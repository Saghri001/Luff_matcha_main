import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Truck, RefreshCw, Cookie } from 'lucide-react';
import { ActiveView } from '../../lib/store/types';

interface LegalModalProps {
  activeView: ActiveView;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ activeView, onClose }) => {
  const isLegalView = ['privacy', 'cookie', 'terms', 'shipping', 'returns'].includes(activeView);

  if (!isLegalView) return null;

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      body: `At LUFF Matcha ("LUFF", "we", "our"), we take your privacy and data security seriously. This Privacy Policy outlines how your personal information is collected, used, and protected when you visit or make a purchase from luffmatcha.com.

1. Information We Collect:
When you place an order or create an account, we collect transaction information including your name, billing address, shipping address, email address, and phone number. We do not store raw credit card numbers; payment data is securely processed via PCI-DSS compliant payment gateways.

2. How We Use Your Information:
We use your information to fulfill orders, arrange shipping, provide order status updates, process payments, and communicate promotional offers (if opted-in).

3. Data Sharing & Protection:
Your information is never sold to third parties. We share data only with essential operational service providers (e.g. shipping carriers like UPS/FedEx and secure payment processors).`,
    },
    cookie: {
      title: 'Cookie Policy',
      icon: Cookie,
      body: `This Cookie Policy explains how LUFF Matcha uses cookies and similar tracking technologies to recognize you when you visit our website.

1. What Are Cookies?
Cookies are small data files placed on your computer or mobile device when you visit a website. They are widely used to make websites work efficiently and provide reporting analytics.

2. Types of Cookies We Use:
- Essential Cookies: Necessary for core site functionality, cart persistence, and secure checkout.
- Performance & Analytics Cookies: Help us measure visitor interaction, page load speeds, and cart completion rates.

3. Managing Cookies:
You can choose to accept or decline non-essential cookies via our Cookie Consent Banner or by adjusting your browser settings.`,
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      body: `Welcome to LUFF Matcha. By using our website and purchasing our ceremonial matcha products, you agree to comply with and be bound by the following Terms and Conditions.

1. Product Specifications & Usage:
LUFF Ceremonial Matcha is 100% organic Uji green tea powder. Storage instructions (refrigeration after opening away from direct sunlight) should be followed for peak freshness.

2. Orders & Pricing:
All prices are displayed in USD and are subject to applicable state taxes and shipping fees. We reserve the right to decline or cancel orders in cases of pricing errors or inventory stockouts.

3. Intellectual Property:
All content, 3D animations, logos, photography, and text on this website are the exclusive property of LUFF Matcha.`,
    },
    shipping: {
      title: 'Shipping Policy',
      icon: Truck,
      body: `We craft and ship all LUFF Matcha orders directly from our Kyoto-supplied distribution hub in New York.

1. Shipping Rates & Delivery Times:
- Standard Eco Ground (3-5 Business Days): $4.99 (FREE on orders over $60.00).
- Express Cold-Chain (1-2 Business Days): $9.99 (Dispatched in temperature-controlled insulated pouches).
- Flagship Store Pickup: Complimentary pickup at 412 Creative Blvd, New York, NY 10013.

2. Tracking & Dispatch:
Orders placed before 2:00 PM EST ship the same business day. You will receive an automated tracking link via email as soon as your package leaves our facility.`,
    },
    returns: {
      title: 'Returns & Refund Policy',
      icon: RefreshCw,
      body: `We are committed to your complete satisfaction with LUFF Matcha.

1. 30-Day Freshness Guarantee:
If you are unsatisfied with the quality or taste of your ceremonial matcha canister, you may request a replacement or full refund within 30 days of purchase.

2. Return Eligibility:
For food safety reasons, opened tea tins are covered under our 30-day taste guarantee without requiring return shipping of used powder. Unopened accessories (chasen whisks, chawan ceramic bowls) must be returned in original packaging.

3. Refund Processing:
Refunds are processed to your original payment method within 3 to 5 business days upon approval.`,
    },
  };

  const currentContent = contentMap[activeView as keyof typeof contentMap] || contentMap.privacy;
  const IconComponent = currentContent.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#FAF7F2] text-[#15191E] rounded-3xl shadow-2xl overflow-hidden border border-[#F4EFE6]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-[#15191E] text-white border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#E53935] text-white">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl">{currentContent.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Policy Text Body */}
          <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto font-sans text-sm text-[#15191E]/90 leading-relaxed whitespace-pre-line space-y-4">
            {currentContent.body}
          </div>

          {/* Footer Close */}
          <div className="p-4 bg-white border-t border-[#F4EFE6] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#15191E] hover:bg-[#15191E] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Close Policy
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
