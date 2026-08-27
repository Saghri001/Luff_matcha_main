import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Eye,
  ShieldCheck,
  Leaf,
  Zap,
  Star,
  Flame,
  ArrowRight,
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
  pillBg: string;
  pillText: string;
  borderColor: string;
}

const THEMES: Record<string, ProductTheme> = {
  'luff-mushroom-matcha-30g': {
    bg: '#EEF6F0',
    glow: 'rgba(116, 178, 76, 0.40)',
    accent: '#4A7C59',
    pillBg: '#DDF0FF',
    pillText: '#15191E',
    borderColor: '#C3E0CC',
  },
  'luff-mushroom-coffee-250g': {
    bg: '#FBF0EB',
    glow: 'rgba(229, 57, 53, 0.35)',
    accent: '#E53935',
    pillBg: '#FDECEB',
    pillText: '#C62828',
    borderColor: '#F8C4C1',
  },
  'luff-daily-ritual-bundle': {
    bg: '#FAF4E4',
    glow: 'rgba(225, 160, 30, 0.40)',
    accent: '#B8860B',
    pillBg: '#F5ECCB',
    pillText: '#855E00',
    borderColor: '#E6D399',
  },
};

const DEFAULT_THEME: ProductTheme = {
  bg: '#FAF7F2',
  glow: 'rgba(229, 57, 53, 0.25)',
  accent: '#E53935',
  pillBg: '#F4EFE6',
  pillText: '#15191E',
  borderColor: '#EAE3D8',
};

