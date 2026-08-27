import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, Truck, Sparkles, Tag } from 'lucide-react';
import { CartItem, CustomerInfo, Order, ShippingOption, PromoCode } from '../../lib/store/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartSubtotal: number;
  cartDiscount: number;
  shippingCost: number;
  estimatedTax: number;
  cartTotal: number;
  appliedPromo: PromoCode | null;
  activeShipping: ShippingOption;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onSelectShipping: (opt: ShippingOption) => void;
  onPlaceOrder: (customer: CustomerInfo) => Order;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  cartSubtotal,
  cartDiscount,
  shippingCost,
  estimatedTax,
  cartTotal,
  appliedPromo,
  activeShipping,
  onApplyPromo,
  onSelectShipping,
  onPlaceOrder,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: 'Alex Mercer',
    email: 'alex.mercer@design.co',
    phone: '+1 (212) 555-0199',
    address: '412 Creative Boulevard, Apt 4B',
    city: 'New York',
    zipCode: '10013',
    country: 'United States',
  });
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = onApplyPromo(promoInput);
    setPromoStatus(res.message);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = onPlaceOrder(customer);
    setConfirmedOrder(order);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-[#FAF7F2] text-[#15191E] rounded-3xl shadow-2xl overflow-hidden border border-[#F4EFE6] max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-[#15191E] text-white border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#E53935] text-white">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl">LUFF Express Checkout</h3>
                <p className="text-xs text-gray-400 font-mono">256-BIT ENCRYPTED SECURE PAYMENT</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {confirmedOrder ? (
            /* ORDER CONFIRMATION SCREEN */
            <div className="p-8 flex flex-col items-center justify-center text-center gap-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-[#4A7C59]/20 text-[#4A7C59] flex items-center justify-center border border-[#4A7C59]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-display font-black text-3xl text-[#15191E]">
                Order Confirmed!
              </h2>
              <p className="text-sm text-gray-600 max-w-md">
                Thank you for your order, <strong className="text-[#15191E]">{confirmedOrder.customer.name}</strong>. An email receipt with live tracking details has been sent to <strong className="text-[#E53935]">{confirmedOrder.customer.email}</strong>.
              </p>

              <div className="bg-[#F4EFE6]/60 p-4 rounded-2xl border border-[#EAE3D8] font-mono text-xs text-[#15191E] w-full max-w-md text-left flex flex-col gap-1 my-2">
                <div className="flex justify-between font-bold"><span>ORDER NUMBER:</span><span className="text-[#E53935]">{confirmedOrder.id}</span></div>
                <div className="flex justify-between"><span>TOTAL PAID:</span><span>${confirmedOrder.total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>SHIPPING TO:</span><span>{confirmedOrder.customer.city}, {confirmedOrder.customer.country}</span></div>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-[#E53935] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-[#C62828]"
              >
                Back to Shopping
              </button>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <div className="overflow-y-auto p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
              {/* Customer Details Form */}
              <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col gap-4">
                <h4 className="font-display font-extrabold text-base text-[#15191E]">1. Delivery Details</h4>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="bg-white p-3 rounded-xl border border-gray-300 text-sm font-sans"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="bg-white p-3 rounded-xl border border-gray-300 text-sm font-sans"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="bg-white p-3 rounded-xl border border-gray-300 text-sm font-sans"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Shipping Address"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="bg-white p-3 rounded-xl border border-gray-300 text-sm font-sans"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="bg-white p-3 rounded-xl border border-gray-300 text-sm font-sans"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Zip / Postal Code"
                    value={customer.zipCode}
                    onChange={(e) => setCustomer({ ...customer, zipCode: e.target.value })}
                    className="bg-white p-3 rounded-xl border border-gray-300 text-sm font-sans"
                    required
                  />
                </div>

                <h4 className="font-display font-extrabold text-base text-[#15191E] pt-2">2. Payment Method</h4>
                <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#E53935]" />
                    <span className="text-xs font-bold text-[#15191E]">Credit Card / Apple Pay / PayPal</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#4A7C59]/20 text-[#4A7C59] rounded-full">
                    TEST MODE ACTIVE
                  </span>
                </div>

                <button
                  type="submit"
                  className="mt-4 py-4 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 border border-white/20"
                >
                  <Lock className="w-4 h-4" />
                  <span>Complete Order • ${cartTotal.toFixed(2)}</span>
                </button>
              </form>

              {/* Order Summary & Promo Sidebar */}
              <div className="w-full lg:w-80 bg-white p-6 rounded-2xl border border-[#F4EFE6] flex flex-col justify-between gap-6">
                <div>
                  <h4 className="font-display font-extrabold text-base text-[#15191E] mb-3">Order Summary</h4>
                  <div className="flex flex-col gap-3 max-h-44 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-md object-cover" />
                          <span className="font-bold">{item.quantity}x {item.product.name}</span>
                        </div>
                        <span className="font-mono font-bold">${((item.product.isOnSale && item.product.salePrice ? item.product.salePrice : item.product.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex flex-col gap-2">
                  <label className="text-[11px] font-mono text-gray-500 font-bold">PROMO CODE</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. LUFF15"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-[#FAF7F2] p-2.5 rounded-xl border border-gray-300 text-xs font-mono uppercase"
                    />
                    <button type="submit" className="px-4 py-2.5 bg-[#15191E] text-white font-bold text-xs rounded-xl">
                      Apply
                    </button>
                  </div>
                  {promoStatus && (
                    <p className="text-[11px] font-mono font-bold text-[#4A7C59]">{promoStatus}</p>
                  )}
                </form>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-3 flex flex-col gap-1 text-xs font-mono">
                  <div className="flex justify-between text-gray-500"><span>Subtotal:</span><span>${cartSubtotal.toFixed(2)}</span></div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#4A7C59]"><span>Discount ({appliedPromo?.code}):</span><span>-${cartDiscount.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between text-gray-500"><span>Shipping ({activeShipping.name.split(' ')[0]}):</span><span>${shippingCost.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Tax (NYC 8.875%):</span><span>${estimatedTax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-base font-bold text-[#15191E] pt-2 border-t border-gray-200 font-display"><span>Total:</span><span>${cartTotal.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
