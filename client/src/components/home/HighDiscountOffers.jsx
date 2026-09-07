import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ADMIN_OFFER_BANNER } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';

export default function HighDiscountOffers({ onQuickView }) {
  const { products } = useStore();

  // Horizontal product scroll state
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Sort products strictly by discountPercent descending (High to Low %)
  const offersList = (products || []).filter((p) => p.isOffer || (p.discountPercent && p.discountPercent > 0));

  const sortedOffers = [...offersList].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const timeout = setTimeout(checkScroll, 100);
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        clearTimeout(timeout);
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
    return () => clearTimeout(timeout);
  }, [sortedOffers]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (offersList.length === 0) {
    return null; // Only show when Discount Offers exist in Database
  }

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

        {/* Products Horizontal Scroll (4 on desktop, 3 on tablet, 2 on mobile) */}
        <div className="relative group/slider">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white shadow-xl border border-slate-200 flex items-center justify-center text-slate-800 hover:text-emerald-900 transition-all hover:scale-105 cursor-pointer backdrop-blur-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white shadow-xl border border-slate-200 flex items-center justify-center text-slate-800 hover:text-emerald-900 transition-all hover:scale-105 cursor-pointer backdrop-blur-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="grid grid-flow-col auto-cols-[calc((100%-12px)/2)] sm:auto-cols-[calc((100%-32px)/3)] lg:auto-cols-[calc((100%-72px)/4)] gap-3 sm:gap-4 lg:gap-6 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth snap-x snap-mandatory"
          >
            {sortedOffers.map((product) => (
              <div
                key={product._id || product.id}
                className="snap-start h-full"
              >
                <ProductCard
                  product={product}
                  onQuickView={onQuickView}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
