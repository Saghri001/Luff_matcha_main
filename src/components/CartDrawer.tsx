import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem, ShippingOption } from '../lib/store/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartSubtotal: number;
  cartDiscount: number;
  shippingCost: number;
  estimatedTax: number;
  cartTotal: number;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  cartSubtotal,
  cartDiscount,
  shippingCost,
  estimatedTax,
  cartTotal,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#FAF7F2] text-[#15191E] shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#F4EFE6] flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F4EFE6] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#E53935]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-[#15191E]">
                    Your Order Bag
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {cart.reduce((s, i) => s + i.quantity, 0)} TOTAL ITEMS
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="bg-[#F4EFE6] px-6 py-3 border-b border-[#EAE3D8]">
              <div className="flex justify-between items-center text-xs font-bold text-[#15191E] mb-1">
                <span>
                  {cartSubtotal < 60
                    ? `Add $${(60 - cartSubtotal).toFixed(2)} more for Free Shipping`
                    : '🎉 You unlocked Free Standard Shipping!'}
                </span>
                <span className="text-[#E53935] font-black font-mono">
                  {Math.min(100, Math.round((cartSubtotal / 60) * 100))}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#4A7C59] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartSubtotal / 60) * 100)}%` }}
                />
              </div>
            </div>

            {/* Body Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F4EFE6] border-2 border-dashed border-[#EAE3D8] flex items-center justify-center mx-auto text-2xl">
                    🍵
                  </div>
                  <h4 className="font-display font-black text-lg text-[#15191E]">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto font-sans">
                    Explore our single-origin Uji matcha canisters, organic mushroom blends, and artisan whisking gear.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-[#E53935] text-white text-xs font-bold shadow-sm"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                cart.map((item, index) => {
                  const p = item.product.isOnSale && item.product.salePrice ? item.product.salePrice : item.product.price;
                  return (
                    <motion.div
                      key={item.product.id + index}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-3 p-4 rounded-2xl bg-white border border-[#F4EFE6] relative shadow-sm"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-black text-xs sm:text-sm text-[#15191E] truncate pr-2">
                            {item.product.name}
                          </h4>
                          <span className="font-display font-black text-xs sm:text-sm text-[#E53935]">
                            ${(p * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="text-[10px] text-[#4A7C59] font-mono font-bold mt-0.5">
                          ${p.toFixed(2)} each
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1">
                          <div className="flex items-center border border-gray-200 bg-[#FAF7F2] rounded-lg overflow-hidden font-mono text-xs">
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 font-bold text-[#15191E]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-gray-400 hover:text-[#E53935] transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer Checkout Trigger */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[#F4EFE6] space-y-4">
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#15191E]">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#4A7C59] font-bold">
                      <span>Discount</span>
                      <span>-${cartDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500"><span>NYC Tax (8.875%)</span><span>${estimatedTax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-base font-black text-[#15191E] pt-2 border-t border-gray-200 font-display">
                    <span>Total</span>
                    <span className="text-[#E53935]">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="w-full py-4 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/20"
                >
                  <span>Proceed to Express Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4A7C59]" />
                  <span>256-BIT SECURE CHECKOUT</span>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
