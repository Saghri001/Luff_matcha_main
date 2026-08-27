import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { CartItem, ActiveView } from '../lib/store/types';

interface NavbarProps {
  cart: CartItem[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenCart: () => void;
  scrollTo?: (target: string | number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cart, activeView, setActiveView, onOpenCart, scrollTo }) => {
  const goToHash = (href: string, view: ActiveView) => {
    // Dedicated views (faq/contact) render their section at the top — the view
    // transition resets scroll, so no hash-scroll needed (and the target isn't
    // mounted yet mid-transition). Only anchor-scroll within the landing page.
    if (!href.startsWith('#') || view !== 'landing') return;
    const delay = activeView === 'landing' ? 60 : 520; // wait for transition + mount if switching in
    setTimeout(() => {
      if (scrollTo) scrollTo(href);
      else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, delay);
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop Blends', view: 'landing' as ActiveView, href: '#catalog' },
    { label: 'The Ritual', view: 'landing' as ActiveView, href: '#ritual' },
    { label: 'Sourcing', view: 'landing' as ActiveView, href: '#sourcing' },
    { label: 'FAQ', view: 'faq' as ActiveView, href: '#faq' },
    { label: 'Contact', view: 'contact' as ActiveView, href: '#contact' },
  ];

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs border-b border-[#EAE3D8]'
          : 'py-4 bg-[#FAF7F2] border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => {
            setActiveView('landing');
            if (scrollTo) scrollTo(0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          id="brand-logo-link"
          className="flex items-center gap-2 group text-left"
        >
          <span className="font-sans font-black text-3xl sm:text-4xl tracking-tighter text-[#E53935] hover:opacity-90 transition-opacity">
            LUFF
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                setActiveView(link.view);
                goToHash(link.href, link.view);
              }}
              className="text-xs uppercase font-extrabold tracking-wider text-[#15191E] hover:text-[#E53935] transition-colors relative py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E53935] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <motion.button
            id="cart-trigger-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#15191E] text-white hover:bg-black transition-all text-xs font-bold shadow-xs"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#E53935]" />
            <span className="hidden sm:inline font-mono uppercase tracking-wider">Bag</span>
            <AnimatePresence mode="wait">
              {totalItemCount > 0 ? (
                <motion.span
                  key={totalItemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E53935] text-white text-[10px] font-black font-mono shadow-xs"
                >
                  {totalItemCount}
                </motion.span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#E53935]" />
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#15191E] hover:bg-[#EAE3D8]/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[88px] z-30 bg-[#FAF7F2] border-b border-[#EAE3D8] p-6 shadow-xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setActiveView(link.view);
                    setMobileMenuOpen(false);
                    goToHash(link.href, link.view);
                  }}
                  className="text-left font-extrabold text-base uppercase tracking-wider text-[#15191E] hover:text-[#E53935] py-2.5 border-b border-[#EAE3D8] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#E53935]" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
