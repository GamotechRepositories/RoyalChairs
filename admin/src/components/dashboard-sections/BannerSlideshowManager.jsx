import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Image,
  Check,
  Upload,
  ArrowUp,
  ArrowDown,
  Link2,
  X,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';

const DEFAULT_BANNER_IMAGES = [
  {
    id: 'banner-1',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85',
    link: '#shop-by-category',
    active: true,
  },
  {
    id: 'banner-2',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=2000&q=85',
    link: '#shop-by-category',
    active: true,
  },
];

export default function BannerSlideshowManager() {
  const [slides, setSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_admin_slides');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s, idx) => ({
            id: s.id || s._id || `banner-${idx + 1}`,
            image: s.image || '',
            link: s.link || '',
            active: s.active !== false,
          }));
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_BANNER_IMAGES;
  });

  const [editingSlide, setEditingSlide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);
  const cardFileInputRefs = useRef({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch banners from API on mount
  useEffect(() => {
    const loadBannersFromAPI = async () => {
      try {
        const res = await api.get('/banners?status=all');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const formatted = res.data.data.map((b, idx) => ({
            id: b.id || b._id || `banner-${idx + 1}`,
            image: b.image,
            link: b.link || '#shop-by-category',
            active: b.active !== false,
          }));
          setSlides(formatted);
          localStorage.setItem('royal_admin_slides', JSON.stringify(formatted));
        }
      } catch (err) {
        console.log('Using local banner slides cache:', err.message);
      }
    };
    loadBannersFromAPI();
  }, []);

  const saveSlides = async (newSlides, toastText = 'Banner photos updated and synced to store!') => {
    setSlides(newSlides);
    localStorage.setItem('royal_admin_slides', JSON.stringify(newSlides));
    try {
      window.dispatchEvent(new Event('royal_storage_update'));
    } catch {
      // ignore
    }

    try {
      await api.post('/banners', { banners: newSlides });
    } catch (err) {
      console.log('API banner save note (saved locally):', err.message);
    }

    showToast(toastText);
  };

  const handleToggleActive = (id) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    saveSlides(updated, 'Banner visibility updated!');
  };

  const handleDeleteSlide = (id) => {
    if (slides.length <= 1) {
      alert('You must keep at least 1 banner image.');
      return;
    }
    const updated = slides.filter((s) => s.id !== id);
    saveSlides(updated, 'Banner photo removed!');
  };

  const handleMove = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    saveSlides(updated, 'Banner order updated!');
  };

  const handleOpenAddModal = () => {
    setEditingSlide({
      id: `banner-${Date.now()}`,
      image: '',
      link: '#shop-by-category',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setEditingSlide((prev) => ({
            ...prev,
            image: uploadEvent.target.result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectCardUpload = (slideId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const updated = slides.map((s) =>
            s.id === slideId ? { ...s, image: uploadEvent.target.result } : s
          );
          saveSlides(updated, 'Photo replaced successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!editingSlide?.image?.trim()) {
      alert('Please select or paste a banner image.');
      return;
    }

    const existingIdx = slides.findIndex((s) => s.id === editingSlide.id);
    let updated;
    if (existingIdx > -1) {
      updated = [...slides];
      updated[existingIdx] = editingSlide;
    } else {
      updated = [...slides, editingSlide];
    }
    saveSlides(updated, 'Banner photo saved and synced to store!');
    setIsModalOpen(false);
    setEditingSlide(null);
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
            <span>HOMEPAGE HERO SLIDESHOW</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Banner Photos ({slides.length})
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Upload, change, or rearrange full-width photo banners (1920x600) displayed on the live store.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Banner Photo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-600/40 transition-all flex flex-col group"
          >
            {/* Full Banner Photo Preview (1920x600) */}
            <div className="relative w-full aspect-[1920/600] bg-slate-950 overflow-hidden">
              <img
                src={slide.image}
                alt={`Banner Photo #${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85';
                }}
              />

              {/* Order Badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full border border-white/20 shadow-md">
                Photo #{index + 1}
              </div>

              {/* Active / Inactive Status Badge */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => handleToggleActive(slide.id)}
                  className={`px-3 py-1 rounded-full text-xs font-black transition backdrop-blur-md flex items-center space-x-1.5 shadow-md cursor-pointer ${
                    slide.active
                      ? 'bg-emerald-600/90 text-white border border-emerald-400/40'
                      : 'bg-slate-900/80 text-slate-300 border border-white/20'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${slide.active ? 'opacity-100' : 'opacity-40'}`} />
                  <span>{slide.active ? 'Active' : 'Hidden'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Bar Actions */}
            <div className="p-4 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
              {/* Order Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition cursor-pointer"
                  title="Move Left / Earlier"
                >
                  <ArrowUp className="w-4 h-4 -rotate-90" />
                </button>
                <button
                  onClick={() => handleMove(index, 1)}
                  disabled={index === slides.length - 1}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition cursor-pointer"
                  title="Move Right / Later"
                >
                  <ArrowDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Hidden Quick Upload Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => (cardFileInputRefs.current[slide.id] = el)}
                  onChange={(e) => handleDirectCardUpload(slide.id, e)}
                  className="hidden"
                />

                <button
                  onClick={() => {
                    setEditingSlide(slide);
                    setIsModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>

                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Slide Modal */}
      {isModalOpen && editingSlide && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Image className="w-5 h-5 text-emerald-700" />
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  {slides.some((s) => s.id === editingSlide.id) ? 'Change Banner Photo' : 'Add Banner Photo'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* File Upload Button & URL input */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-2">
                  Upload Image from Device
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl text-xs font-bold text-slate-700 flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-emerald-700" />
                  <span>Click to choose photo from computer</span>
                  <span className="text-[10px] text-slate-400 font-normal">PNG, JPG, WEBP recommended (1920x600)</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest absolute">
                  OR PASTE IMAGE URL
                </span>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Banner Photo URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or upload above"
                  value={editingSlide.image}
                  onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              {/* Live Preview */}
              {editingSlide.image && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Banner Live Preview (1920x600 Ratio):</span>
                  <div className="aspect-[1920/600] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                    <img
                      src={editingSlide.image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85';
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Click Link / Destination (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. #shop-by-category or /shop"
                  value={editingSlide.link || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
