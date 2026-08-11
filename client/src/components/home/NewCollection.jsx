import { useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { PRODUCTS } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';

export default function NewCollection({ onQuickView }) {
  const scrollRef = useRef(null);
  const newProducts = PRODUCTS.filter((p) => p.isNew);

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
    <section id="new-collection" className="py-16 bg-white border-t border-emerald-100">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Spotlight Banner Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 bg-emerald-700 text-white rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-amber-300 text-emerald-950 text-xs font-black px-3.5 py-1 rounded-full mb-3 shadow-md">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>JUST RELEASED • 2026 LINEUP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif leading-tight text-white">
              The 2026 Royal New Collection
            </h2>

            <p className="text-emerald-50 text-sm sm:text-base mt-3 leading-relaxed">
              Tactile bouclé weaves, 4D dynamic pelvic sync systems, and solid English oak wooden frames hand-buffed with natural beeswax.
            </p>
          </div>

          <div className="relative z-10 mt-6 lg:mt-0 flex flex-wrap gap-4">
            <div className="bg-emerald-600/90 border border-emerald-400/40 p-3.5 rounded-2xl flex items-center space-x-3 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
              <div className="text-xs">
                <span className="font-extrabold text-white block">10-Year Warranty</span>
                <span className="text-emerald-100">On all 2026 frames</span>
              </div>
            </div>

            <div className="bg-emerald-600/90 border border-emerald-400/40 p-3.5 rounded-2xl flex items-center space-x-3 shadow-xs">
              <Zap className="w-6 h-6 text-amber-300" />
              <div className="text-xs">
                <span className="font-extrabold text-white block">Zero-Cost Delivery</span>
                <span className="text-emerald-100">White-glove room setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-emerald-900 font-serif">
            Explore New Arrival Chairs
          </h3>
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
            {newProducts.map((product) => (
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
