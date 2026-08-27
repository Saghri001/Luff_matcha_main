import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Check,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Zap,
  Flame,
  Star,
  ChevronDown,
  Coffee,
  RotateCcw,
} from 'lucide-react';
import { ProductItem } from '../../lib/store/types';

interface FullPageScrollStageProps {
  products: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
  onExplore: () => void;
  scrollTo: (target: string | number) => void;
}

/** Available frame sequences */
const SEQUENCES = {
  studio: {
    id: 'studio',
    label: 'Ceremonial Matcha',
    badge: 'Uji First Flush',
    glowColor: 'rgba(116, 178, 76, 0.28)',
    glowSolid: '#74B24C',
    desktop: { dir: '/hero-frames/studio/desktop', count: 150 },
    mobile: { dir: '/hero-frames/studio/mobile', count: 100 },
  },
  coffee: {
    id: 'coffee',
    label: 'Mushroom Coffee',
    badge: 'Guatemala Arabica',
    glowColor: 'rgba(229, 83, 60, 0.26)',
    glowSolid: '#E5533C',
    desktop: { dir: '/hero-frames/coffee/desktop', count: 150 },
    mobile: { dir: '/hero-frames/coffee/mobile', count: 100 },
  },
} as const;

type VariantKey = keyof typeof SEQUENCES;

const TOP_BARS = 106;

