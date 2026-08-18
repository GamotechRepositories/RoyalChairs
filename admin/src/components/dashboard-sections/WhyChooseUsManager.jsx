import { useState } from 'react';
import { Star, ShieldCheck, Plus, Trash2, Edit3, Sparkles, Check } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function WhyChooseUsManager() {
  const { reviews, setReviews, deleteReview, moderateReview } = useAdminData();

  const [craftBanner, setCraftBanner] = useState(() => {
    const saved = localStorage.getItem('royal_admin_craft_banner');
    return saved
      ? JSON.parse(saved)
      : {
        badge: 'THE MATERIALS & CRAFT',
        title: 'From FSC English Oak Forests to Hand-Stitched Italian Nappa Leather',
        description: 'Unlike mass-market plastic chairs that break easily, every RoyalChairs model features an internal heavy-duty steel backbone encased in high-density molded memory foam.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
        caption: 'Master Craftsman Workshop • Gloucestershire, UK',
      };
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const saveCraftBanner = () => {
    localStorage.setItem('royal_admin_craft_banner', JSON.stringify(craftBanner));
    alert('Craftsmanship Story Banner saved successfully!');
  };

  const handleOpenAddReview = () => {
    setEditingReview({
      id: `REV-${Date.now().toString().slice(-4)}`,
      customer: 'Lord Alistair Sterling',
      role: 'Verified Buyer & Interior Architect',
      rating: 5,
      comment: 'The Sovereign Ergonomic Task Pro saved my back after 10-hour design sessions. The velvet quality surpasses European luxury brands.',
      product: 'The Sovereign Ergonomic Task Pro',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      location: 'London, UK',
      status: 'Approved',
    });
    setIsReviewModalOpen(true);
  };

  const handleSaveReviewModal = (e) => {
    e.preventDefault();
    const existingIdx = reviews.findIndex((r) => r.id === editingReview.id);
    let updated;
    if (existingIdx > -1) {
      updated = [...reviews];
      updated[existingIdx] = editingReview;
    } else {
      updated = [editingReview, ...reviews];
    }
    setReviews(updated);
    localStorage.setItem('royal_admin_reviews', JSON.stringify(updated));
    setIsReviewModalOpen(false);
    setEditingReview(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Craftsmanship Banner CRUD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-black text-slate-900 font-serif border-b border-slate-100 pb-3">
          Craftsmanship Story Banner CRUD
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Banner Badge Tag
            </label>
            <input
              type="text"
              value={craftBanner.badge}
              onChange={(e) => setCraftBanner({ ...craftBanner, badge: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-amber-700 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Banner Main Heading
            </label>
            <input
              type="text"
              value={craftBanner.title}
              onChange={(e) => setCraftBanner({ ...craftBanner, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Craftsmanship Story Description
            </label>
            <textarea
              rows={2}
              value={craftBanner.description}
              onChange={(e) => setCraftBanner({ ...craftBanner, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Craftsmanship Image URL
            </label>
            <input
              type="url"
              value={craftBanner.image}
              onChange={(e) => setCraftBanner({ ...craftBanner, image: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              Location Badge Overlay
            </label>
            <input
              type="text"
              value={craftBanner.caption}
              onChange={(e) => setCraftBanner({ ...craftBanner, caption: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveCraftBanner}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition cursor-pointer"
          >
            Save Craftsmanship Banner
          </button>
        </div>
      </div>

      {/* Customer Reviews Full CRUD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-serif">
              Customer Reviews Slideshow CRUD ({reviews.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add, edit, or delete customer reviews that appear in the homepage slideshow carousel.
            </p>
          </div>

          <button
            onClick={handleOpenAddReview}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Review</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 space-y-3 hover:bg-slate-50/50 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={rev.customer}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-serif">
                      {rev.customer || rev.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {rev.role} {rev.location ? `• ${rev.location}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setEditingReview(rev);
                      setIsReviewModalOpen(true);
                    }}
                    className="p-2 text-slate-600 hover:text-emerald-800 bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                "{rev.comment}"
              </p>

              <div className="text-[11px] text-slate-500 font-bold flex items-center space-x-2">
                <span>Purchased Product:</span>
                <span className="text-emerald-800">{rev.product || rev.productName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-900 font-serif mb-4 pb-2 border-b border-slate-100">
              {reviews.some((r) => r.id === editingReview.id) ? 'Edit Review' : 'Add New Review'}
            </h2>

            <form onSubmit={handleSaveReviewModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Reviewer Name
                </label>
                <input
                  type="text"
                  required
                  value={editingReview.customer || editingReview.name}
                  onChange={(e) => setEditingReview({ ...editingReview, customer: e.target.value, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReview.role || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReview.location || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Purchased Chair Name
                </label>
                <input
                  type="text"
                  required
                  value={editingReview.product || editingReview.productName || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, product: e.target.value, productName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editingReview.avatar || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, avatar: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Review Comment Text
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingReview.comment || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
