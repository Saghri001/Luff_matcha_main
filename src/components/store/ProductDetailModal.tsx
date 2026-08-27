import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Sparkles, Check, Star, ShieldCheck, Zap } from 'lucide-react';
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
  const [selectedMilk, setSelectedMilk] = useState('Oat Milk (Oatly Barista)');
  const [selectedSweetness, setSelectedSweetness] = useState('Unsweetened (Pure Uji)');
  const [addedAnim, setAddedAnim] = useState(false);

  if (!product) return null;

  const isSoldOut = product.stockCount <= 0;

  const handleAdd = () => {
    onAddToCart(product, { milk: selectedMilk, sweetness: selectedSweetness, qty });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#FAF7F2] text-[#15191E] rounded-3xl shadow-2xl overflow-hidden border border-[#F4EFE6]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Image Header */}
            <div className="relative w-full md:w-1/2 h-72 md:h-auto bg-[#15191E]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#E53935] text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info Body */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#4A7C59] uppercase tracking-wider">
                    {product.origin || 'UJI, KYOTO HARVEST'}
                  </span>
                  {isSoldOut ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-black uppercase">
                      SOLD OUT
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#4A7C59]/20 text-[#4A7C59] text-[10px] font-mono font-bold">
                      IN STOCK ({product.stockCount})
                    </span>
                  )}
                </div>

                <h3 className="font-display font-black text-2xl text-[#15191E]">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-3xl text-[#E53935]">
                    ${product.isOnSale && product.salePrice ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
                  </span>
                  {product.isOnSale && product.salePrice && (
                    <span className="text-sm font-mono text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  {product.longDescription || product.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                  <div className="bg-[#F4EFE6]/60 p-2.5 rounded-xl border border-[#EAE3D8]">
                    <span className="text-gray-500 block">CAFFEINE</span>
                    <span className="font-bold text-[#15191E]">{product.caffeineMg || 68}mg Clean</span>
                  </div>
                  <div className="bg-[#EBF3EE] p-2.5 rounded-xl border border-[#EBF3EE]">
                    <span className="text-gray-500 block">L-THEANINE</span>
                    <span className="font-bold text-[#4A7C59]">{product.lTheanineMg || 48}mg Calm</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center bg-[#FAF7F2] border border-gray-300 rounded-full p-1 font-mono text-xs">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-7 h-7 flex items-center justify-center font-bold text-gray-700 hover:bg-white rounded-full"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-7 h-7 flex items-center justify-center font-bold text-gray-700 hover:bg-white rounded-full"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={isSoldOut}
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 rounded-full font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isSoldOut
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#E53935] hover:bg-[#C62828] text-white border border-white/20'
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
                      <span>{isSoldOut ? 'Sold Out' : `Add to Bag • $${((product.isOnSale && product.salePrice ? product.salePrice : product.price) * qty).toFixed(2)}`}</span>
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