const framePath = (dir: string, i: number) =>
  `${dir}/f_${String(i).padStart(3, '0')}.webp`;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const FullPageScrollStage: React.FC<FullPageScrollStageProps> = ({
  products,
  onAddToCart,
  onExplore,
  scrollTo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const currentProgressRef = useRef<number>(0);
  const activeVariantRef = useRef<VariantKey>('studio');

  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeVariant, setActiveVariant] = useState<VariantKey>('studio');
  const [addedSkuId, setAddedSkuId] = useState<string | null>(null);

  const isMobile =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
  const cfg = SEQUENCES[activeVariant][isMobile ? 'mobile' : 'desktop'];

  // Product references
  const matchaProduct = products.find((p) => p.id.includes('matcha')) || products[0];
  const coffeeProduct = products.find((p) => p.id.includes('coffee')) || products[1];
  const bundleProduct = products.find((p) => p.id.includes('bundle')) || products[2];

  const currentProduct = activeVariant === 'coffee' ? coffeeProduct : matchaProduct;

  const handleAddProduct = (p: ProductItem) => {
    onAddToCart(p);
    setAddedSkuId(p.id);
    setTimeout(() => setAddedSkuId(null), 1500);
  };

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Synchronize ref with state
  useEffect(() => {
    activeVariantRef.current = activeVariant;
  }, [activeVariant]);

  // Size the canvas to full backing store DPR
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  // Draw frame to cover canvas without letterboxing
  const drawCover = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) => {
      const ir = img.width / img.height;
      const cr = cw / ch;
      let dw: number, dh: number;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
      } else {
        dw = cw;
        dh = cw / ir;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    },
    []
  );

  // Render frame corresponding to scroll progress p
  const renderFrame = useCallback(
    (p: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const loaded = loadedRef.current;
      const totalFrames = cfg.count;
      let idx = Math.round(p * (totalFrames - 1));

      // Find nearest loaded frame if current isn't ready
      if (!loaded[idx]) {
        let found = -1;
        for (let d = 1; d < totalFrames; d++) {
          if (loaded[idx - d]) {
            found = idx - d;
            break;
          }
          if (loaded[idx + d]) {
            found = idx + d;
            break;
          }
        }
        if (found === -1) return;
        idx = found;
      }

      const img = imagesRef.current[idx];
      if (img && img.complete) {
        drawCover(ctx, img, canvas.clientWidth, canvas.clientHeight);
      }
    },
    [cfg.count, drawCover]
  );

  // Preload frames for current active sequence
  useEffect(() => {
    if (reduced) return;
    setReady(false);
    const imgs: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(cfg.count).fill(false);
    let firstDone = false;

    for (let i = 1; i <= cfg.count; i++) {
      const img = new Image();
      img.src = framePath(cfg.dir, i);
      const idx = i - 1;

      img.onload = () => {
        loaded[idx] = true;
        if (!firstDone && idx === 0) {
          firstDone = true;
          setReady(true);
          renderFrame(currentProgressRef.current);
        }
      };
      imgs.push(img);
    }

    imagesRef.current = imgs;
    loadedRef.current = loaded;

    // Safety fallback: mark ready after 300ms if initial frame took longer
    const timer = setTimeout(() => {
      setReady(true);
      renderFrame(currentProgressRef.current);
    }, 400);

    return () => clearTimeout(timer);
  }, [cfg.dir, cfg.count, reduced, renderFrame]);

  // Scroll listener synced with RAF
  useEffect(() => {
    if (reduced) return;

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    let rafId: number;

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const rawProgress = -rect.top / totalScrollable;
      const clamped = clamp(rawProgress, 0, 1);

      currentProgressRef.current = clamped;
      setProgress(clamped);
      renderFrame(clamped);
    };

    const handleScrollThrottled = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(onScroll);
    };

    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
    // Initial paint
    onScroll();

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      window.removeEventListener('scroll', handleScrollThrottled);
      cancelAnimationFrame(rafId);
    };
  }, [reduced, renderFrame, sizeCanvas]);

  // If user prefers reduced motion, show a high-end static editorial stage
  if (reduced) {
    return (
      <section className="relative w-full bg-[#FAF7F2] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4EFE6] border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kyoto First Harvest • 100% Organic Tencha</span>
            </div>
            <h1 className="font-sans font-black text-4xl sm:text-6xl text-[#15191E] tracking-tight uppercase leading-[0.95] mb-6">
              Energy without the jitters.
            </h1>
            <p className="text-lg text-[#15191E]/80 font-editorial-serif italic mb-8 max-w-xl">
              Ceremonial Uji matcha and Guatemalan Arabica stone-milled with 1,500mg dual-extracted Lion’s Mane & Reishi.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleAddProduct(matchaProduct)}
                className="px-8 py-4 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                Add Matcha Tin ($28)
              </button>
              <button
                onClick={onExplore}
                className="px-8 py-4 rounded-full bg-white border border-[#EAE3D8] hover:bg-[#F4EFE6] text-[#15191E] text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                Explore Full Collection
              </button>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#EAE3D8] bg-white">
            <img
              src={framePath(SEQUENCES[activeVariant].desktop.dir, 78)}
              alt="LUFF powder burst"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  // Calculate Opacities and Transforms for the Storytelling Stages based on progress
  // Stage 1: Hero (0.00 -> 0.20)
  const heroOpacity = 1 - smooth(0.12, 0.20, progress);
  const heroY = lerp(0, -60, smooth(0.10, 0.20, progress));

  // Stage 2: Kinetic Marquee / Flow Statement (0.20 -> 0.38)
  const stage2Opacity = smooth(0.18, 0.24, progress) * (1 - smooth(0.34, 0.40, progress));
  const stage2Y = lerp(40, -40, smooth(0.18, 0.38, progress));

  // Stage 3: Interactive Variant & Solution Showcase (0.38 -> 0.58)
  const stage3Opacity = smooth(0.36, 0.42, progress) * (1 - smooth(0.54, 0.60, progress));
  const stage3Y = lerp(40, -30, smooth(0.36, 0.58, progress));

  // Stage 4: Standout Feature Anatomy & Exploded Burst (0.58 -> 0.78)
  const stage4Opacity = smooth(0.56, 0.62, progress) * (1 - smooth(0.74, 0.80, progress));
  const stage4Y = lerp(40, -30, smooth(0.56, 0.78, progress));

  // Stage 5: The Daily Ritual (0.78 -> 0.95)
  const stage5Opacity = smooth(0.76, 0.82, progress) * (1 - smooth(0.93, 0.98, progress));
  const stage5Y = lerp(40, -20, smooth(0.76, 0.96, progress));

  return (
    <section
      ref={containerRef}
      id="full-page-stage"
      className="relative w-full h-[540vh] bg-[#FAF7F2]"
      style={{ marginTop: `-${TOP_BARS}px` }}
    >
      {/* Navigation Anchors for Smooth Lenis Scrolling */}
      <div id="hero-stage" className="absolute top-0 pointer-events-none" />
      <div id="sourcing" className="absolute top-[60%] pointer-events-none" />
      <div id="ritual" className="absolute top-[80%] pointer-events-none" />

      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden select-none">

        {/* 1. Canvas Backdrop Stage */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ willChange: 'transform' }}
        />

        {/* 2. Seamless Edge-Bleed Scrims (Feathers video edges into cream #FAF7F2 background) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 45%, rgba(250, 247, 242, 0.4) 75%, rgba(250, 247, 242, 0.95) 100%),
              linear-gradient(to bottom, rgba(250, 247, 242, 0.85) 0%, transparent 12%, transparent 88%, rgba(250, 247, 242, 0.95) 100%)
            `,
          }}
        />

        {/* 3. Radiant Ambient Glow (Matched to Active Blend: Jade vs Coffee Amber) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full transition-all duration-700 blur-[80px]"
          style={{
            backgroundColor: SEQUENCES[activeVariant].glowColor,
            opacity: progress > 0.15 && progress < 0.9 ? 1 : 0.4,
            transform: `translate(-50%, -50%) scale(${progress > 0.4 && progress < 0.75 ? 1.25 : 1})`,
          }}
        />

        {/* Loading Spinner for Initial Frame */}
        {!ready && (
          <div className="absolute inset-0 grid place-items-center bg-[#FAF7F2] z-30">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#E53935]/20 border-t-[#E53935] animate-spin" />
              <span className="font-mono text-xs font-bold text-[#15191E]/60 uppercase tracking-widest">
                Loading 3D Studio Stage...
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 1: HERO (0% -> 20% Scroll)
            Clean editorial DTC hero flanking the centered pristine product
        ========================================================================= */}
        <div
          className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center"
          style={{
            opacity: heroOpacity,
            transform: `translate3d(0, ${heroY}px, 0)`,
            display: heroOpacity <= 0 ? 'none' : 'flex',
            paddingTop: `${TOP_BARS}px`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column Content */}
              <div className="lg:col-span-6 pointer-events-auto text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-4 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>01 // KYOTO FIRST HARVEST • 100% ORGANIC</span>
                </div>

                <h1 className="font-sans font-black text-4xl sm:text-6xl xl:text-7xl tracking-tight text-[#15191E] uppercase leading-[0.92] mb-4 drop-shadow-xs">
                  ENERGY WITHOUT THE JITTERS.
                </h1>

                <p className="text-base sm:text-lg text-[#15191E]/80 max-w-lg font-editorial-serif italic mb-6 leading-relaxed">
                  Single-estate ceremonial Uji matcha & adaptogenic mushrooms, stone-milled to 5 microns on granite wheels.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleAddProduct(matchaProduct)}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <span>
                      {addedSkuId === matchaProduct.id ? 'Added to Bag ✓' : 'Add Matcha Tin • $28'}
                    </span>
                    <ShoppingBag className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => scrollTo('#catalog')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/90 hover:bg-white border border-[#EAE3D8] text-[#15191E] font-extrabold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-xs"
                  >
                    <span>Explore All</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E53935]" />
                  </button>
                </div>

                {/* Rating Badge */}
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#E53935] text-[#E53935]" />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#15191E]/70 uppercase">
                    4.9/5 Rating from 1,200+ Creators
                  </span>
                </div>
              </div>

              {/* Right Column: Subtle watermark & scroll cue */}
              <div className="hidden lg:flex lg:col-span-6 flex-col items-end justify-between h-full pointer-events-auto">
                <div className="text-right">
                  <span className="font-sans font-black text-[12vw] leading-none text-[#15191E]/[0.04] select-none block">
                    LUFF
                  </span>
                </div>

                <div className="bg-white/85 backdrop-blur-md border border-[#EAE3D8] rounded-2xl p-4 shadow-xs max-w-xs text-right">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#E53935] block mb-1">
                    INTERACTIVE EXPERIENCE
                  </span>
                  <p className="text-xs font-medium text-[#15191E]/80">
                    Scroll down to witness the stone-milled micro-powder burst and explore the blends.
                  </p>
                  <div className="mt-2 flex items-center justify-end gap-1.5 text-xs font-bold text-[#15191E]">
                    <span>Scroll to uncap</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#E53935] animate-bounce" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 2: KINETIC IDENTITY & VALUE PILLARS (20% -> 38% Scroll)
            Inspired by "YOUR READING BUDDY" with dynamic kinetic text
        ========================================================================= */}
        <div
          className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between py-12"
          style={{
            opacity: stage2Opacity,
            transform: `translate3d(0, ${stage2Y}px, 0)`,
            display: stage2Opacity <= 0 ? 'none' : 'flex',
            paddingTop: `${TOP_BARS}px`,
          }}
        >
          {/* Top kinetic banner flowing behind/above product */}
          <div className="w-full overflow-hidden select-none opacity-30">
            <div className="whitespace-nowrap font-sans font-black text-6xl sm:text-8xl tracking-tighter uppercase text-[#15191E]">
              CEREMONIAL MATCHA • GUATEMALAN ARABICA • ADAPTOGENIC NOOTROPICS • UJI TERROIR •
            </div>
          </div>

          {/* Central Callout Banner (Left and Right balanced) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFE6] text-[#E53935] text-xs font-mono font-bold uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>YOUR DAILY COMPANION</span>
                </div>
                <h2 className="font-sans font-black text-2xl sm:text-4xl text-[#15191E] tracking-tight uppercase leading-tight mb-3">
                  TWO BLENDS. ONE UNCOMPROMISING RITUAL.
                </h2>
                <p className="text-sm text-[#15191E]/75 font-editorial-serif italic leading-relaxed">
                  Crafted for high-output creators who demand steady, jitter-free focus without the bitter aftertaste.
                </p>
              </div>

              {/* 4 Pillars Grid on the other side */}
              <div className="pointer-events-auto grid grid-cols-2 gap-3">
                {[
                  { label: '100% Organic Tencha', sub: 'Single Estate Uji', icon: Leaf },
                  { label: '1,500mg Mushrooms', sub: 'Lion’s Mane & Reishi', icon: Sparkles },
                  { label: 'Zero Added Sugar', sub: 'Pure Plant Essence', icon: ShieldCheck },
                  { label: '6-Hour Steady Energy', sub: 'Alpha-Wave Calm', icon: Zap },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white/85 backdrop-blur-md border border-[#EAE3D8] p-3.5 rounded-2xl shadow-xs flex flex-col justify-between"
                    >
                      <Icon className="w-4 h-4 text-[#E53935] mb-2" />
                      <div className="text-xs font-extrabold text-[#15191E] font-sans leading-tight">
                        {item.label}
                      </div>
                      <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                        {item.sub}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          <div className="w-full" />
        </div>

        {/* =========================================================================
            STAGE 3: INTERACTIVE VARIANT & SOLUTION SHOWCASE (38% -> 58% Scroll)
            Inspired directly by "Urban's Solution" in reference video
        ========================================================================= */}
        <div
          className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center"
          style={{
            opacity: stage3Opacity,
            transform: `translate3d(0, ${stage3Y}px, 0)`,
            display: stage3Opacity <= 0 ? 'none' : 'flex',
            paddingTop: `${TOP_BARS}px`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
            {/* Header */}
            <div className="text-center sm:text-left mb-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>02 // THE ADAPTOGENIC SOLUTION</span>
              </div>
              <h2 className="font-sans font-black text-3xl sm:text-5xl text-[#15191E] tracking-tight uppercase">
                LUFF’S SOLUTION FOR SUSTAINED FLOW
              </h2>
              <p className="text-sm sm:text-base text-[#15191E]/70 font-editorial-serif italic mt-1 max-w-xl">
                Choose your morning blend and configure your daily ritual.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Interactive Blend Selector Buttons */}
              <div className="lg:col-span-4 pointer-events-auto flex flex-col gap-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#15191E]/60">
                  Select Formula:
                </span>

                {/* 1. Matcha Tin */}
                <button
                  onClick={() => setActiveVariant('studio')}
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeVariant === 'studio'
                      ? 'bg-white border-[#74B24C] shadow-md ring-2 ring-[#74B24C]/20 scale-[1.02]'
                      : 'bg-white/70 hover:bg-white border-[#EAE3D8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#74B24C] shadow-xs flex items-center justify-center">
                      {activeVariant === 'studio' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#15191E]">
                        Ceremonial Mushroom Matcha
                      </div>
                      <div className="text-[11px] font-mono text-gray-500">
                        Focus & Calm • Uji First Flush
                      </div>
                    </div>
                  </div>
                  <span className="font-sans font-black text-sm text-[#15191E]">$28</span>
                </button>

                {/* 2. Coffee Bag */}
                <button
                  onClick={() => setActiveVariant('coffee')}
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeVariant === 'coffee'
                      ? 'bg-white border-[#E5533C] shadow-md ring-2 ring-[#E5533C]/20 scale-[1.02]'
                      : 'bg-white/70 hover:bg-white border-[#EAE3D8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E5533C] shadow-xs flex items-center justify-center">
                      {activeVariant === 'coffee' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#15191E]">
                        Organic Mushroom Coffee
                      </div>
                      <div className="text-[11px] font-mono text-gray-500">
                        Stamina & Clarity • Guatemala Arabica
                      </div>
                    </div>
                  </div>
                  <span className="font-sans font-black text-sm text-[#15191E]">$24</span>
                </button>

                {/* 3. Bundle Offer */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] flex items-center justify-between gap-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#E53935] text-white text-[10px] font-mono font-bold uppercase mb-1">
                      Save 15% + Free Brass Scoop
                    </span>
                    <div className="text-xs font-black text-[#15191E]">
                      LUFF Daily Ritual Bundle
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddProduct(bundleProduct)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F4EFE6] border border-[#EAE3D8] text-xs font-black text-[#15191E] transition-colors"
                  >
                    $46 Add
                  </button>
                </div>
              </div>

              {/* Center space is occupied by the 3D canvas tin */}
              <div className="hidden lg:block lg:col-span-4" />

              {/* Right Column: Active Formula Specs Card */}
              <div className="lg:col-span-4 pointer-events-auto">
                <div className="bg-white/90 backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E53935]">
                      Active Blend Specs
                    </span>
                    <span className="text-xs font-mono font-semibold text-gray-400">
                      {currentProduct.volumeOrWeight}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b border-[#EAE3D8]/80 text-xs">
                      <span className="text-gray-500">Caffeine Profile:</span>
                      <span className="font-black text-[#15191E]">{currentProduct.caffeineMg}mg Smooth Release</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#EAE3D8]/80 text-xs">
                      <span className="text-gray-500">L-Theanine Nootropic:</span>
                      <span className="font-black text-[#15191E]">{currentProduct.lTheanineMg}mg (Alpha Wave)</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#EAE3D8]/80 text-xs">
                      <span className="text-gray-500">Functional Adaptogens:</span>
                      <span className="font-black text-[#15191E]">1,500mg Dual-Extract</span>
                    </div>
                    <div className="flex items-center justify-between py-2 text-xs">
                      <span className="text-gray-500">Origin / Terroir:</span>
                      <span className="font-black text-[#15191E] text-right truncate max-w-[170px]">{currentProduct.origin}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddProduct(currentProduct)}
                    className="w-full py-3.5 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-extrabold uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>
                      {addedSkuId === currentProduct.id ? 'Added to Bag ✓' : `Add ${activeVariant === 'coffee' ? 'Coffee' : 'Matcha'} • $${currentProduct.price.toFixed(0)}`}
                    </span>
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 4: STANDOUT FEATURE ANATOMY & EXPLODED VIEW (58% -> 78% Scroll)
            Inspired directly by "What makes Urban stand out" in reference video
        ========================================================================= */}
        <div
          className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center"
          style={{
            opacity: stage4Opacity,
            transform: `translate3d(0, ${stage4Y}px, 0)`,
            display: stage4Opacity <= 0 ? 'none' : 'flex',
            paddingTop: `${TOP_BARS}px`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
            {/* Header */}
            <div className="text-center mb-8 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>03 // UNRIVALED CRAFTSMANSHIP</span>
              </div>
              <h2 className="font-sans font-black text-3xl sm:text-5xl text-[#15191E] tracking-tight uppercase">
                WHAT MAKES LUFF STAND OUT
              </h2>
              <p className="text-sm sm:text-base text-[#15191E]/70 font-editorial-serif italic mt-1">
                The essential formula for calm cognitive energy and clean biological stamina.
              </p>
            </div>

            {/* Exploded feature badges flanking the explosive powder burst */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Flank (3 Feature Callouts) */}
              <div className="lg:col-span-4 pointer-events-auto flex flex-col gap-4">
                {[
                  {
                    num: '01',
                    title: 'Single-Estate Kyoto Terroir',
                    desc: 'Harvested exclusively in Uji river valley. Shaded under straw reeds for 28 continuous days.',
                    tag: 'Spring First Flush',
                  },
                  {
                    num: '02',
                    title: '1,500mg Dual-Extract Mushrooms',
                    desc: '100% organic fruiting bodies of Lion’s Mane & Reishi for memory, neurogenesis, and cortisol balance.',
                    tag: 'Potent Bioavailability',
                  },
                  {
                    num: '03',
                    title: 'Granite Stone-Milled',
                    desc: 'Slowly milled to 5 microns at 35 grams per hour to protect fragile catechins and silky amino foam.',
                    tag: '5-Micron Grind',
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="bg-white/90 backdrop-blur-md border border-[#EAE3D8] p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-black text-[#E53935] tracking-widest">
                        // {item.num}
                      </span>
                      <span className="text-[10px] font-mono font-semibold bg-[#F4EFE6] px-2 py-0.5 rounded-md text-[#15191E]/80">
                        {item.tag}
                      </span>
                    </div>
                    <div className="text-sm font-black text-[#15191E] mb-1">
                      {item.title}
                    </div>
                    <p className="text-xs text-[#15191E]/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Center space where powder burst is happening on canvas */}
              <div className="hidden lg:block lg:col-span-4" />

              {/* Right Flank (3 Feature Callouts) */}
              <div className="lg:col-span-4 pointer-events-auto flex flex-col gap-4">
                {[
                  {
                    num: '04',
                    title: '6-Hour Jitter-Free Energy',
                    desc: 'Clean caffeine bound to high theanine promotes relaxed alpha brainwaves with zero sudden drop-off.',
                    tag: 'Zero Crash Flow',
                  },
                  {
                    num: '05',
                    title: 'Zero Bitterness Guarantee',
                    desc: 'Vibrant jade chlorophyll and high L-theanine provide sweet umami without chalky residue or added sugar.',
                    tag: 'Pure Umami Profile',
                  },
                  {
                    num: '06',
                    title: 'Low-Acid Digestive Comfort',
                    desc: 'Gentle on empty stomachs. No acid reflux or nausea, backed by our 30-day money-back guarantee.',
                    tag: 'Gut Friendly',
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="bg-white/90 backdrop-blur-md border border-[#EAE3D8] p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-black text-[#E53935] tracking-widest">
                        // {item.num}
                      </span>
                      <span className="text-[10px] font-mono font-semibold bg-[#F4EFE6] px-2 py-0.5 rounded-md text-[#15191E]/80">
                        {item.tag}
                      </span>
                    </div>
                    <div className="text-sm font-black text-[#15191E] mb-1">
                      {item.title}
                    </div>
                    <p className="text-xs text-[#15191E]/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 5: THE DAILY RITUAL (78% -> 95% Scroll)
            3-Step preparation guide sliding gracefully over settling powder
        ========================================================================= */}
        <div
          className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center"
          style={{
            opacity: stage5Opacity,
            transform: `translate3d(0, ${stage5Y}px, 0)`,
            display: stage5Opacity <= 0 ? 'none' : 'flex',
            paddingTop: `${TOP_BARS}px`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
            <div className="text-center mb-10 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>04 // 15-SECOND PREPARATION</span>
              </div>
              <h2 className="font-sans font-black text-3xl sm:text-5xl text-[#15191E] tracking-tight uppercase">
                THE DAILY RITUAL
              </h2>
              <p className="text-sm sm:text-base text-[#15191E]/70 font-editorial-serif italic mt-1">
                Three simple steps to unlock sustained cognitive flow and calm energy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
              {[
                {
                  step: '01',
                  title: 'Scoop',
                  desc: '1 tsp (2g) of stone-milled powder into your favorite cup or chawan.',
                  spec: 'Dissolves effortlessly without clumps',
                  icon: Sparkles,
                  color: 'bg-[#D8E8F5] text-[#15191E]',
                },
                {
                  step: '02',
                  title: 'Pour & Whisk',
                  desc: 'Add 60ml warm water or plant milk (80°C). Whisk or froth for 15 seconds.',
                  spec: 'Forms velvety jade micro-foam crema',
                  icon: Flame,
                  color: 'bg-[#FDECEB] text-[#E53935]',
                },
                {
                  step: '03',
                  title: 'Sip & Flow',
                  desc: 'Experience 4 to 6 hours of clean alpha-wave focus with zero crash.',
                  spec: 'Calm alertness with adaptogens',
                  icon: Zap,
                  color: 'bg-[#EBF3EE] text-[#4A7C59]',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="bg-white/95 backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-sans font-black text-3xl text-[#15191E]/25">
                          {item.step}
                        </span>
                        <div className={`p-2.5 rounded-xl ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="font-sans font-black text-xl text-[#15191E] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#15191E]/75 leading-relaxed mb-4">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#EAE3D8] text-[11px] font-mono text-gray-500">
                      ✓ {item.spec}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Global Floating Variant Switcher (Bottom Right Anchor) */}
        <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md border border-[#EAE3D8] p-1.5 rounded-full shadow-md flex items-center gap-1">
            {(['studio', 'coffee'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveVariant(v)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  activeVariant === v
                    ? 'bg-[#E53935] text-white shadow-xs'
                    : 'text-[#15191E]/70 hover:text-[#15191E]'
                }`}
              >
                {SEQUENCES[v].label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Progress Bar at the Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent z-30 pointer-events-none">
          <div
            className="h-full bg-[#E53935] transition-all duration-75"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

      </div>
    </section>
  );
};
