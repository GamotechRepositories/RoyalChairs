import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { PRODUCTS, NEW_COLLECTION_SLIDES } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';

export default function NewCollection({ onQuickView }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [storageTick, setStorageTick] = useState(0);
  const scrollRef = useRef(null);

  // Synchronize with storage updates from Admin
  useEffect(() => {
    const handleStorage = () => setStorageTick((t) => t + 1);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('royal_storage_update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('royal_storage_update', handleStorage);
    };
  }, []);

  // Title and subtitle customization from admin
  const headerTitle = useMemo(() => {
    try {
      return localStorage.getItem('royal_newcoll_title') || 'The 2026 Royal New Collection';
    } catch {
      return 'The 2026 Royal New Collection';
    }
  }, [storageTick]);

  const headerSubtitle = useMemo(() => {
    try {
      return (
        localStorage.getItem('royal_newcoll_subtitle') ||
        'Tactile bouclé weaves, 4D dynamic pelvic sync systems, and solid English oak wooden frames hand-buffed with natural beeswax.'
      );
    } catch {
      return 'Tactile bouclé weaves, 4D dynamic pelvic sync systems, and solid English oak wooden frames hand-buffed with natural beeswax.';
    }
  }, [storageTick]);

  // Load slides from localStorage (if configured by admin) or fallback to NEW_COLLECTION_SLIDES
  const activeSlides = useMemo(() => {
    try {
      const saved = localStorage.getItem('royal_newcoll_slides');
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((s) => s.active !== false);
        if (filtered.length > 0) return filtered;
      }
    } catch {
      // Fallback
    }
    return NEW_COLLECTION_SLIDES;
  }, [storageTick]);

  // Slideshow auto-rotation timer
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, activeSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

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

  const newProducts = PRODUCTS.filter((p) => p.isNew);

  return (
    <section id="new-collection" className="py-16 bg-white border-t border-emerald-100">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* 1. Spotlight Banner Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 bg-emerald-700 text-white rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif leading-tight text-white">
              {headerTitle}
            </h2>
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
                <span className="text-emerald-100">Free doorstep delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Full-Size In-Between Banner Slideshow */}
        {activeSlides.length > 0 && (
          <div
            className="mb-10 relative w-full overflow-hidden rounded-3xl bg-slate-950 shadow-xl border border-slate-200 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px] xl:h-[420px] flex items-center overflow-hidden">
              {activeSlides.map((slide, idx) => {
                const isActive = idx === currentSlide;
                const SlideWrapper = slide.link ? 'a' : 'div';
                const wrapperProps = slide.link ? { href: slide.link } : {};

                return (
                  <SlideWrapper
                    key={slide.id || idx}
                    {...wrapperProps}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out cursor-pointer ${
                      isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title || `New Collection Banner ${idx + 1}`}
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85';
                      }}
                      className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-1000 select-none"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </SlideWrapper>
                );
              })}

              {/* Navigation Arrow Controls */}
              {activeSlides.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevSlide();
                    }}
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md transition shadow-xl border border-white/25 flex items-center justify-center cursor-pointer group/btn"
                    aria-label="Previous Banner"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 group-hover/btn:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextSlide();
                    }}
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md transition shadow-xl border border-white/25 flex items-center justify-center cursor-pointer group/btn"
                    aria-label="Next Banner"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover/btn:scale-110 transition-transform" />
                  </button>

                  {/* Slide Indicators Dots */}
                  <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                    {activeSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide(idx);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          currentSlide === idx ? 'w-7 bg-white shadow-sm' : 'w-2 bg-white/50 hover:bg-white/85'
                        }`}
                        aria-label={`Go to banner ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 3. Section Header */}
        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-emerald-900 font-serif">
            Explore New Arrival Chairs
          </h3>
        </div>

        {/* 4. Products Carousel Wrapper with Left & Right Overlay Arrows */}
        <div className="relative group">
          {/* Left Edge Overlay Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 text-emerald-900 hover:bg-emerald-700 hover:text-white shadow-xl backdrop-blur-xs transition-all border border-gray-200 opacity-90 group-hover:opacity-100 hover:scale-110 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Edge Overlay Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 text-emerald-900 hover:bg-emerald-700 hover:text-white shadow-xl backdrop-blur-xs transition-all border border-gray-200 opacity-90 group-hover:opacity-100 hover:scale-110 cursor-pointer"
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
