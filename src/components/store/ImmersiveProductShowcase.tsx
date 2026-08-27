import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Check,
  Eye,
  ShieldCheck,
  Leaf,
  Zap,
  Truck,
} from 'lucide-react';
import { ProductItem, CartItem } from '../../lib/store/types';

interface ImmersiveProductShowcaseProps {
  products: ProductItem[];
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onOpenQuickView: (product: ProductItem) => void;
}

interface ProductTheme {
  bg: string;
  glow: string;
  accent: string;
  orbColor: string;
  pillBg: string;
  pillText: string;
  watermark: string;
}

const THEMES: Record<string, ProductTheme> = {
  'luff-mushroom-matcha-30g': {
    bg: '#FAF7F2',
    glow: 'rgba(116, 178, 76, 0.45)',
    accent: '#4A7C59',
    orbColor: '#74B24C',
    pillBg: '#DDF0FF',
    pillText: '#15191E',
    watermark: 'matcha',
  },
  'luff-mushroom-coffee-250g': {
    bg: '#FAF0EB',
    glow: 'rgba(229, 57, 53, 0.40)',
    accent: '#E53935',
    orbColor: '#E53935',
    pillBg: '#FDECEB',
    pillText: '#C62828',
    watermark: 'coffee',
  },
};

const DEFAULT_THEME: ProductTheme = {
  bg: '#FAF7F2',
  glow: 'rgba(229, 57, 53, 0.35)',
  accent: '#E53935',
  orbColor: '#E53935',
  pillBg: '#F4EFE6',
  pillText: '#15191E',
  watermark: 'luff',
};

