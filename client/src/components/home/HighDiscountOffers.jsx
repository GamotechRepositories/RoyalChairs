import { useState, useEffect, useRef } from 'react';
import { Percent, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';

export default function HighDiscountOffers({ onQuickView }) {
  const [filterThreshold, setFilterThreshold] = useState(0);
  const scrollRef = useRef(null);

  // Live Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

          {/* Flash Sale Countdown Timer */}
          <div className="flex items-center space-x-4 bg-emerald-700 text-white p-4 rounded-2xl border border-amber-300/40 shadow-md">
            <Clock className="w-6 h-6 text-amber-300 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider block">
                Offer Ends In
              </span>
              <div className="flex items-center space-x-2 text-lg font-black font-mono">
                <span className="bg-emerald-800 px-2 py-0.5 rounded text-amber-300">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-emerald-800 px-2 py-0.5 rounded text-amber-300">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-emerald-800 px-2 py-0.5 rounded text-amber-300">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>
        </div>

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
