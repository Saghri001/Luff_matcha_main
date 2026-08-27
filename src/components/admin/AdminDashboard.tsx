import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Tag,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ChevronLeft,
  Calendar,
  Layers,
} from 'lucide-react';
import { ProductItem, Order, PromoCode, OrderStatus } from '../../lib/store/types';

interface AdminDashboardProps {
  products: ProductItem[];
  orders: Order[];
  promos: PromoCode[];
  onAddProduct: (prod: Omit<ProductItem, 'id'>) => void;
  onUpdateProduct: (prod: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddPromoCode: (promo: Omit<PromoCode, 'id'>) => void;
  onTogglePromoActive: (id: string) => void;
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  promos,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddPromoCode,
  onTogglePromoActive,
  onBackToStore,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'promos'>('analytics');

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'tins' as ProductItem['category'],
    price: 34.0,
    salePrice: 28.0,
    isOnSale: false,
    stockCount: 50,
    description: '',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=800&q=80',
    tags: 'Ceremonial, Uji, Organic',
    volumeOrWeight: '30g (~15 Servings)',
  });

  // Promo code form state
  const [promoForm, setPromoForm] = useState({
    code: '',
    discountPercent: 15,
    minOrder: 0,
    active: true,
  });

  // Financial calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        ...productForm,
        tags: productForm.tags.split(',').map((t) => t.trim()),
      });
    } else {
      onAddProduct({
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        salePrice: productForm.isOnSale ? Number(productForm.salePrice) : undefined,
        isOnSale: productForm.isOnSale,
        stockCount: Number(productForm.stockCount),
        description: productForm.description,
        image: productForm.image,
        tags: productForm.tags.split(',').map((t) => t.trim()),
        volumeOrWeight: productForm.volumeOrWeight,
        flavorNotes: ['Velvety Umami', 'Pistachio'],
      });
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      salePrice: prod.salePrice || prod.price,
      isOnSale: !!prod.isOnSale,
      stockCount: prod.stockCount,
      description: prod.description,
      image: prod.image,
      tags: prod.tags.join(', '),
      volumeOrWeight: prod.volumeOrWeight || '30g',
    });
    setIsProductModalOpen(true);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code) return;
    onAddPromoCode({
      code: promoForm.code.toUpperCase().trim(),
      discountPercent: Number(promoForm.discountPercent),
      minOrder: Number(promoForm.minOrder),
      active: promoForm.active,
    });
    setPromoForm({ code: '', discountPercent: 15, minOrder: 0, active: true });
  };

  return (
    <div className="min-h-screen bg-[#15191E] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E53935] text-white text-[10px] font-mono font-black uppercase tracking-wider">
                ADMIN CONSOLE
              </span>
              <span className="text-gray-400 text-xs font-mono">LIVE STORE MANAGER</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white mt-1">
              LUFF Control Center
            </h1>
          </div>

          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
          {[
            { id: 'analytics', label: 'Dashboard & Revenue', icon: BarChart3 },
            { id: 'products', label: `Products & Stock (${products.length})`, icon: Package },
            { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'promos', label: `Sales & Promo Codes (${promos.length})`, icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#E53935] text-white shadow-lg scale-105'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS & OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-mono uppercase">Total Store Revenue</span>
                  <DollarSign className="w-5 h-5 text-[#4A7C59]" />
                </div>
                <div className="font-display font-black text-3xl text-white">
                  ${totalRevenue.toFixed(2)}
                </div>
                <div className="text-[11px] text-[#4A7C59] font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% from last week</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-mono uppercase">Total Completed Orders</span>
                  <ShoppingBag className="w-5 h-5 text-[#E53935]" />
                </div>
                <div className="font-display font-black text-3xl text-white">
                  {totalOrdersCount}
                </div>
                <div className="text-[11px] text-gray-400 font-mono">
                  {totalItemsSold} total items fulfilled
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-mono uppercase">Active Products</span>
                  <Package className="w-5 h-5 text-[#F4EFE6]" />
                </div>
                <div className="font-display font-black text-3xl text-white">
                  {products.length}
                </div>
                <div className="text-[11px] text-amber-400 font-mono">
                  {products.filter((p) => p.stockCount <= 0).length} items currently SOLD OUT
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-mono uppercase">Active Promo Codes</span>
                  <Tag className="w-5 h-5 text-[#4A7C59]" />
                </div>
                <div className="font-display font-black text-3xl text-white">
                  {promos.filter((p) => p.active).length}
                </div>
                <div className="text-[11px] text-[#4A7C59] font-mono">
                  LUFF15 code active
                </div>
              </div>
            </div>

            {/* Best Sellers & Recent Activity Table */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
              <h3 className="font-display font-black text-xl text-white">
                Best-Selling Products & Stock Status
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 font-mono">
                      <th className="pb-3">PRODUCT</th>
                      <th className="pb-3">CATEGORY</th>
                      <th className="pb-3">PRICE</th>
                      <th className="pb-3">STOCK</th>
                      <th className="pb-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td className="py-3 font-bold flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-9 h-9 rounded-lg object-cover" />
                          <span>{prod.name}</span>
                        </td>
                        <td className="py-3 uppercase font-mono text-gray-400">{prod.category}</td>
                        <td className="py-3 font-bold text-white">${prod.price.toFixed(2)}</td>
                        <td className="py-3 font-mono font-bold">
                          <span className={prod.stockCount > 0 ? 'text-[#4A7C59]' : 'text-red-400'}>
                            {prod.stockCount} units
                          </span>
                        </td>
                        <td className="py-3">
                          {prod.stockCount > 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#4A7C59]/20 text-[#4A7C59] text-[10px] font-bold font-mono">
                              IN STOCK
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold font-mono">
                              SOLD OUT
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-xl text-white">Product Catalog & Inventory</h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    category: 'tins',
                    price: 34.0,
                    salePrice: 28.0,
                    isOnSale: false,
                    stockCount: 50,
                    description: '',
                    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=800&q=80',
                    tags: 'Ceremonial, Uji, Organic',
                    volumeOrWeight: '30g (~15 Servings)',
                  });
                  setIsProductModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img src={prod.image} alt={prod.name} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
                    <div className="flex-1">
                      <span className="text-[10px] font-mono font-bold text-[#4A7C59] uppercase">{prod.category}</span>
                      <h4 className="font-display font-bold text-base text-white">{prod.name}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{prod.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                      <div className="text-sm font-black text-white">
                        ${prod.isOnSale && prod.salePrice ? prod.salePrice.toFixed(2) : prod.price.toFixed(2)}
                      </div>
                      <div className="text-xs font-mono text-gray-400">Stock: {prod.stockCount}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-black text-xl text-white">Customer Orders Management</h3>
            <div className="flex flex-col gap-4">
              {orders.length === 0 ? (
                <div className="p-12 text-center text-gray-400 bg-white/5 rounded-3xl">No orders placed yet.</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-base text-[#E53935]">{order.id}</span>
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white mt-1">
                          {order.customer.name} ({order.customer.email})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-black text-white font-mono font-bold text-xs px-3 py-1.5 rounded-xl border border-white/20"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-mono text-gray-400 mb-2 uppercase">Items Ordered</div>
                        <div className="flex flex-col gap-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-white">
                              <span>{item.quantity}x {item.product.name}</span>
                              <span className="font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-black/40 p-4 rounded-2xl flex flex-col gap-1 text-xs font-mono">
                        <div className="flex justify-between text-gray-400"><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-400"><span>Shipping:</span><span>${order.shipping.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-400"><span>Tax (NYC 8.875%):</span><span>${order.tax.toFixed(2)}</span></div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-[#4A7C59]"><span>Discount ({order.promoCodeApplied}):</span><span>-${order.discount.toFixed(2)}</span></div>
                        )}
                        <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10"><span>Total Paid:</span><span>${order.total.toFixed(2)}</span></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PROMO CODES & SALES */}
        {activeTab === 'promos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Promo Form */}
            <form onSubmit={handleCreatePromo} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
              <h3 className="font-display font-black text-xl text-white">Create Promo Code</h3>

              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">PROMO CODE STRING</label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER20"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/20 font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">DISCOUNT %</label>
                  <input
                    type="number"
                    value={promoForm.discountPercent}
                    onChange={(e) => setPromoForm({ ...promoForm, discountPercent: Number(e.target.value) })}
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/20 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">MIN ORDER ($)</label>
                  <input
                    type="number"
                    value={promoForm.minOrder}
                    onChange={(e) => setPromoForm({ ...promoForm, minOrder: Number(e.target.value) })}
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/20 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 rounded-xl bg-[#4A7C59] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-[#4A7C59] transition-all"
              >
                Create Promo Code
              </button>
            </form>

            {/* Existing Promos List */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
              <h3 className="font-display font-black text-xl text-white">Active Promo Codes & Temporary Sales</h3>
              <div className="flex flex-col gap-3">
                {promos.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-black text-lg text-[#E53935]">{p.code}</div>
                      <div className="text-xs text-gray-400">
                        {p.discountPercent}% OFF • Min Order: ${p.minOrder || 0}
                      </div>
                    </div>

                    <button
                      onClick={() => onTogglePromoActive(p.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        p.active
                          ? 'bg-[#4A7C59]/20 text-[#4A7C59] border border-[#4A7C59]/40'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {p.active ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSaveProduct} className="w-full max-w-lg bg-[#15191E] text-white p-6 rounded-3xl border border-white/20 flex flex-col gap-4">
            <h3 className="font-display font-black text-xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <input
              type="text"
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="bg-black p-3 rounded-xl border border-white/20 text-sm"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Regular Price ($)"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                className="bg-black p-3 rounded-xl border border-white/20 text-sm"
                required
              />
              <input
                type="number"
                placeholder="Stock Inventory"
                value={productForm.stockCount}
                onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                className="bg-black p-3 rounded-xl border border-white/20 text-sm"
                required
              />
            </div>

            <textarea
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="bg-black p-3 rounded-xl border border-white/20 text-sm h-24"
              required
            />

            <input
              type="text"
              placeholder="Image URL"
              value={productForm.image}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              className="bg-black p-3 rounded-xl border border-white/20 text-sm"
              required
            />

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#E53935] font-black text-xs uppercase tracking-wider"
              >
                Save Product
              </button>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-5 py-3 rounded-xl bg-white/10 font-bold text-xs uppercase"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
