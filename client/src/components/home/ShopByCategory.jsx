import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function ShopByCategory({ onSelectCategory }) {
  const { categories } = useStore();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const defaultFallbackImage =
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80';

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
      const scrollAmount = clientWidth * 0.65;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!categories || categories.length === 0) {
    return null; // Don't show until categories are added from Admin
  }

  return (
    <section id="shop-by-category" className="py-8 sm:py-12 bg-white animate-fadeIn">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-left sm:text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Shop By Category
          </h2>
        </div>

        {/* Category Carousel Container */}
        <div className="relative group">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-2 sm:-left-5 top-[44px] sm:top-[70px] -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white shadow-md hover:shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all hover:scale-105 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-2 sm:-right-5 top-[44px] sm:top-[70px] -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white shadow-md hover:shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all hover:scale-105 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Horizontal Circular Category List (3 per view on mobile, smooth horizontal snap) */}
          <div
            ref={scrollRef}
            className="flex items-start space-x-3.5 sm:space-x-8 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth snap-x snap-mandatory"
          >
            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug || cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug || cat.id)}
                className="flex-none flex flex-col items-center text-center cursor-pointer w-[calc(33.333%-10px)] sm:w-32 lg:w-36 focus:outline-hidden snap-start group/cat"
              >
                {/* Circular Backdrop Container */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-[#f1f3f6] flex items-center justify-center mb-2 sm:mb-3 overflow-hidden border border-slate-100 shadow-2xs group-hover/cat:scale-105 transition-transform duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => {
                      e.target.src = defaultFallbackImage;
                    }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Category Name */}
                <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover/cat:text-emerald-800 transition-colors">
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
