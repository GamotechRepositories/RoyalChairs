import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { CATEGORIES } from '../../data/chairProductsData';

export default function ShopByCategory({ onSelectCategory }) {
  const scrollRef = useRef(null);

  const defaultFallbackImage = 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80';

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

  return (
    <section id="shop-by-category" className="py-12 bg-white border-b border-gray-100">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <Grid className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 font-serif">
            Shop By Category
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Explore our complete range of handcrafted chairs designed for every space.
          </p>
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

          {/* Circular Category Photo Bubbles */}
          <div
            ref={scrollRef}
            className="flex space-x-6 sm:space-x-10 overflow-x-auto no-scrollbar py-4 px-2 snap-x snap-mandatory items-start"
            style={{ scrollBehavior: 'smooth' }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className="flex-none snap-start flex flex-col items-center text-center cursor-pointer w-32 sm:w-40"
              >
                {/* Circular Photo Bubble Container */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-cream-soft p-2.5 mb-3.5 shadow-sm border border-emerald-100/80 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => {
                      e.target.src = defaultFallbackImage;
                    }}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>

                {/* Category Title Label */}
                <span className="text-sm sm:text-base font-black text-emerald-950 font-serif leading-tight">
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
