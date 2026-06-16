import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaStar,
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaArrowLeft,
  FaUserGraduate
} from 'react-icons/fa';
import SEO from '../components/common/SEO';
import { tutorService } from '../services/tutorService';
import { useBookingModal } from '../context/BookingModalContext';
import { TutorProfileSkeleton } from '../components/common/Skeleton';
import Button from '../components/common/Button';

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openBookingModal } = useBookingModal();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await tutorService.getTutorById(id);
        setTutor(data);
      } catch (err) {
        setError(err.message || 'Tutor not found');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TutorProfileSkeleton />
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tutor Profile Not Found</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          The tutor profile you are looking for does not exist or may have been deactivated.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/tutors')}>
            Back to Directory
          </Button>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={tutor.name}
        description={`Read qualifications, experience, reviews, and subjects taught by ${tutor.name}. Book a free trial class now.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Back navigation */}
        <div>
          <Link
            to="/tutors"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-blue-450 transition"
          >
            <FaArrowLeft className="h-3.5 w-3.5" /> Back to Tutors Listing
          </Link>
        </div>

        {/* Profile Header Details Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
          <img
            src={tutor.photo}
            alt={tutor.name}
            className="h-28 w-28 md:h-36 md:w-36 rounded-2xl object-cover shrink-0 border border-slate-100 dark:border-slate-800 shadow-md"
          />
          <div className="flex-1 space-y-4 text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                {tutor.name}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/40">
                <FaCheckCircle className="h-3.5 w-3.5" /> Verified Tutor
              </span>
            </div>

            <p className="text-sm font-bold text-slate-650 dark:text-slate-300 flex items-center justify-center md:justify-start gap-1.5">
              <FaGraduationCap className="text-slate-450 text-lg shrink-0" />
              <span>{tutor.qualification}</span>
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <FaBriefcase className="text-slate-405" /> {tutor.experience} Years Experience
              </span>
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-slate-405" /> Lives in {tutor.city}
              </span>
              <span className="flex items-center gap-1.5">
                <FaStar className="text-amber-500" /> {tutor.rating} ({tutor.reviewsCount} reviews)
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
              {tutor.modes.map((mode, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-slate-50 border border-slate-150/40 text-[10px] font-bold text-slate-500 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-400"
                >
                  {mode} Classes
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Main Details and Booking splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left panel: Info tabs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About bio */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Biography & Teaching Philosophy
              </h3>
              <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
                {tutor.about}
              </p>
            </div>

            {/* Teaching Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Teaching Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">
                    Subjects Taught
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-blue-50 text-primary dark:bg-blue-950/20 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-100/50 dark:border-blue-900/30"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">
                    Grade Classes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tutor.classes.map((cls, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 rounded-xl text-xs font-bold border border-amber-100/50 dark:border-amber-900/30"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Student Reviews & Feedback
              </h3>
              {tutor.reviews.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No reviews registered yet.</p>
              ) : (
                <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
                  {tutor.reviews.map((rev, i) => (
                    <div key={rev.id} className={`space-y-2.5 ${i > 0 ? 'pt-6' : ''}`}>
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                            <FaUserGraduate className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-sm font-bold text-slate-850 dark:text-slate-200">
                            {rev.reviewer}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-500 text-xs font-bold gap-1 shrink-0">
                          <FaStar className="fill-current" /> {rev.rating}
                        </div>
                      </div>
                      <p className="text-sm text-slate-650 dark:text-slate-400 italic leading-relaxed pl-10 font-medium">
                        "{rev.comment}"
                      </p>
                      <p className="text-[10px] text-slate-400 pl-10 font-semibold uppercase tracking-wider">{rev.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Scheduling details and action booking panel */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Tutoring Session Rate
              </h3>
              <div className="flex justify-between items-baseline border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Hourly Rate</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ₹{tutor.hourlyRate}
                  <span className="text-xs font-bold text-slate-400 ml-1">/ Hour</span>
                </span>
              </div>

              {/* Weekly schedules */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <FaClock className="h-3.5 w-3.5" /> Weekly Availability
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 dark:text-slate-450">
                  {tutor.availability.map((day, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center"
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Free demo class action button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full py-4 text-sm font-bold shadow-md shadow-primary/10"
                  onClick={() => openBookingModal(tutor)}
                >
                  Book 30-Min Free Demo
                </Button>
                <p className="text-[10px] text-center text-slate-400 mt-3 font-semibold">
                  No commitment required for first session.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default TutorProfile;
