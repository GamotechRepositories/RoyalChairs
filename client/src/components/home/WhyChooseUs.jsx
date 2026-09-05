import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Award,
  Truck,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
const STATIC_PILLARS = [
  {
    id: 'ergonomics',
    icon: <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />,
    title: 'Spinal Orthopedic Design',
    desc: 'Co-developed with UK spine biomechanists to ensure healthy posture and pressure distribution.',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'materials',
    icon: <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />,
    title: 'English Grain & Velvet',
    desc: 'Ethically sourced top-grain leathers, English plush velvets, and sustainable FSC-certified solid oak.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'warranty',
    icon: <Award className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />,
    title: '10-Year Master Warranty',
    desc: 'Uncompromising confidence. Full frame, gas lift, and mechanical component coverage guaranteed.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'delivery',
    icon: <Truck className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />,
    title: 'Free Express Delivery',
    desc: 'Delivered directly to your doorstep with zero-hassle safe packaging and fast transit.',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
  },
];

export default function WhyChooseUs() {
  const { reviews } = useStore();
  const [storageTick, setStorageTick] = useState(0);
  const reviewsScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mobile Pillars Auto-scroll state (2s interval, same as Moments of Comfort)
  const [pillarIndex, setPillarIndex] = useState(0);
  const [isPillarPaused, setIsPillarPaused] = useState(false);
  const pillarsScrollRef = useRef(null);

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

  // Auto-scroll pillars on mobile every 2 seconds
  useEffect(() => {
    if (isPillarPaused) return;

    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setPillarIndex((prev) => (prev + 1) % STATIC_PILLARS.length);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [isPillarPaused]);

  // Sync scroll position on mobile
  useEffect(() => {
    if (pillarsScrollRef.current && typeof window !== 'undefined' && window.innerWidth < 768) {
      const container = pillarsScrollRef.current;
      const card = container.firstElementChild;
      if (card) {
        const cardWidth = card.offsetWidth;
        const gap = 16;
        container.scrollTo({
          left: pillarIndex * (cardWidth + gap),
          behavior: 'smooth',
        });
      }
    }
  }, [pillarIndex]);

  // Craftsmanship Story Banner from Admin / default
  const craftBanner = useMemo(() => {
    try {
      const saved = localStorage.getItem('royal_admin_craft_banner');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      badge: 'THE MATERIALS & CRAFT',
      title: 'From FSC English Oak Forests to Hand-Stitched Italian Nappa Leather',
      description:
        'Unlike mass-market plastic chairs that break easily, every RoyalChairs model features an internal heavy-duty steel backbone encased in high-density molded memory foam.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
      caption: 'Master Craftsman Workshop • Gloucestershire, UK',
    };
  }, [storageTick]);

  // 3. Dynamic Reviews from API / Database or Admin Local Storage
  const reviewsList = useMemo(() => {
    if (Array.isArray(reviews) && reviews.length > 0) {
      return reviews;
    }
    try {
      const saved = localStorage.getItem('royal_admin_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  }, [reviews, storageTick]);

  // Check scroll position for review carousel arrows
  const checkReviewScroll = () => {
    if (reviewsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = reviewsScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkReviewScroll();
    const el = reviewsScrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkReviewScroll);
      window.addEventListener('resize', checkReviewScroll);
      return () => {
        el.removeEventListener('scroll', checkReviewScroll);
        window.removeEventListener('resize', checkReviewScroll);
      };
    }
  }, [reviewsList]);

  const scrollReviews = (direction) => {
    if (reviewsScrollRef.current) {
      const { scrollLeft, clientWidth } = reviewsScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      reviewsScrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="why-choose-us" className="py-20 bg-white border-t border-gray-100">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* 1. Section Header */}
        <div className="text-left sm:text-center max-w-3xl sm:mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Why Choose RoyalChairs
          </h2>
        </div>

        {/* 2. 4 Pillars with Images & Mobile 2s Auto-Scroll Carousel */}
        <div
          onMouseEnter={() => setIsPillarPaused(true)}
          onMouseLeave={() => setIsPillarPaused(false)}
          onTouchStart={() => setIsPillarPaused(true)}
          onTouchEnd={() => setIsPillarPaused(false)}
          className="relative group mb-8 md:mb-20"
        >
          {/* Cards container: Horizontal scroll on mobile (shows 1 card + peek of 2nd), Grid on desktop */}
          <div
            ref={pillarsScrollRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {STATIC_PILLARS.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => setPillarIndex(idx)}
                className="w-[82vw] sm:w-[84vw] md:w-auto shrink-0 snap-start bg-cream-soft rounded-2xl p-5 sm:p-6 border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Top Row: Icon Badge (left) + Image (right) */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="flex-1 h-14 sm:h-16 rounded-xl overflow-hidden shadow-xs border border-emerald-900/10 bg-slate-100 shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          if (item.fallback && e.target.src !== item.fallback) {
                            e.target.src = item.fallback;
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-emerald-950 font-serif mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-200/60 flex items-center text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600 shrink-0" />
                  <span>Verified Royal Standard</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Dot Indicators */}
          <div className="flex md:hidden justify-center items-center gap-2 mt-4">
            {STATIC_PILLARS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPillarIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  pillarIndex === idx ? 'w-6 bg-emerald-700' : 'w-2 bg-emerald-200'
                }`}
                aria-label={`Go to pillar ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 3. Craftsmanship & Material Story */}
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 mb-20 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-800 text-amber-300 font-extrabold text-[10px] rounded-full uppercase tracking-widest mb-3 border border-amber-300/30">
              {craftBanner.badge || 'THE MATERIALS & CRAFT'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif leading-tight text-white mb-4">
              {craftBanner.title}
            </h3>

            <div className="space-y-4 text-sm text-emerald-100 leading-relaxed">
              <p>{craftBanner.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-800/80 p-3 rounded-xl border border-emerald-700 text-xs">
                  <strong className="text-amber-300 block mb-1">Top-Grain Nappa & Velvet</strong>
                  Hand-selected, breathable, and treated to resist spills while aging gracefully.
                </div>

                <div className="bg-emerald-800/80 p-3 rounded-xl border border-emerald-700 text-xs">
                  <strong className="text-amber-300 block mb-1">FSC Certified Oak</strong>
                  Sustainably harvested from managed English woodlands for lifetime frame integrity.
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-80 lg:h-96">
            <img
              src={craftBanner.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'}
              alt="Craftsmanship"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-6">
              <span className="text-xs font-bold text-amber-200 bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-300/30">
                {craftBanner.caption || 'Master Craftsman Workshop • Gloucestershire, UK'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Customer Reviews Section with Smooth Navigation Arrows */}
        {reviewsList.length > 0 && (
          <div className="pt-16 border-t border-gray-100 relative group">
            {/* Section Heading */}
            <div className="text-left sm:text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                Verified Owner Reviews
              </h2>
            </div>

            {/* Left Scroll Arrow */}
            {canScrollLeft && (
              <button
                onClick={() => scrollReviews('left')}
                className="absolute left-0 sm:-left-3 top-[58%] -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 shadow-xl border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center"
                aria-label="Scroll Reviews Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Right Scroll Arrow */}
            {canScrollRight && (
              <button
                onClick={() => scrollReviews('right')}
                className="absolute right-0 sm:-right-3 top-[58%] -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 shadow-xl border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center"
                aria-label="Scroll Reviews Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Reviews Horizontal Scrolling Carousel Container (3 in view on desktop, 1 on mobile) */}
            <div
              ref={reviewsScrollRef}
              className="flex space-x-6 overflow-x-auto scroll-smooth scrollbar-none pb-4 pt-1 snap-x snap-mandatory"
            >
              {reviewsList.map((review) => (
                <div
                  key={review.id || review._id}
                  className="w-[calc(100%-0.5rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] shrink-0 snap-start bg-white rounded-2xl p-6 border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Top Bar: Stars + Verified Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-amber-500">
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        Verified Owner
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-sans mb-6 line-clamp-4">
                      {review.comment}
                    </p>
                  </div>

                  {/* Author Info & Purchased Chair */}
                  <div className="border-t border-gray-100 pt-4 mt-auto space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={review.avatar}
                        alt={review.name || review.customer}
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                        }}
                        className="w-10 h-10 rounded-full object-cover border-2 border-emerald-800/20 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-extrabold text-emerald-950 font-serif truncate">
                          {review.name || review.userName || review.customer}
                        </h4>
                        <p className="text-[11px] text-gray-500 truncate">
                          {review.role || review.userRole || 'Verified Buyer'} {review.location ? `• ${review.location}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Product Tag */}
                    {(review.productName || review.product) && (
                      <div className="bg-emerald-50/70 rounded-xl p-2 border border-emerald-100 flex items-center justify-between text-[11px]">
                        <span className="text-gray-500 font-medium truncate">Purchased:</span>
                        <span className="font-extrabold text-emerald-900 truncate ml-1">
                          {review.productName || review.product}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
