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
              className="absolute -left-3 sm:-left-5 top-[60px] sm:top-[75px] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md hover:shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all hover:scale-105 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-3 sm:-right-5 top-[60px] sm:top-[75px] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md hover:shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all hover:scale-105 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Horizontal Circular Category List */}
          <div
            ref={scrollRef}
            className="flex items-start space-x-6 sm:space-x-10 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
          >
            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug || cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug || cat.id)}
                className="flex-none flex flex-col items-center text-center cursor-pointer w-28 sm:w-36 focus:outline-hidden"
              >
                {/* Circular Backdrop Container */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#f1f3f6] flex items-center justify-center mb-3 overflow-hidden">
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
                <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
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
