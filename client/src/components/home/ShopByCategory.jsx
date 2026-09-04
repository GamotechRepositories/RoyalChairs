import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../../data/chairProductsData';

export default function ShopByCategory({ onSelectCategory }) {
  const { categories: apiCategories } = useStore();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const defaultFallbackImage =
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80';

  const categories = apiCategories && apiCategories.length > 0 ? apiCategories : DEFAULT_CATEGORIES;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [categories]);

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

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section id="shop-by-category" className="py-8 sm:py-14 bg-white animate-fadeIn">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-left sm:text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Shop By Category
          </h2>
        </div>

        {/* Category Showcase Container */}
        <div className="relative group">
          {/* Left Arrow Button (Visible on desktop when overflow exists) */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white shadow-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all hover:scale-105 cursor-pointer backdrop-blur-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow Button (Visible on desktop when overflow exists) */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white shadow-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all hover:scale-105 cursor-pointer backdrop-blur-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Category Cards Single-Row Horizontal Carousel (5 visible on web, 2 on mobile) */}
          <div
            ref={scrollRef}
            className="flex items-start gap-3.5 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar pb-3 px-1 scroll-smooth snap-x snap-mandatory"
          >
            {categories.map((cat, idx) => (
              <button
                key={cat._id || cat.slug || cat.id || idx}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug || cat.id)}
                className="flex-none w-[calc(50%-7px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-16px)] flex flex-col items-center text-center cursor-pointer group focus:outline-hidden snap-start"
              >
                {/* Square Category Poster Container */}
                <div className="relative w-full aspect-square overflow-hidden bg-[#f4f5f7] rounded-none sm:rounded-sm shadow-2xs border border-slate-100 group-hover:shadow-md transition-all duration-300">
                  <img
                    src={cat.image || defaultFallbackImage}
                    alt={cat.name}
                    onError={(e) => {
                      e.target.src = defaultFallbackImage;
                    }}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle hover overlay tint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Category Name Beneath Image */}
                <span className="mt-3 text-xs sm:text-sm lg:text-base font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1 tracking-tight">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
