import { useState, useRef } from 'react';
import { Percent, Tag, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { PRODUCTS, ADMIN_OFFER_BANNER } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';

export default function HighDiscountOffers({ onQuickView }) {
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
  const sortedOffers = [...PRODUCTS]
    .filter((p) => p.discountPercent >= filterThreshold)
    .sort((a, b) => b.discountPercent - a.discountPercent);

  return (
    <section id="special-offers" className="py-16 bg-cream-soft border-t border-emerald-100">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Flash Sale Banner Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300/60 shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-emerald-950 text-xs font-black px-3.5 py-1 rounded-full mb-3 border border-amber-300">
              <Percent className="w-4 h-4 text-amber-600" />
              <span>LIMITED TIME FLASH SALE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-emerald-900 font-serif">
              Royal Offers
            </h2>

            <p className="text-gray-600 text-sm mt-1">
              Curated luxury seats sorted strictly by maximum price reduction. Save up to 50% today.
            </p>
          </div>
        </div>

        {/* Admin Configurable Featured Offer Banner Card */}
        {ADMIN_OFFER_BANNER && (
          <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 mb-10 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center shadow-xl border border-emerald-800">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-amber-400 text-emerald-950 text-xs font-black px-3.5 py-1 rounded-full mb-4 shadow-sm tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{ADMIN_OFFER_BANNER.badge || 'SPECIAL PROMOTIONAL OFFER'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif leading-tight text-white mb-4">
                {ADMIN_OFFER_BANNER.title}
              </h3>

              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">
                {ADMIN_OFFER_BANNER.description}
              </p>

              {ADMIN_OFFER_BANNER.highlights && ADMIN_OFFER_BANNER.highlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {ADMIN_OFFER_BANNER.highlights.map((h, i) => (
                    <div key={i} className="bg-emerald-800/80 p-3.5 rounded-xl border border-emerald-700/80 text-xs">
                      <strong className="text-amber-300 block mb-1 text-xs font-bold">{h.title}</strong>
                      <span className="text-emerald-100/90 text-[11px] leading-snug block">{h.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Promo Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-72 sm:h-80 lg:h-96 group border-2 border-emerald-700/60">
              <img
                src={ADMIN_OFFER_BANNER.image}
                alt={ADMIN_OFFER_BANNER.title}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              {ADMIN_OFFER_BANNER.imageCaption && (
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-transparent to-transparent flex items-end p-4 sm:p-6">
                  <span className="text-xs font-extrabold text-amber-200 bg-emerald-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-300/30 shadow-md">
                    {ADMIN_OFFER_BANNER.imageCaption}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center space-x-3 mb-6 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
          <span className="text-xs font-bold text-gray-500 flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filter:</span>
          </span>

          <button
            onClick={() => setFilterThreshold(0)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${filterThreshold === 0
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
              }`}
          >
            All Offers (High → Low)
          </button>

          <button
            onClick={() => setFilterThreshold(40)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${filterThreshold === 40
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
              }`}
          >
            🔥 40%+ OFF Only
          </button>
        </div>

        {/* Carousel Wrapper with Left & Right Overlay Arrows */}
        <div className="relative group">
          {/* Left Edge Overlay Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 text-emerald-900 hover:bg-emerald-700 hover:text-white shadow-xl backdrop-blur-xs transition-all border border-gray-200 opacity-90 group-hover:opacity-100 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Edge Overlay Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 text-emerald-900 hover:bg-emerald-700 hover:text-white shadow-xl backdrop-blur-xs transition-all border border-gray-200 opacity-90 group-hover:opacity-100 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Scrollable Horizontal Card List */}
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto no-scrollbar py-3 px-2 snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {sortedOffers.map((product) => (
              <div key={product.id} className="flex-none w-72 sm:w-80 snap-start">
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
