import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Truck,
  Coffee,
  Leaf,
  MessageCircle,
  Search,
  X,
  ThumbsUp,
  Zap,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'sourcing' | 'formula' | 'taste' | 'guarantee';
  q: string;
  a: string;
  tag: string;
  icon: React.ElementType;
  initialHelpful: number;
}

export const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIdx, setOpenIdx] = useState<string | null>('faq-1');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, { count: number; voted: boolean }>>({
    'faq-1': { count: 184, voted: false },
    'faq-2': { count: 242, voted: false },
    'faq-3': { count: 129, voted: false },
    'faq-4': { count: 310, voted: false },
    'faq-5': { count: 198, voted: false },
    'faq-6': { count: 276, voted: false },
  });

  const categories = [
    { id: 'all', label: 'All Inquiries' },
    { id: 'sourcing', label: 'Sourcing & Terroir' },
    { id: 'formula', label: 'Caffeine & Adaptogens' },
    { id: 'taste', label: 'Taste & Ritual' },
    { id: 'guarantee', label: 'Shipping & Guarantee' },
  ];

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'sourcing',
      q: 'Where is LUFF Ceremonial Matcha sourced and grown?',
      a: 'LUFF is harvested exclusively from 5th-generation family estates in Uji, Kyoto. The tea bushes are covered under natural straw reed tarps for 28 continuous days before spring harvest to maximize chlorophyll and L-theanine. Leaves are slowly stone-ground on granite wheels to 5 microns (at 35g/hour) for zero astringency.',
      tag: 'Kyoto First Harvest',
      icon: Leaf,
      initialHelpful: 184,
    },
    {
      id: 'faq-2',
      category: 'formula',
      q: 'How much caffeine and adaptogens are in each serving?',
      a: 'Each 2g serving of LUFF Organic Mushroom Matcha delivers 45mg of clean caffeine paired with 60mg of L-theanine and 1,500mg of dual-extracted organic Lion’s Mane & Reishi mushroom fruiting bodies. LUFF Mushroom Coffee contains 50mg of caffeine paired with 1,500mg of wild Chaga & Cordyceps.',
      tag: '1,500mg Dual-Extract',
      icon: Coffee,
      initialHelpful: 242,
    },
    {
      id: 'faq-3',
      category: 'taste',
      q: 'Does LUFF Mushroom Matcha taste like mushrooms?',
      a: 'Not at all! We use pure dual-extracted fruiting body extracts that dissolve seamlessly into the vibrant, creamy umami profile of single-origin Uji matcha. It delivers sweet pistachio, toasted vanilla, and rich green tea notes without any earthy fungus taste or chalkiness.',
      tag: 'Zero Earthy Aftertaste',
      icon: Leaf,
      initialHelpful: 129,
    },
    {
      id: 'faq-4',
      category: 'formula',
      q: 'Will LUFF cause stomach acid, jitters, or caffeine crashes?',
      a: 'Zero crashes and zero acid reflux. Standard coffee causes acid spikes and rapid cortisol release. LUFF’s organic matcha and low-acid Guatemalan Arabica bind caffeine to L-theanine and beta-glucans, ensuring a steady, slow-release 4 to 6 hour cognitive flow without digestive distress.',
      tag: 'Alkaline pH • No Crash',
      icon: ShieldCheck,
      initialHelpful: 310,
    },
    {
      id: 'faq-5',
      category: 'guarantee',
      q: 'What is your 30-Day Money-Back Guarantee policy?',
      a: 'We offer an unconditional 30-day money-back guarantee. If you don’t feel sustained, calm energy or aren’t completely in love with the taste, simply email hello@luffmatcha.com or message our WhatsApp concierge for a 100% full refund with no return shipping hassle.',
      tag: '100% Risk-Free Refund',
      icon: ShieldCheck,
      initialHelpful: 198,
    },
    {
      id: 'faq-6',
      category: 'guarantee',
      q: 'How long does shipping take and is it free?',
      a: 'Orders placed before 2:00 PM EST ship the exact same business day from our climate-controlled warehouse. Standard Carbon-Neutral Ground delivery takes 3 to 5 business days across the US and is 100% FREE on all orders over $40.00.',
      tag: 'Free Ground on $40+',
      icon: Truck,
      initialHelpful: 276,
    },
  ];

  const handleVoteHelpful = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHelpfulVotes((prev) => {
      const current = prev[id] || { count: 0, voted: false };
      if (current.voted) {
        return {
          ...prev,
          [id]: { count: current.count - 1, voted: false },
        };
      }
      return {
        ...prev,
        [id]: { count: current.count + 1, voted: true },
      };
    });
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCat;
      const matchesSearch =
        item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query) ||
        item.tag.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="faq" className="py-28 bg-[#FAF7F2] border-t border-[#EAE3D8] relative overflow-hidden">
      
      {/* Subtle Ambient Radial Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-[#4A7C59]/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#E53935]/8 blur-[130px]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest shadow-2xs">
            <HelpCircle className="w-4 h-4 text-[#E53935]" />
            <span>04 // FREQUENTLY ASKED QUESTIONS</span>
          </div>
          
          <h2 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-[#15191E] tracking-tight uppercase leading-[0.95]">
            EVERYTHING YOU NEED TO KNOW
          </h2>
          
          <p className="text-sm sm:text-base text-[#15191E]/75 font-editorial-serif italic mt-1 max-w-xl leading-relaxed">
            Transparent biological answers on single-estate harvesting, adaptogenic dosing, and our 30-day guarantee.
          </p>

          {/* Real-Time Interactive Search Bar */}
          <div className="w-full max-w-xl mt-6 relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#15191E]/40 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword (e.g., caffeine, stomach, Uji, shipping)..."
                className="w-full pl-11 pr-10 py-3.5 rounded-full bg-white border border-[#EAE3D8] text-sm text-[#15191E] placeholder-[#15191E]/40 focus:outline-none focus:ring-2 focus:ring-[#E53935] shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full hover:bg-gray-100 text-[#15191E]/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-left text-xs font-mono text-[#15191E]/60 pl-2">
                Showing {filteredFaqs.length} of {faqs.length} answers
              </div>
            )}
          </div>
        </div>

        {/* Sliding Interactive Category Tabs */}
        <div className="flex items-center justify-center mb-12 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/80 border border-[#EAE3D8] backdrop-blur-md shadow-2xs">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-[#15191E]/70 hover:text-[#15191E] hover:bg-gray-50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFaqTab"
                      className="absolute inset-0 rounded-full bg-[#15191E] shadow-sm"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Flank: Concierge & Bio-Metric Bento Card */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
            
            {/* Live Sommelier Concierge Card */}
            <div className="bg-white/95 backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3EE] text-[#4A7C59] text-[11px] font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#4A7C59] animate-pulse" />
                    <span>Kyoto Sommelier Online</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">Avg reply 2m</span>
                </div>

                <h3 className="font-sans font-black text-xl text-[#15191E] uppercase leading-tight mb-2">
                  Have a Personalized Formula Question?
                </h3>
                <p className="text-xs sm:text-sm text-[#15191E]/75 font-editorial-serif italic leading-relaxed mb-6">
                  Our certified tea masters in Kyoto and adaptogen biochemists answer your dosage and pairing questions directly.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/12125555833?text=Hi%20LUFF%20team,%20I%20have%20a%20question%20about%20your%20blends"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2.5 shadow-md shadow-[#25D366]/25 hover:shadow-lg"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-white shrink-0"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href="mailto:hello@luffmatcha.com?subject=Formula%20Inquiry"
                  className="w-full py-3.5 px-5 rounded-full bg-white hover:bg-gray-50 border border-[#EAE3D8] text-[#15191E] text-xs font-bold uppercase tracking-wider transition-all active:scale-95 text-center"
                >
                  Email Bio-Team
                </a>
              </div>
            </div>

            {/* Quick Bio-Metric Comparison Card */}
            <div className="bg-[#141C18] text-[#FAF7F2] rounded-3xl p-6 border border-[#2D3A32] shadow-xs">
              <div className="flex items-center gap-2 text-[#4A7C59] text-xs font-mono font-bold uppercase mb-3">
                <Zap className="w-4 h-4" />
                <span>The Clean Energy Advantage</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#1E2922] border border-[#2D3A32]">
                  <div className="font-bold text-[#FAF7F2] mb-0.5">LUFF Ceremonial (45mg Caffeine)</div>
                  <div className="text-[11px] text-[#A3B8AB]">Bound to 60mg L-Theanine → 6h steady alpha flow with zero jitters.</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#1E2922] border border-[#2D3A32]">
                  <div className="font-bold text-[#FAF7F2]/80 mb-0.5">Standard Coffee (95mg Caffeine)</div>
                  <div className="text-[11px] text-[#7D9486]">Rapid cortisol spike → 45m burst followed by afternoon crash & acid.</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Flank: Vibrant Interactive Accordions */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {filteredFaqs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-12 rounded-3xl border border-[#EAE3D8] text-center"
                >
                  <p className="text-sm font-sans font-bold text-[#15191E] mb-2">No matching questions found</p>
                  <p className="text-xs text-gray-500 mb-4">Try searching for "caffeine", "shipping", "taste", or "refund"</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#15191E] text-white text-xs font-mono font-bold uppercase"
                  >
                    Reset Filter
                  </button>
                </motion.div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openIdx === faq.id;
                  const Icon = faq.icon;
                  const vote = helpfulVotes[faq.id] || { count: faq.initialHelpful, voted: false };

                  return (
                    <motion.div
                      key={faq.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25 }}
                      className={`bg-white/95 rounded-3xl border transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-xs ${
                        isOpen ? 'border-[#15191E]/30 ring-1 ring-[#15191E]/10' : 'border-[#EAE3D8] hover:border-gray-300'
                      }`}
                    >
                      {/* Accordion Trigger Header */}
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : faq.id)}
                        className="w-full py-5 px-6 sm:px-8 text-left flex items-center justify-between gap-4 focus:outline-none select-none"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                              isOpen ? 'bg-[#E53935] text-white' : 'bg-[#FAF7F2] text-[#15191E]/70 border border-[#EAE3D8]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
                            <span className="font-sans font-black text-base sm:text-lg text-[#15191E] leading-snug">
                              {faq.q}
                            </span>
                            <span className="inline-block text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#F4EFE6] text-[#15191E]/75 w-fit border border-[#EAE3D8]/60">
                              {faq.tag}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                            isOpen ? 'bg-[#15191E] text-white border-[#15191E]' : 'border-[#EAE3D8] text-gray-400'
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        </div>
                      </button>

                      {/* Expandable Body */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-[#EAE3D8]/60">
                              <p className="text-sm sm:text-base text-[#15191E]/80 leading-relaxed font-sans font-medium mb-5">
                                {faq.a}
                              </p>

                              {/* Interactive Helpful Micro-Action */}
                              <div className="flex items-center justify-between pt-4 border-t border-[#EAE3D8]/40 text-xs text-gray-500 font-mono">
                                <span className="text-[11px]">Was this answer helpful?</span>
                                
                                <button
                                  onClick={(e) => handleVoteHelpful(e, faq.id)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                                    vote.voted
                                      ? 'bg-[#EBF3EE] text-[#4A7C59] border border-[#4A7C59]/30'
                                      : 'bg-[#FAF7F2] hover:bg-gray-100 text-[#15191E]/70 border border-[#EAE3D8]'
                                  }`}
                                >
                                  <ThumbsUp className={`w-3.5 h-3.5 ${vote.voted ? 'fill-[#4A7C59]' : ''}`} />
                                  <span>{vote.voted ? 'Helpful ✓' : 'Helpful'}</span>
                                  <span className="text-[10px] text-gray-400">({vote.count})</span>
                                </button>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
