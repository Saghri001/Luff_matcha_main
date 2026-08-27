import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, Quote, ArrowRight, Heart } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'matcha' | 'coffee'>('all');

  const reviews = [
    {
      id: '1',
      name: 'Elena Rostova',
      role: 'Staff Product Designer at Figma',
      location: 'San Francisco, CA',
      category: 'matcha',
      quote:
        'Replaced my 3-cup espresso habit with LUFF Mushroom Matcha. The sustained focus without the crash changed my afternoons completely. My design flow states last 4-5 hours effortlessly.',
      drink: 'LUFF Organic Mushroom Matcha (30g)',
      date: 'Verified Buyer • 2 days ago',
      rating: 5,
      impact: 'Zero Jitters • 5hr Deep Flow',
    },
    {
      id: '2',
      name: 'Marcus Vance',
      role: 'Creative Director & Typographer',
      location: 'Brooklyn, NY',
      category: 'coffee',
      quote:
        'Most mushroom coffee tastes like dirty soil or burnt grain. LUFF is artisanal Guatemalan dark roast with pure velvety cocoa notes. Wild Chaga keeps my digestion calm all morning.',
      drink: 'LUFF Organic Mushroom Coffee (250g)',
      date: 'Verified Buyer • 1 week ago',
      rating: 5,
      impact: 'Digestive Comfort • Low Acid',
    },
    {
      id: '3',
      name: 'Aria Chen',
      role: 'Architectural Lead at Gensler',
      location: 'Seattle, WA',
      category: 'bundle',
      quote:
        'The Daily Ritual Bundle is permanent on my studio desk. Coffee at 8 AM for physical stamina, and ceremonial matcha at 2 PM for crystal-clear CAD render sessions. The free brass scoop is gorgeous.',
      drink: 'LUFF Daily Ritual Bundle',
      date: 'Verified Buyer • 2 weeks ago',
      rating: 5,
      impact: 'Morning Stamina + Afternoon Calm',
    },
    {
      id: '4',
      name: 'Dr. Julian Thorne',
      role: 'Neuroscience Researcher & Founder',
      location: 'Cambridge, MA',
      category: 'matcha',
      quote:
        'The pairing of 60mg L-theanine with 1,500mg Lion’s Mane fruiting body is biochemically brilliant. Smooth alpha brainwave elevation without the tachycardia of traditional caffeine.',
      drink: 'LUFF Organic Mushroom Matcha (30g)',
      date: 'Verified Buyer • 3 weeks ago',
      rating: 5,
      impact: 'Alpha Wave Boost • No Crash',
    },
  ];

  const filtered = reviews.filter(
    (r) => filter === 'all' || r.category === filter
  );

  return (
    <section
      id="reviews"
      className="relative py-14 sm:py-16 bg-[#FAF7F2] text-[#15191E] overflow-hidden"
    >
      {/* Immersive Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-[#4A7C59]/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#E53935]/8 blur-[130px]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-3 backdrop-blur-md border border-[#EAE3D8] shadow-2xs">
              <span>03 // VERIFIED COMMUNITY EXPERIENCE</span>
            </div>
            <h2 className="font-sans font-black text-3xl sm:text-5xl text-[#15191E] tracking-tight uppercase">
              PRAISE FROM THE FLOW STATE
            </h2>
            <p className="text-sm sm:text-base text-[#15191E]/75 font-editorial-serif italic mt-2 max-w-xl">
              Read how creators, designers, and scientists sustain their daily output with LUFF.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-[#EAE3D8] shadow-2xs overflow-x-auto no-scrollbar">
            {(['all', 'matcha', 'coffee'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
                  filter === cat
                    ? 'bg-[#15191E] text-white shadow-sm'
                    : 'text-[#15191E]/65 hover:text-[#15191E] hover:bg-gray-50'
                }`}
              >
                {cat === 'all' ? 'All Reviews' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Verified Community Proof Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { metric: '4.92 / 5.0', label: 'Over 1,200+ Reviews' },
            { metric: '94.8%', label: 'Replaced Standard Coffee' },
            { metric: '0 Jitters', label: 'Reported Crash-Free Flow' },
            { metric: '30-Day', label: 'Risk-Free Full Refund Guarantee' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md border border-[#EAE3D8] p-5 rounded-2xl text-center flex flex-col justify-center shadow-2xs"
            >
              <div className="font-sans font-black text-2xl sm:text-3xl text-[#15191E] tracking-tight">
                {stat.metric}
              </div>
              <div className="text-[11px] font-mono font-semibold text-[#15191E]/70 uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Review Cards Grid with Staggered Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((rev) => (
              <motion.div
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="bg-white/95 hover:bg-white backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 group hover:border-[#15191E]/25 hover:shadow-md shadow-2xs"
              >
                <div>
                  {/* Top Bar: Stars + Product Tag */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#E53935] text-[#E53935]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#F4EFE6] text-[#15191E]/80 border border-[#EAE3D8]">
                      {rev.impact}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-sm sm:text-base text-[#15191E]/85 leading-relaxed font-sans font-medium mb-6">
                    "{rev.quote}"
                  </p>
                </div>

                {/* Bottom Author Details */}
                <div className="pt-5 border-t border-[#EAE3D8] flex items-end justify-between gap-4">
                  <div>
                    <h4 className="font-sans font-black text-base text-[#15191E] flex items-center gap-2">
                      <span>{rev.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                    </h4>
                    <p className="text-xs text-[#15191E]/60 font-sans">{rev.role}</p>
                    <span className="text-[11px] font-mono text-[#E53935] mt-0.5 block font-bold">
                      Ordered: {rev.drink}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#15191E]/45 shrink-0 text-right">
                    {rev.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
