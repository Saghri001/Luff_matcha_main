import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
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

/** Pure Ceremonial Matcha frame sequence */
const SEQUENCE = {
  id: 'studio',
  label: 'Ceremonial Matcha',
  badge: 'Uji First Flush',
  glowColor: 'rgba(116, 178, 76, 0.28)',
  glowSolid: '#74B24C',
  desktop: { dir: '/hero-frames/studio/desktop', count: 150 },
  mobile: { dir: '/hero-frames/studio/mobile', count: 100 },
} as const;

const TOP_BARS = 106;

const framePath = (dir: string, i: number) =>
  `${dir}/f_${String(i + 1).padStart(3, '0')}.webp`;

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

  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [addedSkuId, setAddedSkuId] = useState<string | null>(null);

  const isMobile =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
  const cfg = SEQUENCE[isMobile ? 'mobile' : 'desktop'];

  // Product references - Matcha is the flagship
  const matchaProduct = products.find((p) => p.id.includes('matcha')) || products[0];

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

  // Preload frames progressively
  useEffect(() => {
    let cancelled = false;
    const totalFrames = cfg.count;
    imagesRef.current = new Array(totalFrames);
    loadedRef.current = new Array(totalFrames).fill(false);
    setReady(false);

    // Safety fallback timer to ensure page never hangs on spinner
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) {
        setReady(true);
        sizeCanvas();
        renderFrame(currentProgressRef.current);
      }
    }, 400);

    // Initial critical frames
    const initialIndices = [0, 1, 2, 5, 10, 20, 40, 70, 100, 149];
    let loadedCount = 0;

    const checkInitialReady = () => {
      if (cancelled) return;
      if (loadedRef.current[0] || loadedCount > 0) {
        setReady(true);
        sizeCanvas();
        renderFrame(currentProgressRef.current);
      }
    };

    initialIndices.forEach((i) => {
      if (i >= totalFrames) return;
      const img = new Image();
      img.src = framePath(cfg.dir, i);
      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[i] = img;
        loadedRef.current[i] = true;
        loadedCount++;
        checkInitialReady();
      };
    });

    // Background load all remaining frames
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(() => loadRemaining())
      : setTimeout(() => loadRemaining(), 300);

    function loadRemaining() {
      for (let i = 0; i < totalFrames; i++) {
        if (cancelled) break;
        if (!imagesRef.current[i]) {
          const img = new Image();
          img.src = framePath(cfg.dir, i);
          img.onload = () => {
            if (cancelled) return;
            imagesRef.current[i] = img;
            loadedRef.current[i] = true;
          };
        }
      }
    }

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      if (typeof idleId === 'number') clearTimeout(idleId);
    };
  }, [cfg.count, cfg.dir, renderFrame, sizeCanvas]);

  // Window resize observer
  useEffect(() => {
    const handleResize = () => {
      sizeCanvas();
      renderFrame(currentProgressRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrame, sizeCanvas]);

  // Scroll listener tracking container progress
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const p = clamp(-rect.top / totalScrollable, 0, 1);
      currentProgressRef.current = p;
      setProgress(p);

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        renderFrame(p);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [renderFrame]);

  // Interpolated stages
  const stage1Opacity = 1 - smooth(0.12, 0.22, progress);
  const stage1Y = lerp(0, -50, smooth(0.12, 0.22, progress));

  const stage2In = smooth(0.18, 0.28, progress);
  const stage2Out = smooth(0.36, 0.44, progress);
  const stage2Opacity = stage2In * (1 - stage2Out);
  const stage2Y = lerp(40, -40, stage2Out);

  const stage3In = smooth(0.38, 0.48, progress);
  const stage3Out = smooth(0.58, 0.66, progress);
  const stage3Opacity = stage3In * (1 - stage3Out);
  const stage3Y = lerp(40, -40, stage3Out);

  const stage4In = smooth(0.60, 0.70, progress);
  const stage4Out = smooth(0.78, 0.86, progress);
  const stage4Opacity = stage4In * (1 - stage4Out);
  const stage4Y = lerp(40, -40, stage4Out);

  const stage5In = smooth(0.82, 0.90, progress);
  const stage5Opacity = stage5In;
  const stage5Y = lerp(40, 0, stage5In);

  const isStage3Active = stage3Opacity > 0.15;
  const isStage4Active = stage4Opacity > 0.15;
  const isStage5Active = stage5Opacity > 0.15;

  if (reduced) {
    return (
      <section className="relative w-full bg-[#FAF7F2] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4EFE6] border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-bold uppercase tracking-widest mb-6">
              <span>Kyoto First Harvest • 100% Organic Tencha</span>
            </div>
            <h1 className="font-sans font-black text-4xl sm:text-6xl text-[#15191E] tracking-tight uppercase leading-[0.95] mb-6">
              Energy without the jitters.
            </h1>
            <p className="text-lg text-[#15191E]/80 font-editorial-serif italic mb-8 max-w-xl">
              Ceremonial Uji matcha stone-milled with 1,500mg dual-extracted Lion’s Mane & Reishi.
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
              src={framePath(SEQUENCE.desktop.dir, 78)}
              alt="LUFF powder burst"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="hero-stage"
      className="relative w-full h-[520vh] bg-[#FAF7F2]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">

        {/* Ambient Aura Background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-colors duration-700 flex items-center justify-center"
        >
          <div
            className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full blur-[140px] opacity-70 transition-all duration-700"
            style={{ backgroundColor: SEQUENCE.glowColor }}
          />
        </div>

        {/* Canvas for Scrolled Stone-Milled Frame Sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Loading Spinner */}
        {!ready && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#FAF7F2]/90 backdrop-blur-md">
            <div className="w-10 h-10 border-3 border-[#EAE3D8] border-t-[#E53935] rounded-full animate-spin mb-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#15191E]/60">
              Stone-milling ceremonial frames...
            </span>
          </div>
        )}

        {/* =========================================================================
            STAGE 1: EDITORIAL HERO LANDING (Single-Viewport Stage)
        ========================================================================= */}
        <div
          className="absolute top-[106px] bottom-0 left-0 right-0 h-[calc(100svh-106px)] z-10 pointer-events-none flex flex-col justify-center py-4"
          style={{
            opacity: stage1Opacity,
            transform: `translate3d(0, ${stage1Y}px, 0)`,
            display: stage1Opacity <= 0 ? 'none' : 'flex',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Left Column Content */}
              <div className="lg:col-span-6 pointer-events-auto text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-3 shadow-2xs">
                  <span>01 // KYOTO FIRST HARVEST • 100% ORGANIC</span>
                </div>

                <h1 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#15191E] uppercase leading-[0.94] mb-3 drop-shadow-xs">
                  ENERGY WITHOUT THE JITTERS.
                </h1>

                <p className="text-sm sm:text-base text-[#15191E]/80 max-w-lg font-editorial-serif italic mb-5 leading-relaxed">
                  Single-estate ceremonial Uji matcha & adaptogenic mushrooms, stone-milled to 5 microns on granite wheels.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleAddProduct(matchaProduct)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <span>
                      {addedSkuId === matchaProduct.id ? 'Added to Bag ✓' : 'Add Matcha Tin • $28'}
                    </span>
                    <ShoppingBag className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => scrollTo('#catalog')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 hover:bg-white border border-[#EAE3D8] text-[#15191E] font-extrabold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-2xs"
                  >
                    <span>Explore Blends</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E53935]" />
                  </button>
                </div>

                {/* Rating Badge */}
                <div className="mt-5 flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#E53935] text-[#E53935]" />
                    ))}
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#15191E]/75 uppercase tracking-wide">
                    4.9/5 Rating from 1,200+ Creators
                  </span>
                </div>
              </div>

              {/* Right Column: Subtle watermark */}
              <div className="hidden lg:flex lg:col-span-6 flex-col items-end justify-between h-full pointer-events-auto">
                <div className="text-right">
                  <span className="font-sans font-black text-[12vw] leading-none text-[#15191E]/[0.04] select-none block">
                    LUFF
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 2: KINETIC IDENTITY & VALUE PILLARS
        ========================================================================= */}
        <div
          className="absolute top-[106px] bottom-0 left-0 right-0 h-[calc(100svh-106px)] z-10 pointer-events-none flex flex-col justify-between py-6 pb-12"
          style={{
            opacity: stage2Opacity,
            transform: `translate3d(0, ${stage2Y}px, 0)`,
            display: stage2Opacity <= 0 ? 'none' : 'flex',
          }}
        >
          {/* Top kinetic banner flowing behind/above product */}
          <div className="w-full overflow-hidden select-none opacity-30">
            <div className="whitespace-nowrap font-sans font-black text-6xl sm:text-8xl tracking-tighter uppercase text-[#15191E]">
              CEREMONIAL MATCHA • SINGLE-ESTATE UJI • ADAPTOGENIC NOOTROPICS • LION'S MANE •
            </div>
          </div>

          {/* Central Callout Banner (Left and Right balanced) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFE6] text-[#E53935] text-xs font-mono font-bold uppercase mb-3">
                  <span>YOUR DAILY COMPANION</span>
                </div>
                <h2 className="font-sans font-black text-2xl sm:text-4xl text-[#15191E] tracking-tight uppercase leading-tight mb-3">
                  ONE UNCOMPROMISING RITUAL.
                </h2>
                <p className="text-sm text-[#15191E]/75 font-editorial-serif italic leading-relaxed">
                  Crafted for high-output creators who demand steady, jitter-free focus without the bitter aftertaste.
                </p>
              </div>

              {/* 4 Pillars Grid on the other side */}
              <div className="pointer-events-auto grid grid-cols-2 gap-3">
                {[
                  { label: '100% Organic Tencha', sub: 'Single Estate Uji', icon: Leaf },
                  { label: '1,500mg Mushrooms', sub: 'Lion’s Mane & Reishi', icon: ShieldCheck },
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
            STAGE 3: THE ADAPTOGENIC SOLUTION & CLEAN ENERGY
        ========================================================================= */}
        <div
          className="absolute top-[106px] bottom-0 left-0 right-0 h-[calc(100svh-106px)] z-10 pointer-events-none flex flex-col justify-center py-4 pb-12"
          style={{
            opacity: stage3Opacity,
            transform: `translate3d(0, ${stage3Y}px, 0)`,
            display: stage3Opacity <= 0 ? 'none' : 'flex',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
            {/* Header */}
            <div className="text-center sm:text-left mb-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-2 shadow-xs">
                <span>02 // THE ADAPTOGENIC SOLUTION</span>
              </div>
              <h2 className="font-sans font-black text-3xl sm:text-5xl text-[#15191E] tracking-tight uppercase">
                LUFF’S SOLUTION FOR SUSTAINED FLOW
              </h2>
              <p className="text-sm sm:text-base text-[#15191E]/70 font-editorial-serif italic mt-1 max-w-xl">
                Replace high-cortisol coffee crashes with calm, sustained cognitive endurance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column Card: Comparison / Why LUFF Outperforms */}
              <div
                className="lg:col-span-4 pointer-events-auto transition-all duration-500 ease-out"
                style={{
                  transform: isStage3Active ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.96)',
                  opacity: isStage3Active ? 1 : 0,
                  transitionDelay: '60ms',
                }}
              >
                <div className="bg-white/90 backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-black uppercase tracking-widest text-[#4A7C59]">
                      Clean Energy Formula
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[#EBF3EE] text-[#4A7C59] px-2 py-0.5 rounded-md">
                      Zero Crash
                    </span>
                  </div>

                  <h3 className="font-sans font-black text-xl text-[#15191E] mb-3">
                    Ceremonial Mushroom Matcha
                  </h3>

                  <div className="space-y-2.5 mb-4 text-xs font-sans">
                    <div className="flex items-start gap-2 text-[#15191E]/80">
                      <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
                      <span><strong>45mg Caffeine + 60mg L-Theanine:</strong> Smooth alpha-wave calm alertness without tremors.</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#15191E]/80">
                      <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
                      <span><strong>1,500mg Dual-Extract:</strong> Lion’s Mane & Reishi for neurogenesis and cortisol modulation.</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#15191E]/80">
                      <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
                      <span><strong>Alkaline Digestion:</strong> Zero stomach irritation, acidity, or afternoon fatigue.</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EAE3D8] flex items-center justify-between text-xs font-mono text-gray-500">
                    <span>Terroir: Uji, Kyoto</span>
                    <span className="font-bold text-[#15191E]">Grade: Ceremonial</span>
                  </div>
                </div>
              </div>

              {/* Center space is occupied by the 3D canvas tin */}
              <div className="hidden lg:block lg:col-span-4" />

              {/* Right Column Card: Active Formula Specs Card */}
              <div
                className="lg:col-span-4 pointer-events-auto transition-all duration-500 ease-out"
                style={{
                  transform: isStage3Active ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.96)',
                  opacity: isStage3Active ? 1 : 0,
                  transitionDelay: '140ms',
                }}
              >
                <div className="bg-white/90 backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E53935]">
                      Active Blend Specs
                    </span>
                    <span className="text-xs font-mono font-semibold text-gray-400">
                      30g (~15 Servings)
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b border-[#EAE3D8]/80 text-xs">
                      <span className="text-gray-500">Caffeine Profile:</span>
                      <span className="font-black text-[#15191E]">45mg Smooth Release</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#EAE3D8]/80 text-xs">
                      <span className="text-gray-500">L-Theanine Nootropic:</span>
                      <span className="font-black text-[#15191E]">60mg (Alpha Wave)</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#EAE3D8]/80 text-xs">
                      <span className="text-gray-500">Functional Adaptogens:</span>
                      <span className="font-black text-[#15191E]">1,500mg Dual-Extract</span>
                    </div>
                    <div className="flex items-center justify-between py-2 text-xs">
                      <span className="text-gray-500">Origin / Terroir:</span>
                      <span className="font-black text-[#15191E] text-right truncate max-w-[170px]">Uji, Kyoto, Japan</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddProduct(matchaProduct)}
                    className="w-full py-3.5 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-extrabold uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {addedSkuId === matchaProduct.id ? 'Added to Bag ✓' : `Add Matcha • $${matchaProduct.price.toFixed(0)}`}
                    </span>
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 4: STANDOUT FEATURE ANATOMY & EXPLODED VIEW
        ========================================================================= */}
        <div
          className="absolute top-[106px] bottom-0 left-0 right-0 h-[calc(100svh-106px)] z-10 pointer-events-none flex flex-col justify-center py-2 pb-14"
          style={{
            opacity: stage4Opacity,
            transform: `translate3d(0, ${stage4Y}px, 0)`,
            display: stage4Opacity <= 0 ? 'none' : 'flex',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
            {/* Header */}
            <div className="text-center mb-4 sm:mb-5 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-[11px] font-mono font-black uppercase tracking-widest mb-1.5 shadow-2xs">
                <span>03 // UNRIVALED CRAFTSMANSHIP</span>
              </div>
              <h2 className="font-sans font-black text-2xl sm:text-4xl text-[#15191E] tracking-tight uppercase">
                WHAT MAKES LUFF STAND OUT
              </h2>
              <p className="text-xs sm:text-sm text-[#15191E]/70 font-editorial-serif italic mt-0.5">
                The essential formula for calm cognitive energy and clean biological stamina.
              </p>
            </div>

            {/* Exploded feature badges flanking the powder burst */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Left Flank (3 Feature Callouts) */}
              <div className="lg:col-span-4 pointer-events-auto flex flex-col gap-2.5 sm:gap-3">
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
                ].map((item, idx) => (
                  <div
                    key={item.num}
                    className="bg-white/90 backdrop-blur-md border border-[#EAE3D8] p-3.5 sm:p-4 rounded-2xl shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-out"
                    style={{
                      transform: isStage4Active ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
                      opacity: isStage4Active ? 1 : 0,
                      transitionDelay: `${idx * 80}ms`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-black text-[#E53935] tracking-widest">
                        // {item.num}
                      </span>
                      <span className="text-[10px] font-mono font-semibold bg-[#F4EFE6] px-2 py-0.5 rounded-md text-[#15191E]/80">
                        {item.tag}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-[#15191E] mb-0.5">
                      {item.title}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#15191E]/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Center Canvas Clearance */}
              <div className="hidden lg:block lg:col-span-4" />

              {/* Right Flank (3 Feature Callouts) */}
              <div className="lg:col-span-4 pointer-events-auto flex flex-col gap-2.5 sm:gap-3">
                {[
                  {
                    num: '04',
                    title: 'Zero Gut Acidity & Jitters',
                    desc: 'Naturally alkaline matcha pairs with L-theanine to prevent cortisol spike and digestive distress.',
                    tag: 'Alkaline pH',
                  },
                  {
                    num: '05',
                    title: 'Lab-Tested Purity',
                    desc: 'Triple-tested for heavy metals, pesticides, radiation, and biological contaminants. 100% clean.',
                    tag: 'Eurofins Verified',
                  },
                  {
                    num: '06',
                    title: 'Effortless 15-Sec Dissolve',
                    desc: '5-micron particulate dissolves completely into warm water or oat milk with no grit or clumping.',
                    tag: 'Velvety Crema',
                  },
                ].map((item, idx) => (
                  <div
                    key={item.num}
                    className="bg-white/90 backdrop-blur-md border border-[#EAE3D8] p-3.5 sm:p-4 rounded-2xl shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-out"
                    style={{
                      transform: isStage4Active ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
                      opacity: isStage4Active ? 1 : 0,
                      transitionDelay: `${(idx + 3) * 80}ms`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-black text-[#E53935] tracking-widest">
                        // {item.num}
                      </span>
                      <span className="text-[10px] font-mono font-semibold bg-[#F4EFE6] px-2 py-0.5 rounded-md text-[#15191E]/80">
                        {item.tag}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-[#15191E] mb-0.5">
                      {item.title}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#15191E]/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 5: 3-STEP DAILY RITUAL
        ========================================================================= */}
        <div
          className="absolute top-[106px] bottom-0 left-0 right-0 h-[calc(100svh-106px)] z-10 pointer-events-none flex flex-col justify-center py-4 pb-14"
          style={{
            opacity: stage5Opacity,
            transform: `translate3d(0, ${stage5Y}px, 0)`,
            display: stage5Opacity <= 0 ? 'none' : 'flex',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
            <div className="text-center mb-10 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D8] text-[#E53935] text-xs font-mono font-black uppercase tracking-widest mb-2 shadow-xs">
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
                  icon: Leaf,
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
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="bg-white/95 backdrop-blur-md border border-[#EAE3D8] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 flex flex-col justify-between transition-all duration-500 ease-out"
                    style={{
                      transform: isStage5Active ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.95)',
                      opacity: isStage5Active ? 1 : 0,
                      transitionDelay: `${idx * 120}ms`,
                    }}
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
