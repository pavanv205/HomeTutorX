import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaShareAlt,
  FaWhatsapp,
  FaTelegramPlane,
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaEnvelope,
  FaCopy,
  FaCheck,
  FaQrcode,
  FaGooglePlay,
  FaGlobe
} from 'react-icons/fa';
import { PLAY_STORE_URL, WEBSITE_URL } from '../../constants';

export const DEFAULT_PLAY_STORE_URL = PLAY_STORE_URL || 'https://play.google.com/store/apps/details?id=com.hometutor.hometutorx';
export const DEFAULT_WEBSITE_URL = WEBSITE_URL || 'https://www.hometutorx.in';

export const DEFAULT_SHARE_TEXT = `Find verified, qualified home & online tutors across India on HomeTutorX!

🌐 Website: ${DEFAULT_WEBSITE_URL}
📱 Android App: ${DEFAULT_PLAY_STORE_URL}`;

export const DEFAULT_SHARE_TITLE = 'HomeTutorX | Find Verified Home & Online Tutors';

const AppShareModal = ({
  isOpen,
  onClose,
  customUrl
}) => {
  const [copiedType, setCopiedType] = useState(null); // 'web' | 'app' | 'all'
  const [showQr, setShowQr] = useState(false);
  const [qrMode, setQrMode] = useState('app'); // 'app' | 'web'

  const websiteUrl = DEFAULT_WEBSITE_URL;
  const playStoreUrl = customUrl || DEFAULT_PLAY_STORE_URL;
  const fullShareText = `${DEFAULT_SHARE_TEXT}`;

  const handleCopy = async (textToCopy, type) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: DEFAULT_SHARE_TITLE,
          text: fullShareText,
          url: websiteUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy(fullShareText, 'all');
        }
      }
    } else {
      handleCopy(fullShareText, 'all');
    }
  };

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      bg: 'bg-[#25D366] text-white hover:bg-[#20bd5a]',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`
    },
    {
      name: 'Telegram',
      icon: FaTelegramPlane,
      bg: 'bg-[#229ED9] text-white hover:bg-[#1e8ec3]',
      href: `https://t.me/share/url?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(fullShareText)}`
    },
    {
      name: 'X (Twitter)',
      icon: FaTwitter,
      bg: 'bg-slate-900 text-white hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(DEFAULT_SHARE_TEXT)}`
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      bg: 'bg-[#0A66C2] text-white hover:bg-[#095196]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      bg: 'bg-[#1877F2] text-white hover:bg-[#166fe5]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      bg: 'bg-amber-600 text-white hover:bg-amber-700',
      href: `mailto:?subject=${encodeURIComponent(DEFAULT_SHARE_TITLE)}&body=${encodeURIComponent(fullShareText)}`
    }
  ];

  if (!isOpen) return null;

  const currentQrUrl = qrMode === 'app' ? playStoreUrl : websiteUrl;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(currentQrUrl)}&margin=10`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500/5 via-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shadow-inner">
                <FaShareAlt className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Share HomeTutorX
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Website & Google Play Store App
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close share dialog"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            {/* Quick Destination Cards (Play Store & Website) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Play Store Link Card */}
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-800 shadow-md transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                    <FaGooglePlay className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Android App</p>
                    <p className="text-xs font-extrabold text-white">Google Play</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </a>

              {/* Website Link Card */}
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-primary/10 hover:bg-primary/20 text-slate-900 dark:text-white border border-primary/20 shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center">
                    <FaGlobe className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Web Platform</p>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">Visit Website</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </a>
            </div>

            {/* Native Share Button (Web & Mobile System Share Sheet) */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleNativeShare}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FaShareAlt className="h-4 w-4" />
                <span>Share via System Apps</span>
              </motion.button>
            )}

            {/* Quick 1-Click Social Channels */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Share to
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {shareChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={channel.name}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl shadow-sm transition-transform duration-200 hover:-translate-y-0.5 ${channel.bg}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px] font-medium tracking-tight">
                        {channel.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Copy Links (Website & Play Store) */}
            <div className="space-y-3">
              {/* Copy Website Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <FaGlobe className="h-3 w-3 text-primary dark:text-blue-400" />
                    <span>Website Link</span>
                  </label>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
                  <input
                    type="text"
                    readOnly
                    value={websiteUrl}
                    className="flex-1 bg-transparent px-3 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none truncate"
                  />
                  <button
                    onClick={() => handleCopy(websiteUrl, 'web')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      copiedType === 'web'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {copiedType === 'web' ? (
                      <>
                        <FaCheck className="h-3 w-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Copy Play Store Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <FaGooglePlay className="h-3 w-3 text-amber-500" />
                    <span>Play Store App Link</span>
                  </label>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
                  <input
                    type="text"
                    readOnly
                    value={playStoreUrl}
                    className="flex-1 bg-transparent px-3 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none truncate"
                  />
                  <button
                    onClick={() => handleCopy(playStoreUrl, 'app')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      copiedType === 'app'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                    }`}
                  >
                    {copiedType === 'app' ? (
                      <>
                        <FaCheck className="h-3 w-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Toggle for Mobile Phone Camera Scan */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FaQrcode className="h-4 w-4 text-amber-500" />
                  <span>Scan QR Code on Phone</span>
                </div>
                <span className="text-[11px] text-primary dark:text-blue-400 font-bold">
                  {showQr ? 'Hide' : 'Show'}
                </span>
              </button>

              <AnimatePresence>
                {showQr && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      {/* Switcher between App QR and Website QR */}
                      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setQrMode('app')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            qrMode === 'app'
                              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Play Store App
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrMode('web')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            qrMode === 'web'
                              ? 'bg-white dark:bg-slate-900 text-primary dark:text-blue-400 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Website
                        </button>
                      </div>

                      <img
                        src={qrImageUrl}
                        alt="HomeTutorX QR Code"
                        className="w-44 h-44 rounded-xl shadow-inner border border-slate-100"
                        loading="lazy"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
                        Scan with your camera to open {qrMode === 'app' ? 'Google Play Store' : 'HomeTutorX Website'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AppShareModal;
