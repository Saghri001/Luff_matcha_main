import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Cookie, X } from 'lucide-react';
import { ActiveView } from '../../lib/store/types';

interface CookieConsentBannerProps {
  onOpenPolicy: (view: ActiveView) => void;
}

const COOKIE_CONSENT_KEY = 'luff_cookie_consent_v1';

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="cookie-consent-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 z-50 max-w-md w-[calc(100%-3rem)] bg-black/90 backdrop-blur-xl border border-white/20 text-white p-5 rounded-3xl shadow-2xl flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#4A7C59]/20 text-[#4A7C59]">
                <Cookie className="w-5 h-5" />
              </div>
              <h4 className="font-display font-extrabold text-sm text-white">Cookie & Privacy Notice</h4>
            </div>
            <button
              onClick={handleDecline}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            LUFF uses essential cookies to save your shopping bag and optimize performance. By continuing, you agree to our{' '}
            <button
              onClick={() => onOpenPolicy('cookie')}
              className="text-[#4A7C59] underline hover:text-white font-bold"
            >
              Cookie Policy
            </button>{' '}
            and{' '}
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="text-[#4A7C59] underline hover:text-white font-bold"
            >
              Privacy Policy
            </button>.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="flex-1 py-2.5 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 font-bold text-xs transition-colors"
            >
              Essential Only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
