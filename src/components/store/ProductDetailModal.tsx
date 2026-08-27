import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Check } from 'lucide-react';
import { ProductItem } from '../../lib/store/types';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem, options?: { milk?: string; sweetness?: string; qty?: number }) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  if (!product) return null;

  const isSoldOut = product.stockCount <= 0;
  const isMatcha = product.id.includes('matcha');
  const auraColor = isMatcha ? 'rgba(116, 178, 76, 0.25)' : 'rgba(229, 57, 53, 0.22)';
  const currentPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price;

  const handleAdd = () => {
    onAddToCart(product, { qty });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white text-[#15191E] rounded-3xl shadow-2xl overflow-hidden border border-[#EAE3D8]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#15191E] shadow-sm hover:shadow-md border border-[#EAE3D8] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Image Stage - Warm Cream with Soft Product Aura (NOT BLACK) */}
            <div
              className="relative w-full md:w-1/2 h-72 md:h-auto min-h-[320px] bg-[#FAF7F2] flex items-center justify-center p-8 overflow-hidden"
            >
              {/* Soft Ambient Product Aura */}
              <div
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-80 pointer-events-none"
                style={{ backgroundColor: auraColor }}
              />

              <img
                src={product.image}
                alt={product.name}
                className="relative z-10 w-full h-full max-h-[260px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.14)] select-none"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 border border-[#EAE3D8] text-[#E53935] text-[10px] font-mono font-black uppercase tracking-wider shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info Body */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between gap-5 bg-white">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#4A7C59] uppercase tracking-wider">
                    {product.origin || 'Kyoto Harvest'}
                  </span>
                  {isSoldOut ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-black uppercase">
                      SOLD OUT
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#4A7C59]/10 text-[#4A7C59] text-[10px] font-mono font-bold">
                      IN STOCK
                    </span>
                  )}
                </div>

                <h3 className="font-sans font-black text-2xl text-[#15191E] leading-tight">
                  {product.name.replace(/^LUFF\s+Organic\s+/i, '').replace(/^LUFF\s+/i, '')}
                </h3>

                <div className="flex items-baseline gap-2">
                  <span className="font-sans font-black text-3xl text-[#E53935]">
                    ${currentPrice.toFixed(0)}
                  </span>
                  {product.volumeOrWeight && (
                    <span className="text-xs font-mono text-gray-500">
                      / {product.volumeOrWeight}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#15191E]/75 leading-relaxed font-sans mt-1">
                  {product.longDescription || product.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs font-mono">
                  {product.caffeineMg !== undefined && (
                    <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE3D8]">
                      <span className="text-gray-500 text-[10px] block font-mono font-bold uppercase tracking-wider">
                        CAFFEINE
                      </span>
                      <span className="font-bold text-[#15191E] font-sans text-sm mt-0.5 block">
                        {product.caffeineMg}mg Clean
                      </span>
                    </div>
                  )}
                  {product.lTheanineMg !== undefined && (
                    <div className="bg-[#EBF3EE] p-3 rounded-2xl border border-[#DCEADE]">
                      <span className="text-[#4A7C59] text-[10px] block font-mono font-bold uppercase tracking-wider">
                        L-THEANINE
                      </span>
                      <span className="font-bold text-[#4A7C59] font-sans text-sm mt-0.5 block">
                        {product.lTheanineMg}mg Calm
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button & Stepper Bar */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#EAE3D8]">
                {/* Stepper */}
                <div className="flex items-center bg-[#FAF7F2] border border-[#EAE3D8] rounded-full p-1 font-mono text-xs shadow-2xs">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center font-bold text-[#15191E] hover:bg-white rounded-full transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 font-mono font-black text-sm text-[#15191E]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center font-bold text-[#15191E] hover:bg-white rounded-full transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  disabled={isSoldOut}
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-full font-sans font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${
                    isSoldOut
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#E53935] hover:bg-[#C62828] text-white'
                  }`}
                >
                  {addedAnim ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isSoldOut ? 'Sold Out' : `Add to Bag • $${(currentPrice * qty).toFixed(0)}`}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
