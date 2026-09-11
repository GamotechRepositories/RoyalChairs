import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../ui/ProductCard';
import { ProductCardSkeleton } from '../ui/Skeletons';
import api from '../../services/api';

export default function NewCollection({ onQuickView }) {
  const { products, isLoading } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [storageTick, setStorageTick] = useState(0);
  const [apiBanners, setApiBanners] = useState([]);

  // Horizontal product scroll state
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  // Fetch New Collection banners from MongoDB database via API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get('/banners?type=new_collection');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setApiBanners(res.data.data);
        }
      } catch (err) {
        console.log('Error loading new collection banners from MongoDB API:', err.message);
      }
    };
    fetchBanners();
  }, [storageTick]);

  const activeSlides = useMemo(() => {
    return (apiBanners || []).filter((s) => s.active !== false);
  }, [apiBanners]);

  // Slideshow auto-rotation timer
  useEffect(() => {
    const list = activeSlides || [];
    if (isPaused || list.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % list.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, activeSlides]);

  const handleNextSlide = () => {
    const list = activeSlides || [];
    if (list.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % list.length);
    }
  };

  const handlePrevSlide = () => {
    const list = activeSlides || [];
    if (list.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + list.length) % list.length);
    }
  };

  const newProducts = (products || []).filter((p) => p.isNew);

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
  }, [newProducts, isLoading]);

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

  if (isLoading) {
    return (
      <section id="new-collection" className="py-16 bg-white border-t border-emerald-100 animate-fadeIn">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
          <div className="h-44 sm:h-64 w-full bg-slate-200/80 rounded-3xl animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                New Arrivals
              </h2>
              <div className="h-3 w-40 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (newProducts.length === 0) {
    return null; // Only show when New Arrival chairs are added in Database
  }

  return (
    <section id="new-collection" className="py-16 bg-white border-t border-emerald-100">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">

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
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex-1 text-left sm:text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Explore New Arrival Chairs
            </h2>
          </div>
        </div>

        {/* 4. Products Horizontal Scroll (4 on desktop, 3 on tablet, 2 on mobile) */}
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
            {newProducts.map((product) => (
              <div
                key={product.id || product._id}
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
