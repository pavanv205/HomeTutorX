import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGraduationCap,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane
} from 'react-icons/fa';
import { NAV_LINKS, SUBJECTS } from '../../constants';
import { bookingService } from '../../services/bookingService';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: '', message: '' });
      const response = await bookingService.subscribeNewsletter(email);
      if (response.success) {
        setStatus({ type: 'success', message: response.message });
        setEmail('');
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Subscription failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const topSubjects = SUBJECTS.slice(0, 6);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8 dark:bg-[#070b13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <FaGraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Tutor<span className="text-primary dark:text-blue-500">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting students and parents with top-tier, qualified tutors for personalized home and online lessons. Spark learning, build confidence, and achieve academic excellence.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3.5">
              {[
                { icon: <FaFacebookF />, label: 'Facebook' },
                { icon: <FaTwitter />, label: 'Twitter' },
                { icon: <FaInstagram />, label: 'Instagram' },
                { icon: <FaLinkedinIn />, label: 'LinkedIn' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="h-9 w-9 rounded-lg bg-slate-800 text-slate-400 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-base tracking-wide">Quick Links</h4>
            <ul className="space-y-3.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Subjects */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-base tracking-wide">Popular Subjects</h4>
            <ul className="space-y-3.5 text-sm">
              {topSubjects.map((sub, index) => (
                <li key={index}>
                  <Link
                    to={`/tutors?subject=${encodeURIComponent(sub)}`}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {sub} Tuition
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Subscription */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold text-base tracking-wide">Stay Connected</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Subscribe to our newsletter for educational insights, updates, and learning tips.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 h-9 w-9 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                  aria-label="Subscribe email"
                >
                  <FaPaperPlane className="h-3.5 w-3.5" />
                </button>
              </div>
              {status.message && (
                <p
                  className={`text-xs mt-1 font-medium ${
                    status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>

            <ul className="space-y-3.5 text-sm pt-2">
              <li className="flex items-center gap-3 text-slate-400">
                <FaPhoneAlt className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <FaEnvelope className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>support@tutorconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TutorConnect. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
