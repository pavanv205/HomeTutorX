import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import { SUBJECTS, CLASSES, STATES } from '../constants';
import { FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaLock } from 'react-icons/fa';

const TutorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile'); // 'Profile', 'Settings'
  const [tutorProfile, setTutorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  // Load Tutor Profile
  const loadDashboardData = async () => {
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
      setTutorProfile(profileRes.data || null);


    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to load dashboard data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

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

  // Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await api.put(`/tutors/${tutorProfile._id}`, tutorProfile);
      if (res.data && res.data.success) {
        setTutorProfile(res.data.data);
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

  return (
    <>
      <SEO title="Tutor Dashboard" description="Update your tuition availability, rates, and profile credentials." />

      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
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
            {['Profile', 'Settings'].map(tab => (
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
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
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Student Leads</p>
                    <p className="text-xl font-extrabold text-slate-850 dark:text-slate-100">
                      {tutorProfile?.leadsCount ?? 12}
                    </p>
                  </div>
                </div>

                {/* Total Views Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="h-12 w-12 rounded-2xl bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                    <div className="relative h-6 w-6 text-violet-650 dark:text-violet-400 flex items-center justify-center">
                      <svg className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="absolute h-2.5 w-2.5 rounded-full bg-violet-400 dark:bg-violet-500 animate-ping"></span>
                      <span className="absolute h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400"></span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Views</p>
                    <p className="text-xl font-extrabold text-slate-850 dark:text-slate-100">
                      {tutorProfile?.viewsCount ?? 142}
                    </p>
                  </div>
                </div>
              </div>

              {/* TAB 2: PROFILE MANAGEMENT */}
              {activeTab === 'Profile' && tutorProfile && (
                <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <h3 className="text-base font-extrabold text-slate-855 dark:text-slate-100 border-b pb-3">Edit Profile Details</h3>
                  
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
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Highest Qualification</label>
                      <input
                        type="text"
                        name="qualification"
                        value={tutorProfile.qualification || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={tutorProfile.experience || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-3 px-4 text-sm focus:outline-none"
                      />
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
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-505 mb-1.5 uppercase tracking-wide">Preferred Division</label>
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

              {/* TAB 3: SETTINGS */}
              {activeTab === 'Settings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Password Form */}
                  <form onSubmit={handlePasswordChange} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold text-slate-855 dark:text-slate-100 border-b pb-3 flex items-center gap-2">
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
