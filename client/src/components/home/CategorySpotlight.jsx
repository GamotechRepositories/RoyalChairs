import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
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
    <section id="category-spotlight" className="py-8 sm:py-16 bg-white overflow-hidden animate-fadeIn">
      <div className="w-full max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] lg:min-h-[560px] items-stretch">
          
          {/* Left Column: Text & Information & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center text-center px-6 sm:px-12 lg:px-16 py-10 lg:py-14 bg-white">
            <div className="max-w-xl mx-auto space-y-5">
              
              {/* Main Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-serif leading-tight tracking-tight">
                {spotlight.title || DEFAULT_SPOTLIGHT.title}
              </h2>

              {/* Decorative Accent Underline */}
              <div className="w-16 h-0.5 bg-slate-900 mx-auto rounded-full" />

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal pt-1 whitespace-pre-line">
                {spotlight.description || DEFAULT_SPOTLIGHT.description}
              </p>

              {/* Shop Now Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  onClick={handleActionClick}
                  className="px-8 sm:px-12 py-3.5 sm:py-4 bg-black hover:bg-emerald-950 text-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center space-x-3 cursor-pointer"
                >
                  <span>{spotlight.buttonText || 'SHOP NOW'}</span>
                  <ArrowRight className="w-4 h-4" />
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
          </div>

        </div>
      </div>
    </section>
  );
}
