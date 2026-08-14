import { useState } from 'react';
import { Tag, Sparkles, Percent, Plus, Trash2, Edit3, Armchair } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import ProductModal from '../products/ProductModal';

export default function OffersDiscountsManager() {
  const { products, updateProduct, deleteProduct } = useAdminData();

  const [bannerConfig, setBannerConfig] = useState(() => {
    const saved = localStorage.getItem('royal_admin_offer_banner');
    return saved
      ? JSON.parse(saved)
      : {
          badge: 'SPECIAL PROMOTIONAL OFFER',
          title: 'Handcrafted Luxury Armchairs & Season Savings',
          description:
            'Co-developed with spine orthopedists. Hand-stitched Italian Nappa leathers, plush English velvets, and 100% FSC-certified solid oak frames offered with up to 50% discount.',
          image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80',
          imageCaption: 'Master Craftsman Workshop • Exclusive 2026 Collection',
        };
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const saveBannerConfig = () => {
    localStorage.setItem('royal_admin_offer_banner', JSON.stringify(bannerConfig));
    alert('Promotional Offer Banner updated successfully!');
  };

  const handleUpdateDiscount = (prodId, discountPercent) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    const origPrice = Number(prod.originalPrice) || Number(prod.price) || 500;
    const newPrice = Math.round(origPrice * (1 - discountPercent / 100));
    updateProduct(prodId, {
      discountPercent: discountPercent,
      price: newPrice,
      originalPrice: origPrice,
    });
  };

  // Sort products by discountPercent descending
  const discountedProducts = [...products].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Promotional Offer Banner Card CRUD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-800 text-xs font-black px-3.5 py-1 rounded-full mb-2 border border-amber-200">
              <Percent className="w-3.5 h-3.5 text-amber-600" />
              <span>OFFERS BANNER CONTROLLER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Promotional Banner &amp; Discounts
            </h1>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Discount Product</span>
          </button>
        </div>

        {/* Banner Field Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Top Badge Tag
            </label>
            <input
              type="text"
              value={bannerConfig.badge}
              onChange={(e) => setBannerConfig({ ...bannerConfig, badge: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-amber-700 focus:outline-hidden focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Banner Heading
            </label>
            <input
              type="text"
              value={bannerConfig.title}
              onChange={(e) => setBannerConfig({ ...bannerConfig, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-hidden focus:border-emerald-700"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Offer Description Text
            </label>
            <textarea
              rows={2}
              value={bannerConfig.description}
              onChange={(e) => setBannerConfig({ ...bannerConfig, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Banner Image URL
            </label>
            <input
              type="url"
              value={bannerConfig.image}
              onChange={(e) => setBannerConfig({ ...bannerConfig, image: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Image Caption Overlay
            </label>
            <input
              type="text"
              value={bannerConfig.imageCaption}
              onChange={(e) => setBannerConfig({ ...bannerConfig, imageCaption: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveBannerConfig}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Save Offer Banner Configuration
          </button>
        </div>
      </div>

      {/* Discount Products List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 font-serif">
            Products Discount Rankings ({discountedProducts.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {discountedProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative shadow-2xs">
                  {prod.mainImage && prod.mainImage.startsWith('http') ? (
                    <img
                      src={prod.mainImage}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentNode.querySelector('.fallback-icon');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`fallback-icon absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-800 ${prod.mainImage && prod.mainImage.startsWith('http') ? 'hidden' : ''}`}>
                    <Armchair className="w-6 h-6 text-emerald-700/60" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Save {prod.discountPercent || 0}%
                    </span>
                    <span className="text-xs text-slate-500 font-bold">{prod.category}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 font-serif mt-0.5">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">SKU: {prod.sku}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                {/* Discount % Modifier Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500">Discount:</span>
                  <select
                    value={prod.discountPercent || 0}
                    onChange={(e) => handleUpdateDiscount(prod.id, Number(e.target.value))}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-900 focus:outline-hidden focus:border-emerald-700 cursor-pointer"
                  >
                    <option value={50}>50% OFF</option>
                    <option value={45}>45% OFF</option>
                    <option value={40}>40% OFF</option>
                    <option value={35}>35% OFF</option>
                    <option value={30}>30% OFF</option>
                    <option value={25}>25% OFF</option>
                    <option value={20}>20% OFF</option>
                    <option value={15}>15% OFF</option>
                    <option value={0}>No Discount</option>
                  </select>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-950 block">₹{prod.price}</span>
                  {prod.originalPrice > prod.price && (
                    <span className="text-xs text-slate-400 line-through">₹{prod.originalPrice}</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsProductModalOpen(true);
                    }}
                    className="p-2 text-slate-600 hover:text-emerald-800 bg-slate-50 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Remove "${prod.name}" from catalog?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Product Edit / Add Modal */}
      {isProductModalOpen && (
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          productToEdit={editingProduct}
        />
      )}
    </div>
  );
}
