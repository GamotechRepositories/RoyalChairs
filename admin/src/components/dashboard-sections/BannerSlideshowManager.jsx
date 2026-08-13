import { useState } from 'react';
import { Sparkles, Plus, Trash2, Edit3, Image, Check, Eye, ChevronRight, Layers } from 'lucide-react';

const INITIAL_SLIDES = [
  {
    id: 'slide-1',
    tag: 'ROYAL HERITAGE COLLECTION',
    title: 'Handcrafted Ergonomic Luxury Armchairs',
    subtitle: 'Co-developed with UK spine biomechanists. Made with solid English oak & stain-resistant Italian Nappa leather.',
    ctaText: 'Explore Royal Seats',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    active: true,
  },
  {
    id: 'slide-2',
    tag: 'SPINAL ORTHOPEDIC SERIES',
    title: 'The Sovereign Task Pro Ergonomic Throne',
    subtitle: 'Dynamic lumbar tracking mechanism with 4D precision armrests and breathable micro-mesh backing.',
    ctaText: 'Shop Ergonomic Range',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=1200&q=80',
    active: true,
  },
  {
    id: 'slide-3',
    tag: 'EXECUTIVE SUITE 2026',
    title: 'Monarch High-Back Executive Leather Chairs',
    subtitle: 'Uncompromising prestige for boardrooms and luxury private study suites. 10-Year Master Frame Guarantee.',
    ctaText: 'View Executive Suite',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=1200&q=80',
    active: true,
  },
];

export default function BannerSlideshowManager() {
  const [slides, setSlides] = useState(() => {
    const saved = localStorage.getItem('royal_admin_slides');
    return saved ? JSON.parse(saved) : INITIAL_SLIDES;
  });

  const [editingSlide, setEditingSlide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveSlides = (newSlides) => {
    setSlides(newSlides);
    localStorage.setItem('royal_admin_slides', JSON.stringify(newSlides));
  };

  const handleToggleActive = (id) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    saveSlides(updated);
  };

  const handleDeleteSlide = (id) => {
    if (slides.length <= 1) {
      alert('You must keep at least 1 active hero slide.');
      return;
    }
    const updated = slides.filter((s) => s.id !== id);
    saveSlides(updated);
  };

  const handleOpenAddModal = () => {
    setEditingSlide({
      id: `slide-${Date.now()}`,
      tag: 'NEW EXCLUSIVE PROMO',
      title: 'New Luxury Seating Release',
      subtitle: 'Experience supreme comfort handcrafted with premium English oak and plush velvets.',
      ctaText: 'Discover Collection',
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    const existingIdx = slides.findIndex((s) => s.id === editingSlide.id);
    let updated;
    if (existingIdx > -1) {
      updated = [...slides];
      updated[existingIdx] = editingSlide;
    } else {
      updated = [...slides, editingSlide];
    }
    saveSlides(updated);
    setIsModalOpen(false);
    setEditingSlide(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>HERO SLIDESHOW CONTROLLER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Banner Slideshow Handling
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Customize homepage hero slideshow images, headlines, sub-taglines, CTA buttons, and slide ordering.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Slides List Grid */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-emerald-700/30 transition"
          >
            {/* Slide Preview Image */}
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <span className="w-8 h-8 rounded-full bg-slate-100 font-black text-xs text-slate-600 flex items-center justify-center flex-shrink-0">
                #{index + 1}
              </span>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-28 h-20 object-cover rounded-xl border border-slate-200 shadow-2xs flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 inline-block mb-1">
                  {slide.tag}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-serif truncate">
                  {slide.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {slide.subtitle}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
              <button
                onClick={() => handleToggleActive(slide.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  slide.active
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-300'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${slide.active ? 'text-emerald-700' : 'opacity-0'}`} />
                <span>{slide.active ? 'Active' : 'Disabled'}</span>
              </button>

              <button
                onClick={() => {
                  setEditingSlide(slide);
                  setIsModalOpen(true);
                }}
                className="p-2.5 text-slate-600 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 transition cursor-pointer"
                title="Edit Slide"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDeleteSlide(slide.id)}
                className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer"
                title="Delete Slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Modal */}
      {isModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-900 font-serif mb-4 pb-2 border-b border-slate-100">
              {slides.some((s) => s.id === editingSlide.id) ? 'Edit Hero Banner Slide' : 'Add New Hero Slide'}
            </h2>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Header Badge Tag
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.tag}
                  onChange={(e) => setEditingSlide({ ...editingSlide, tag: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Sub-description Paragraph
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingSlide.subtitle}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Call to Action Button Text
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.ctaText}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editingSlide.image}
                  onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
                {editingSlide.image && (
                  <img
                    src={editingSlide.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl mt-2 border border-slate-200"
                  />
                )}
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
                  Save Slide Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
