import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight, 
  FaArrowLeft, 
  FaCheck, 
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaSearch
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import api from '../services/api';
import { STATES, STATE_CITIES } from '../constants';

const RegisterStudent = () => {
  const [step, setStep] = useState(1);
  const [verificationFee, setVerificationFee] = useState(1);
  
  // Step 1: Personal info
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Preferred Location (Preferred State, Preferred Division, Street Address)
  const [preferredState, setPreferredState] = useState('');
  const [preferredDivision, setPreferredDivision] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  // Dropdown & Search states for location
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [isDivisionDropdownOpen, setIsDivisionDropdownOpen] = useState(false);
  const [divisionSearchQuery, setDivisionSearchQuery] = useState('');
  
  // Step 3: Account credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  // Filtered states based on search query
  const filteredStates = STATES.filter(s => 
    s.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  // Available divisions for selected state
  const allStateDivisions = preferredState ? (STATE_CITIES[preferredState] || []) : [];
  const filteredDivisions = allStateDivisions.filter(d => 
    d.toLowerCase().includes(divisionSearchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/config/settings');
        if (res.data && res.data.success) {
          setVerificationFee(res.data.studentVerificationFee);
        }
      } catch (err) {
        console.error('Failed to load dynamic settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Validate step 1 (Personal Details)
  const handleNextStep1 = () => {
    const trimmedName = firstName.trim();
    if (!trimmedName) {
      setErrorMsg('Please enter your first name.');
      return;
    }
    if (trimmedName.length > 25) {
      setErrorMsg('Name cannot exceed 25 characters.');
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      setErrorMsg('Name can only contain letters and spaces (no periods or commas).');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  // Validate step 2 (Preferred Location)
  const handleNextStep2 = () => {
    if (!preferredState) {
      setErrorMsg('Please select your preferred state.');
      return;
    }
    if (!preferredDivision) {
      setErrorMsg('Please select your preferred division.');
      return;
    }
    if (!streetAddress.trim()) {
      setErrorMsg('Please enter your street address.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  // Submit form (Step 3: Account Credentials)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password || !confirmPassword) {
      setErrorMsg('Please fill in all details.');
      return;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const fullLocation = `${streetAddress.trim()}, ${preferredDivision}, ${preferredState}`;
      await registerStudent({
        name: firstName.trim(),
        phone: phone.trim(),
        state: preferredState,
        division: preferredDivision,
        city: preferredDivision,
        streetAddress: streetAddress.trim(),
        location: fullLocation,
        email: email.trim().toLowerCase(),
        password,
        paymentStatus: 'Paid',
        paymentId: 'free_student_registration'
      });

      setSuccessMsg('Registration successful! Redirecting to student dashboard...');
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Student Registration"
        description="Sign up as a student on HomeTutorX to browse and book tutoring classes with verified tutors."
      />

      <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 dark:bg-blue-500/5" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 dark:bg-amber-500/5" />

        <div className="max-w-lg w-full space-y-8 bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl glass relative">
          
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create Student Account
            </h2>
            <p className="mt-2 text-sm text-slate-550 dark:text-slate-400 font-medium">
              Join HomeTutorX to find your perfect tutor today
            </p>
          </div>

          {/* Stepper Progress Indicator (3 Steps) */}
          <div className="flex items-center justify-center gap-2 py-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-colors duration-200 ${
              step === 1 
                ? 'bg-slate-950 text-white dark:bg-slate-200 dark:text-slate-950' 
                : 'bg-emerald-500 text-white'
            }`}>
              {step > 1 ? <FaCheck className="w-3.5 h-3.5" /> : '1'}
            </div>
            
            <div className={`h-1 w-12 sm:w-16 rounded transition-colors duration-200 ${
              step > 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
            }`} />
            
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-colors duration-200 ${
              step === 2 
                ? 'bg-slate-950 text-white dark:bg-slate-200 dark:text-slate-950' 
                : step > 2 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-150 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {step > 2 ? <FaCheck className="w-3.5 h-3.5" /> : '2'}
            </div>
            
            <div className={`h-1 w-12 sm:w-16 rounded transition-colors duration-200 ${
              step > 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
            }`} />
            
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-colors duration-200 ${
              step === 3 
                ? 'bg-slate-950 text-white dark:bg-slate-200 dark:text-slate-950' 
                : 'bg-slate-150 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              3
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 text-xs font-semibold text-rose-650 dark:text-rose-400 flex items-center gap-3"
            >
              <span className="text-sm"><FaExclamationTriangle className="h-4 w-4 shrink-0 text-rose-500" /></span>
              <p>{errorMsg}</p>
            </motion.div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 text-xs font-semibold text-emerald-650 dark:text-emerald-400 flex items-center gap-3"
            >
              <span><FaCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" /></span>
              <p>{successMsg}</p>
            </motion.div>
          )}

          {/* Wizard Steps */}
          <AnimatePresence mode="wait">
            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    First Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400"><FaUser className="h-4 w-4" /></span>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400"><FaPhone className="h-4 w-4" /></span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) setPhone(val);
                      }}
                      maxLength={10}
                      placeholder="9876543210"
                      className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNextStep1}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white dark:bg-slate-200 dark:hover:bg-slate-100 dark:text-slate-950 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition duration-200"
                  >
                    Next Step <FaArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Preferred Location (Preferred State, Preferred Division, Street Address) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* State & Division in 2-column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* PREFERRED STATE */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                      Preferred State
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400 pointer-events-none">
                        <FaMapMarkerAlt className="h-4 w-4" />
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsStateDropdownOpen(!isStateDropdownOpen);
                          setIsDivisionDropdownOpen(false);
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-left focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 flex items-center justify-between cursor-pointer"
                      >
                        <span className={preferredState ? 'text-slate-850 dark:text-slate-100 font-semibold truncate' : 'text-slate-400 truncate'}>
                          {preferredState || 'Select State'}
                        </span>
                        <span className="text-slate-400 text-xs shrink-0 ml-1">▼</span>
                      </button>

                      {/* State Dropdown with Search */}
                      {isStateDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsStateDropdownOpen(false);
                              setStateSearchQuery('');
                            }} 
                          />
                          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 flex flex-col gap-2 max-h-72">
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-slate-400 text-xs pointer-events-none">
                                <FaSearch className="h-3 w-3" />
                              </span>
                              <input
                                type="text"
                                value={stateSearchQuery}
                                onChange={(e) => setStateSearchQuery(e.target.value)}
                                placeholder="Search state..."
                                autoFocus
                                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-primary transition-all duration-200"
                              />
                            </div>
                            
                            <div className="overflow-y-auto flex-1 space-y-0.5 max-h-48 pr-1 custom-scrollbar">
                              {filteredStates.length === 0 ? (
                                <p className="text-slate-400 dark:text-slate-500 text-xs text-center py-4">No states found</p>
                              ) : (
                                filteredStates.map((s, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                      setPreferredState(s);
                                      setPreferredDivision('');
                                      setIsStateDropdownOpen(false);
                                      setStateSearchQuery('');
                                    }}
                                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                                      preferredState === s
                                        ? 'bg-primary text-white dark:bg-blue-500'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* PREFERRED DIVISION */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                      Preferred Division
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400 pointer-events-none">
                        <FaMapMarkerAlt className="h-4 w-4" />
                      </span>
                      <button
                        type="button"
                        disabled={!preferredState}
                        onClick={() => {
                          setIsDivisionDropdownOpen(!isDivisionDropdownOpen);
                          setIsStateDropdownOpen(false);
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-left focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <span className={preferredDivision ? 'text-slate-850 dark:text-slate-100 font-semibold truncate' : 'text-slate-400 truncate'}>
                          {preferredDivision || (preferredState ? 'Select Division' : 'Select state first')}
                        </span>
                        <span className="text-slate-400 text-xs shrink-0 ml-1">▼</span>
                      </button>

                      {/* Division Dropdown with Search */}
                      {isDivisionDropdownOpen && preferredState && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDivisionDropdownOpen(false);
                              setDivisionSearchQuery('');
                            }} 
                          />
                          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 flex flex-col gap-2 max-h-72">
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-slate-400 text-xs pointer-events-none">
                                <FaSearch className="h-3 w-3" />
                              </span>
                              <input
                                type="text"
                                value={divisionSearchQuery}
                                onChange={(e) => setDivisionSearchQuery(e.target.value)}
                                placeholder="Search division..."
                                autoFocus
                                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-primary transition-all duration-200"
                              />
                            </div>
                            
                            <div className="overflow-y-auto flex-1 space-y-0.5 max-h-48 pr-1 custom-scrollbar">
                              {filteredDivisions.length === 0 ? (
                                <p className="text-slate-400 dark:text-slate-500 text-xs text-center py-4">No divisions found</p>
                              ) : (
                                filteredDivisions.map((d, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                      setPreferredDivision(d);
                                      setIsDivisionDropdownOpen(false);
                                      setDivisionSearchQuery('');
                                    }}
                                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                                      preferredDivision === d
                                        ? 'bg-primary text-white dark:bg-blue-500'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                                    }`}
                                  >
                                    {d}
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* STREET ADDRESS */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Street Address
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 pointer-events-none">
                      <FaMapMarkerAlt className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Enter street address"
                      className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Back and Next Step Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setStep(1);
                    }}
                    className="w-1/3 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 transition focus:outline-none cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FaArrowLeft className="h-3 w-3" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep2}
                    className="w-2/3 bg-slate-950 hover:bg-slate-900 text-white dark:bg-slate-200 dark:hover:bg-slate-100 dark:text-slate-950 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition duration-200"
                  >
                    Next Step <FaArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Account Credentials */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-300 mb-2 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400"><FaEnvelope className="h-4 w-4" /></span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-350 mb-2 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400"><FaLock className="h-4 w-4" /></span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl py-3.5 pl-11 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-350 mb-2 uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400"><FaLock className="h-4 w-4" /></span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl py-3.5 pl-11 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg('');
                        setStep(2);
                      }}
                      className="w-1/3 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-205 hover:bg-slate-50 dark:hover:bg-slate-850 transition focus:outline-none cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FaArrowLeft className="h-3 w-3" /> Back
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      className="w-2/3 py-4 text-sm font-bold shadow-lg shadow-primary/20 dark:shadow-none cursor-pointer"
                    >
                      Register & Login
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-bold dark:text-blue-400 focus:outline-none cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default RegisterStudent;
