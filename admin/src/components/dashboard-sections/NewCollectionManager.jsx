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

const DEFAULT_NEWCOLL_SLIDES = [
  {
    id: 'newcoll-1',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
  },
  {
    id: 'newcoll-2',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
  },
  {
    id: 'newcoll-3',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
  },
  {
    id: 'newcoll-4',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
  },
];

export default function NewCollectionManager() {
  const [slides, setSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_newcoll_slides');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s, idx) => ({
            id: s.id || s._id || `newcoll-${idx + 1}`,
            image: s.image || '',
            link: s.link || '#new-collection',
            active: s.active !== false,
          }));
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_NEWCOLL_SLIDES;
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

  // Fetch New Collection banners from API on mount
  useEffect(() => {
    const loadBannersFromAPI = async () => {
      try {
        const res = await api.get('/banners?type=new_collection&status=all');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const formatted = res.data.data.map((b, idx) => ({
            id: b.id || b._id || `newcoll-${idx + 1}`,
            image: b.image,
            link: b.link || '#new-collection',
            active: b.active !== false,
          }));
          setSlides(formatted);
          localStorage.setItem('royal_newcoll_slides', JSON.stringify(formatted));
        }
      } catch (err) {
        console.log('Using local new collection banner cache:', err.message);
      }
    };
    loadBannersFromAPI();
  }, []);

  const saveSlides = async (newSlides, toastText = 'New Arrival banners updated and synced to store!') => {
    setSlides(newSlides);
    localStorage.setItem('royal_newcoll_slides', JSON.stringify(newSlides));
    try {
      window.dispatchEvent(new Event('royal_storage_update'));
    } catch {
      // ignore
    }

    try {
      await api.post('/banners', { banners: newSlides, type: 'new_collection' });
    } catch (err) {
      console.log('API new collection banner save note:', err.message);
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
      id: `newcoll-${Date.now()}`,
      image: '',
      link: '#new-collection',
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
          saveSlides(updated, 'Banner photo updated from file!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!editingSlide.image?.trim()) {
      alert('Please select or paste an image.');
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
    saveSlides(updated, 'New Arrival banner slide updated!');
    setIsModalOpen(false);
    setEditingSlide(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-300/40 flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-extrabold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Add Button */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>NEW ARRIVALS BANNER CONTROLLER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            New Arrivals Banners
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Upload, arrange, and manage banner images displayed above the "Explore New Arrival Chairs" section.
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

      {/* 2. Banner Photo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-600/40 transition-all flex flex-col group"
          >
            {/* Hidden File Input for direct card upload */}
            <input
              type="file"
              ref={(el) => (cardFileInputRefs.current[slide.id] = el)}
              onChange={(e) => handleDirectCardUpload(slide.id, e)}
              accept="image/*"
              className="hidden"
            />

            {/* Full Banner Photo Preview */}
            <div className="relative w-full aspect-[21/9] bg-slate-950 overflow-hidden">
              <img
                src={slide.image}
                alt={`New Arrival Banner #${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85';
                }}
              />

              {/* Order Badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full border border-white/20 shadow-md">
                Banner #{index + 1}
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
                <button
                  onClick={() => cardFileInputRefs.current[slide.id]?.click()}
                  className="px-3.5 py-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition flex items-center space-x-1.5 cursor-pointer"
                  title="Upload from Device"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>

                <button
                  onClick={() => {
                    setEditingSlide(slide);
                    setIsModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit URL</span>
                </button>

                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Add / Edit Banner Slide Modal (Mounted via createPortal) */}
      {isModalOpen && editingSlide && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Image className="w-5 h-5 text-emerald-700" />
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  {slides.some((s) => s.id === editingSlide.id)
                    ? 'Change New Arrival Banner'
                    : 'Add New Arrival Banner'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-5">
              {/* Image Upload or URL */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-2">
                  Banner Image Source
                </label>

                {/* Upload Button */}
                <div className="mb-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Upload Image from Device</span>
                  </button>
                </div>

                <div className="flex items-center my-3">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="px-3 text-[11px] font-bold text-slate-400 uppercase">
                    OR Paste Image URL
                  </span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingSlide.image}
                  onChange={(e) =>
                    setEditingSlide((prev) => ({ ...prev, image: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
                />
              </div>

              {/* Live Preview */}
              {editingSlide.image && (
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Image Preview
                  </label>
                  <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner relative">
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

              {/* Destination Link */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center space-x-1">
                  <Link2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Target Link (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="#new-collection or #shop-by-category"
                  value={editingSlide.link || ''}
                  onChange={(e) =>
                    setEditingSlide((prev) => ({ ...prev, link: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  Publish Banner Immediately
                </span>
                <input
                  type="checkbox"
                  checked={editingSlide.active}
                  onChange={(e) =>
                    setEditingSlide((prev) => ({ ...prev, active: e.target.checked }))
                  }
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition cursor-pointer"
                >
                  Save Banner Photo
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
