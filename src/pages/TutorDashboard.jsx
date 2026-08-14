import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import { SUBJECTS, CLASSES } from '../constants';
import { FaLock, FaEnvelope, FaPhone, FaUser, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { parseArrayField } from '../utils/arrayHelper';
import { Geolocation } from '@capacitor/geolocation';

import { getAvatarStyle } from '../utils/avatarHelper';

const TutorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile'); // 'Profile', 'Student Requests', 'Settings'
  const [tutorProfile, setTutorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [deleteData, setDeleteData] = useState({ email: '', password: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  // Load Tutor Profile
  const loadDashboardData = useCallback(async () => {
    if (!user || !user.tutorProfile) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      // 1. Fetch tutor profile
      const tutorId = typeof user.tutorProfile === 'object' ? user.tutorProfile._id : user.tutorProfile;
      const profileRes = await api.get(`/tutors/${tutorId}`);
      const rawProfile = profileRes.data || null;
      if (rawProfile) {
        rawProfile.subjects = parseArrayField(rawProfile.subjects);
        rawProfile.classes = parseArrayField(rawProfile.classes);
      }
      setTutorProfile(rawProfile);

      // 2. Fetch tutor bookings
      const bookingsRes = await api.get('/bookings');
      if (bookingsRes.data && bookingsRes.data.success) {
        setBookings(bookingsRes.data.data || []);
      }


    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to load dashboard data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update Booking Status
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    setUpdatingBookingId(bookingId);
    setMessage({ text: '', type: '' });
    try {
      const res = await api.put(`/bookings/${bookingId}`, { status: newStatus });
      if (res.data && res.data.success) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        setMessage({ text: `Request status updated to ${newStatus}!`, type: 'success' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to update request status.', type: 'error' });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // Delete Booking Completely
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking request?')) {
      return;
    }
    setUpdatingBookingId(bookingId);
    setMessage({ text: '', type: '' });
    try {
      const res = await api.delete(`/bookings/${bookingId}`);
      if (res.data && res.data.success) {
        setBookings(prev => prev.filter(b => b._id !== bookingId));
        setMessage({ text: 'Booking request removed completely.', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to delete booking request.', type: 'error' });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboardData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadDashboardData]);

  // Handle Text Profile Inputs
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setTutorProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Toggle Array (Subjects, Classes)
  const handleArrayToggle = (field, item) => {
    setTutorProfile(prev => {
      const list = prev[field] || [];
      const updated = list.includes(item)
        ? list.filter(i => i !== item)
        : [...list, item];
      return { ...prev, [field]: updated };
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const filename = file.name.toLowerCase();
      
      if (filename.includes('.trashed-') || filename.startsWith('.trashed-')) {
        setPhotoError('Invalid file type: temporary files not allowed');
        return;
      }
      
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
      const hasAllowedExt = allowedExts.some(ext => filename.endsWith(ext));
      const isAllowedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      
      if (!isAllowedType && !hasAllowedExt) {
        setPhotoError('Only image files (JPEG, PNG, WEBP) are allowed');
        return;
      }

      setPhotoError('');
      try {
        setCompressing(true);
        const { compressImage } = await import('../utils/imageCompression');
        const result = await compressImage(file, 350 * 1024);
        setPhotoFile(result.file);
        setPhotoPreview(result.previewUrl);
      } catch (err) {
        console.error('Image compression failed:', err);
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
      } finally {
        setCompressing(false);
      }
    }
  };

  const handleRemovePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError('');
    setTutorProfile(prev => ({
      ...prev,
      photo: ''
    }));
  };

  const handleFetchLiveLocation = async () => {
    const confirmLocation = window.confirm("Use only at your home location. Do you want to continue?");
    if (!confirmLocation) {
      return;
    }

    setLocLoading(true);
    setLocError('');

    const setCoords = (latitude, longitude) => {
      setTutorProfile(prev => ({
        ...prev,
        lat: latitude,
        lng: longitude
      }));
      setLocLoading(false);
    };

    // 1. Try Native Capacitor Geolocation
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      });
      if (coordinates && coordinates.coords) {
        setCoords(coordinates.coords.latitude, coordinates.coords.longitude);
        return;
      }
    } catch (nativeErr) {
      console.log('Native Capacitor Geolocation failed in dashboard, trying web/fallback...', nativeErr);
    }

    // 2. Try Web HTML5 navigator.geolocation
    if (navigator.geolocation) {
      try {
        const webPos = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            () => resolve(null),
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
          );
        });
        if (webPos && webPos.coords) {
          setCoords(webPos.coords.latitude, webPos.coords.longitude);
          return;
        }
      } catch (e) {
        console.error('Web geolocation error:', e);
      }
    }

    // 3. Fallback to IP Location APIs
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        setCoords(data.latitude, data.longitude);
        return;
      }
    } catch (e) {
      console.error('Primary IP location failed:', e);
    }

    try {
      const res = await fetch('https://ip-api.com/json/');
      const data = await res.json();
      if (data && data.lat && data.lon) {
        setCoords(data.lat, data.lon);
        return;
      }
    } catch (e) {
      console.error('Secondary IP location failed:', e);
    }

    setLocError('Location permission denied or timed out. Please check location settings.');
    setLocLoading(false);
  };

  // Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    const hourly = Number(tutorProfile.hourlyRate);
    const monthly = Number(tutorProfile.monthlyRate);
    if (isNaN(hourly) || hourly < 50 || hourly > 500) {
      setMessage({ text: 'Hourly rate must be between ₹50 and ₹500.', type: 'error' });
      setSaving(false);
      return;
    }
    if (isNaN(monthly) || monthly < 500 || monthly > 15000) {
      setMessage({ text: 'Monthly rate must be between ₹500 and ₹15000.', type: 'error' });
      setSaving(false);
      return;
    }

    try {
      let res;
      if (photoFile) {
        const formData = new FormData();
        for (const key of Object.keys(tutorProfile)) {
          const val = tutorProfile[key];
          if (Array.isArray(val)) {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, val ?? '');
          }
        }
        formData.append('resume', photoFile);
        
        res = await api.put(`/tutors/${tutorProfile._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.put(`/tutors/${tutorProfile._id}`, tutorProfile);
      }

      if (res.data && res.data.success) {
        const savedProfile = res.data.data;
        if (savedProfile) {
          savedProfile.subjects = parseArrayField(savedProfile.subjects);
          savedProfile.classes = parseArrayField(savedProfile.classes);
        }
        setTutorProfile(savedProfile);
        setPhotoFile(null);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to update profile details.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };



  // Settings: Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      // Direct user password update if endpoint existed; here we simulate/stub
      setTimeout(() => {
        setMessage({ text: 'Settings updated successfully! (Mocked password change)', type: 'success' });
        setPasswordData({ currentPassword: '', newPassword: '' });
        setSaving(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to update credentials.', type: 'error' });
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!window.confirm("WARNING: This will permanently delete your account and profile. This action cannot be undone. Are you sure you want to proceed?")) {
      return;
    }
    
    setSaving(true);
    setDeleteLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const res = await api.delete('/auth/delete-account', { data: deleteData });
      if (res.data && res.data.success) {
        alert("Your account has been successfully deleted.");
        logout();
      }
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || 'Failed to delete account. Please verify credentials.',
        type: 'error'
      });
    } finally {
      setSaving(false);
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <SEO title="Tutor Dashboard" description="Update your tuition availability, rates, and profile credentials." />

      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Tutor Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Welcome back, {tutorProfile?.fullName || user?.name || 'Tutor'}. Manage your tutor profile and settings here.
            </p>
          </div>

          {/* Feedback Messages */}
          {message.text && (
            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
            }`}>
              <span>{message.type === 'success' ? '✓' : '⚠️'}</span>
              <p>{message.text}</p>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
            {['Profile', 'Student Requests', 'Settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 text-sm font-extrabold border-b-2 transition-all focus:outline-none ${
                  activeTab === tab
                    ? 'border-primary text-primary dark:border-blue-500 dark:text-blue-400 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Metrics Grid */}
              {activeTab === 'Profile' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Profile Verification Status Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    tutorProfile?.isVerified 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                  }`}>
                    {tutorProfile?.isVerified ? (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Profile verification status</p>
                    <p className={`text-sm font-extrabold ${
                      tutorProfile?.isVerified 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {tutorProfile?.isVerified ? 'Verified Profile' : 'Pending Verification'}
                    </p>
                  </div>
                </div>

                {/* Total Student Leads Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                    <FaUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Student Leads</p>
                    <p className="text-xl font-extrabold text-slate-850 dark:text-slate-100">
                      {tutorProfile?.leadsCount ?? 0}
                    </p>
                  </div>
                </div>

                {/* Total Views Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="scale-[0.16] transform-gpu origin-center absolute select-none pointer-events-none">
                      <div className="eye-lid">
                        <div className="eye">
                          <div className="cornea">
                            <div className="white-pupil"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Views</p>
                    <p className="text-xl font-extrabold text-slate-850 dark:text-slate-100">
                      {tutorProfile?.viewsCount ?? 0}
                    </p>
                  </div>
                </div>
              </div>
              )}

              {/* TAB 2: PROFILE MANAGEMENT */}
              {activeTab === 'Profile' && tutorProfile && (
                <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 border-b pb-3">Edit Profile Details</h3>
                  
                  {/* Basic Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Hourly Rate (₹)</label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={tutorProfile.hourlyRate || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Monthly Rate (₹)</label>
                      <input
                        type="number"
                        name="monthlyRate"
                        value={tutorProfile.monthlyRate || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-wide">Profile Photo</label>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          {photoPreview || tutorProfile.photo ? (
                            <img src={photoPreview || tutorProfile.photo} alt="Profile preview" className="h-full w-full object-cover" />
                          ) : (
                            <div className={`h-full w-full font-extrabold flex items-center justify-center text-lg ${getAvatarStyle(tutorProfile.fullName)}`}>
                              {(tutorProfile.fullName || 'T').trim().charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-2 rounded-lg text-center transition-colors">
                              {photoPreview || tutorProfile.photo ? 'Change Photo' : 'Add Photo'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                              />
                            </label>
                            {(photoPreview || tutorProfile.photo) && (
                              <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-455 text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                              >
                                Remove Photo
                              </button>
                            )}
                          </div>
                          {photoFile && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold max-w-[150px] truncate">
                              {photoFile.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {compressing && (
                        <p className="text-xs text-primary dark:text-blue-450 mt-1 font-semibold">Optimizing image...</p>
                      )}
                      {photoError && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{photoError}</p>
                      )}
                    </div>
                    <div>
                      {/* Empty column */}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Street Address</label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={tutorProfile.streetAddress || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-55 mb-1.5 uppercase tracking-wide">Preferred Division</label>
                      <input
                        type="text"
                        name="city"
                        value={tutorProfile.city || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Pin Code</label>
                      <input
                        type="text"
                        name="pincode"
                        value={tutorProfile.pincode || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* State, Age, Preferred Teaching Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">State</label>
                      <input
                        type="text"
                        name="state"
                        value={tutorProfile.state || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={tutorProfile.age || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Preferred Teaching Mode</label>
                      <select
                        name="teachingMode"
                        value={tutorProfile.teachingMode || 'Online'}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none cursor-pointer"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Both">Both (Online & Offline)</option>
                      </select>
                    </div>
                  </div>

                  {/* Live Location Option */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
                    <div className="relative group flex items-center">
                      <button
                        type="button"
                        onClick={handleFetchLiveLocation}
                        disabled={locLoading}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all duration-200 ${
                          (tutorProfile.lat && tutorProfile.lng)
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/50'
                            : 'bg-slate-50 text-slate-700 border-slate-205 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                        }`}
                      >
                        {locLoading ? (
                          <span>Fetching Location...</span>
                        ) : (tutorProfile.lat && tutorProfile.lng) ? (
                          <span>Live Location Linked <FaCheck className="h-3.5 w-3.5 text-emerald-500 inline ml-1" /></span>
                        ) : (
                          <>
                            <span>Use Live Location</span>
                            <span className="loader scale-pin"></span>
                          </>
                        )}
                      </button>

                      {/* Styled Tooltip Popup on Hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
                        <div className="bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg text-center leading-normal dark:bg-slate-800 border border-slate-700">
                          Use only at your home location
                        </div>
                        <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 transform rotate-45 -mt-1 shadow-md"></div>
                      </div>
                    </div>

                    {/* Persistent Amber Warning Text */}
                    <span className="text-[11px] text-amber-600 dark:text-amber-455 font-bold bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 px-3 py-2 rounded-xl flex items-center gap-1.5">
                      <FaExclamationTriangle className="h-4 w-4 shrink-0 text-amber-505" /> Use only at your home location.
                    </span>

                    {locError && <span className="text-xs text-rose-500 font-semibold">{locError}</span>}
                    {tutorProfile.lat && tutorProfile.lng && (
                      <span className="text-[10px] text-slate-400 font-bold dark:text-slate-550">
                        Latitude: {Number(tutorProfile.lat).toFixed(4)}, Longitude: {Number(tutorProfile.lng).toFixed(4)}
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Professional Biography</label>
                    <textarea
                      name="bio"
                      rows="4"
                      value={tutorProfile.bio || ''}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                    />
                  </div>

                  {/* Array Choices (Subjects) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Subjects Taught</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {SUBJECTS.map(sub => {
                        const isChecked = tutorProfile.subjects?.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => handleArrayToggle('subjects', sub)}
                            className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all duration-200 ${
                              isChecked
                                ? 'bg-primary/10 border-primary text-primary dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400'
                                : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Array Choices (Classes) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Grades / Classes</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {CLASSES.map(cls => {
                        const isChecked = tutorProfile.classes?.includes(cls);
                        return (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => handleArrayToggle('classes', cls)}
                            className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all duration-200 ${
                              isChecked
                                ? 'bg-primary/10 border-primary text-primary dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400'
                                : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            {cls}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <Button type="submit" variant="primary" loading={saving}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}

              {/* TAB 2: STUDENT REQUESTS */}
              {activeTab === 'Student Requests' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      Total Requests ({bookings.length})
                    </h3>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaEnvelope className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">No Student Requests</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                        When students request a class with you, their contact details and requirements will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {bookings.map(booking => (
                        <div 
                          key={booking._id}
                          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4 relative overflow-hidden flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            {/* Card Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                  <FaUser className="h-4.5 w-4.5" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100">
                                    {booking.studentName}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                    Tutoring Lead
                                  </p>
                                </div>
                              </div>
                              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                booking.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-450'
                                  : booking.status === 'Assigned'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                                  : booking.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                                  : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                              }`}>
                                {booking.status === 'Pending' ? 'Pending Approval' : booking.status === 'Assigned' ? 'Assigned' : booking.status}
                              </span>
                            </div>

                             {/* Contact Grid */}
                             {booking.status === 'Pending' ? (
                               <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl text-[11px] font-semibold text-slate-500 dark:text-slate-455 italic flex items-center gap-1.5">
                                 <span>⏳</span>
                                 <span>Contact details will be unlocked once you accept this request.</span>
                               </div>
                             ) : (
                               <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400">
                                 <FaPhone className="text-slate-400 shrink-0" />
                                 <span>{booking.studentPhone || 'N/A'}</span>
                               </div>
                             )}

                            {/* Requirement Details */}
                            <div className="space-y-2 text-xs font-semibold text-slate-650 dark:text-slate-350">
                              <div>
                                <span>Subject: <strong className="text-slate-800 dark:text-slate-200">{parseArrayField(booking.subject).join(', ')}</strong></span>
                              </div>
                              <div>
                                <span>Class: <strong className="text-slate-800 dark:text-slate-200">{parseArrayField(booking.gradeClass).join(', ')}</strong></span>
                              </div>
                              <div>
                                <span>Mode: <strong className="text-slate-800 dark:text-slate-200">{booking.preferredMode}</strong></span>
                              </div>
                              {booking.location && (
                                <div className="text-[11px] bg-slate-50 dark:bg-slate-800/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mt-1 italic">
                                  Address: {booking.location}
                                </div>
                              )}
                              {/* Message */}
                              {booking.message && booking.message !== 'Instant booking from tutor profile' && (
                                <div className="bg-slate-50 dark:bg-slate-800/20 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                                  <p className="font-bold text-[10px] uppercase text-slate-400 dark:text-slate-505 tracking-wider mb-1">Student Notes:</p>
                                  <p className="leading-relaxed">"{booking.message}"</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3 mt-4">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                              Received: {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>

                            {booking.status === 'Pending' && (
                              <div className="flex gap-2">
                                <button
                                  disabled={updatingBookingId !== null}
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'Assigned')}
                                  className="flex items-center gap-1.5 py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-400 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                                >
                                  <FaCheck className="h-3 w-3" />
                                  Accept
                                </button>
                                <button
                                  disabled={updatingBookingId !== null}
                                  onClick={() => handleDeleteBooking(booking._id)}
                                  className="flex items-center gap-1.5 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-655 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                                >
                                  <FaTimes className="h-3 w-3" />
                                  Decline
                                </button>
                              </div>
                            )}

                            {booking.status === 'Assigned' && (
                              <div className="flex gap-2">
                                <button
                                  disabled={updatingBookingId !== null}
                                  onClick={() => handleDeleteBooking(booking._id)}
                                  className="flex items-center gap-1.5 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-655 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                                >
                                  <FaTimes className="h-3 w-3" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === 'Settings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Password Form */}
                  <form onSubmit={handlePasswordChange} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 border-b pb-3 flex items-center gap-2">
                      <FaLock className="text-primary dark:text-blue-500" />
                      Change Password
                    </h3>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="pt-2">
                      <Button type="submit" variant="primary" loading={saving}>
                        Update Credentials
                      </Button>
                    </div>
                  </form>

                  {/* Delete Account Form */}
                  <form onSubmit={handleDeleteAccount} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold text-red-655 dark:text-red-400 border-b pb-3 flex items-center gap-2">
                      <FaTimes className="text-red-500" />
                      Delete Account
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Warning: Permanently delete your account. This action is irreversible and all your tutor profile details will be deleted.
                    </p>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Registered Email</label>
                      <input
                        type="email"
                        required
                        value={deleteData.email}
                        onChange={(e) => setDeleteData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-slate-55 dark:bg-slate-80 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Password</label>
                      <input
                        type="password"
                        required
                        value={deleteData.password}
                        onChange={(e) => setDeleteData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full bg-slate-55 dark:bg-slate-80 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={deleteLoading}
                        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {deleteLoading ? 'Deleting Account...' : 'Permanently Delete Account'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TutorDashboard;
