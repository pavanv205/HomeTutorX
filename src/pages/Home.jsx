import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SEO from '../components/common/SEO';
import Hero from '../components/sections/Hero';
import SubjectsCarousel from '../components/sections/SubjectsCarousel';
import FeaturedTutors from '../components/sections/FeaturedTutors';
import HowItWorks from '../components/sections/HowItWorks';
import reviewsData from '../data/reviews.json';
import { FAQS } from '../constants';
import Button from '../components/common/Button';

const Home = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % reviewsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % reviewsData.length);
  };

  return (
    <>
      <SEO
        title="Home"
        description="Find verified local home tutors and interactive online tuition for boards prep, school levels, JEE, NEET, and language learning."
        keywords="home tuition, online classes, physics tutor, math tutor, private teachers, JEE NEET prep"
      />

      {/* Hero Section */}
      <Hero />

      {/* Stats Bar */}
      <section className="py-8 bg-slate-900 text-white dark:bg-[#070b13] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-primary dark:text-blue-500">98%</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Grade Improvement</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-amber-500">12,000+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Hours Taught</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary dark:text-blue-500">150+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Subjects Covered</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-amber-500">4.9/5</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Categories Slider */}
      <SubjectsCarousel />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Tutors Section */}
      <FeaturedTutors />

      {/* Testimonials Slider */}
      <section className="py-20 bg-white dark:bg-[#0f172a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-xs font-bold text-primary dark:text-blue-500 uppercase tracking-widest">
              Success Stories
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              What Parents & Students Say
            </h3>
          </div>

          <div className="relative bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm min-h-[300px] flex flex-col justify-between">
            <FaQuoteLeft className="text-primary/10 dark:text-blue-500/10 h-16 w-16 absolute top-8 left-8" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 relative z-10"
              >
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">
                  "{reviewsData[activeTestimonial].comment}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={reviewsData[activeTestimonial].avatar}
                    alt={reviewsData[activeTestimonial].name}
                    className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h5 className="font-bold text-slate-850 dark:text-slate-200 text-sm">
                      {reviewsData[activeTestimonial].name}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {reviewsData[activeTestimonial].role}
                    </p>
                  </div>
                  <div className="ml-auto flex text-amber-500 gap-0.5 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} className="fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation */}
            <div className="flex justify-end gap-2.5 mt-8 border-t border-slate-150/20 dark:border-slate-800/40 pt-6">
              <button
                onClick={handlePrevTestimonial}
                className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors focus:outline-none"
                aria-label="Previous testimonial"
              >
                <FaChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleNextTestimonial}
                className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors focus:outline-none"
                aria-label="Next testimonial"
              >
                <FaChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-100/50 dark:border-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-xs font-bold text-primary dark:text-blue-500 uppercase tracking-widest">
              Have Questions?
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex justify-between items-center py-5 px-6 font-bold text-slate-800 dark:text-slate-250 text-left focus:outline-none hover:text-primary dark:hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400 shrink-0 ml-4"
                    >
                      <FaChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-650 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-800/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global CTA Banner */}
      <section className="py-20 bg-gradient-to-tr from-primary to-blue-700 text-white text-center relative overflow-hidden dark:from-slate-900 dark:to-slate-950 border-t border-slate-900">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Learning?
          </h3>
          <p className="text-base text-blue-100 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Find the perfect private tutor for home or online lessons, or sign up as a tutor to join our network today!
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/tutors')}
            >
              Find a Tutor
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-transparent border border-white text-white hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800"
              onClick={() => navigate('/become-tutor')}
            >
              Apply as Tutor
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
