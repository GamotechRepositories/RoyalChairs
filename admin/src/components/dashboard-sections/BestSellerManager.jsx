import { useState } from 'react';
import { Crown, Star, Plus, Trash2, Edit3, Check, Filter, Armchair } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import ProductModal from '../products/ProductModal';

export default function BestSellerManager() {
  const { products, updateProduct, deleteProduct } = useAdminData();
  const [selectedType, setSelectedType] = useState('all');

  const [headerTitle, setHeaderTitle] = useState(() => {
    return localStorage.getItem('royal_bestseller_title') || 'Royal Best Sellers';
  });

  const [headerSubtitle, setHeaderSubtitle] = useState(() => {
    return (
      localStorage.getItem('royal_bestseller_subtitle') ||
      'Our most coveted handcrafted seating designs chosen by visionary architects, executives, and interior specialists.'
    );
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const saveHeaderConfig = () => {
    localStorage.setItem('royal_bestseller_title', headerTitle);
    localStorage.setItem('royal_bestseller_subtitle', headerSubtitle);
    alert('Best Seller header configuration saved successfully!');
  };

  const handleToggleBestSeller = (product) => {
    updateProduct(product.id, { isBestSeller: !product.isBestSeller });
  };

  const filteredProducts =
    selectedType === 'all'
      ? products
      : products.filter((p) => (p.type || p.category || '').toLowerCase() === selectedType.toLowerCase());

  const activeBestSellersCount = products.filter((p) => p.isBestSeller).length;

  const categoryTypes = ['all', 'wooden', 'velvet', 'ergonomic', 'executive', 'deck recliner', 'gaming'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section Header Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-800 text-xs font-black px-3.5 py-1 rounded-full mb-2 border border-amber-200">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>BEST SELLERS SECTION CONTROLLER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Best Sellers Manager
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
            <span>Add Best Seller Product</span>
          </button>
        </div>

        {/* Header Editable Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Best Sellers Section Heading
            </label>
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-hidden focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Sub-heading Description
            </label>
            <input
              type="text"
              value={headerSubtitle}
              onChange={(e) => setHeaderSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveHeaderConfig}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Save Header Settings
          </button>
        </div>
      </div>
      {/* Card 1: Active Best Sellers (Top) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-105 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/20">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-serif flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Active Best Sellers ({activeBestSellersCount})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">These luxury items are currently showcased on the customer homepage.</p>
          </div>
        </div>

        {products.filter((p) => p.isBestSeller).length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-semibold">
            No products are currently marked as Best Sellers. Feature some from the catalog below.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
            {products.filter((p) => p.isBestSeller).map((prod) => (
              <div
                key={`active-${prod.id}`}
                className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-amber-300 transition duration-300 group"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-square w-full rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                  {prod.mainImage && prod.mainImage.startsWith('http') ? (
                    <img
                      src={prod.mainImage}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentNode.querySelector('.fallback-icon');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`fallback-icon absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-800 ${prod.mainImage && prod.mainImage.startsWith('http') ? 'hidden' : ''}`}>
                    <Armchair className="w-8 h-8 text-emerald-700/60" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between space-y-1">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 truncate">
                        {prod.category}
                      </span>
                      <span className="text-[10px] text-amber-500 font-bold flex items-center shrink-0">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        {prod.rating}
                      </span>
                    </div>
                    <h3 className="text-xs font-extrabold text-slate-900 font-serif leading-tight mt-1.5 line-clamp-2 min-h-[32px]">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-black text-emerald-950">₹{prod.price}</span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleToggleBestSeller(prod)}
                  className="w-full py-2 rounded-xl text-[10px] font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer flex items-center justify-center space-x-1"
                  title="Remove from Best Sellers"
                >
                  <span>Remove</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Types Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 pt-4 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500 mr-2 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1 text-emerald-700" />
          <span>Category Type:</span>
        </span>
        {categoryTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition cursor-pointer ${
              selectedType.toLowerCase() === type.toLowerCase()
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Card 2: All Products Selection Catalog (Bottom) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-serif">
              All Products Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Toggle products to add or remove them from the Best Sellers showcase.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
          {filteredProducts.map((prod) => (
            <div
              key={`catalog-${prod.id}`}
              className="bg-slate-50/30 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-emerald-700/30 transition duration-300 group relative"
            >
              {/* Floating Edit/Delete Actions */}
              <div className="absolute top-6 right-6 flex space-x-1 z-10">
                <button
                  onClick={() => {
                    setEditingProduct(prod);
                    setIsProductModalOpen(true);
                  }}
                  className="p-1.5 text-slate-600 hover:text-emerald-800 bg-white/95 backdrop-blur-xs rounded-lg border border-slate-200 shadow-xs transition cursor-pointer"
                  title="Edit Product"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove "${prod.name}" from catalog?`)) {
                      deleteProduct(prod.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 bg-white/95 backdrop-blur-xs rounded-lg border border-slate-200 shadow-xs transition cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Image Wrapper */}
              <div className="relative aspect-square w-full rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                {prod.mainImage && prod.mainImage.startsWith('http') ? (
                  <img
                    src={prod.mainImage}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentNode.querySelector('.fallback-icon');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`fallback-icon absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-800 ${prod.mainImage && prod.mainImage.startsWith('http') ? 'hidden' : ''}`}>
                  <Armchair className="w-8 h-8 text-emerald-700/60" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between space-y-1">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 truncate">
                      {prod.category}
                    </span>
                    <span className="text-[10px] text-amber-500 font-bold flex items-center shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                      {prod.rating}
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 font-serif leading-tight mt-1.5 line-clamp-2 min-h-[32px]">
                    {prod.name}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">SKU: {prod.sku}</p>
                </div>

                <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-black text-emerald-950">₹{prod.price}</span>
                  {prod.originalPrice > prod.price && (
                    <span className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => handleToggleBestSeller(prod)}
                className={`w-full py-2 rounded-xl text-[10px] font-extrabold border transition cursor-pointer flex items-center justify-center space-x-1 ${
                  prod.isBestSeller
                    ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
                title={prod.isBestSeller ? 'Remove from Best Sellers' : 'Add to Best Sellers'}
              >
                <Crown className={`w-3.5 h-3.5 ${prod.isBestSeller ? 'text-amber-600 fill-amber-600 animate-pulse' : 'text-slate-400'}`} />
                <span>{prod.isBestSeller ? 'Best Seller' : 'Add to Best Sellers'}</span>
              </button>
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
