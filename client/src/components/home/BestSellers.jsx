import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../ui/ProductCard';

export default function BestSellers({ onQuickView }) {
  const { products, categories } = useStore();
  const [activeTab, setActiveTab] = useState('all');

  // Horizontal product scroll state
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const bestSellersList = (products || []).filter((p) => p.isBestSeller);

  const filteredProducts =
    activeTab === 'all'
      ? bestSellersList
      : bestSellersList.filter(
          (p) => (p.categorySlug || p.category || '').toLowerCase() === activeTab.toLowerCase()
        );

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
  }, [filteredProducts]);

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

  if (bestSellersList.length === 0) {
    return null; // Only show when Best Seller chairs exist in Database
  }

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
            {filteredProducts.map((product) => (
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
