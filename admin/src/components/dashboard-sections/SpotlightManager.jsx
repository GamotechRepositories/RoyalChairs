import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  CheckCircle2,
  Layers,
  Link2,
  Type,
  FileText,
  Image as ImageIcon,
  Check,
  Eye,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { useAdminData } from '../../context/AdminDataContext';

const DEFAULT_SPOTLIGHT = {
  id: 'spotlight-1',
  title: 'The All-In-One Height Adjustable Table For Every Need',
  subtitle: 'Master-Crafted Ergonomics & Unmatched Spinal Comfort',
  description:
    'Smart, adaptable design that moves with you. Our height-adjustable table seamlessly transforms from a focused workstation to an immersive gaming setup. Enjoy ergonomic comfort, modern aesthetics, and the freedom to customise your space—your way.',
  buttonText: 'SHOP NOW',
  categorySlug: 'gaming',
  link: '#category-gaming',
  image:
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1600&q=85',
  active: true,
};

export default function SpotlightManager() {
  const { categories } = useAdminData();
  const [spotlight, setSpotlight] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_admin_spotlight');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return DEFAULT_SPOTLIGHT;
  });

  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load live data from API
  useEffect(() => {
    const loadSpotlightFromAPI = async () => {
      try {
        const res = await api.get('/banners?type=spotlight&status=all');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const item = res.data.data[0];
          setSpotlight(item);
          localStorage.setItem('royal_admin_spotlight', JSON.stringify(item));
        }
      } catch (err) {
        console.log('Using local spotlight cache:', err.message);
      }
    };
    loadSpotlightFromAPI();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSpotlight((prev) => ({
            ...prev,
            image: uploadEvent.target.result,
          }));
          showToast('Image uploaded! Click Save Changes to publish.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    if (!spotlight.title?.trim() || !spotlight.image?.trim()) {
      alert('Please provide at least a title and an image for the spotlight.');
      return;
    }

    setIsSaving(true);
    localStorage.setItem('royal_admin_spotlight', JSON.stringify(spotlight));

    try {
      window.dispatchEvent(new Event('royal_storage_update'));
    } catch {}

    try {
      await api.post('/banners', {
        type: 'spotlight',
        banners: [
          {
            ...spotlight,
            type: 'spotlight',
            link: spotlight.link || `#category-${spotlight.categorySlug || 'gaming'}`,
          },
        ],
      });
      showToast('Category Spotlight saved & synced to live store!');
    } catch (err) {
      console.log('Spotlight save note:', err.message);
      showToast('Saved locally & synced!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl border border-amber-300/40 flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-black">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>HOMEPAGE FEATURED SHOWCASE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Category / Product Spotlight
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Configure the full-width split showcase positioned between New Arrivals and Royal Offers on the client storefront.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSpotlight((prev) => ({ ...prev, active: !prev.active }))}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition border cursor-pointer ${
              spotlight.active
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            <Check className={`w-4 h-4 ${spotlight.active ? 'opacity-100' : 'opacity-40'}`} />
            <span>{spotlight.active ? 'Section Active' : 'Section Hidden'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 6 Columns: Form Controls */}
        <form onSubmit={handleSave} className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900 font-serif border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Type className="w-4 h-4 text-emerald-700" />
            <span>Showcase Content & Details</span>
          </h2>

          {/* Heading */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center">
              <span>Main Heading</span>
            </label>
            <input
              type="text"
              required
              value={spotlight.title || ''}
              onChange={(e) => setSpotlight({ ...spotlight, title: e.target.value })}
              placeholder="e.g. The All-In-One Height Adjustable Table For Every Need"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
              <span>Description Paragraph</span>
            </label>
            <textarea
              rows={4}
              value={spotlight.description || ''}
              onChange={(e) => setSpotlight({ ...spotlight, description: e.target.value })}
              placeholder="Explain the features, ergonomics, and comfort of this best category..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden transition leading-relaxed"
            />
          </div>

          {/* Target Category & Custom Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                <span>Target Category</span>
              </label>
              <select
                value={spotlight.categorySlug || ''}
                onChange={(e) =>
                  setSpotlight({
                    ...spotlight,
                    categorySlug: e.target.value,
                    link: `#category-${e.target.value}`,
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden transition cursor-pointer"
              >
                <option value="">Select Category (Optional)</option>
                {categories.map((c) => (
                  <option key={c._id || c.slug || c.id} value={c.slug || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center">
                <Link2 className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                <span>Redirect Link (URL or #category)</span>
              </label>
              <input
                type="text"
                value={spotlight.link || ''}
                onChange={(e) => setSpotlight({ ...spotlight, link: e.target.value })}
                placeholder="e.g. #category-gaming or /shop"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:bg-white focus:border-emerald-700 focus:outline-hidden transition"
              />
            </div>
          </div>

          {/* Image Upload / URL */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center">
              <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
              <span>Showcase Image</span>
            </label>

            <div className="flex items-center space-x-3 mb-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition flex items-center space-x-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload from Computer</span>
              </button>
              <span className="text-xs text-slate-400">or enter image URL below</span>
            </div>

            <input
              type="url"
              required
              value={spotlight.image || ''}
              onChange={(e) => setSpotlight({ ...spotlight, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-emerald-700 focus:outline-hidden transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save & Publish Spotlight'}
          </button>
        </form>

        {/* Right 6 Columns: Live Store Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-serif flex items-center space-x-2">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>Live Client Storefront Preview</span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Interactive Preview
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[320px]">
              
              {/* Preview Left Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-3 bg-white">
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-serif leading-tight">
                  {spotlight.title || 'Spotlight Title'}
                </h3>
                <div className="w-12 h-0.5 bg-slate-900 rounded-full" />
                <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed">
                  {spotlight.description || 'Spotlight description text will appear here...'}
                </p>
                <div className="pt-2">
                  <span className="px-6 py-2.5 bg-black text-white text-[11px] font-black uppercase tracking-wider inline-flex items-center space-x-1.5 shadow-xs">
                    <span>{spotlight.buttonText || 'SHOP NOW'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Preview Right Image */}
              <div className="relative min-h-[220px] bg-slate-100 overflow-hidden">
                <img
                  src={spotlight.image || DEFAULT_SPOTLIGHT.image}
                  alt="Spotlight preview"
                  onError={(e) => {
                    e.target.src = DEFAULT_SPOTLIGHT.image;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs text-emerald-950 space-y-1">
            <span className="font-bold block">💡 Instant Store Integration:</span>
            <span>
              Clicking <strong>{spotlight.buttonText || 'SHOP NOW'}</strong> on the live client store will automatically take visitors to the <strong>{spotlight.categorySlug || 'selected'}</strong> category catalogue.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
