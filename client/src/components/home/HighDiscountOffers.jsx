import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ADMIN_OFFER_BANNER } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';

export default function HighDiscountOffers({ onQuickView }) {
  const { products } = useStore();

  // Sort products strictly by discountPercent descending (High to Low %)
  const offersList = (products || []).filter((p) => p.isOffer || (p.discountPercent && p.discountPercent > 0));

  if (offersList.length === 0) {
    return null; // Only show when Discount Offers exist in Database
  }

  const sortedOffers = [...offersList].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

  return (
    <section id="special-offers" className="py-16 bg-cream-soft border-t border-emerald-100 animate-fadeIn">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left sm:text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Royal Offers
          </h2>
        </div>

        {/* Promo Big Banners Carousel */}
        {ADMIN_OFFER_BANNER && ADMIN_OFFER_BANNER.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {ADMIN_OFFER_BANNER.map((banner) => (
              <div
                key={banner.id}
                className="relative rounded-3xl overflow-hidden shadow-xl group cursor-pointer border border-emerald-900/10 min-h-[220px] flex items-end p-6 sm:p-8"
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 space-y-2 text-white">
                  <span className="inline-block px-3 py-1 bg-amber-400 text-emerald-950 font-black text-[11px] rounded-full uppercase tracking-wider shadow-md">
                    {banner.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-serif text-white leading-tight">
                    {banner.title}
                  </h3>
                  <p className="text-gray-200 text-xs sm:text-sm font-medium">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid (4 on desktop, 2 on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {sortedOffers.map((product) => (
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
