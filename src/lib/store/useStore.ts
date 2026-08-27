import { useState, useEffect } from 'react';
import { ProductItem, CartItem, Order, PromoCode, ActiveView, ShippingOption, CustomerInfo } from './types';
import { INITIAL_PRODUCTS, INITIAL_PROMO_CODES, SHIPPING_OPTIONS } from './products.data';

const PRODUCTS_KEY = 'luff_store_products_v7';
const ORDERS_KEY = 'luff_store_orders_v1';
const PROMOS_KEY = 'luff_store_promos_v1';
const CART_KEY = 'luff_store_cart_v5';

const ALLOWED_IDS = new Set(['luff-mushroom-matcha-30g', 'luff-mushroom-coffee-250g']);

export function useLUFFStore() {
  // 1. Products State - strictly the 2 core formulas
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      if (saved) {
        const parsed: ProductItem[] = JSON.parse(saved);
        const filtered = parsed.filter((p) => ALLOWED_IDS.has(p.id));
        return filtered.length === 2 ? filtered : INITIAL_PRODUCTS;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      if (saved) return JSON.parse(saved);
      // Demo initial order
      return [
        {
          id: 'LUFF-98241',
          customer: {
            name: 'Sophia Vance',
            email: 'sophia@example.com',
            phone: '+1 212-555-0199',
            address: '742 Evergreen Terrace',
            city: 'New York',
            zipCode: '10013',
            country: 'United States',
          },
          items: [{ product: INITIAL_PRODUCTS[0], quantity: 2 }],
          subtotal: 56.00,
          tax: 4.97,
          shipping: 0,
          discount: 8.40,
          total: 52.57,
          promoCodeApplied: 'LUFF15',
          status: 'processing',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  // 3. Promo Codes State
  const [promos, setPromos] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem(PROMOS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
    } catch {
      return INITIAL_PROMO_CODES;
    }
  });

  // 4. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [{ product: INITIAL_PRODUCTS[0], quantity: 1 }];
    } catch {
      return [{ product: INITIAL_PRODUCTS[0], quantity: 1 }];
    }
  });

  // Navigation & UI state
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [activeShipping, setActiveShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(PROMOS_KEY, JSON.stringify(promos));
    } catch (e) {
      console.error('Failed to save promos', e);
    }
  }, [promos]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Toast utility
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  // Cart operations
  const addToCart = (product: ProductItem, options?: { milk?: string; sweetness?: string; qty?: number }) => {
    if (product.stockCount <= 0) {
      showToast(`Sorry, "${product.name}" is currently sold out!`);
      return;
    }

    const qtyToAdd = options?.qty || 1;

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += qtyToAdd;
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: qtyToAdd,
            selectedMilk: options?.milk || '',
            selectedSweetness: options?.sweetness || '',
          },
        ];
      }
    });

    showToast(`Added ${qtyToAdd}x "${product.name}" to your order bag!`);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === productId);
      if (idx === -1) return prev;

      const currentQty = prev[idx].quantity;
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        return prev.filter((_, i) => i !== idx);
      } else {
        const next = [...prev];
        next[idx].quantity = newQty;
        return next;
      }
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from order bag.');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Promo code validation
  const applyPromoCode = (codeStr: string): { success: boolean; message: string } => {
    const trimmed = codeStr.trim().toUpperCase();
    const found = promos.find((p) => p.code === trimmed && p.active);

    if (!found) {
      return { success: false, message: 'Invalid or expired promo code.' };
    }

    const subtotal = cart.reduce((acc, item) => {
      const price = item.product.isOnSale && item.product.salePrice ? item.product.salePrice : item.product.price;
      return acc + price * item.quantity;
    }, 0);

    if (found.minOrder && subtotal < found.minOrder) {
      return { success: false, message: `Minimum order of $${found.minOrder.toFixed(2)} required for code ${found.code}.` };
    }

    setAppliedPromo(found);
    return { success: true, message: `Promo code "${found.code}" applied! (${found.discountPercent}% OFF)` };
  };

  // Pricing computations
  const cartSubtotal = cart.reduce((acc, item) => {
    const p = item.product.isOnSale && item.product.salePrice ? item.product.salePrice : item.product.price;
    return acc + p * item.quantity;
  }, 0);

  const cartDiscount = appliedPromo ? (cartSubtotal * appliedPromo.discountPercent) / 100 : 0;
  
  const shippingCost = (activeShipping.minOrderForFree && cartSubtotal >= activeShipping.minOrderForFree)
    ? 0
    : activeShipping.price;

  const estimatedTax = (cartSubtotal - cartDiscount) * 0.08875; // 8.875% NYC tax
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + shippingCost + estimatedTax);

  // Admin CRUD operations
  const addProduct = (newProd: Omit<ProductItem, 'id'>) => {
    const generatedId = `luff-prod-${Date.now()}`;
    const fullProd: ProductItem = { ...newProd, id: generatedId };
    setProducts((prev) => [fullProd, ...prev]);
    showToast(`Created product "${fullProd.name}"`);
  };

  const updateProduct = (updated: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Updated "${updated.name}"`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted');
  };

  // Order Placement
  const placeOrder = (customer: CustomerInfo): Order => {
    const orderNum = `LUFF-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: orderNum,
      customer,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: estimatedTax,
      shipping: shippingCost,
      discount: cartDiscount,
      total: cartTotal,
      promoCodeApplied: appliedPromo?.code,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };

    // Deduct stock
    setProducts((prevProds) =>
      prevProds.map((prod) => {
        const itemInCart = cart.find((ci) => ci.product.id === prod.id);
        if (itemInCart) {
          const nextStock = Math.max(0, prod.stockCount - itemInCart.quantity);
          return { ...prod, stockCount: nextStock };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedPromo(null);
    showToast(`Order #${orderNum} confirmed! Email confirmation sent.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    showToast(`Order ${orderId} status changed to ${status.toUpperCase()}`);
  };

  const addPromoCode = (promo: Omit<PromoCode, 'id'>) => {
    const newPromo: PromoCode = { ...promo, id: `promo-${Date.now()}` };
    setPromos((prev) => [newPromo, ...prev]);
    showToast(`Created promo code "${newPromo.code}"`);
  };

  const togglePromoActive = (id: string) => {
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  return {
    products,
    orders,
    promos,
    cart,
    activeView,
    setActiveView,
    activeShipping,
    setActiveShipping,
    appliedPromo,
    toastMessage,
    quickViewProduct,
    setQuickViewProduct,
    showToast,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    applyPromoCode,
    cartSubtotal,
    cartDiscount,
    shippingCost,
    estimatedTax,
    cartTotal,
    addProduct,
    updateProduct,
    deleteProduct,
    placeOrder,
    updateOrderStatus,
    addPromoCode,
    togglePromoActive,
  };
}