export const ImmersiveProductShowcase: React.FC<ImmersiveProductShowcaseProps> = ({
  products,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onOpenQuickView,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const activeProduct = products[activeIdx] || products[0];
  const activeTheme = THEMES[activeProduct.id] || DEFAULT_THEME;

  const getQtyInCart = (productId: string) => {
    return cart
      .filter((i) => i.product.id === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const handleAdd = (product: ProductItem) => {
    if (product.stockCount <= 0) return;
    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1400);
  };

  // Pinned scroll scrubber to change products as user scrolls through the showcase track
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let rafId: number;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
      const targetIdx = Math.min(
        products.length - 1,
        Math.floor(progress * products.length)
      );

      setActiveIdx((prev) => (prev !== targetIdx ? targetIdx : prev));
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
  }, [products.length]);

  return (
    <section
      ref={sectionRef}
      id="catalog"
      className="relative w-full h-[320vh] transition-colors duration-700 ease-out"
      style={{ backgroundColor: activeTheme.bg }}
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center select-none">

        {/* Ambient Dynamic Background Halo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] transition-all duration-700 opacity-70"
          style={{ backgroundColor: activeTheme.glow }}
        />

        {/* Watermark brand title behind product */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.04] transition-opacity duration-700"
        >
          <span className="font-sans font-black text-[22vw] leading-none uppercase tracking-tighter text-[#15191E]">
            {activeIdx === 0 ? 'MATCHA' : activeIdx === 1 ? 'COFFEE' : 'BUNDLE'}
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>02 // THE LUFF COLLECTION • IMMERSIVE SHOWCASE</span>
              </div>
              <h2 className="font-sans font-black text-3xl sm:text-5xl text-[#15191E] tracking-tight uppercase">
                SELECT YOUR FORMULA
              </h2>
            </div>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#15191E]/60">
                Formula {activeIdx + 1} of {products.length}
              </span>
              <div className="flex gap-1.5">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIdx === i
                        ? 'w-8 bg-[#E53935]'
                        : 'w-2 bg-[#15191E]/20 hover:bg-[#15191E]/40'
                    }`}
                    aria-label={`Go to product ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Three-Column Flanked Layout matching the Reference Video */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* Left Flank: Interactive Formula Switcher List */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#15191E]/60 mb-1">
                Explore Formulas:
              </span>

              {products.map((p, idx) => {
                const isActive = activeIdx === idx;
                const theme = THEMES[p.id] || DEFAULT_THEME;
                const inCart = getQtyInCart(p.id);

                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`text-left p-4 rounded-3xl border transition-all duration-400 relative overflow-hidden group ${
                      isActive
                        ? 'bg-white shadow-xl scale-[1.02]'
                        : 'bg-white/70 hover:bg-white/90 border-[#EAE3D8]'
                    }`}
                    style={{
                      borderColor: isActive ? theme.accent : '#EAE3D8',
                      boxShadow: isActive
                        ? `0 14px 34px -10px ${theme.glow}`
                        : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE3D8]">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {isActive && (
                            <div
                              className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                              style={{ backgroundColor: theme.accent }}
                            />
                          )}
                        </div>

                        <div>
                          {p.badge && (
                            <span
                              className="inline-block text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md mb-1"
                              style={{
                                backgroundColor: theme.pillBg,
                                color: theme.pillText,
                              }}
                            >
                              {p.badge}
                            </span>
                          )}
                          <div className="font-sans font-black text-sm text-[#15191E] leading-tight">
                            {p.name.replace(/^LUFF\s+Organic\s+/i, '')}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-sans font-black text-sm text-[#15191E]">
                          ${p.price.toFixed(0)}
                        </div>
                        {inCart > 0 && (
                          <span className="text-[10px] font-mono font-bold text-[#4A7C59]">
                            {inCart} in bag
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Center Stage: Floating Dynamic Product Showcase with Ambient Glow */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, scale: 0.88, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -20 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                  className="relative group cursor-pointer"
                  onClick={() => onOpenQuickView(activeProduct)}
                >
                  {/* Floating Product Image */}
                  <div className="relative w-64 sm:w-80 h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 bg-white flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ borderColor: activeTheme.borderColor }}
                  >
                    <img
                      src={activeProduct.image}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Quick View Hover Pill */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#15191E] text-xs font-black uppercase tracking-wider shadow-md">
                        <Eye className="w-3.5 h-3.5 text-[#E53935]" />
                        <span>Quick Specs</span>
                      </span>
                    </div>
                  </div>

                  {/* Badges on product */}
                  {activeProduct.badge && (
                    <div className="absolute -top-3 -right-3 shadow-lg">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider text-white shadow-md"
                        style={{ backgroundColor: activeTheme.accent }}
                      >
                        {activeProduct.badge}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Flank: Detailed Product Intelligence & Purchase Action */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="bg-white/95 backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {activeProduct.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#FAF7F2] text-[#15191E]/80 border border-[#EAE3D8]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-sans font-black text-2xl text-[#15191E] leading-tight mb-2">
                      {activeProduct.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#15191E]/75 leading-relaxed font-sans mb-4">
                      {activeProduct.description}
                    </p>

                    {/* Biological Specs & Origin */}
                    <div className="space-y-2.5 py-3 border-y border-[#EAE3D8] mb-5 text-xs">
                      {activeProduct.caffeineMg !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 font-sans">Caffeine / Release:</span>
                          <span className="font-black text-[#15191E] font-mono">
                            {activeProduct.caffeineMg}mg Steady Energy
                          </span>
                        </div>
                      )}

                      {activeProduct.lTheanineMg !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 font-sans">L-Theanine Nootropic:</span>
                          <span className="font-black text-[#15191E] font-mono">
                            {activeProduct.lTheanineMg}mg Alpha Calm
                          </span>
                        </div>
                      )}

                      {activeProduct.origin && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 font-sans">Single Origin:</span>
                          <span className="font-black text-[#15191E] font-mono truncate max-w-[170px]">
                            {activeProduct.origin}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Buy Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-black text-2xl text-[#15191E]">
                          ${activeProduct.price.toFixed(0)}.00
                        </span>
                        {activeProduct.volumeOrWeight && (
                          <span className="text-xs font-mono text-gray-500">
                            / {activeProduct.volumeOrWeight}
                          </span>
                        )}
                      </div>

                      {/* In-cart stepper if already in cart */}
                      {getQtyInCart(activeProduct.id) > 0 && (
                        <div className="flex items-center gap-2 bg-[#F4EFE6] px-2.5 py-1 rounded-xl border border-[#EAE3D8]">
                          <button
                            onClick={() => onUpdateCartQty(activeProduct.id, -1)}
                            className="p-1 rounded-md hover:bg-white text-[#15191E]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-[#15191E] font-mono px-1">
                            {getQtyInCart(activeProduct.id)}
                          </span>
                          <button
                            onClick={() => onUpdateCartQty(activeProduct.id, 1)}
                            className="p-1 rounded-md hover:bg-white text-[#15191E]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdd(activeProduct)}
                        className="flex-1 py-3.5 rounded-full text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
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
                        className="p-3.5 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#EAE3D8] text-[#15191E] transition-colors"
                        title="View Full Ingredients & Brewing Ritual"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Bottom Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-[#15191E]/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Free Eco Shipping on $40+', icon: Sparkles },
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
