import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, Coffee, Leaf, MessageCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const categories = [
    { id: 'all', label: 'All Inquiries' },
    { id: 'sourcing', label: 'Sourcing & Terroir' },
    { id: 'formula', label: 'Caffeine & Adaptogens' },
    { id: 'taste', label: 'Taste & Ritual' },
    { id: 'guarantee', label: 'Shipping & Guarantee' },
  ];

  const faqs = [
    {
      category: 'sourcing',
      q: 'Where is LUFF Ceremonial Matcha sourced and grown?',
      a: 'LUFF is harvested exclusively from 5th-generation family estates in Uji, Kyoto. The tea bushes are covered under natural straw reed tarps for 28 continuous days before spring harvest to maximize chlorophyll and L-theanine. Leaves are slowly stone-ground on granite wheels to 5 microns (at 35g/hour) for zero astringency.',
      icon: Leaf,
    },
    {
      category: 'formula',
      q: 'How much caffeine and adaptogens are in each serving?',
      a: 'Each 2g serving of LUFF Organic Mushroom Matcha delivers 45mg of clean caffeine paired with 60mg of L-theanine and 1,500mg of dual-extracted organic Lion’s Mane & Reishi mushroom fruiting bodies. LUFF Mushroom Coffee contains 50mg of caffeine paired with 1,500mg of wild Chaga & Cordyceps.',
      icon: Coffee,
    },
    {
      category: 'taste',
      q: 'Does LUFF Mushroom Matcha taste like mushrooms?',
      a: 'Not at all! We use pure dual-extracted fruiting body extracts that dissolve seamlessly into the vibrant, creamy umami profile of single-origin Uji matcha. It delivers sweet pistachio, toasted vanilla, and rich green tea notes without any earthy fungus taste or chalkiness.',
      icon: Leaf,
    },
    {
      category: 'guarantee',
      q: 'What is your 30-Day Money-Back Guarantee policy?',
      a: 'We offer an unconditional 30-day money-back guarantee. If you don’t feel sustained, calm energy or aren’t completely in love with the taste, simply email hello@luffmatcha.com or message our WhatsApp concierge for a 100% full refund with no return shipping hassle.',
      icon: ShieldCheck,
    },
    {
      category: 'guarantee',
      q: 'How long does shipping take and is it free?',
      a: 'Orders placed before 2:00 PM EST ship the exact same business day from our climate-controlled warehouse. Standard Carbon-Neutral Ground delivery takes 3 to 5 business days across the US and is 100% FREE on all orders over $40.00.',
      icon: Truck,
    },
    {
      category: 'formula',
      q: 'Will LUFF cause stomach acid or caffeine crashes?',
      a: 'Zero crashes and zero acid reflux. Standard coffee causes acid spikes and rapid cortisol release. LUFF’s organic matcha and low-acid Guatemalan Arabica bind caffeine to L-theanine and beta-glucans, ensuring a steady, slow-release 4 to 6 hour cognitive flow without digestive distress.',
      icon: ShieldCheck,
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <section id="faq" className="py-28 bg-[#FAF7F2] relative overflow-hidden">
      
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[#D8E8F5]/40 blur-[100px]"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest shadow-xs">
            <HelpCircle className="w-4 h-4 text-[#E53935]" />
            <span>04 // FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-[#15191E] tracking-tight uppercase">
            HAVE QUESTIONS? WE HAVE ANSWERS.
          </h2>
          <p className="text-sm sm:text-base text-[#15191E]/70 max-w-lg leading-relaxed font-editorial-serif italic">
            Everything you need to know about our single-estate sourcing, adaptogenic dosing, and 30-day guarantee.
          </p>

          {/* Category Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIdx(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#E53935] text-white shadow-sm'
                    : 'bg-white hover:bg-[#F4EFE6] text-[#15191E] border border-[#EAE3D8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const Icon = faq.icon;

            return (
              <motion.div
                key={faq.q}
                layout
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#E53935] shadow-md ring-2 ring-[#E53935]/10'
                    : 'border-[#EAE3D8] shadow-xs hover:border-[#15191E]/20'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left font-sans font-black text-base sm:text-lg text-[#15191E] flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2 rounded-xl shrink-0 transition-colors ${
                        isOpen ? 'bg-[#FDECEB] text-[#E53935]' : 'bg-[#FAF7F2] text-gray-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{faq.q}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 p-1.5 rounded-full bg-[#FAF7F2] text-gray-500"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-2 text-sm text-[#15191E]/80 leading-relaxed font-sans border-t border-[#EAE3D8]/60 mt-1 pl-[4.25rem]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* 30-Day Guarantee Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3EE] text-[#4A7C59] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-sans font-black text-lg text-[#15191E]">
                Still Have Questions? Talk to Our Team
              </h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Our Kyoto tea sommeliers & mushroom specialists respond in minutes.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/12125555833?text=Hi%20LUFF%20team,%20I%20have%20a%20question%20about%20your%20blends"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#15191E] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shrink-0 flex items-center gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#4A7C59]" />
            <span>Chat On WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Soft Bottom Transition Gradient into Dark Newsletter Footer */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#FAF7F2]/40 to-[#15191E] pointer-events-none z-20"
      />
    </section>
  );
};
