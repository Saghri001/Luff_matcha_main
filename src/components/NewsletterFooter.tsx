import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ShieldCheck, Leaf, Heart, Send, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveView } from '../lib/store/types';

interface NewsletterFooterProps {
  onNotify: (msg: string) => void;
  onOpenLegal: (view: ActiveView) => void;
}

export const NewsletterFooter: React.FC<NewsletterFooterProps> = ({ onNotify, onOpenLegal }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubscribed(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.82 },
      colors: ['#E53935', '#4A7C59', '#D8E8F5', '#E6AF2E', '#FFFFFF'],
    });

    onNotify('🎉 Welcome to LUFF Flow Club! Use code LUFF15 for 15% off your order.');
  };

  return (
    <footer id="club" className="relative bg-[#0F1512] text-[#FAF7F2] pt-24 pb-12 overflow-hidden border-t border-[#1F2922] select-none">
      
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#4A7C59]/15 blur-[140px]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Newsletter Reward Stage */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18221C] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-4 backdrop-blur-md border border-[#2D3A32]">
            <span>THE LUFF FLOW CLUB</span>
          </div>

          <h2 className="font-sans font-black text-3xl sm:text-6xl tracking-tight text-[#FAF7F2] uppercase mb-4 leading-[0.95]">
            UNLOCK 15% OFF YOUR FIRST RITUAL
          </h2>

          <p className="text-sm sm:text-base text-[#A3B8AB] max-w-lg mx-auto font-editorial-serif italic mb-8 leading-relaxed">
            Join 12,000+ creators receiving seasonal spring-flush announcements, nootropic research, and secret recipes.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                required
                id="newsletter-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for 15% off..."
                className="w-full px-6 py-4 rounded-full bg-[#18221C]/90 text-[#FAF7F2] placeholder-[#7D9486] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E53935] border border-[#2D3A32] backdrop-blur-md"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Claim 15%</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#18221C] p-6 rounded-3xl max-w-md mx-auto border border-[#2D3A32] text-[#FAF7F2] backdrop-blur-md"
            >
              <div className="flex items-center justify-center gap-2 text-[#4A7C59] font-sans font-black text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>YOU'RE IN THE FLOW CLUB</span>
              </div>
              <p className="text-xs text-[#A3B8AB]">
                Use code <span className="font-mono font-bold text-[#FAF7F2] bg-[#233128] px-2 py-0.5 rounded text-sm">LUFF15</span> at checkout for 15% off.
              </p>
            </motion.div>
          )}
        </div>

        {/* 4 Brand Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-10 border-y border-[#1F2922] mb-16 text-center">
          {[
            { title: 'Single-Estate Terroir', sub: 'Uji, Kyoto, Japan', icon: Leaf },
            { title: '1,500mg Dual-Extract', sub: 'Lion’s Mane, Reishi, Chaga', icon: Zap },
            { title: 'Carbon-Neutral DTC', sub: 'Compostable & Recyclable', icon: ShieldCheck },
            { title: '30-Day Pure Guarantee', sub: '100% Risk-Free Refund', icon: Heart },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="flex flex-col items-center">
                <Icon className="w-5 h-5 text-[#E53935] mb-2" />
                <div className="font-sans font-black text-sm text-[#FAF7F2]">
                  {pillar.title}
                </div>
                <div className="text-[11px] font-mono text-[#7D9486] mt-0.5">
                  {pillar.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grand Kinetic Watermark (Urban Markers Inspired) */}
        <div className="w-full overflow-hidden select-none my-6 text-center">
          <span className="font-sans font-black text-[22vw] leading-none uppercase tracking-tighter text-[#E53935] block">
            LUFF
          </span>
        </div>

        {/* Navigation & Legal Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-[#1F2922] text-xs text-[#7D9486]">
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono font-semibold uppercase tracking-wider">
            <button onClick={() => onOpenLegal('privacy')} className="hover:text-[#FAF7F2] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onOpenLegal('terms')} className="hover:text-[#FAF7F2] transition-colors">
              Terms of Service
            </button>
            <button onClick={() => onOpenLegal('shipping')} className="hover:text-[#FAF7F2] transition-colors">
              Shipping Rates
            </button>
            <button onClick={() => onOpenLegal('returns')} className="hover:text-[#FAF7F2] transition-colors">
              Returns & Refunds
            </button>
            <button onClick={() => onOpenLegal('admin')} className="text-white/40 hover:text-[#FAF7F2] transition-colors">
              Admin Portal
            </button>
          </div>

          <div className="text-[#566B5E] font-mono text-center md:text-right">
            © {new Date().getFullYear()} LUFF Matcha Co. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
