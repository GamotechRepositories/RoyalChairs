import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../ui/ProductCard';

export default function BestSellers({ onQuickView }) {
  const { products, categories } = useStore();
  const [activeTab, setActiveTab] = useState('all');

  const bestSellersList = (products || []).filter((p) => p.isBestSeller);

  if (bestSellersList.length === 0) {
    return null; // Only show when Best Seller chairs exist in Database
  }

  const filteredProducts =
    activeTab === 'all'
      ? bestSellersList
      : bestSellersList.filter(
          (p) => (p.categorySlug || p.category || '').toLowerCase() === activeTab.toLowerCase()
        );

  const dynamicTabs = [
    { id: 'all', label: 'All Best Sellers' },
    ...(categories || []).map((c) => ({
      id: c.slug || c.id,
      label: c.name,
    })),
  ];

  return (
    <section id="best-sellers" className="py-16 bg-cream-soft animate-fadeIn">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left sm:text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Best Seller Chairs
          </h2>

          {/* Category Filter Tabs */}
          {dynamicTabs.length > 1 && (
            <div className="flex flex-wrap justify-start sm:justify-center gap-2 mt-4 sm:mt-5">
              {dynamicTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 border border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid (4 on desktop, 2 on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
