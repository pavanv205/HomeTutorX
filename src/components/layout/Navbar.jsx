import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaBars, FaTimes } from 'react-icons/fa';
import { NAV_LINKS } from '../../constants';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import { useBookingModal } from '../../context/BookingModalContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openBookingModal } = useBookingModal();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeStyle = ({ isActive }) =>
    `relative text-sm font-semibold transition-colors duration-200 py-2 ${
      isActive
        ? 'text-primary dark:text-blue-400 font-bold'
        : 'text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-blue-400'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass shadow-md shadow-slate-100/10 dark:shadow-none py-3 border-b border-slate-100/80 dark:border-slate-800/80'
            : 'bg-transparent py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 dark:shadow-none">
                <FaGraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Tutor<span className="text-primary dark:text-blue-500">Connect</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.path} to={link.path} className={activeStyle}>
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary dark:bg-blue-400 rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <Button variant="primary" size="sm" onClick={() => openBookingModal(null)}>
                Book Free Demo
              </Button>
            </div>

            {/* Mobile Actions Header */}
            <div className="flex md:hidden items-center gap-3">
              <ThemeToggle />
              {/* Hamburger Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm md:hidden"
            />

            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-30 w-72 bg-white dark:bg-[#0f172a] shadow-2xl border-l border-slate-100 dark:border-slate-800 px-6 py-20 flex flex-col justify-between md:hidden"
            >
              {/* Menu Links */}
              <nav className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-semibold transition-colors duration-200 ${
                        isActive
                          ? 'text-primary dark:text-blue-400 font-bold'
                          : 'text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-blue-400'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-8">
                <Button
                  variant="primary"
                  className="w-full text-center py-3"
                  onClick={() => {
                    setIsOpen(false);
                    openBookingModal(null);
                  }}
                >
                  Book Free Demo
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
