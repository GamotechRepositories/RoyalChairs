import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ADMIN_OFFER_BANNER } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';

export default function HighDiscountOffers({ onQuickView }) {
  const { products } = useStore();
  const [filterThreshold, setFilterThreshold] = useState(0);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Sort products strictly by discountPercent descending (High to Low %)
  const offersList = (products || []).filter((p) => p.isOffer || (p.discountPercent && p.discountPercent > 0));

  if (offersList.length === 0) {
    return null; // Only show when Discount Offers exist in Database
  }

  const sortedOffers = [...offersList]
    .filter((p) => (p.discountPercent || 0) >= filterThreshold)
    .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

  return (
    <section id="special-offers" className="py-16 bg-cream-soft border-t border-emerald-100 animate-fadeIn">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Flash Sale Banner Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300/60 shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-900 font-serif">
              Royal Offers
            </h2>

            <p className="text-gray-600 text-sm mt-1">
              Curated luxury seats sorted strictly by maximum price reduction.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[0, 20, 30, 40, 50].map((pct) => (
              <button
                key={pct}
                onClick={() => setFilterThreshold(pct)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  filterThreshold === pct
                    ? 'bg-emerald-900 text-amber-300 shadow-md scale-105'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                {pct === 0 ? 'All Offers' : `${pct}%+ OFF`}
              </button>
            ))}
          </div>
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

        {/* Horizontal Card Carousel */}
        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 text-emerald-900 hover:bg-emerald-700 hover:text-white shadow-xl backdrop-blur-xs transition-all border border-gray-200 opacity-90 group-hover:opacity-100 hover:scale-110 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 text-emerald-900 hover:bg-emerald-700 hover:text-white shadow-xl backdrop-blur-xs transition-all border border-gray-200 opacity-90 group-hover:opacity-100 hover:scale-110 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto no-scrollbar py-4 px-2 snap-x snap-mandatory scroll-smooth"
          >
            {sortedOffers.map((product) => (
              <div key={product._id || product.id} className="flex-none w-72 sm:w-80 snap-start">
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
