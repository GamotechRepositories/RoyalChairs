import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../../data/chairProductsData';
import api from '../../services/api';

export default function BannerSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [storageTick, setStorageTick] = useState(0);
  const [apiBanners, setApiBanners] = useState([]);

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

  // Fetch real-time banner list from MongoDB database via API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get('/banners');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setApiBanners(res.data.data);
        }
      } catch (err) {
        console.log('Error loading banners from API:', err.message);
      }
    };
    fetchBanners();
  }, [storageTick]);

  // Load slides from MongoDB API, or localStorage, or fallback
  const activeSlides = useMemo(() => {
    if (apiBanners.length > 0) {
      return apiBanners.filter((s) => s.active !== false);
    }
    try {
      const saved = localStorage.getItem('royal_admin_slides');
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((s) => s.active !== false);
        if (filtered.length > 0) return filtered;
      }
    } catch {
      // Fallback
    }
    return HERO_SLIDES;
  }, [apiBanners, storageTick]);

  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, activeSlides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  if (!activeSlides.length) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full Width Photo Banner Carousel Box (1920x600) */}
      <div className="relative w-full aspect-[1920/600] max-h-[600px] flex items-center overflow-hidden">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          const SlideWrapper = slide.link ? 'a' : 'div';
          const wrapperProps = slide.link ? { href: slide.link } : {};

          return (
            <SlideWrapper
              key={slide.id || slide._id || idx}
              {...wrapperProps}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out cursor-pointer ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title || `Royal Chairs Banner ${idx + 1}`}
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
                handlePrev();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition shadow-lg border border-white/20 flex items-center justify-center cursor-pointer group"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition shadow-lg border border-white/20 flex items-center justify-center cursor-pointer group"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            </button>

            {/* Slide Indicators Dots */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-7 bg-white shadow-sm' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
