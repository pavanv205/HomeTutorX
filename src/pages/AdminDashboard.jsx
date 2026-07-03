import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCheck, FaTimes, FaUserSlash, FaUserCheck, FaInfoCircle } from 'react-icons/fa';
import api from '../services/api';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';

const formatVerifiedDate = (dateString) => {
  if (!dateString) return 'Not Verified';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Not Verified';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview', 'Tutors'
  const [stats, setStats] = useState({
    tutors: { total: 0, verified: 0, pending: 0 },
    students: { total: 0 }
  });
  const [tutors, setTutors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch admin dashboard details
  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch Stats
      const statsRes = await api.get('/admin/stats');
      if (statsRes.data && statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // 2. Fetch Tutors
      const tutorsRes = await api.get('/tutors', { params: { adminView: true } });
      setTutors(tutorsRes.data || []);


    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setErrorMsg('Failed to fetch admin data. Make sure MongoDB is connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Verify / Approve Tutor profile
  const handleVerifyTutor = async (tutorId, isCurrentlyVerified) => {
    setActionLoading(tutorId);
    setErrorMsg('');
    try {
      const res = await api.put(`/admin/tutors/${tutorId}/verify`, { isVerified: !isCurrentlyVerified });
      if (res.data && res.data.success) {
        // Update local state
        setTutors(prev => prev.map(t => t._id === tutorId ? { 
          ...t, 
          isVerified: !isCurrentlyVerified,
          verifiedAt: !isCurrentlyVerified ? new Date().toISOString() : null,
          verifiedDate: !isCurrentlyVerified ? new Date().toISOString() : null 
        } : t));
        // Refresh stats
        const statsRes = await api.get('/admin/stats');
        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update verification status.');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Tutor
  const handleDeleteTutor = async (tutorId) => {
    if (!window.confirm('Are you sure you want to remove this tutor profile?')) return;
    setActionLoading(tutorId);
    setErrorMsg('');
    try {
      const res = await api.delete(`/tutors/${tutorId}`);
      if (res.data && res.data.success) {
        setTutors(prev => prev.filter(t => t._id !== tutorId));
        // Refresh stats
        const statsRes = await api.get('/admin/stats');
        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete tutor profile.');
    } finally {
      setActionLoading(null);
    }
  };



  return (
    <>
      <SEO title="Admin Dashboard" description="Manage verified tutors, system locations, and metrics." />

      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-205 dark:border-slate-800 pb-5">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Control Center</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Manage your tutor directory and verify profiles.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchDashboardData} loading={loading}>
              Refresh Board
            </Button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-3">
              <FaInfoCircle className="h-4 w-4 shrink-0" />
              <div>
                <p>{errorMsg}</p>
                <p className="text-[10px] opacity-80 mt-1">If MongoDB is down, this dashboard will remain empty. Start your MongoDB server to test full-stack features.</p>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
            {['Overview', 'Tutors'].map(tab => (
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
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'Overview' && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center text-xl">
                        <FaGraduationCap />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Tutors</p>
                        <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">{stats.tutors?.total || 0}</h4>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center text-xl">
                        <FaUserCheck />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Tutors</p>
                        <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">{stats.tutors?.verified || 0}</h4>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 flex items-center justify-center text-xl">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
                        <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">{stats.students?.total || 0}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Storage Capacity Section */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                      <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100">Storage & System Capacity Dashboard</h3>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Estimated system limits based on MongoDB (512 MB Free tier) and Cloudinary (25 GB Free tier).</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left: Storage Usage progress bars */}
                      <div className="space-y-5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Usage Metrics</h4>
                        
                        {/* MongoDB Metric */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-330">
                            <span>MongoDB Database (512 MB Free)</span>
                            <span>{(((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0) / 1024).toFixed(4)} MB ({Math.min((((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0) / 1024 / 512) * 100, 100).toFixed(4)}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500" 
                              style={{ width: `${Math.min((((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0) / 1024 / 512) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Cloudinary Metric */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-330">
                            <span>Cloudinary Asset CDN (25 GB Free)</span>
                            <span>{((stats.tutors?.total || 0) * 1.2).toFixed(2)} MB ({Math.min(((stats.tutors?.total || 0) * 1.2 / 25000) * 100, 100).toFixed(4)}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 transition-all duration-500" 
                              style={{ width: `${Math.min(((stats.tutors?.total || 0) * 1.2 / 25000) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Remaining Limit estimations */}
                      <div className="space-y-5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Remaining Capacity Estimations</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
                              <FaGraduationCap />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Max Tutor Logins</p>
                              <h4 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">
                                {Math.max(0, Math.min(
                                  Math.floor((512 * 1024 - ((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0)) / 3.5),
                                  Math.floor((25000 - (stats.tutors?.total || 0) * 1.2) / 1.2)
                                )).toLocaleString()}
                              </h4>
                              <p className="text-[8px] text-slate-400 font-bold tracking-tight leading-tight mt-0.5">Bounded by Cloudinary</p>
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Max Student Logins</p>
                              <h4 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">
                                {Math.max(0, Math.floor((512 * 1024 - ((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0)) / 0.5)).toLocaleString()}
                              </h4>
                              <p className="text-[8px] text-slate-400 font-bold tracking-tight leading-tight mt-0.5">Bounded by MongoDB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850/40 p-4 rounded-2xl text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed border border-slate-100 dark:border-slate-800 font-semibold">
                      <p className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[9px] tracking-wider mb-1">Calculation parameters:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Student registration size:</strong> ~0.5 KB inside MongoDB. Students do not upload files.</li>
                        <li><strong>Tutor profile registration size:</strong> ~3.5 KB inside MongoDB (profile, subjects, classes, location coordinates) + ~1.2 MB average inside Cloudinary CDN for attachments (profile picture, verified certificates).</li>
                        <li><strong>Booking Request size:</strong> ~1.0 KB inside MongoDB.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TUTORS MANAGEMENT */}
              {activeTab === 'Tutors' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
                  <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100 mb-5">Tutor Accounts Directory</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                          <th className="pb-3 pl-2">Name</th>
                          <th className="pb-3">Subject & Experience</th>
                          <th className="pb-3">Location</th>
                          <th className="pb-3">Verification</th>
                          <th className="pb-3 pr-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-350">
                        {tutors.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">No registered tutors yet.</td>
                          </tr>
                        ) : (
                          tutors.map(tutor => (
                            <tr key={tutor._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                              <td className="py-3.5 pl-2">
                                <div className="flex items-center gap-3">
                                  <img src={tutor.photo} alt={tutor.fullName} className="h-8 w-8 rounded-full object-cover border" />
                                  <div>
                                    <p className="font-bold text-slate-850 dark:text-slate-200">{tutor.fullName}</p>
                                    <p className="text-[9px] text-slate-400">
                                      {tutor.email} • {tutor.mobile}
                                      {tutor.certificateUrl && (
                                        <>
                                          {' • '}
                                          <a 
                                            href={tutor.certificateUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-primary dark:text-blue-400 hover:underline font-bold"
                                          >
                                            📄 Certificate
                                          </a>
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5">
                                <p className="font-semibold text-slate-800 dark:text-slate-350">{tutor.qualification}</p>
                                <p className="text-[9px] text-slate-400">{(tutor.subjects || []).slice(0, 3).join(', ')} • {tutor.experience} Yrs Exp</p>
                              </td>
                              <td className="py-3.5">
                                <p>{tutor.city || 'N/A'}</p>
                                <p className="text-[9px] text-slate-400">{tutor.state}</p>
                              </td>
                              <td className="py-3.5">
                                <div className="flex flex-col items-start gap-1">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold ${
                                    tutor.isVerified 
                                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-250 dark:bg-emerald-950/20' 
                                      : 'bg-amber-50 text-amber-600 border border-amber-250 dark:bg-amber-950/20'
                                  }`}>
                                    Status: {tutor.isVerified ? 'Verified ✅' : 'Pending'}
                                  </span>
                                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold">
                                    Verified Date: {formatVerifiedDate(tutor.verifiedDate)}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 pr-2 text-right space-x-2">
                                <Button
                                  variant={tutor.isVerified ? 'outline' : 'primary'}
                                  size="xs"
                                  loading={actionLoading === tutor._id}
                                  onClick={() => handleVerifyTutor(tutor._id, tutor.isVerified)}
                                >
                                  {tutor.isVerified ? 'Unverify' : 'Verify'}
                                </Button>
                                <button
                                  onClick={() => handleDeleteTutor(tutor._id)}
                                  disabled={actionLoading === tutor._id}
                                  className="text-rose-500 hover:text-rose-700 disabled:opacity-50 inline-block font-extrabold focus:outline-none ml-2"
                                  title="Delete Tutor Profile"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                )}

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
