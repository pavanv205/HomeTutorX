import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaBriefcase, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { tutorService } from '../../services/tutorService';
import { useBookingModal } from '../../context/BookingModalContext';
import { TutorCardSkeleton } from '../common/Skeleton';
import Button from '../common/Button';

export const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();
  const { openBookingModal } = useBookingModal();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-slate-200/50 dark:hover:border-slate-800/80 transition-all duration-300 flex flex-col justify-between h-full group"
    >
      <div>
        {/* Header: Photo and Badges */}
        <div className="flex gap-4 items-start">
          <img
            src={tutor.photo}
            alt={tutor.name}
            className="h-16 w-16 rounded-2xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
          />
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-slate-850 dark:text-slate-100 text-base group-hover:text-primary dark:group-hover:text-blue-450 transition-colors">
              {tutor.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
              <FaGraduationCap className="text-slate-400 text-sm" />
              <span className="truncate max-w-[150px]">{tutor.qualification.split('(')[0]}</span>
            </p>
            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                <FaStar className="h-3.5 w-3.5 fill-current" /> {tutor.rating}
              </span>
              <span className="text-slate-400">({tutor.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Experience & City */}
        <div className="mt-5 flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <FaBriefcase className="text-slate-400 text-sm" /> {tutor.experience} Yrs Exp
          </span>
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-slate-400 text-sm" /> {tutor.city}
          </span>
        </div>

        {/* Short Bio */}
        <p className="mt-4 text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium line-clamp-2">
          {tutor.about}
        </p>

        {/* Subjects Tags */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {tutor.subjects.map((sub, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-slate-50 text-slate-600 dark:bg-slate-850 dark:text-slate-350 rounded-lg text-[10px] font-bold border border-slate-100 dark:border-slate-800"
            >
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Details & Actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-3">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rate / Hour</span>
          <span className="text-base font-extrabold text-slate-850 dark:text-slate-100">
            ₹{tutor.hourlyRate}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/tutors/${tutor.id}`)}
          >
            Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openBookingModal(tutor)}
          >
            Book Demo
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await tutorService.getFeaturedTutors();
        setTutors(data);
      } catch (error) {
        console.error('Failed to load featured tutors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#0B0F19] border-y border-slate-100/50 dark:border-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-primary dark:text-blue-500 uppercase tracking-widest">
              Top Rated Educators
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Featured Tutors
            </h3>
            <p className="text-sm text-slate-650 dark:text-slate-400 font-medium">
              Learn from hand-picked, verified teaching professionals with proven success tracking.
            </p>
          </div>
          <Link
            to="/tutors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary dark:text-blue-450 hover:underline shrink-0"
          >
            View All Tutors →
          </Link>
        </div>

        {/* Tutors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <TutorCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTutors;