export const ImmersiveProductShowcase: React.FC<ImmersiveProductShowcaseProps> = ({
  products,
  cart,
  onAddToCart,
  onOpenQuickView,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Strictly only the first two core formulas
  const displayProducts = products
    .filter(
      (p) =>
        p.id === 'luff-mushroom-matcha-30g' ||
        p.id === 'luff-mushroom-coffee-250g'
    )
    .slice(0, 2);

  const activeProduct = displayProducts[activeIdx] || displayProducts[0] || products[0];
  const activeTheme = THEMES[activeProduct.id] || DEFAULT_THEME;

  const handleAdd = (product: ProductItem) => {
    if (product.stockCount <= 0) return;
    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1400);
  };

  // Instant, responsive scroll scrubber without lag or delay
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || displayProducts.length <= 1) return;

    let rafId: number;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));

      // Responsive hysteresis threshold for immediate, crisp switching
      setActiveIdx((current) => {
        if (current === 0 && progress >= 0.35) return 1;
        if (current === 1 && progress < 0.35) return 0;
        return current;
      });
    };

    const handleScrollThrottled = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(onScroll);
    };

    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', handleScrollThrottled);
      cancelAnimationFrame(rafId);
    };
  }, [displayProducts.length]);

  return (
    <section
      ref={sectionRef}
      id="catalog"
      className="relative w-full h-[180vh] transition-colors duration-300 ease-out"
      style={{ backgroundColor: activeTheme.bg }}
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center select-none">

        {/* 1. Subtle Precision Circular Dial with Radial Aura */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          
          {/* Radial Glowing Aura */}
          <div
            aria-hidden="true"
            className="absolute w-[580px] h-[580px] rounded-full blur-[110px] transition-all duration-300 opacity-80"
            style={{ backgroundColor: activeTheme.glow }}
          />

          {/* Precision Circular Orbit & Ticks Dial */}
          <svg
            className="absolute w-[620px] h-[620px] opacity-25 transition-all duration-300 text-[#15191E]"
            viewBox="0 0 620 620"
          >
            <circle
              cx="310"
              cy="310"
              r="280"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="4 8"
            />
            <circle
              cx="310"
              cy="310"
              r="230"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="2 6"
              opacity="0.6"
            />
            {[...Array(36)].map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const isMajor = i % 3 === 0;
              const r1 = 285;
              const r2 = isMajor ? 300 : 292;
              const x1 = 310 + r1 * Math.cos(angle);
              const y1 = 310 + r1 * Math.sin(angle);
              const x2 = 310 + r2 * Math.cos(angle);
              const y2 = 310 + r2 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth={isMajor ? '1.5' : '1'}
                  opacity={isMajor ? '0.8' : '0.4'}
                />
              );
            })}
          </svg>

          {/* Soft Cursive Watermark behind Product */}
          <div className="absolute flex items-center justify-center select-none pointer-events-none">
            <span className="font-editorial-serif italic text-7xl sm:text-9xl text-[#15191E]/[0.08] transition-all duration-300 tracking-tighter capitalize">
              {activeTheme.watermark}
            </span>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">

          {/* Top Stage Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-1.5 shadow-2xs">
                <span>02 // THE LUFF COLLECTION • IMMERSIVE SHOWCASE</span>
              </div>
              <h2 className="font-sans font-black text-3xl sm:text-5xl text-[#15191E] tracking-tight uppercase leading-tight">
                SELECT YOUR FORMULA
              </h2>
            </div>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#15191E]/60">
                Formula {activeIdx + 1} of 2
              </span>
              <div className="flex gap-1.5">
                {[0, 1].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIdx === i
                        ? 'w-8 bg-[#E53935]'
                        : 'w-2 bg-[#15191E]/20 hover:bg-[#15191E]/40'
                    }`}
                    aria-label={`Go to formula ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main 3-Column Layout: Left Arc Selector -> Center Borderless Product -> Right Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* =========================================================================
                LEFT FLANK: ARC FORMATION (Formula Images in Circle + Name directly in front)
            ========================================================================= */}
            <div className="lg:col-span-3 flex flex-col gap-3 relative">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#15191E]/60 mb-2 pl-3">
                Formulas:
              </span>

              <div className="flex flex-col gap-4 relative">
                {displayProducts.map((p, idx) => {
                  const isActive = activeIdx === idx;
                  const theme = THEMES[p.id] || DEFAULT_THEME;
                  const arcX = -18;

                  return (
                    <button
                      key={p.id}
                      onClick={() => setActiveIdx(idx)}
                      style={{ transform: `translateX(${arcX}px)` }}
                      className={`group flex items-center gap-3.5 text-left py-1.5 px-2 rounded-full transition-all duration-200 relative cursor-pointer ${
                        isActive
                          ? 'opacity-100 scale-[1.04]'
                          : 'opacity-60 hover:opacity-95'
                      }`}
                    >
                      {/* Circle containing the formula/product image */}
                      <div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 p-1.5 ${
                          isActive
                            ? 'ring-2 ring-[#15191E] shadow-md scale-110'
                            : 'border border-[#15191E]/20 group-hover:border-[#15191E]/50 group-hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: theme.pillBg,
                          boxShadow: isActive ? `0 0 16px ${theme.glow}` : undefined,
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain select-none"
                        />
                      </div>

                      {/* Name of the product - NOT enclosed in any div */}
                      <span
                        className={`font-sans text-sm sm:text-base tracking-tight transition-colors select-none ${
                          isActive
                            ? 'font-black text-[#15191E]'
                            : 'font-semibold text-[#15191E]/70 group-hover:text-[#15191E]'
                        }`}
                      >
                        {p.name.replace(/^LUFF\s+Organic\s+/i, '').replace(/^LUFF\s+/i, '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =========================================================================
                CENTER STAGE: INSTANT DUAL-MOUNT CROSS-FADE (Zero Display Delay)
            ========================================================================= */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-4">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full h-80 sm:h-[24rem] flex items-center justify-center cursor-pointer group"
                onClick={() => onOpenQuickView(activeProduct)}
              >
                {/* Pre-mounted Product 0 (Matcha) - Instant opacity transition */}
                {displayProducts[0] && (
                  <motion.div
                    animate={{
                      opacity: activeIdx === 0 ? 1 : 0,
                      scale: activeIdx === 0 ? 1 : 0.92,
                      y: activeIdx === 0 ? 0 : 15,
                    }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className={`absolute inset-0 flex items-center justify-center ${
                      activeIdx === 0 ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                  >
                    <img
                      src={displayProducts[0].image}
                      alt={displayProducts[0].name}
                      className="w-72 sm:w-[22rem] h-72 sm:h-[22rem] object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105 select-none"
                    />
                  </motion.div>
                )}

                {/* Pre-mounted Product 1 (Coffee) - Instant opacity transition */}
                {displayProducts[1] && (
                  <motion.div
                    animate={{
                      opacity: activeIdx === 1 ? 1 : 0,
                      scale: activeIdx === 1 ? 1 : 0.92,
                      y: activeIdx === 1 ? 0 : 15,
                    }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className={`absolute inset-0 flex items-center justify-center ${
                      activeIdx === 1 ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                  >
                    <img
                      src={displayProducts[1].image}
                      alt={displayProducts[1].name}
                      className="w-72 sm:w-[22rem] h-72 sm:h-[22rem] object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105 select-none"
                    />
                  </motion.div>
                )}

                {/* Quick Specs Hover Pill */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-[#15191E] text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
                    <Eye className="w-3.5 h-3.5 text-[#E53935]" />
                    <span>Quick Specs</span>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* =========================================================================
                RIGHT FLANK: ROCK-SOLID STABLE CARD (Zero Lag, Zero Layout Shift)
            ========================================================================= */}
            <div className="lg:col-span-4">
              <div className="bg-white/90 backdrop-blur-xl border border-[#EAE3D8] rounded-[2rem] p-7 sm:p-8 shadow-xl flex flex-col justify-between min-h-[480px]">
                
                {/* Overlapping Content Stack: Both layers share the exact same space */}
                <div className="grid [grid-template-areas:'stack'] relative">
                  
                  {/* Layer 0: Organic Mushroom Matcha */}
                  <div
                    style={{ gridArea: 'stack' }}
                    className={`transition-all duration-300 ease-out flex flex-col ${
                      activeIdx === 0
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#4A7C59]">
                        Formula 01
                      </span>
                      <span className="text-[11px] font-mono font-medium text-gray-500 uppercase tracking-wider">
                        30g (~15 Servings)
                      </span>
                    </div>

                    <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#15191E] leading-tight tracking-tight mb-3">
                      Organic Mushroom Matcha
                    </h3>

                    <p className="text-sm text-[#15191E]/75 leading-relaxed font-sans mb-6">
                      Single-estate Kyoto ceremonial matcha stone-milled with Lion’s Mane & Reishi for calm, jitter-free cognitive flow.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE3D8]/80 flex flex-col">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                          Caffeine
                        </span>
                        <span className="font-sans font-black text-lg text-[#15191E] mt-0.5">
                          45mg
                          <span className="text-xs font-normal text-gray-500 ml-1">steady</span>
                        </span>
                      </div>

                      <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE3D8]/80 flex flex-col">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A7C59]">
                          L-Theanine
                        </span>
                        <span className="font-sans font-black text-lg text-[#4A7C59] mt-0.5">
                          60mg
                          <span className="text-xs font-normal text-gray-500 ml-1">calm</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59]" />
                      <span>Uji, Kyoto, Japan • Single Estate</span>
                    </div>
                  </div>

                  {/* Layer 1: Organic Mushroom Coffee */}
                  <div
                    style={{ gridArea: 'stack' }}
                    className={`transition-all duration-300 ease-out flex flex-col ${
                      activeIdx === 1
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#E53935]">
                        Formula 02
                      </span>
                      <span className="text-[11px] font-mono font-medium text-gray-500 uppercase tracking-wider">
                        250g Milled
                      </span>
                    </div>

                    <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#15191E] leading-tight tracking-tight mb-3">
                      Organic Mushroom Coffee
                    </h3>

                    <p className="text-sm text-[#15191E]/75 leading-relaxed font-sans mb-6">
                      Single-origin Guatemalan dark roast infused with wild Chaga & Cordyceps for clean stamina and low acidity.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE3D8]/80 flex flex-col">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                          Caffeine
                        </span>
                        <span className="font-sans font-black text-lg text-[#15191E] mt-0.5">
                          50mg
                          <span className="text-xs font-normal text-gray-500 ml-1">steady</span>
                        </span>
                      </div>

                      <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE3D8]/80 flex flex-col">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A7C59]">
                          L-Theanine
                        </span>
                        <span className="font-sans font-black text-lg text-[#4A7C59] mt-0.5">
                          30mg
                          <span className="text-xs font-normal text-gray-500 ml-1">calm</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]" />
                      <span>Huehuetenango, Guatemala</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Bar */}
                <div className="pt-5 border-t border-[#EAE3D8] mt-6">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-sans font-black text-3xl text-[#15191E] transition-all duration-200">
                      ${activeProduct.price.toFixed(0)}
                    </span>
                    <span className="text-xs font-mono text-[#4A7C59] font-bold">
                      In Stock • Ships Free
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleAdd(activeProduct)}
                      className="flex-1 py-4 px-6 rounded-full text-white text-xs font-sans font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                      style={{ backgroundColor: activeTheme.accent }}
                    >
                      {justAddedId === activeProduct.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Bag • ${activeProduct.price.toFixed(0)}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenQuickView(activeProduct)}
                      className="p-4 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#EAE3D8] text-[#15191E] transition-all hover:scale-105 shadow-2xs cursor-pointer"
                      title="View Full Ingredients & Brewing Ritual"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-[#15191E]/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Free Eco Shipping on $40+', icon: Truck },
              { label: '100% Organic & Non-GMO', icon: Leaf },
              { label: '30-Day Money-Back Guarantee', icon: ShieldCheck },
              { label: 'Zero Jitters or Crash', icon: Zap },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center justify-center gap-2 text-xs font-bold text-[#15191E]/75">
                  <Icon className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
