import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Sparkles, Check, Eye, Award, Leaf } from 'lucide-react';
import { ProductItem } from '../../lib/store/types';
import heroBackdrop from '../../assets/images/luff_iced_matcha_hero_1787223577925.jpg';

interface HeroEditorialSectionProps {
  products: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
  onOpenQuickView: (product: ProductItem) => void;
}

/** Short display name: "LUFF Organic Mushroom Matcha (30g)" -> "Mushroom Matcha" */
const shortName = (p: ProductItem): string =>
  p.name.replace(/^LUFF\s+Organic\s+/i, '').replace(/\s*\(.*\)\s*$/, '');

export const HeroEditorialSection: React.FC<HeroEditorialSectionProps> = ({
  products,
  onAddToCart,
  onOpenQuickView,
}) => {
  const [selectedSkuIdx, setSelectedSkuIdx] = useState(0); // 0 = Matcha, 1 = Coffee
  const [isAdded, setIsAdded] = useState(false);

  const currentProduct = products[selectedSkuIdx] || products[0];

  const handleAdd = () => {
    onAddToCart(currentProduct);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Full-bleed cinematic hero. The #hero-stage layer fills the entire hero and is the
  // mount point for the scroll-scrubbed frame-sequence animation (currently a still
  // backdrop). Headline + controls overlay on top over a legibility scrim.
  return (
    <section
      id="hero-editorial"
      className="relative w-full overflow-hidden min-h-[calc(100dvh-106px)] sm:h-[calc(100dvh-106px)]"
    >
      {/* ---- Full-bleed animation stage (canvas mount point) ---- */}
      <div id="hero-stage" className="absolute inset-0 z-0">
        <img
          src={heroBackdrop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Legibility scrims: even darken + stronger top/bottom for text & controls */}
        <div className="absolute inset-0 bg-[#15191E]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15191E]/80 via-[#15191E]/10 to-[#15191E]/55" />
      </div>

      {/* ---- Overlay content ---- */}
      <div className="relative z-10 h-full max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col">

        {/* Top: floating product credibility badges */}
        <div className="hidden sm:flex items-start justify-between shrink-0">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 shadow-sm">
            <Leaf className="w-4 h-4 text-[#EBF3EE]" />
            <div className="text-left font-mono">
              <span className="text-[10px] text-white/60 block leading-none uppercase">Flavor &amp; Flow</span>
              <span className="text-xs font-black text-white">{currentProduct.tags[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 shadow-sm">
            <Award className="w-4 h-4 text-[#E53935]" />
            <div className="text-left font-mono">
              <span className="text-[10px] text-white/60 block leading-none uppercase">Dosage</span>
              <span className="text-xs font-black text-white">{currentProduct.volumeOrWeight}</span>
            </div>
          </div>
        </div>

        {/* Center: pill + headline + subcopy (compact, lets the stage dominate) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex-1 flex flex-col items-center justify-center text-center gap-4 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white text-xs font-mono font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E53935]" />
            <span>Kyoto First Harvest • 100% Organic</span>
          </div>

          <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase leading-[0.95] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
            Energy without the jitters.
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-editorial-serif italic font-normal">
            Pure ceremonial matcha &amp; adaptogenic mushrooms stone-milled to 5 microns.
          </p>

          <button
            onClick={() => onOpenQuickView(currentProduct)}
            className="mt-1 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white/90 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full transition-colors active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-[#E53935]" />
            <span>Quick View Specs</span>
          </button>
        </motion.div>

        {/* Bottom: SKU switcher + direct Add-to-Bag (data-driven labels) */}
        <div className="max-w-3xl mx-auto w-full shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 sm:px-6 sm:py-3 rounded-full border border-[#EAE3D8] shadow-xl">

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {products.slice(0, 2).map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedSkuIdx(idx)}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  selectedSkuIdx === idx
                    ? idx === 0
                      ? 'bg-[#D8E8F5] text-[#15191E] font-black border border-[#EAE3D8] shadow-xs'
                      : 'bg-[#FDECEB] text-[#15191E] font-black border border-[#F8C4C1] shadow-xs'
                    : 'bg-transparent text-gray-500 hover:text-[#15191E]'
                }`}
              >
                0{idx + 1}. {shortName(p)} (${p.price.toFixed(0)})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleAdd}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-[#4A7C59] text-white'
                  : 'bg-[#E53935] hover:bg-[#C62828] text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ${currentProduct.price.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
