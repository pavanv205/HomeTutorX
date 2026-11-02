import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, 
  FaUserCheck, 
  FaInfoCircle, 
  FaUser, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaClipboardList, 
  FaUserClock, 
  FaTimes, 
  FaExchangeAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaExclamationTriangle, 
  FaArrowRight, 
  FaCheckCircle, 
  FaTrashAlt, 
  FaWhatsapp 
} from 'react-icons/fa';
import api from '../services/api';
import { parseArrayField } from '../utils/arrayHelper';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import { getAvatarStyle } from '../utils/avatarHelper';

const formatVerifiedDate = (dateString) => {
  if (!dateString) return 'Not Verified';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Not Verified';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ColorfulUsersIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Left User Gradient: Sky Blue */}
      <linearGradient id="leftGrad" x1="2.5" y1="9" x2="8.5" y2="20">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      
      {/* Right User Gradient: Emerald Green */}
      <linearGradient id="rightGrad" x1="15.5" y1="9" x2="21.5" y2="20">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      
      {/* Center User Gradient: Indigo-Violet */}
      <linearGradient id="centerGrad" x1="7" y1="3" x2="17" y2="20">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>

    {/* Left User */}
    <circle cx="6.5" cy="10" r="2.5" fill="url(#leftGrad)" />
    <path d="M6.5 13.5C4.5 13.5 2.5 15.1 2.5 17.5V19.5H10.5V17.5C10.5 15.1 8.5 13.5 6.5 13.5Z" fill="url(#leftGrad)" />

    {/* Right User */}
    <circle cx="17.5" cy="10" r="2.5" fill="url(#rightGrad)" />
    <path d="M17.5 13.5C15.5 13.5 13.5 15.1 13.5 17.5V19.5H22.5V17.5C22.5 15.1 20.5 13.5 17.5 13.5Z" fill="url(#rightGrad)" />

    {/* Center User (Drawn last to overlap left/right) */}
    <circle cx="12" cy="7" r="3" fill="url(#centerGrad)" className="stroke-white dark:stroke-slate-900" strokeWidth="1.5" />
    <path d="M12 11C9.24 11 7 13.24 7 16V18.5C7 19.33 7.67 20 8.5 20H15.5C16.33 20 17 19.33 17 18.5V16C17 13.24 14.76 11 12 11Z" fill="url(#centerGrad)" className="stroke-white dark:stroke-slate-900" strokeWidth="1.5" />
  </svg>
);

const ColorfulDatabaseIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Glossy Server Metallic Gradient */}
      <linearGradient id="dbMetallicGrad" x1="4" y1="2" x2="20" y2="22">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="50%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      
      {/* Light border accents */}
      <linearGradient id="dbHighlightGrad" x1="12" y1="2" x2="12" y2="22">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>

    {/* Top Cylinder */}
    <path d="M4 6C4 7.66 7.58 9 12 9C16.42 9 20 7.66 20 6C20 4.34 16.42 3 12 3C7.58 3 4 4.34 4 6Z" fill="url(#dbMetallicGrad)" stroke="url(#dbHighlightGrad)" strokeWidth="1" />
    <path d="M20 6V10C20 11.66 16.42 13 12 13C7.58 13 4 11.66 4 10V6" fill="url(#dbMetallicGrad)" fillOpacity="0.85" stroke="url(#dbHighlightGrad)" strokeWidth="1" />

    {/* Middle Cylinder */}
    <path d="M20 11V15C20 16.66 16.42 18 12 18C7.58 18 4 15.66 4 14V11" fill="url(#dbMetallicGrad)" fillOpacity="0.85" stroke="url(#dbHighlightGrad)" strokeWidth="1" />

    {/* Bottom Cylinder */}
    <path d="M20 16V20C20 21.66 16.42 23 12 23C7.58 23 4 21.66 4 20V16" fill="url(#dbMetallicGrad)" fillOpacity="0.85" stroke="url(#dbHighlightGrad)" strokeWidth="1" />
    
    {/* Ellipses lines on cylinders for depth */}
    <path d="M4 10C4 11.66 7.58 13 12 13C16.42 13 20 11.66 20 10" stroke="url(#dbHighlightGrad)" strokeWidth="1" />
    <path d="M4 15C4 16.66 7.58 18 12 18C16.42 18 20 16.66 20 15" stroke="url(#dbHighlightGrad)" strokeWidth="1" />
  </svg>
);

const ColorfulGiftIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Box Wrap/Lid Gradient: Rose/Coral */}
      <linearGradient id="lidGrad" x1="2" y1="6" x2="22" y2="10">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
      
      {/* Box Body Gradient: Gold/Orange */}
      <linearGradient id="bodyGrad" x1="4" y1="10" x2="20" y2="21">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      
      {/* Ribbon Gradient: Glowing Red */}
      <linearGradient id="ribbonGrad" x1="12" y1="2" x2="12" y2="21">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
    </defs>

    {/* Ribbon Bow Loops */}
    <path d="M12 7C9.5 7 7.5 5.5 7.5 3.5C7.5 1.5 9.5 1 12 5C14.5 1 16.5 1.5 16.5 3.5C16.5 5.5 14.5 7 12 7Z" fill="url(#ribbonGrad)" />
    <path d="M12 7.5C11.17 7.5 10.5 6.83 10.5 6C10.5 5.17 11.17 4.5 12 4.5C12.83 4.5 13.5 5.17 13.5 6C13.5 6.83 12.83 7.5 12 7.5Z" fill="#FEE2E2" />

    {/* Gift Box Body */}
    <rect x="4" y="10" width="16" height="11" rx="2" fill="url(#bodyGrad)" />
    
    {/* Gift Box Lid */}
    <rect x="3" y="7" width="18" height="3.5" rx="1.5" fill="url(#lidGrad)" className="stroke-white dark:stroke-slate-900" strokeWidth="0.5" />
    
    {/* Ribbon Vertical and Horizontal Stripes */}
    <rect x="10.5" y="7" width="3" height="14" fill="url(#ribbonGrad)" />
    <rect x="3" y="11.5" width="18" height="2" fill="url(#ribbonGrad)" />
  </svg>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview', 'Verified Tutors', 'Unverified Tutors', 'Students', 'Student Requests'
  const [stats, setStats] = useState({
    tutors: { total: 0, verified: 0, pending: 0, active: 0 },
    students: { total: 0 },
    bookings: { total: 0, assigned: 0, unassigned: 0, pending: 0, contacted: 0, resolved: 0 },
    storage: { databaseSize: 0, cdnSize: 0 }
  });
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Search states
  const [tutorLocationSearch, setTutorLocationSearch] = useState('');
  const [tutorGeneralSearch, setTutorGeneralSearch] = useState('');
  const [unverifiedLocationSearch, setUnverifiedLocationSearch] = useState('');
  const [unverifiedGeneralSearch, setUnverifiedGeneralSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentLocationSearch, setStudentLocationSearch] = useState('');

  // Student Request (Booking) states
  const [bookingFilter, setBookingFilter] = useState('all'); // 'all', 'assigned', 'unassigned'
  const [bookingLocationSearch, setBookingLocationSearch] = useState('');
  const [bookingGeneralSearch, setBookingGeneralSearch] = useState('');

  // Assign Tutor Modal states
  const [assignModalBooking, setAssignModalBooking] = useState(null);
  const [assignTutorSearch, setAssignTutorSearch] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [confirmChangeBooking, setConfirmChangeBooking] = useState(null);

  const [showCapacityDetails, setShowCapacityDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Helper to resolve the assigned/requested tutor profile
  const getBookingTutor = (booking) => {
    if (!booking || !booking.assignedTutor) return null;
    const tutorId = typeof booking.assignedTutor === 'object' ? booking.assignedTutor._id : booking.assignedTutor;
    const fromList = tutors.find(t => String(t._id) === String(tutorId));
    if (fromList) return fromList;
    if (typeof booking.assignedTutor === 'object' && (booking.assignedTutor.fullName || booking.assignedTutor.name)) {
      return booking.assignedTutor;
    }
    return null;
  };

  // Helper to extract clean "Division, State" (or "City, State")
  const formatDivisionAndState = (divisionOrCity, state, fallbackString = '') => {
    const div = String(divisionOrCity || '').trim();
    const st = String(state || '').trim();
    if (div && st) {
      return `${div}, ${st}`;
    }
    if (div) return div;
    if (st) return st;

    if (fallbackString && typeof fallbackString === 'string') {
      const cleanParts = fallbackString
        .split(',')
        .map(p => p.trim())
        .filter(Boolean);
      if (cleanParts.length >= 2) {
        const lastTwo = cleanParts.slice(-2);
        return Array.from(new Set(lastTwo)).join(', ');
      }
      if (cleanParts.length === 1) return cleanParts[0];
    }
    return '';
  };

  // Helper to resolve student location (Strictly Division and State)
  const getBookingStudentLocation = (booking) => {
    if (!booking) return 'Location Not Specified';
    
    // 1. Check if registered student has division & state details
    const student = students.find(s => 
      (s.email && booking.studentEmail && s.email.toLowerCase() === booking.studentEmail.toLowerCase()) ||
      (s.phone && booking.studentPhone && String(s.phone).replace(/\D/g, '') === String(booking.studentPhone).replace(/\D/g, ''))
    );
    if (student) {
      const divState = formatDivisionAndState(
        student.division || student.city,
        student.state,
        student.location
      );
      if (divState && divState !== 'Hyderabad' && divState !== 'Hyderabad, Telangana') {
        return divState;
      }
    }

    // 2. Check if booking location is explicitly set
    if (booking.location && booking.location !== 'Hyderabad' && booking.location !== 'Hyderabad, Telangana') {
      const divState = formatDivisionAndState('', '', booking.location);
      if (divState) return divState;
      return booking.location;
    }

    if (student) {
      const fallback = formatDivisionAndState(student.division || student.city, student.state, student.location);
      if (fallback) return fallback;
    }

    return 'Location Not Specified';
  };

  // Helper to resolve full student address (for hover tooltip)
  const getBookingStudentFullAddress = (booking) => {
    if (!booking) return '';
    const student = students.find(s => 
      (s.email && booking.studentEmail && s.email.toLowerCase() === booking.studentEmail.toLowerCase()) ||
      (s.phone && booking.studentPhone && String(s.phone).replace(/\D/g, '') === String(booking.studentPhone).replace(/\D/g, ''))
    );
    if (student) {
      const parts = [student.streetAddress, student.division, student.city, student.state].filter(Boolean);
      if (parts.length > 0) return parts.join(', ');
      if (student.location) return student.location;
    }
    return booking.location || '';
  };

  // Helper to resolve tutor location (Strictly Division / City and State)
  const getBookingTutorLocation = (booking, tutorObj = null) => {
    const t = tutorObj || getBookingTutor(booking);
    if (!t) return 'Unassigned';
    
    const divState = formatDivisionAndState(
      t.division || t.city,
      t.state,
      [t.city, t.state].filter(Boolean).join(', ')
    );
    if (divState) return divState;

    if (t.preferredLocations && t.preferredLocations.length > 0) {
      const pref = parseArrayField(t.preferredLocations)[0];
      const prefDivState = formatDivisionAndState('', '', pref);
      if (prefDivState) return prefDivState;
    }
    return 'Location Not Set';
  };

  // Helper to resolve full tutor address (for hover tooltip)
  const getBookingTutorFullAddress = (booking, tutorObj = null) => {
    const t = tutorObj || getBookingTutor(booking);
    if (!t) return '';
    const parts = [t.streetAddress, t.city, t.state].filter(Boolean);
    return parts.join(', ') || '';
  };

  const isBookingAssigned = (b) => b && b.status === 'Assigned' && !!b.assignedTutor;
  const totalBookingsCount = bookings.length;
  const assignedBookingsCount = bookings.filter(isBookingAssigned).length;
  const unassignedBookingsCount = bookings.filter(b => !isBookingAssigned(b)).length;

  // Filtered Verified Tutors
  const filteredVerifiedTutors = tutors.filter(t => {
    if (!t.isVerified) return false;

    if (tutorLocationSearch.trim()) {
      const locQ = tutorLocationSearch.toLowerCase().trim();
      const city = (t.city || '').toLowerCase();
      const state = (t.state || '').toLowerCase();
      const address = (t.streetAddress || t.address || '').toLowerCase();
      const pincode = String(t.pincode || '').toLowerCase();
      const matchesLoc = city.includes(locQ) || state.includes(locQ) || address.includes(locQ) || pincode.includes(locQ);
      if (!matchesLoc) return false;
    }

    if (tutorGeneralSearch.trim()) {
      const genQ = tutorGeneralSearch.toLowerCase().trim();
      const name = (t.fullName || '').toLowerCase();
      const email = (t.email || '').toLowerCase();
      const mobile = String(t.mobile || '').toLowerCase();
      const qualification = (t.qualification || '').toLowerCase();
      const subjects = parseArrayField(t.subjects).join(' ').toLowerCase();
      const matchesGen = name.includes(genQ) || email.includes(genQ) || mobile.includes(genQ) || qualification.includes(genQ) || subjects.includes(genQ);
      if (!matchesGen) return false;
    }

    return true;
  });

  // Filtered Unverified Tutors
  const filteredUnverifiedTutors = tutors.filter(t => {
    if (t.isVerified) return false;

    if (unverifiedLocationSearch.trim()) {
      const locQ = unverifiedLocationSearch.toLowerCase().trim();
      const city = (t.city || '').toLowerCase();
      const state = (t.state || '').toLowerCase();
      const address = (t.streetAddress || t.address || '').toLowerCase();
      const pincode = String(t.pincode || '').toLowerCase();
      const matchesLoc = city.includes(locQ) || state.includes(locQ) || address.includes(locQ) || pincode.includes(locQ);
      if (!matchesLoc) return false;
    }

    if (unverifiedGeneralSearch.trim()) {
      const genQ = unverifiedGeneralSearch.toLowerCase().trim();
      const name = (t.fullName || '').toLowerCase();
      const email = (t.email || '').toLowerCase();
      const mobile = String(t.mobile || '').toLowerCase();
      const qualification = (t.qualification || '').toLowerCase();
      const subjects = parseArrayField(t.subjects).join(' ').toLowerCase();
      const matchesGen = name.includes(genQ) || email.includes(genQ) || mobile.includes(genQ) || qualification.includes(genQ) || subjects.includes(genQ);
      if (!matchesGen) return false;
    }

    return true;
  });

  // Filtered Students
  const filteredStudents = students.filter(s => {
    if (studentLocationSearch.trim()) {
      const locQ = studentLocationSearch.toLowerCase().trim();
      const loc = (s.location || s.city || s.address || '').toLowerCase();
      if (!loc.includes(locQ)) return false;
    }

    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase().trim();
      const name = (s.name || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      const phone = String(s.phone || '').toLowerCase();
      if (!name.includes(q) && !email.includes(q) && !phone.includes(q)) return false;
    }

    return true;
  });

  // Filtered Student Requests (Bookings)
  const filteredBookings = bookings.filter(b => {
    // 1. Tab segment filter
    if (bookingFilter === 'assigned' && !isBookingAssigned(b)) return false;
    if (bookingFilter === 'unassigned' && isBookingAssigned(b)) return false;

    // 2. Location search
    if (bookingLocationSearch.trim()) {
      const locQ = bookingLocationSearch.toLowerCase().trim();
      const loc = (b.location || '').toLowerCase();
      const studentLoc = (getBookingStudentLocation(b) || '').toLowerCase();
      const tutor = getBookingTutor(b);
      const tutorLoc = (getBookingTutorLocation(b, tutor) || '').toLowerCase();
      if (!loc.includes(locQ) && !studentLoc.includes(locQ) && !tutorLoc.includes(locQ)) {
        return false;
      }
    }

    // 3. General search (student or requested tutor)
    if (bookingGeneralSearch.trim()) {
      const q = bookingGeneralSearch.toLowerCase().trim();
      const studentName = (b.studentName || '').toLowerCase();
      const studentEmail = (b.studentEmail || '').toLowerCase();
      const studentPhone = String(b.studentPhone || '').toLowerCase();
      const subject = (b.subject || '').toLowerCase();
      const grade = (b.gradeClass || '').toLowerCase();
      const tutor = getBookingTutor(b);
      const tutorName = (tutor?.fullName || tutor?.name || '').toLowerCase();
      const tutorEmail = (tutor?.email || '').toLowerCase();
      const tutorPhone = String(tutor?.mobile || '').toLowerCase();

      const matches = studentName.includes(q) ||
        studentEmail.includes(q) ||
        studentPhone.includes(q) ||
        subject.includes(q) ||
        grade.includes(q) ||
        tutorName.includes(q) ||
        tutorEmail.includes(q) ||
        tutorPhone.includes(q);

      if (!matches) return false;
    }

    return true;
  });

  // Filtered Verified Tutors for Assignment Modal
  const filteredTutorsForAssignment = tutors.filter(t => {
    if (!t.isVerified) return false;
    if (!assignTutorSearch.trim()) return true;
    const q = assignTutorSearch.toLowerCase().trim();
    const name = (t.fullName || '').toLowerCase();
    const email = (t.email || '').toLowerCase();
    const mobile = String(t.mobile || '').toLowerCase();
    const city = (t.city || '').toLowerCase();
    const subjects = parseArrayField(t.subjects).join(' ').toLowerCase();
    return name.includes(q) || email.includes(q) || mobile.includes(q) || city.includes(q) || subjects.includes(q);
  });

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

      // 3. Fetch Students
      try {
        const studentsRes = await api.get('/admin/students');
        if (studentsRes.data && studentsRes.data.success) {
          setStudents(studentsRes.data.data || []);
        }
      } catch (e) {
        console.log('Students fetch error:', e);
      }

      // 4. Fetch Bookings / Student Requests
      try {
        const bookingsRes = await api.get('/bookings');
        if (bookingsRes.data && bookingsRes.data.success) {
          setBookings(bookingsRes.data.data || []);
        }
      } catch (bErr) {
        console.log('Bookings fetch error:', bErr);
      }

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setErrorMsg('Failed to fetch admin data. Make sure MongoDB is connected.');
    } finally {
      setLoading(false);
    }
  };

  // Assign or Reassign a Tutor to a Student Request
  const handleAssignTutor = async (bookingId, tutorId) => {
    setAssignLoading(true);
    try {
      const res = await api.put(`/bookings/${bookingId}`, {
        assignedTutor: tutorId,
        status: 'Assigned'
      });
      if (res.data && res.data.success) {
        const tutorObj = tutors.find(t => String(t._id) === String(tutorId));
        setBookings(prev => prev.map(b => b._id === bookingId ? {
          ...b,
          status: 'Assigned',
          assignedTutor: tutorObj ? {
            _id: tutorObj._id,
            fullName: tutorObj.fullName,
            mobile: tutorObj.mobile,
            email: tutorObj.email,
            subjects: tutorObj.subjects,
            photo: tutorObj.photo,
            city: tutorObj.city,
            state: tutorObj.state,
            streetAddress: tutorObj.streetAddress,
            experience: tutorObj.experience,
            qualification: tutorObj.qualification
          } : tutorId
        } : b));

        // Refresh stats
        const statsRes = await api.get('/admin/stats');
        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        setAssignModalBooking(null);
      }
    } catch (err) {
      console.error('Failed to assign tutor:', err);
      alert('Failed to assign tutor. Please try again.');
    } finally {
      setAssignLoading(false);
    }
  };

  // Unassign Tutor
  const handleUnassignTutor = async (bookingId) => {
    if (!window.confirm('Are you sure you want to unassign the tutor from this student request?')) return;
    try {
      const res = await api.put(`/bookings/${bookingId}`, {
        assignedTutor: null,
        status: 'Pending'
      });
      if (res.data && res.data.success) {
        setBookings(prev => prev.map(b => b._id === bookingId ? {
          ...b,
          status: 'Pending',
          assignedTutor: null
        } : b));
        const statsRes = await api.get('/admin/stats');
        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to unassign tutor:', err);
    }
  };

  // Update Status of Student Request
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}`, { status: newStatus });
      if (res.data && res.data.success) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        const statsRes = await api.get('/admin/stats');
        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Delete Student Request
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this student request?')) return;
    try {
      const res = await api.delete(`/bookings/${bookingId}`);
      if (res.data && res.data.success) {
        setBookings(prev => prev.filter(b => b._id !== bookingId));
        const statsRes = await api.get('/admin/stats');
        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  // Delete / Remove Student Account
  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove student "${studentName || 'this student'}"? This will permanently delete their account and associated class requests.`)) {
      return;
    }
    setActionLoading(studentId);
    setErrorMsg('');
    try {
      const res = await api.delete(`/admin/students/${studentId}`);
      if (res.data && res.data.success) {
        setStudents(prev => prev.filter(s => s._id !== studentId));
        // Refresh bookings and stats
        try {
          const [statsRes, bookingsRes] = await Promise.all([
            api.get('/admin/stats'),
            api.get('/bookings')
          ]);
          if (statsRes.data && statsRes.data.success) {
            setStats(statsRes.data.data);
          }
          if (bookingsRes.data && bookingsRes.data.success) {
            setBookings(bookingsRes.data.data || []);
          }
        } catch (rErr) {
          console.log('Refresh error after deleting student:', rErr);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to remove student account.');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchDashboardData();
      }
    });
    return () => {
      active = false;
    };
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
        <div className="max-w-screen-2xl mx-auto space-y-8">
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
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto scrollbar-none">
            {['Overview', 'Verified Tutors', 'Unverified Tutors', 'Students', 'Student Requests'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 text-sm font-extrabold border-b-2 transition-all focus:outline-none flex items-center gap-2 shrink-0 ${
                  activeTab === tab
                    ? 'border-primary text-primary dark:border-blue-500 dark:text-blue-400 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab}</span>
                {tab === 'Student Requests' && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    unassignedBookingsCount > 0
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {totalBookingsCount}
                  </span>
                )}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <div 
                      onClick={() => setActiveTab('Verified Tutors')}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-slate-900 shadow-md dark:bg-black dark:border-slate-950 flex items-center justify-center text-xl shrink-0 relative overflow-visible">
                        <svg width="0" height="0" className="absolute">
                          <linearGradient id="cap-gradient-admin" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d4af37" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#fffbdf" />
                          </linearGradient>
                        </svg>
                        <FaGraduationCap style={{ fill: "url(#cap-gradient-admin)" }} className="filter drop-shadow-[0_1px_4px_rgba(212,175,55,0.5)]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Tutors</p>
                        <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">{stats.tutors?.total || 0}</h4>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setActiveTab('Verified Tutors')}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-455 flex items-center justify-center text-xl shrink-0">
                        <FaUserCheck />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Tutors</p>
                        <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">{stats.tutors?.verified || 0}</h4>
                      </div>
                    </div>
 
                    <div 
                      onClick={() => setActiveTab('Verified Tutors')}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
                        <FaUser />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Tutors</p>
                        <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">{stats.tutors?.active || 0}</h4>
                      </div>
                    </div>

                    <div 
                      onClick={() => setActiveTab('Students')}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                        <ColorfulUsersIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
                        <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">{stats.students?.total || 0}</h4>
                      </div>
                    </div>

                    {/* New Storage Capacity Stat Card */}
                    <div 
                      onClick={() => setShowCapacityDetails(prev => !prev)}
                      className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all ${
                        showCapacityDetails ? 'border-primary dark:border-blue-500' : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 flex items-center justify-center shrink-0">
                          <ColorfulDatabaseIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Storage Capacity</p>
                          <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">
                            {(stats.storage && stats.storage.databaseSize > 0) ? (
                              100 - Math.max(
                                Math.min((stats.storage.databaseSize / (512 * 1024 * 1024)) * 100, 100),
                                Math.min((stats.storage.cdnSize / (25 * 1024 * 1024 * 1024)) * 100, 100)
                              )
                            ).toFixed(2) : (
                              100 - Math.max(
                                Math.min((((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0) / 1024 / 512) * 100, 100),
                                Math.min(((stats.tutors?.total || 0) * 1.2 / 25000) * 100, 100)
                              )
                            ).toFixed(2)}% Free
                          </h4>
                        </div>
                      </div>
                      <svg 
                        className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${showCapacityDetails ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Storage Capacity Section */}
                  {showCapacityDetails && (
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
                            <span>
                              {(stats.storage && stats.storage.databaseSize > 0)
                                ? `${(stats.storage.databaseSize / (1024 * 1024)).toFixed(4)} MB (${Math.min((stats.storage.databaseSize / (512 * 1024 * 1024)) * 100, 100).toFixed(4)}%)`
                                : `${(((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0) / 1024).toFixed(4)} MB (${Math.min((((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0) / 1024 / 512) * 100, 100).toFixed(4)}%)`}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500" 
                              style={{ 
                                width: `${(stats.storage && stats.storage.databaseSize > 0)
                                  ? Math.min((stats.storage.databaseSize / (512 * 1024 * 1024)) * 100, 100)
                                  : Math.min((((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0) / 1024 / 512) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </div>

                        {/* Cloudinary Metric */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-330">
                            <span>Cloudinary Asset CDN (25 GB Free)</span>
                            <span>
                              {(stats.storage && stats.storage.cdnSize > 0)
                                ? `${(stats.storage.cdnSize / (1024 * 1024)).toFixed(2)} MB (${Math.min((stats.storage.cdnSize / (25 * 1024 * 1024 * 1024)) * 100, 100).toFixed(4)}%)`
                                : `${((stats.tutors?.total || 0) * 0.9).toFixed(2)} MB (${Math.min(((stats.tutors?.total || 0) * 0.9 / 25000) * 100, 100).toFixed(4)}%)`}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 transition-all duration-500" 
                              style={{ 
                                width: `${(stats.storage && stats.storage.cdnSize > 0)
                                  ? Math.min((stats.storage.cdnSize / (25 * 1024 * 1024 * 1024)) * 100, 100)
                                  : Math.min(((stats.tutors?.total || 0) * 0.9 / 25000) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Remaining Limit estimations */}
                      <div className="space-y-5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Remaining Capacity Estimations</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-slate-900 shadow-md flex items-center justify-center text-white relative overflow-hidden shrink-0">
                              <svg width="0" height="0" className="absolute">
                                <linearGradient id="tutor-cap-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#d4af37" />
                                  <stop offset="50%" stopColor="#f59e0b" />
                                  <stop offset="100%" stopColor="#fffbdf" />
                                </linearGradient>
                              </svg>
                              <FaGraduationCap style={{ fill: "url(#tutor-cap-gradient)" }} className="h-6 w-6 filter drop-shadow-[0_1px_3px_rgba(212,175,55,0.4)]" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Max Tutor Logins</p>
                              <h4 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">
                                {(stats.storage && stats.storage.databaseSize > 0) ? (
                                  Math.max(0, Math.min(
                                    Math.floor((512 * 1024 * 1024 - stats.storage.databaseSize) / (stats.storage.avgTutorDbSize || 3.5 * 1024)),
                                    Math.floor((25 * 1024 * 1024 * 1024 - stats.storage.cdnSize) / (stats.storage.avgTutorCdnSize || 900 * 1024))
                                  )).toLocaleString()
                                ) : (
                                  Math.max(0, Math.min(
                                    Math.floor((512 * 1024 - ((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0)) / 3.5),
                                    Math.floor((25000 - (stats.tutors?.total || 0) * 0.9) / 0.9)
                                  )).toLocaleString()
                                )}
                              </h4>
                              <p className="text-[8px] text-slate-400 font-bold tracking-tight leading-tight mt-0.5">Bounded by Cloudinary</p>
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center shrink-0">
                              <ColorfulDatabaseIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Max Student Logins</p>
                              <h4 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 mt-0.5">
                                {(stats.storage && stats.storage.databaseSize > 0) ? (
                                  Math.max(0, Math.floor((512 * 1024 * 1024 - stats.storage.databaseSize) / (stats.storage.avgStudentDbSize || 0.5 * 1024))).toLocaleString()
                                ) : (
                                  Math.max(0, Math.floor((512 * 1024 - ((stats.students?.total || 0) * 0.5 + (stats.tutors?.total || 0) * 3.5 + (stats.bookings?.total || 0) * 1.0)) / 0.5)).toLocaleString()
                                )}
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
                        <li><strong>Student registration size:</strong> ~{(stats.storage?.avgStudentDbSize ? (stats.storage.avgStudentDbSize / 1024).toFixed(3) : '0.5')} KB inside MongoDB. Students do not upload files.</li>
                        <li><strong>Tutor profile registration size:</strong> ~{(stats.storage?.avgTutorDbSize ? (stats.storage.avgTutorDbSize / 1024).toFixed(3) : '3.5')} KB inside MongoDB (profile, subjects, classes, location coordinates) + ~{(stats.storage?.avgTutorCdnSize ? (stats.storage.avgTutorCdnSize / 1024).toFixed(1) : '900')} KB average inside Cloudinary CDN for attachments (profile picture, verified certificates).</li>
                        <li><strong>Booking Request size:</strong> ~{(stats.storage?.avgBookingSize ? (stats.storage.avgBookingSize / 1024).toFixed(3) : '1.0')} KB inside MongoDB.</li>
                      </ul>
                    </div>
                  </div>
                  )}

                  {/* ======================================================== */}
                  {/* STUDENT REQUESTS OVERVIEW CARD (3 SECTIONS + TUTOR DETAILS) */}
                  {/* ======================================================== */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-500/20 shrink-0">
                          <FaClipboardList />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                              Student Request Center
                            </h3>
                            <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                              {totalBookingsCount} Requests
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            Track student inquiries, tutor allocations, and direct match assignments.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setBookingFilter('all');
                          setActiveTab('Student Requests');
                        }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-primary dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors self-start sm:self-auto"
                      >
                        <span>Open Full Requests Board</span>
                        <FaArrowRight className="text-[10px]" />
                      </button>
                    </div>

                    {/* 3 Sections Grid: Total Requests, Assigned Tutors, Unassigned Tutors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Section 1: Total Requests */}
                      <div
                        onClick={() => {
                          setBookingFilter('all');
                          setActiveTab('Student Requests');
                        }}
                        className="group relative overflow-hidden bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/40 dark:from-indigo-950/20 dark:via-slate-900 dark:to-blue-950/10 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl p-6 cursor-pointer hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-[1.01] transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20 shrink-0">
                            <FaClipboardList />
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            All Enquiries
                          </span>
                        </div>
                        <div className="mt-4">
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                            Total Requests
                          </p>
                          <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
                            {totalBookingsCount}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                            Total trial and tuition requests placed by students across all subjects and locations.
                          </p>
                        </div>
                        <div className="mt-5 pt-3.5 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                          <span>View all student requests</span>
                          <FaArrowRight className="text-[11px]" />
                        </div>
                      </div>

                      {/* Section 2: Assigned Tutors */}
                      <div
                        onClick={() => {
                          setBookingFilter('assigned');
                          setActiveTab('Student Requests');
                        }}
                        className="group relative overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/10 border border-emerald-100 dark:border-emerald-900/40 rounded-3xl p-6 cursor-pointer hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.01] transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-500/20 shrink-0">
                            <FaUserCheck />
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Matched & Active ✅
                          </span>
                        </div>
                        <div className="mt-4">
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                            Assigned Tutors
                          </p>
                          <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
                            {assignedBookingsCount}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                            Students successfully connected to a requested tutor profile with full contact details.
                          </p>
                        </div>
                        <div className="mt-5 pt-3.5 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                          <span>View assigned tutors</span>
                          <FaArrowRight className="text-[11px]" />
                        </div>
                      </div>

                      {/* Section 3: Unassigned Tutors */}
                      <div
                        onClick={() => {
                          setBookingFilter('unassigned');
                          setActiveTab('Student Requests');
                        }}
                        className="group relative overflow-hidden bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/10 border border-amber-100 dark:border-amber-900/40 rounded-3xl p-6 cursor-pointer hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 hover:scale-[1.01] transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20 shrink-0">
                            <FaUserClock />
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            Action Required ⚠️
                          </span>
                        </div>
                        <div className="mt-4">
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                            Unassigned Tutors
                          </p>
                          <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
                            {unassignedBookingsCount}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                            Open student enquiries pending tutor assignment. Click to assign a verified tutor.
                          </p>
                        </div>
                        <div className="mt-5 pt-3.5 border-t border-amber-100 dark:border-amber-900/40 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                          <span>Assign tutors now</span>
                          <FaArrowRight className="text-[11px]" />
                        </div>
                      </div>
                    </div>

                    {/* Requested Tutor Allocations Preview */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Recent Student Requests & Requested Tutor Allocations
                        </h4>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          Showing recent requests
                        </span>
                      </div>

                      {bookings.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                          No student requests recorded yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {bookings.slice(0, 4).map(booking => {
                            const tutor = getBookingTutor(booking);
                            return (
                              <div
                                key={booking._id}
                                className="bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4.5 space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                              >
                                {/* Student Header */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarStyle(booking.studentName)}`}>
                                      {(booking.studentName || 'S').trim().charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                                        {booking.studentName}
                                      </h5>
                                      <p className="text-[11px] text-slate-400 font-medium">
                                        {booking.gradeClass || 'Student'} • {formatVerifiedDate(booking.createdAt)}
                                      </p>
                                    </div>
                                  </div>

                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    booking.status === 'Assigned'
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                      : booking.status === 'Contacted'
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </div>

                                {/* Subject & Location Pills */}
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                                    📚 {booking.subject || 'All Subjects'}
                                  </span>
                                  <span className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium text-[11px] flex items-center gap-1" title={`Student Location: ${getBookingStudentLocation(booking)}`}>
                                    <FaMapMarkerAlt className="text-rose-500 text-[10px]" />
                                    <span>Student: <strong>{getBookingStudentLocation(booking)}</strong></span>
                                  </span>
                                  <span className="text-slate-400 text-[11px] font-medium ml-auto">
                                    Mode: <strong className="text-slate-600 dark:text-slate-300">{booking.preferredMode || 'Offline'}</strong>
                                  </span>
                                </div>

                                {/* REQUESTED TUTOR SECTION */}
                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                                    Requested Tutor Allocation
                                  </p>
                                  {tutor ? (
                                    <div className="bg-white dark:bg-slate-900/90 border border-emerald-200/70 dark:border-emerald-900/40 rounded-xl p-3 flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        {tutor.photo ? (
                                          <img src={tutor.photo} alt={tutor.fullName} className="h-9 w-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
                                        ) : (
                                          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarStyle(tutor.fullName)}`}>
                                            {(tutor.fullName || 'T').trim().charAt(0).toUpperCase()}
                                          </div>
                                        )}
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1.5">
                                            <p className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                                              {tutor.fullName}
                                            </p>
                                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                                              ✓ Verified
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-slate-400 font-medium truncate">
                                            {getBookingTutorLocation(booking, tutor) !== 'Unassigned' ? `📍 ${getBookingTutorLocation(booking, tutor)} • ` : ''}{tutor.qualification || tutor.experience ? `${tutor.qualification || ''} ${tutor.experience ? `• ${tutor.experience}y exp` : ''}` : tutor.mobile || tutor.email}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          onClick={() => {
                                            setAssignModalBooking(booking);
                                            setAssignTutorSearch('');
                                          }}
                                          className="px-2.5 py-1 text-[11px] font-bold text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                                        >
                                          Change
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 rounded-xl p-2.5 flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <FaExclamationTriangle className="text-amber-500 text-xs shrink-0" />
                                        <div>
                                          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                                            No Tutor Assigned Yet
                                          </p>
                                          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                            Awaiting admin to allocate a verified tutor
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setAssignModalBooking(booking);
                                          setAssignTutorSearch('');
                                        }}
                                        className="px-3 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors shrink-0"
                                      >
                                        + Assign Tutor
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VERIFIED TUTORS */}
              {activeTab === 'Verified Tutors' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden animate-fadeIn space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100">
                          Verified Tutor Accounts Directory
                        </h3>
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {filteredVerifiedTutors.length} of {tutors.filter(t => t.isVerified).length} Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Search and filter verified tutor profiles by location or name.
                      </p>
                    </div>

                    {/* Search Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
                      {/* Location Search Bar */}
                      <div className="relative min-w-[220px]">
                        <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500 text-xs pointer-events-none" />
                        <input
                          type="text"
                          value={tutorLocationSearch}
                          onChange={(e) => setTutorLocationSearch(e.target.value)}
                          placeholder="Search location (city, area)..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-7 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        {tutorLocationSearch && (
                          <button
                            type="button"
                            onClick={() => setTutorLocationSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* General Search Bar */}
                      <div className="relative min-w-[220px]">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                        <input
                          type="text"
                          value={tutorGeneralSearch}
                          onChange={(e) => setTutorGeneralSearch(e.target.value)}
                          placeholder="Search name, subject, email..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-7 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        {tutorGeneralSearch && (
                          <button
                            type="button"
                            onClick={() => setTutorGeneralSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
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
                        {filteredVerifiedTutors.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                              {tutors.filter(t => t.isVerified).length === 0
                                ? 'No verified tutors yet.'
                                : 'No verified tutors matching your location or search query.'}
                            </td>
                          </tr>
                        ) : (
                          filteredVerifiedTutors.map(tutor => (
                            <tr key={tutor._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                              <td className="py-3.5 pl-2">
                                <div className="flex items-center gap-3">
                                  {tutor.photo && !tutor.photo.includes('photo-1535713875002-d1d0cf377fde') ? (
                                    <img src={tutor.photo} alt={tutor.fullName} className="h-8 w-8 rounded-full object-cover border" />
                                  ) : (
                                    <div className={`h-8 w-8 rounded-full font-extrabold flex items-center justify-center text-xs shrink-0 ${getAvatarStyle(tutor.fullName)}`}>
                                      {(tutor.fullName || 'T').trim().charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-bold text-slate-850 dark:text-slate-200">{tutor.fullName}</p>
                                    <p className="text-[9px] text-slate-400">
                                      {tutor.email} • {tutor.mobile}
                                      {tutor.paymentId && ` • Paid (ID: ${tutor.paymentId})`}
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
                                <p className="text-[9px] text-slate-400">{parseArrayField(tutor.subjects).slice(0, 3).join(', ')} • {tutor.experience} Yrs Exp</p>
                              </td>
                              <td className="py-3.5">
                                <div className="flex items-center gap-1.5">
                                  <FaMapMarkerAlt className="text-rose-500 text-[10px] shrink-0" />
                                  <p className="font-medium text-slate-800 dark:text-slate-200">{tutor.city || 'N/A'}</p>
                                </div>
                                <p className="text-[9px] text-slate-400 pl-4">{tutor.state || tutor.streetAddress || ''}</p>
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

              {/* TAB 3: UNVERIFIED TUTORS */}
              {activeTab === 'Unverified Tutors' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden animate-fadeIn space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100">
                          Unverified Tutor Accounts Directory
                        </h3>
                        <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          {filteredUnverifiedTutors.length} of {tutors.filter(t => !t.isVerified).length} Pending
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Review pending tutor registrations awaiting verification.
                      </p>
                    </div>

                    {/* Search Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
                      {/* Location Search Bar */}
                      <div className="relative min-w-[220px]">
                        <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500 text-xs pointer-events-none" />
                        <input
                          type="text"
                          value={unverifiedLocationSearch}
                          onChange={(e) => setUnverifiedLocationSearch(e.target.value)}
                          placeholder="Search location (city, area)..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-7 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        {unverifiedLocationSearch && (
                          <button
                            type="button"
                            onClick={() => setUnverifiedLocationSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* General Search Bar */}
                      <div className="relative min-w-[220px]">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                        <input
                          type="text"
                          value={unverifiedGeneralSearch}
                          onChange={(e) => setUnverifiedGeneralSearch(e.target.value)}
                          placeholder="Search name, subject, email..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-7 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        {unverifiedGeneralSearch && (
                          <button
                            type="button"
                            onClick={() => setUnverifiedGeneralSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
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
                        {filteredUnverifiedTutors.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                              {tutors.filter(t => !t.isVerified).length === 0
                                ? 'No unverified tutors yet.'
                                : 'No unverified tutors matching your location or search query.'}
                            </td>
                          </tr>
                        ) : (
                          filteredUnverifiedTutors.map(tutor => (
                            <tr key={tutor._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                              <td className="py-3.5 pl-2">
                                <div className="flex items-center gap-3">
                                  {tutor.photo && !tutor.photo.includes('photo-1535713875002-d1d0cf377fde') ? (
                                    <img src={tutor.photo} alt={tutor.fullName} className="h-8 w-8 rounded-full object-cover border" />
                                  ) : (
                                    <div className={`h-8 w-8 rounded-full font-extrabold flex items-center justify-center text-xs shrink-0 ${getAvatarStyle(tutor.fullName)}`}>
                                      {(tutor.fullName || 'T').trim().charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-bold text-slate-850 dark:text-slate-200">{tutor.fullName}</p>
                                    <p className="text-[9px] text-slate-400">
                                      {tutor.email} • {tutor.mobile}
                                      {tutor.paymentId && ` • Paid (ID: ${tutor.paymentId})`}
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
                                <p className="text-[9px] text-slate-400">{parseArrayField(tutor.subjects).slice(0, 3).join(', ')} • {tutor.experience} Yrs Exp</p>
                              </td>
                              <td className="py-3.5">
                                <div className="flex items-center gap-1.5">
                                  <FaMapMarkerAlt className="text-rose-500 text-[10px] shrink-0" />
                                  <p className="font-medium text-slate-800 dark:text-slate-200">{tutor.city || 'N/A'}</p>
                                </div>
                                <p className="text-[9px] text-slate-400 pl-4">{tutor.state || tutor.streetAddress || ''}</p>
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

              {/* TAB 4: STUDENTS DIRECTORY */}
              {activeTab === 'Students' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100">
                          Registered Students Directory ({students.length})
                        </h3>
                        <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                          {filteredStudents.length} of {students.length} Students
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        View student contact details, location, account registration dates, and trial class requests.
                      </p>
                    </div>

                    {/* Search Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
                      {/* Location Search Bar */}
                      <div className="relative min-w-[220px]">
                        <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500 text-xs pointer-events-none" />
                        <input
                          type="text"
                          value={studentLocationSearch}
                          onChange={(e) => setStudentLocationSearch(e.target.value)}
                          placeholder="Search location (city, area)..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-7 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        {studentLocationSearch && (
                          <button
                            type="button"
                            onClick={() => setStudentLocationSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* General Search Bar */}
                      <div className="relative min-w-[220px]">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                        <input
                          type="text"
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          placeholder="Search student name, email, phone..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-7 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        {studentSearch && (
                          <button
                            type="button"
                            onClick={() => setStudentSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                          <th className="py-3 px-2">Student</th>
                          <th className="py-3">Email Address</th>
                          <th className="py-3">Phone Number</th>
                          <th className="py-3">Location</th>
                          <th className="py-3">Registered Date</th>
                          <th className="py-3">Class Requests</th>
                          <th className="py-3">Account Status</th>
                          <th className="py-3 pr-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-350">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="py-12 text-center text-slate-400">
                              {students.length === 0
                                ? 'No registered students found in database.'
                                : 'No students found matching your location or search query.'}
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => (
                            <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-3.5 px-2">
                                <div className="flex items-center gap-3">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarStyle(student.name)}`}>
                                    {(student.name || 'S').trim().charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-850 dark:text-slate-100">{student.name}</p>
                                    <p className="text-[10px] text-slate-400">ID: {String(student._id).slice(-6)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5">
                                <a href={`mailto:${student.email}`} className="font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400">
                                  {student.email}
                                </a>
                              </td>
                              <td className="py-3.5">
                                {student.phone ? (
                                  <a href={`tel:${student.phone}`} className="font-medium text-slate-700 dark:text-slate-300 hover:text-primary">
                                    {student.phone}
                                  </a>
                                ) : (
                                  <span className="text-slate-400">Not provided</span>
                                )}
                              </td>
                              <td className="py-3.5">
                                <div className="flex items-center gap-1.5">
                                  <FaMapMarkerAlt className="text-rose-500 text-[11px] shrink-0" />
                                  <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {student.location || [student.streetAddress, student.division, student.city, student.state].filter(Boolean).join(', ') || student.city || 'Location Not Provided'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5">
                                <p className="font-medium text-slate-700 dark:text-slate-300">
                                  {formatVerifiedDate(student.createdAt)}
                                </p>
                              </td>
                              <td className="py-3.5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  (student.requestsCount || 0) > 0
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                  {student.requestsCount || 0} Request{student.requestsCount !== 1 ? 's' : ''}
                                </span>
                              </td>
                              <td className="py-3.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                                  Registered Student
                                </span>
                              </td>
                              <td className="py-3.5 pr-2 text-right">
                                <button
                                  onClick={() => handleDeleteStudent(student._id, student.name)}
                                  disabled={actionLoading === student._id}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-600 rounded-xl border border-rose-200 dark:border-rose-900/50 transition-all shadow-xs disabled:opacity-50"
                                  title={`Remove student ${student.name}`}
                                >
                                  <FaTrashAlt className="text-[10px]" />
                                  <span>{actionLoading === student._id ? 'Removing...' : 'Remove Student'}</span>
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

              {/* TAB 5: STUDENT REQUESTS & TUTOR ALLOCATION */}
              {activeTab === 'Student Requests' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden animate-fadeIn space-y-6">
                  {/* Top Bar: Title & Filter Pills */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100">
                          Student Tuition Requests & Tutor Directory
                        </h3>
                        <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                          {filteredBookings.length} of {bookings.length} Requests
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        View details about which tutor the student has requested, manage assignments, and update statuses.
                      </p>
                    </div>

                    {/* Filter Segmented Control */}
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0 self-start lg:self-auto">
                      <button
                        onClick={() => setBookingFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          bookingFilter === 'all'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                        }`}
                      >
                        All Requests ({totalBookingsCount})
                      </button>
                      <button
                        onClick={() => setBookingFilter('unassigned')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          bookingFilter === 'unassigned'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <span>Pending Assignment</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${bookingFilter === 'unassigned' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'}`}>
                          {unassignedBookingsCount}
                        </span>
                      </button>
                      <button
                        onClick={() => setBookingFilter('assigned')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          bookingFilter === 'assigned'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <span>Assigned Requests</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${bookingFilter === 'assigned' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'}`}>
                          {assignedBookingsCount}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Search Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                      {/* Location Search Bar */}
                      <div className="relative min-w-[240px]">
                        <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500 text-xs pointer-events-none" />
                        <input
                          type="text"
                          value={bookingLocationSearch}
                          onChange={(e) => setBookingLocationSearch(e.target.value)}
                          placeholder="Search location (city, area)..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-7 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        {bookingLocationSearch && (
                          <button
                            type="button"
                            onClick={() => setBookingLocationSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* General Search Bar */}
                      <div className="relative min-w-[260px]">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                        <input
                          type="text"
                          value={bookingGeneralSearch}
                          onChange={(e) => setBookingGeneralSearch(e.target.value)}
                          placeholder="Search student, tutor, subject, phone..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-7 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        {bookingGeneralSearch && (
                          <button
                            type="button"
                            onClick={() => setBookingGeneralSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                      Showing <strong className="text-slate-700 dark:text-slate-200">{filteredBookings.length}</strong> matching enquiries
                    </div>
                  </div>

                  {/* Table View */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                          <th className="py-3 px-2">Student</th>
                          <th className="py-3">Contact</th>
                          <th className="py-3">Locations (Student & Tutor)</th>
                          <th className="py-3 min-w-[240px]">Which Tutor Requested</th>
                          <th className="py-3">Status</th>
                          <th className="py-3 pr-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-350">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-12 text-center text-slate-400">
                              {bookings.length === 0
                                ? 'No student requests found in database.'
                                : 'No requests found matching your filter or search query.'}
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((booking) => {
                            const tutor = getBookingTutor(booking);
                            const studentLoc = getBookingStudentLocation(booking);
                            const tutorLoc = getBookingTutorLocation(booking, tutor);
                            const studentFull = getBookingStudentFullAddress(booking);
                            const tutorFull = getBookingTutorFullAddress(booking, tutor);
                            const cleanPhone = (booking.studentPhone || '').replace(/\D/g, '');

                            return (
                              <tr key={booking._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                {/* Student */}
                                <td className="py-3.5 px-2">
                                  <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarStyle(booking.studentName)}`}>
                                      {(booking.studentName || 'S').trim().charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-slate-850 dark:text-slate-100">{booking.studentName}</p>
                                      <p className="text-[10px] text-slate-400">
                                        {booking.gradeClass || 'Student'} • {formatVerifiedDate(booking.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* Contact */}
                                <td className="py-3.5">
                                  <div className="space-y-1">
                                    {booking.studentPhone && (
                                      <div className="flex items-center gap-1.5">
                                        <a href={`tel:${booking.studentPhone}`} className="font-bold text-slate-800 dark:text-slate-200 hover:text-primary">
                                          {booking.studentPhone}
                                        </a>
                                        {cleanPhone && (
                                          <a
                                            href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${booking.studentName}, this is HomeTutorX regarding your tuition request for ${booking.subject || 'classes'}.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-500 hover:text-emerald-600 p-0.5"
                                            title="Chat on WhatsApp"
                                          >
                                            <FaWhatsapp className="text-xs" />
                                          </a>
                                        )}
                                      </div>
                                    )}
                                    {booking.studentEmail && (
                                      <a href={`mailto:${booking.studentEmail}`} className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-primary truncate max-w-[150px]">
                                        {booking.studentEmail}
                                      </a>
                                    )}
                                  </div>
                                </td>



                                {/* Locations: Student & Tutor */}
                                <td className="py-3.5">
                                  <div className="space-y-2 min-w-[170px] max-w-[230px]">
                                    {/* Student Location */}
                                    <div className="flex items-start gap-1.5">
                                      <FaMapMarkerAlt className="text-rose-500 text-[11px] shrink-0 mt-0.5" />
                                      <div className="min-w-0">
                                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                                          Student Location
                                        </p>
                                        <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-snug break-words" title={studentFull || studentLoc}>
                                          {studentLoc}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Tutor Location */}
                                    <div className="flex items-start gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                                      <FaGraduationCap className="text-primary text-[11px] shrink-0 mt-0.5" />
                                      <div className="min-w-0">
                                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                                          Tutor Location
                                        </p>
                                        <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-snug break-words" title={tutor ? (tutorFull || tutorLoc) : 'Awaiting Assignment'}>
                                          {tutor ? (
                                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{tutorLoc}</span>
                                          ) : (
                                            <span className="text-slate-400 font-normal italic">Awaiting Assignment</span>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* WHICH TUTOR REQUESTED */}
                                <td className="py-3.5">
                                  {tutor ? (
                                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 rounded-xl p-2.5 max-w-[280px]">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          {tutor.photo ? (
                                            <img src={tutor.photo} alt={tutor.fullName} className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
                                          ) : (
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarStyle(tutor.fullName)}`}>
                                              {(tutor.fullName || 'T').trim().charAt(0).toUpperCase()}
                                            </div>
                                          )}
                                          <div className="min-w-0">
                                            <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                              {tutor.fullName}
                                            </p>
                                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                              ✓ Assigned Tutor
                                            </p>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => {
                                            setConfirmChangeBooking(booking);
                                          }}
                                          className="text-[10px] font-bold text-primary dark:text-blue-400 hover:underline shrink-0"
                                        >
                                          Change
                                        </button>
                                      </div>

                                      <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400">
                                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                          <FaMapMarkerAlt className="text-rose-500 text-[9px] shrink-0" />
                                          {tutorLoc}
                                        </span>
                                        {tutor.mobile && (
                                          <span className="ml-auto">{tutor.mobile}</span>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1.5">
                                      <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                                        <FaExclamationTriangle className="text-[9px]" />
                                        Pending Assignment
                                      </span>
                                      <div>
                                        <button
                                          onClick={() => {
                                            setAssignModalBooking(booking);
                                            setAssignTutorSearch('');
                                          }}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
                                        >
                                          + Assign Tutor
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </td>

                                {/* Status */}
                                <td className="py-3.5">
                                  <select
                                    value={booking.status || 'Pending'}
                                    onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                                    className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${
                                      booking.status === 'Assigned'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                                    }`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Assigned">Assigned</option>
                                  </select>
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 pr-2 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setAssignModalBooking(booking);
                                        setAssignTutorSearch('');
                                      }}
                                      title={tutor ? "Change assigned tutor" : "Assign a tutor"}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                      <FaExchangeAlt className="text-xs" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteBooking(booking._id)}
                                      title="Delete request"
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                    >
                                      <FaTrashAlt className="text-xs" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </>
          )}

          {/* CONFIRMATION POPUP FOR CHANGING ASSIGNED TUTOR */}
          {confirmChangeBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0 border border-amber-200/60 dark:border-amber-800/60">
                    <FaExclamationTriangle />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Change Assigned Tutor</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Confirmation Required</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you sure you want to change the assigned tutor for <strong>{confirmChangeBooking.studentName || 'this student'}</strong>? Confirming will open the tutor directory to allocate a new tutor.
                </p>

                {getBookingTutor(confirmChangeBooking) && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 text-xs">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Current Assigned Tutor</p>
                    <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {getBookingTutor(confirmChangeBooking)?.fullName}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    onClick={() => setConfirmChangeBooking(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const booking = confirmChangeBooking;
                      setConfirmChangeBooking(null);
                      setAssignModalBooking(booking);
                      setAssignTutorSearch('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 shadow-sm transition-colors"
                  >
                    Yes, Change Tutor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ASSIGN TUTOR MODAL */}
          {/* ======================================================== */}
          {assignModalBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Assign Tutor to Student Request
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Choose a verified tutor from your directory to allocate to this student.
                    </p>
                  </div>
                  <button
                    onClick={() => setAssignModalBooking(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FaTimes className="text-base" />
                  </button>
                </div>

                {/* Target Student Request Summary */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Student Enquiry Details
                    </span>
                    <span className="text-xs font-bold text-primary dark:text-blue-400">
                      {assignModalBooking.gradeClass || 'Student'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <p className="font-extrabold text-slate-900 dark:text-white">
                      {assignModalBooking.studentName}
                    </p>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">
                      📚 Subject: <strong>{assignModalBooking.subject || 'All Subjects'}</strong>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1">
                      <FaMapMarkerAlt className="text-rose-500 text-[10px]" />
                      {assignModalBooking.location || 'Location Not Specified'}
                    </span>
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  <input
                    type="text"
                    value={assignTutorSearch}
                    onChange={(e) => setAssignTutorSearch(e.target.value)}
                    placeholder="Search verified tutors by name, subject, area..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-8 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-medium"
                  />
                  {assignTutorSearch && (
                    <button
                      onClick={() => setAssignTutorSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Tutors List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {filteredTutorsForAssignment.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400 font-medium">
                      No verified tutors found matching "{assignTutorSearch}".
                    </div>
                  ) : (
                    filteredTutorsForAssignment.map(tutor => {
                      const isCurrentlyAssigned = assignModalBooking.assignedTutor && (
                        String(assignModalBooking.assignedTutor._id || assignModalBooking.assignedTutor) === String(tutor._id)
                      );
                      const tutorSubjects = parseArrayField(tutor.subjects);
                      const isSubjectMatch = tutorSubjects.some(s => 
                        s.toLowerCase().includes((assignModalBooking.subject || '').toLowerCase())
                      );

                      return (
                        <div
                          key={tutor._id}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isCurrentlyAssigned
                              ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800'
                              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {tutor.photo ? (
                              <img src={tutor.photo} alt={tutor.fullName} className="h-10 w-10 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
                            ) : (
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarStyle(tutor.fullName)}`}>
                                {(tutor.fullName || 'T').trim().charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                  {tutor.fullName}
                                </p>
                                {isSubjectMatch && (
                                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                    Subject Match
                                  </span>
                                )}
                                {isCurrentlyAssigned && (
                                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                {tutor.qualification || ''} • {tutor.city || tutor.state || 'Location not set'} • {tutor.mobile || tutor.email}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tutorSubjects.slice(0, 3).map((sub, i) => (
                                  <span key={i} className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-medium">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant={isCurrentlyAssigned ? 'secondary' : 'primary'}
                            disabled={assignLoading || isCurrentlyAssigned}
                            onClick={() => handleAssignTutor(assignModalBooking._id, tutor._id)}
                            className="shrink-0 text-xs font-bold"
                          >
                            {isCurrentlyAssigned ? 'Assigned' : 'Assign'}
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="ghost" size="sm" onClick={() => setAssignModalBooking(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
