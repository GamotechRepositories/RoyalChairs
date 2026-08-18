import { useState, useRef } from 'react';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';

export default function BestSellers({ onQuickView }) {
  const [activeTab, setActiveTab] = useState('all');
  const scrollRef = useRef(null);

  const bestSellersList = PRODUCTS.filter((p) => p.isBestSeller);

  const filteredProducts = activeTab === 'all'
    ? bestSellersList
    : bestSellersList.filter((p) => p.category === activeTab);

  const tabs = [
    { id: 'all', label: 'All Best Sellers' },
    { id: 'wooden', label: 'Wooden' },
    { id: 'ergonomic', label: 'Ergonomic' },
    { id: 'velvet', label: 'Velvet' },
    { id: 'executive', label: 'Executive' },
    { id: 'gaming', label: 'Gaming' },
  ];

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
    <section id="best-sellers" className="py-16 bg-cream-soft">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6">


          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 font-serif">
            Best Seller Chairs
          </h2>



          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 border border-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Container with Overlay Left and Right Arrows */}
        <div className="relative group">
          {/* Left Overlay Arrow Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 text-emerald-900 hover:bg-emerald-700 hover:text-white shadow-xl backdrop-blur-xs transition-all border border-gray-200 opacity-90 group-hover:opacity-100 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Overlay Arrow Button */}
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
            {filteredProducts.map((product) => (
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
