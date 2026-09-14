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
  X,
  CheckCircle2,
  Smartphone,
  Monitor,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';

const DEFAULT_BANNER_IMAGES = [
  {
    id: 'banner-1',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85',
    mobileImage: '',
    link: '#shop-by-category',
    active: true,
  },
  {
    id: 'banner-2',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=2000&q=85',
    mobileImage: '',
    link: '#shop-by-category',
    active: true,
  },
];

export default function BannerSlideshowManager() {
  const [slides, setSlides] = useState(DEFAULT_BANNER_IMAGES);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Top-level Dashboard View Selector: 'desktop' | 'mobile'
  const [activeDeviceView, setActiveDeviceView] = useState('desktop');

  const desktopFileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);
  const cardFileInputRefs = useRef({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch banners directly from MongoDB API on mount
  const loadBannersFromAPI = async () => {
    try {
      const res = await api.get('/banners?type=hero&status=all');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const formatted = res.data.data.map((b, idx) => ({
          id: b.id || b._id || `banner-${idx + 1}`,
          _id: b._id || b.id,
          image: b.image || '',
          mobileImage: b.mobileImage || '',
          link: b.link || '#shop-by-category',
          active: b.active !== false,
        }));
        setSlides(formatted);
      }
    } catch (err) {
      console.log('Error loading hero banners from MongoDB API:', err.message);
    }
  };

  useEffect(() => {
    loadBannersFromAPI();
  }, []);

  const saveSlides = async (newSlides, toastText = 'Banners updated and synced to live store!') => {
    setSlides(newSlides);
    setIsSaving(true);
    try {
      const res = await api.post('/banners', { banners: newSlides, type: 'hero' });
      if (res.data?.success && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map((b, idx) => ({
          id: b.id || b._id || `banner-${idx + 1}`,
          _id: b._id || b.id,
          image: b.image || '',
          mobileImage: b.mobileImage || '',
          link: b.link || '#shop-by-category',
          active: b.active !== false,
        }));
        setSlides(formatted);
      }
      window.dispatchEvent(new CustomEvent('royal_storage_update'));
      showToast(toastText);
    } catch (err) {
      console.error('Error saving hero banners to MongoDB:', err);
      showToast(err.response?.data?.message || 'Error saving to database. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = (id) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    saveSlides(updated, 'Banner visibility updated!');
  };

  const handleDeleteSlide = (id) => {
    if (slides.length <= 1) {
      alert('You must keep at least 1 banner.');
      return;
    }
    const updated = slides.filter((s) => s.id !== id);
    saveSlides(updated, 'Banner removed!');
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
      mobileImage: '',
      link: '#shop-by-category',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleDesktopFileUpload = (e) => {
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

  const handleMobileFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setEditingSlide((prev) => ({
            ...prev,
            mobileImage: uploadEvent.target.result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectDesktopCardUpload = (slideId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const updated = slides.map((s) =>
            s.id === slideId ? { ...s, image: uploadEvent.target.result } : s
          );
          saveSlides(updated, 'Desktop banner replaced successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectMobileCardUpload = (slideId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const updated = slides.map((s) =>
            s.id === slideId ? { ...s, mobileImage: uploadEvent.target.result } : s
          );
          saveSlides(updated, 'Mobile banner replaced successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!editingSlide?.image?.trim()) {
      alert('Please provide a Desktop Banner image (1920 × 600).');
      return;
    }

    const existingIdx = slides.findIndex(
      (s) => (editingSlide.id && s.id === editingSlide.id) || (editingSlide._id && s._id === editingSlide._id)
    );
    let updated;
    if (existingIdx > -1) {
      updated = [...slides];
      updated[existingIdx] = { ...editingSlide };
    } else {
      updated = [...slides, { ...editingSlide }];
    }
    saveSlides(updated, 'Banner saved and synced to live store!');
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

      {/* Main Header & Device View Toggle Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>HOMEPAGE HERO SLIDESHOW</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Hero Banners ({slides.length})
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Configure and switch between <strong>Desktop (1920 × 600)</strong> and <strong>Mobile (1080 × 1080)</strong> banner views.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex items-center p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 max-w-xl">
          <button
            onClick={() => setActiveDeviceView('desktop')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center space-x-2.5 cursor-pointer ${
              activeDeviceView === 'desktop'
                ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/70'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className={`w-4 h-4 sm:w-5 sm:h-5 ${activeDeviceView === 'desktop' ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span>1. Desktop Banners (1920 × 600)</span>
          </button>

          <button
            onClick={() => setActiveDeviceView('mobile')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center space-x-2.5 cursor-pointer ${
              activeDeviceView === 'mobile'
                ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/70'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className={`w-4 h-4 sm:w-5 sm:h-5 ${activeDeviceView === 'mobile' ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span>2. Mobile Banners (1080 × 1080)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DESKTOP BANNERS GRID (1920 × 600) */}
      {activeDeviceView === 'desktop' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 text-slate-700">
              <Monitor className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-black uppercase tracking-wider">
                Desktop Hero Slides (1920 × 600 px)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-bold">{slides.length} Slides</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-600/40 transition-all flex flex-col group"
              >
                {/* 1920x600 Ratio Box */}
                <div className="relative w-full aspect-[1920/600] bg-slate-950 overflow-hidden">
                  <img
                    src={slide.image}
                    alt={`Desktop Banner #${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85';
                    }}
                  />

                  {/* Order Badge */}
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full border border-white/20 shadow-md flex items-center space-x-1.5">
                    <Monitor className="w-3.5 h-3.5 text-amber-300" />
                    <span>Desktop #{index + 1} (1920×600)</span>
                  </div>

                  {/* Status Toggle */}
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
                <div className="p-4 bg-white flex items-center justify-between gap-2 border-t border-slate-100 mt-auto">
                  {/* Reorder Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition cursor-pointer"
                      title="Move Left"
                    >
                      <ArrowUp className="w-4 h-4 -rotate-90" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === slides.length - 1}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition cursor-pointer"
                      title="Move Right"
                    >
                      <ArrowDown className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>

                  {/* Edit / Quick Upload */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (cardFileInputRefs.current[`desktop-${slide.id}`] = el)}
                      onChange={(e) => handleDirectDesktopCardUpload(slide.id, e)}
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
                      <span>Edit Banner</span>
                    </button>

                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MOBILE BANNERS GRID (1080 × 1080 Square) */}
      {activeDeviceView === 'mobile' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 text-slate-700">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-black uppercase tracking-wider">
                Mobile Hero Slides (1080 × 1080 px Square)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-bold">{slides.length} Slides</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, index) => {
              const displayImage = slide.mobileImage && slide.mobileImage.trim() !== '' ? slide.mobileImage : slide.image;

              return (
                <div
                  key={slide.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-600/40 transition-all flex flex-col group"
                >
                  {/* 1080x1080 Square Ratio Box */}
                  <div className="relative w-full aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={displayImage}
                      alt={`Mobile Banner #${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85';
                      }}
                    />

                    {/* Order Badge */}
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full border border-white/20 shadow-md flex items-center space-x-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                      <span>Mobile #{index + 1} (1080×1080)</span>
                    </div>

                    {/* Status Toggle */}
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

                  {/* Bottom Bar Actions (Exact same options as Desktop) */}
                  <div className="p-4 bg-white flex items-center justify-between gap-2 border-t border-slate-100 mt-auto">
                    {/* Reorder Buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition cursor-pointer"
                        title="Move Left"
                      >
                        <ArrowUp className="w-4 h-4 -rotate-90" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 1)}
                        disabled={index === slides.length - 1}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition cursor-pointer"
                        title="Move Right"
                      >
                        <ArrowDown className="w-4 h-4 -rotate-90" />
                      </button>
                    </div>

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingSlide(slide);
                          setIsModalOpen(true);
                        }}
                        className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Banner</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      {isModalOpen && editingSlide && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Image className="w-5 h-5 text-emerald-700" />
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  {slides.some((s) => s.id === editingSlide.id) ? 'Edit Hero Banner' : 'Add Hero Banner'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-6">
              {/* 1. DESKTOP BANNER SECTION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <Monitor className="w-4 h-4 text-emerald-700" />
                    <span>1. Desktop Banner Image (1920 × 600 px) *</span>
                  </label>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-bold">Required</span>
                </div>

                <input
                  type="file"
                  ref={desktopFileInputRef}
                  accept="image/*"
                  onChange={handleDesktopFileUpload}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => desktopFileInputRef.current?.click()}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload 1920×600 File</span>
                  </button>
                  <input
                    type="text"
                    required
                    placeholder="Or paste Desktop Image URL (https://...)"
                    value={editingSlide.image}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                  />
                </div>

                {/* Desktop Preview */}
                {editingSlide.image && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase">Desktop Live Preview (1920 × 600):</span>
                    <div className="aspect-[1920/600] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner">
                      <img
                        src={editingSlide.image}
                        alt="Desktop Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. MOBILE BANNER SECTION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span>2. Mobile Banner Image (1080 × 1080 px Square)</span>
                  </label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">Recommended</span>
                </div>

                <input
                  type="file"
                  ref={mobileFileInputRef}
                  accept="image/*"
                  onChange={handleMobileFileUpload}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => mobileFileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload 1080×1080 File</span>
                  </button>
                  <input
                    type="text"
                    placeholder="Or paste Mobile Image URL (https://...)"
                    value={editingSlide.mobileImage || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, mobileImage: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                  />
                </div>

                {/* Mobile Preview */}
                {editingSlide.mobileImage ? (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase">Mobile Preview (1080 × 1080 Square):</span>
                      <button
                        type="button"
                        onClick={() => setEditingSlide({ ...editingSlide, mobileImage: '' })}
                        className="text-[10px] font-bold text-rose-600 hover:underline"
                      >
                        Clear Mobile Image
                      </button>
                    </div>
                    <div className="w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-950 shadow-md">
                      <img
                        src={editingSlide.mobileImage}
                        alt="Mobile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 italic">
                    If no mobile image is uploaded, mobile phones will automatically display the desktop image.
                  </p>
                )}
              </div>

              {/* Destination Link */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">
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
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Banner'}
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
