import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Award, Zap, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const DEFAULT_SPOTLIGHT = {
  id: 'spotlight-1',
  title: 'The All-In-One Height Adjustable Table For Every Need',
  description:
    'Smart, adaptable design that moves with you. Our height-adjustable table seamlessly transforms from a focused workstation to an immersive gaming setup. Enjoy ergonomic comfort, modern aesthetics, and the freedom to customise your space—your way.',
  buttonText: 'SHOP NOW',
  categorySlug: 'gaming',
  link: '#category-gaming',
  image:
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1600&q=85',
  active: true,
};

export default function CategorySpotlight({ onSelectCategory, onOpenProduct }) {
  const [spotlight, setSpotlight] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_admin_spotlight');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_SPOTLIGHT,
            ...parsed,
          };
        }
      }
    } catch {}
    return DEFAULT_SPOTLIGHT;
  });

  const [storageTick, setStorageTick] = useState(0);

  // Sync with storage updates from Admin
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('royal_admin_spotlight');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setSpotlight((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch {}
      setStorageTick((t) => t + 1);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('royal_storage_update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('royal_storage_update', handleStorage);
    };
  }, []);

  // Fetch live spotlight data from MongoDB via API
  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const res = await api.get('/banners?type=spotlight');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const item = res.data.data[0];
          setSpotlight((prev) => ({
            ...prev,
            ...item,
            description:
              item.description !== undefined && item.description !== null && item.description !== ''
                ? item.description
                : (prev.description || DEFAULT_SPOTLIGHT.description),
            buttonText: item.buttonText || prev.buttonText || 'SHOP NOW',
            categorySlug: item.categorySlug || prev.categorySlug || 'gaming',
          }));
        }
      } catch (err) {
        console.log('Error loading spotlight banner:', err.message);
      }
    };
    fetchSpotlight();
  }, [storageTick]);

  if (spotlight.active === false) {
    return null;
  }

  const handleActionClick = () => {
    const rawLink = spotlight.link || '';
    const rawCategory = spotlight.categorySlug || '';

    // If a category slug is specified or link is formatted as #category-slug
    const resolvedCategory = rawCategory || (rawLink.startsWith('#category-') ? rawLink.replace('#category-', '') : '');

    if (resolvedCategory && onSelectCategory) {
      onSelectCategory(resolvedCategory);
      return;
    }

    // If link is an anchor on the page (e.g. #shop-by-category, #new-collection)
    if (rawLink.startsWith('#')) {
      const el = document.querySelector(rawLink);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // If link is an absolute or relative URL
    if (rawLink && !rawLink.startsWith('#')) {
      window.location.href = rawLink;
      return;
    }

    // Fallback default category
    if (onSelectCategory) {
      onSelectCategory('gaming');
    }
  };

  return (
    <section id="category-spotlight" className="py-10 sm:py-16 bg-white overflow-hidden animate-fadeIn">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl grid grid-cols-1 lg:grid-cols-12 min-h-[500px] lg:min-h-[560px] items-stretch">
          
          {/* Left Column: Text & Information & CTA with Rich Decorative Aesthetics */}
          <div className="lg:col-span-6 relative flex flex-col justify-center items-center text-center px-6 sm:px-12 lg:px-16 py-12 lg:py-16 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 overflow-hidden">
            
            {/* Top-Left Ambient Glow & Geometric Accent Corner */}
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-emerald-900/20 rounded-tl-xl pointer-events-none hidden sm:block" />
            <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-emerald-700/30 pointer-events-none hidden sm:block" />

            {/* Bottom-Left Ambient Glow & Geometric Accent Corner */}
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-emerald-900/20 rounded-bl-xl pointer-events-none hidden sm:block" />
            <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-amber-600/30 pointer-events-none hidden sm:block" />

            {/* Subtle Top-Right & Bottom-Right Border Corner Accents */}
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-emerald-900/15 rounded-tr-lg pointer-events-none hidden lg:block" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-emerald-900/15 rounded-br-lg pointer-events-none hidden lg:block" />

            {/* Background Subtle Dot Matrix Watermark */}
            <div className="absolute inset-0 bg-[radial-gradient(#059669_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            {/* Content Box */}
            <div className="relative z-10 max-w-xl mx-auto space-y-5">
              
              {/* Top Luxury Pill Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-emerald-900/15 shadow-xs text-[11px] font-black tracking-widest text-emerald-900 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>SIGNATURE SPOTLIGHT</span>
              </div>

              {/* Main Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-serif leading-tight tracking-tight">
                {spotlight.title || DEFAULT_SPOTLIGHT.title}
              </h2>

              {/* Decorative Accent Divider Line */}
              <div className="flex items-center justify-center space-x-2 pt-1">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-emerald-800 rounded-full" />
                <div className="w-2 h-2 rotate-45 bg-amber-500 rounded-xs shadow-xs" />
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-emerald-800 rounded-full" />
              </div>

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal pt-1 whitespace-pre-line">
                {spotlight.description || DEFAULT_SPOTLIGHT.description}
              </p>

              {/* Micro-Features Tags */}
              <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
                <span className="inline-flex items-center text-[11px] font-bold text-slate-700 bg-white/95 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  Ergonomic Master Build
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-slate-700 bg-white/95 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  Premium Upholstery
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-slate-700 bg-white/95 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  Fast Doorstep Dispatch
                </span>
              </div>

              {/* Shop Now Action Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  onClick={handleActionClick}
                  className="group px-8 sm:px-12 py-3.5 sm:py-4 bg-slate-950 hover:bg-emerald-950 text-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-emerald-950/20 transform hover:-translate-y-0.5 inline-flex items-center space-x-3 cursor-pointer border border-white/10"
                >
                  <span>{spotlight.buttonText || 'SHOP NOW'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-amber-400" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Full-Bleed Product / Category Showcase Image */}
          <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[440px] lg:min-h-full overflow-hidden bg-slate-100 group">
            <img
              src={spotlight.image || DEFAULT_SPOTLIGHT.image}
              alt={spotlight.title || 'Category Spotlight'}
              onError={(e) => {
                e.target.src = DEFAULT_SPOTLIGHT.image;
              }}
              className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-105 select-none"
              loading="lazy"
            />
            
            {/* Top-Right Floating Badge */}
            <div className="absolute top-5 right-5 z-10 bg-slate-950/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full border border-white/20 text-[11px] font-black tracking-wider uppercase shadow-lg flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>ROYAL EDITION</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
