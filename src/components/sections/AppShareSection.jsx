import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
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
import AppShareModal, {
  DEFAULT_PLAY_STORE_URL,
  DEFAULT_WEBSITE_URL,
  DEFAULT_SHARE_TEXT,
  DEFAULT_SHARE_TITLE
} from '../common/AppShareModal';

const AppShareSection = () => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrMode, setQrMode] = useState('app'); // 'app' | 'web'

  const playStoreUrl = DEFAULT_PLAY_STORE_URL;
  const websiteUrl = DEFAULT_WEBSITE_URL;
  const fullShareText = DEFAULT_SHARE_TEXT;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullShareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
          setIsModalOpen(true);
        }
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      bgColor: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`
    },
    {
      name: 'Telegram',
      icon: FaTelegramPlane,
      bgColor: 'hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]',
      href: `https://t.me/share/url?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(fullShareText)}`
    },
    {
      name: 'X (Twitter)',
      icon: FaTwitter,
      bgColor: 'hover:bg-slate-950 hover:text-white hover:border-slate-950 dark:hover:bg-black',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(DEFAULT_SHARE_TEXT)}`
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      bgColor: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      bgColor: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      bgColor: 'hover:bg-amber-600 hover:text-white hover:border-amber-600',
      href: `mailto:?subject=${encodeURIComponent(DEFAULT_SHARE_TITLE)}&body=${encodeURIComponent(fullShareText)}`
    }
  ];

  const currentQrUrl = qrMode === 'app' ? playStoreUrl : websiteUrl;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentQrUrl)}&margin=8`;

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white via-amber-50/20 to-primary/5 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-850 shadow-xl p-8 sm:p-12 transition-all">
        {/* Decorative glow elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-primary/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Share Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <FaShareAlt className="h-3 w-3" />
              <span>Spread the Word</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Share HomeTutorX & Transform Learning
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Know parents looking for verified home tutors or an educator ready to teach? Share HomeTutorX on the web or download our Android app directly from Google Play Store.
            </p>

            {/* Action Buttons: Native Share + Google Play + Website + Copy */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNativeShare}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all"
              >
                <FaShareAlt className="h-4 w-4" />
                <span>Share App Now</span>
              </motion.button>

              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-750 font-bold text-sm flex items-center gap-2 shadow-md transition-all group"
              >
                <FaGooglePlay className="h-4 w-4 text-amber-400" />
                <span>Google Play</span>
              </a>

              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-400 border border-primary/20 font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <FaGlobe className="h-4 w-4" />
                <span>Website</span>
              </a>

              <button
                onClick={handleCopyLink}
                className={`px-5 py-3 rounded-2xl border font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {copied ? (
                  <>
                    <FaCheck className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span>Copy Info</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Share Icon Row */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Share directly to:
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Share on ${item.name}`}
                      className={`h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm ${item.bgColor}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Phone / QR Code Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl space-y-4 text-center relative">
              {/* QR Mode Switcher */}
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setQrMode('app')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    qrMode === 'app'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FaGooglePlay className="h-3 w-3" />
                  <span>Play Store App</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQrMode('web')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    qrMode === 'web'
                      ? 'bg-white dark:bg-slate-900 text-primary dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FaGlobe className="h-3 w-3" />
                  <span>Website</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 inline-block shadow-inner">
                <img
                  src={qrImageUrl}
                  alt={`HomeTutorX ${qrMode === 'app' ? 'Google Play' : 'Website'} QR Code`}
                  className="w-44 h-44 sm:w-48 sm:h-48 rounded-xl object-contain mx-auto"
                  loading="lazy"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Scan to open {qrMode === 'app' ? 'Google Play Store' : 'HomeTutorX Website'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Scan with your phone camera for instant access
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FaQrcode className="h-3.5 w-3.5" />
                  <span>More sharing options & QR full view</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal Dialog */}
      <AppShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AppShareSection;
