import { useState } from 'react';
import { Sparkles, Plus, Trash2, Edit3, Image, Check, Star, Armchair } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import ProductModal from '../products/ProductModal';

export default function NewCollectionManager() {
  const { products, updateProduct, deleteProduct } = useAdminData();

  const [headerTitle, setHeaderTitle] = useState(() => {
    return localStorage.getItem('royal_newcoll_title') || '2026 New Collection';
  });

  const [headerSubtitle, setHeaderSubtitle] = useState(() => {
    return (
      localStorage.getItem('royal_newcoll_subtitle') ||
      'Explore our latest arrivals handcrafted with English Oak and stain-resistant velvet.'
    );
  });

  const [bannerImage, setBannerImage] = useState(() => {
    return (
      localStorage.getItem('royal_newcoll_image') ||
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
    );
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const saveBannerConfig = () => {
    localStorage.setItem('royal_newcoll_title', headerTitle);
    localStorage.setItem('royal_newcoll_subtitle', headerSubtitle);
    localStorage.setItem('royal_newcoll_image', bannerImage);
    alert('Royal New Collection banner configuration saved successfully!');
  };

  const handleToggleNew = (product) => {
    updateProduct(product.id, { isNew: !product.isNew });
  };

  const newCollectionProducts = products.filter((p) => p.isNew);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Banner Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>NEW COLLECTION BANNER CONTROLLER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Royal New Collection
            </h1>
          </div>
        </div>

        {/* Banner Configuration Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
                Sub-description Paragraph
              </label>
              <textarea
                value={headerSubtitle}
                onChange={(e) => setHeaderSubtitle(e.target.value)}
                rows="2"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
                Featured Promo Banner Image URL
              </label>
              <input
                type="url"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
              />
            </div>

            <div className="pt-2 flex justify-start">
              <button
                onClick={saveBannerConfig}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-xs"
              >
                Save New Collection Banner
              </button>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-5 flex flex-col">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
              Live Banner Preview
            </label>
            <div className="relative flex-1 min-h-[180px] lg:min-h-0 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs group">
              {bannerImage ? (
                <>
                  <img
                    src={bannerImage}
                    alt="Banner Preview"
                    className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                      New Collection
                    </p>
                    <h4 className="text-sm font-black font-serif leading-tight truncate">
                      {headerTitle || '2026 New Collection'}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-200 line-clamp-1 mt-0.5">
                      {headerSubtitle || 'Explore our latest arrivals...'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4">
                  <Image className="w-8 h-8 mb-2 text-slate-300" />
                  <span className="text-xs font-bold">No Image Configured</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Collection Products Catalog */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-slate-900 font-serif">
            New Collection Flagged Products ({newCollectionProducts.length})
          </h2>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {newCollectionProducts.map((prod) => (
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
                    <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      NEW ARRIVAL
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {prod.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 font-serif mt-0.5">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">SKU: {prod.sku}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-950 block">₹{prod.price}</span>
                  {prod.originalPrice > prod.price && (
                    <span className="text-xs text-slate-400 line-through">₹{prod.originalPrice}</span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleNew(prod)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 transition cursor-pointer flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Flagged New</span>
                </button>

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
