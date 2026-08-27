import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { useLUFFStore } from './lib/store/useStore';
import { AnnouncementBar } from './components/nav/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { FullPageScrollStage } from './components/hero/FullPageScrollStage';
import { ImmersiveProductShowcase } from './components/store/ImmersiveProductShowcase';
import { CustomerReviewsSection } from './components/reviews/CustomerReviewsSection';
import { FAQSection } from './components/contact/FAQSection';
import { ContactSection } from './components/contact/ContactSection';
import { NewsletterFooter } from './components/NewsletterFooter';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CheckoutModal } from './components/store/CheckoutModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LegalModal } from './components/legal/LegalModal';
import { WhatsAppWidget } from './components/nav/WhatsAppWidget';
import { CookieConsentBanner } from './components/nav/CookieConsentBanner';
import { Toast } from './components/Toast';

export default function App() {
  const store = useLUFFStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

  // Which top-level view is showing (legal views render over the landing page)
  const viewKey: 'admin' | 'faq' | 'contact' | 'landing' =
    store.activeView === 'admin' ? 'admin'
    : store.activeView === 'faq' ? 'faq'
    : store.activeView === 'contact' ? 'contact'
    : 'landing';

  // Lenis smooth scroll (skipped under reduced-motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, []);

  // Smooth-scroll helper (Lenis when available, native fallback)
  const scrollTo = useCallback((target: string | number) => {
    const l = lenisRef.current;
    if (l) {
      l.scrollTo(target as never, { offset: typeof target === 'number' ? 0 : -80, duration: 1.0 });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Reset to the top after a view transition finishes (once the old view has unmounted)
  const resetTop = useCallback(() => {
    const l = lenisRef.current;
    if (l) l.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#15191E] flex flex-col selection:bg-[#E53935] selection:text-white font-sans">
      
      {/* 1. Top Free Shipping Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Glass DTC Header */}
      <Navbar
        cart={store.cart}
        activeView={store.activeView}
        setActiveView={store.setActiveView}
        onOpenCart={() => setIsCartOpen(true)}
        scrollTo={scrollTo}
      />

      {/* 3. Main View Router — opacity-only transitions (no transform: keeps the sticky hero intact) */}
      <main className="flex-1">
        <AnimatePresence mode="wait" onExitComplete={resetTop}>
          <motion.div
            key={viewKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {viewKey === 'admin' ? (
              <AdminDashboard
                products={store.products}
                orders={store.orders}
                promos={store.promos}
                onAddProduct={store.addProduct}
                onUpdateProduct={store.updateProduct}
                onDeleteProduct={store.deleteProduct}
                onUpdateOrderStatus={store.updateOrderStatus}
                onAddPromoCode={store.addPromoCode}
                onTogglePromoActive={store.togglePromoActive}
                onBackToStore={() => store.setActiveView('landing')}
              />
            ) : viewKey === 'faq' ? (
              <div className="pt-8">
                <FAQSection />
                <ContactSection onNotify={store.showToast} />
              </div>
            ) : viewKey === 'contact' ? (
              <div className="pt-8">
                <ContactSection onNotify={store.showToast} />
                <FAQSection />
              </div>
            ) : (
              /* MAIN DTC LANDING PAGE & SHOP */
              <>
                {/* 1. Full-Page Multi-Stage Pinned 3D Scroll Journey */}
                <FullPageScrollStage
                  products={store.products}
                  onAddToCart={store.addToCart}
                  onExplore={() => scrollTo('#catalog')}
                  scrollTo={scrollTo}
                />

                {/* 2. Immersive Dynamic Product Showcase with Color-Morphing Stage */}
                <ImmersiveProductShowcase
                  products={store.products}
                  cart={store.cart}
                  onAddToCart={store.addToCart}
                  onUpdateCartQty={store.updateCartQty}
                  onOpenQuickView={(p) => store.setQuickViewProduct(p)}
                />

                {/* 3. Customer Reviews (3 Cards with 5 Red Stars) */}
                <CustomerReviewsSection />

                {/* 4. Expandable FAQ Accordion */}
                <FAQSection />

                {/* 5. Contact Section */}
                <ContactSection onNotify={store.showToast} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Footer Banner & Legal Navigation */}
      {store.activeView !== 'admin' && (
        <NewsletterFooter
          onNotify={store.showToast}
          onOpenLegal={(legalView) => store.setActiveView(legalView)}
        />
      )}

      {/* 5. Floating Circular WhatsApp Chat Bubble */}
      <WhatsAppWidget />

      {/* 6. Cookie Consent Banner */}
      <CookieConsentBanner onOpenPolicy={(view) => store.setActiveView(view)} />

      {/* 7. Legal Compliance Suite Modal */}
      <LegalModal
        activeView={store.activeView}
        onClose={() => store.setActiveView('landing')}
      />

      {/* 8. Order Bag Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={store.cart}
        cartSubtotal={store.cartSubtotal}
        cartDiscount={store.cartDiscount}
        shippingCost={store.shippingCost}
        estimatedTax={store.estimatedTax}
        cartTotal={store.cartTotal}
        onUpdateQuantity={(idx, qty) => store.updateCartQty(store.cart[idx].product.id, qty - store.cart[idx].quantity)}
        onRemoveItem={store.removeFromCart}
        onClearCart={store.clearCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 9. Express Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={store.cart}
        cartSubtotal={store.cartSubtotal}
        cartDiscount={store.cartDiscount}
        shippingCost={store.shippingCost}
        estimatedTax={store.estimatedTax}
        cartTotal={store.cartTotal}
        appliedPromo={store.appliedPromo}
        activeShipping={store.activeShipping}
        onApplyPromo={store.applyPromoCode}
        onSelectShipping={store.setActiveShipping}
        onPlaceOrder={store.placeOrder}
      />

      {/* 10. Product Detail & Quick View Modal */}
      <ProductDetailModal
        product={store.quickViewProduct}
        onClose={() => store.setQuickViewProduct(null)}
        onAddToCart={store.addToCart}
      />

      {/* 11. Toast Notifications */}
      <Toast
        message={store.toastMessage}
        onClose={() => store.showToast('')}
      />

    </div>
  );
}
