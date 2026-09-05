import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Star,
  ShieldCheck,
  Sparkles,
  Award,
  Truck,
  Plus,
  Trash2,
  Edit3,
  Check,
  Upload,
  X,
  Layers,
  FileText,
  MessageSquareQuote,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';


const DEFAULT_CRAFT_BANNER = {
  badge: 'THE MATERIALS & CRAFT',
  title: 'From FSC English Oak Forests to Hand-Stitched Italian Nappa Leather',
  description:
    'Unlike mass-market plastic chairs that break easily, every RoyalChairs model features an internal heavy-duty steel backbone encased in high-density molded memory foam.',
  image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
  caption: 'Master Craftsman Workshop • Gloucestershire, UK',
};

export default function WhyChooseUsManager() {
  const [activeSubTab, setActiveSubTab] = useState('craftsmanship'); // 'craftsmanship', 'reviews'
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);


  // 2. Craft banner state
  const [craftBanner, setCraftBanner] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_admin_craft_banner');
      if (saved) return { ...DEFAULT_CRAFT_BANNER, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_CRAFT_BANNER;
  });

  // 3. Reviews state (Loaded via API or local storage, no hardcoded defaults)
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_admin_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [saveToast, setSaveToast] = useState('');

  const triggerToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const dispatchStorageUpdate = () => {
    try {
      window.dispatchEvent(new Event('royal_storage_update'));
    } catch {
      // ignore
    }
  };

  // Load reviews directly from API on mount
  useEffect(() => {
    const loadReviewsFromAPI = async () => {
      try {
        const res = await api.get('/reviews?status=all');
        if (res.data?.success && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((r) => ({
            id: r.id || r._id,
            name: r.userName || r.name || r.customer || '',
            role: r.userRole || r.role || 'Verified Buyer',
            location: r.location || 'London, UK',
            rating: r.rating || 5,
            comment: r.comment || '',
            productName: r.productName || r.product || 'Royal Handcrafted Seating',
            avatar:
              r.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          }));
          setReviewsList(formatted);
          localStorage.setItem('royal_admin_reviews', JSON.stringify(formatted));
          dispatchStorageUpdate();
        }
      } catch (err) {
        console.log('Using local reviews cache:', err.message);
      }
    };
    loadReviewsFromAPI();
  }, []);


  // Save Craftsmanship Banner
  const handleSaveCraftBanner = () => {
    localStorage.setItem('royal_admin_craft_banner', JSON.stringify(craftBanner));
    dispatchStorageUpdate();
    triggerToast('Craftsmanship Story Banner saved and synced to store!');
  };

  const handleBannerFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCraftBanner((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reviews CRUD
  const handleOpenAddReview = () => {
    setEditingReview({
      id: `rev-${Date.now()}`,
      name: '',
      role: 'Verified Buyer',
      location: 'London, UK',
      rating: 5,
      comment: '',
      productName: 'Royal Handcrafted Seating',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });
    setIsReviewModalOpen(true);
  };

  const handleEditReview = (rev) => {
    setEditingReview({
      id: rev.id || rev._id || `rev-${Date.now()}`,
      name: rev.name || rev.userName || rev.customer || '',
      role: rev.role || rev.userRole || 'Verified Buyer',
      location: rev.location || 'London, UK',
      rating: rev.rating || 5,
      comment: rev.comment || '',
      productName: rev.productName || rev.product || 'Royal Handcrafted Seating',
      avatar:
        rev.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = async (id) => {
    try {
      if (id && id.length === 24 && !id.startsWith('rev-')) {
        await api.delete(`/reviews/${id}`);
      }
    } catch (err) {
      console.log('API delete review note:', err.message);
    }

    const updated = reviewsList.filter((r) => (r.id || r._id) !== id);
    setReviewsList(updated);
    localStorage.setItem('royal_admin_reviews', JSON.stringify(updated));
    dispatchStorageUpdate();
    triggerToast('Review deleted successfully!');
  };

  const handleSaveReviewModal = async (e) => {
    e.preventDefault();
    if (!editingReview.name.trim() || !editingReview.comment.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    let savedItem = { ...editingReview };

    try {
      const payload = {
        userName: editingReview.name.trim(),
        name: editingReview.name.trim(),
        role: editingReview.role || 'Verified Buyer',
        userRole: editingReview.role || 'Verified Buyer',
        rating: Number(editingReview.rating) || 5,
        comment: editingReview.comment.trim(),
        location: editingReview.location || 'London, UK',
        avatar:
          editingReview.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        productName: editingReview.productName || 'Royal Handcrafted Seating',
        status: 'approved',
      };

      if (editingReview.id && editingReview.id.length === 24 && !editingReview.id.startsWith('rev-')) {
        // Update existing API review
        const res = await api.put(`/reviews/${editingReview.id}`, payload);
        if (res.data?.success && res.data.data) {
          savedItem = {
            id: res.data.data.id || res.data.data._id,
            name: res.data.data.name || res.data.data.userName,
            role: res.data.data.role || res.data.data.userRole,
            location: res.data.data.location,
            rating: res.data.data.rating,
            comment: res.data.data.comment,
            productName: res.data.data.productName,
            avatar: res.data.data.avatar,
          };
        }
      } else {
        // Create new review in API
        const res = await api.post('/reviews', payload);
        if (res.data?.success && res.data.data) {
          savedItem = {
            id: res.data.data.id || res.data.data._id,
            name: res.data.data.name || res.data.data.userName,
            role: res.data.data.role || res.data.data.userRole,
            location: res.data.data.location,
            rating: res.data.data.rating,
            comment: res.data.data.comment,
            productName: res.data.data.productName,
            avatar: res.data.data.avatar,
          };
        }
      }
    } catch (err) {
      console.log('API save note (saving locally):', err.message);
    }

    const existingIdx = reviewsList.findIndex((r) => (r.id || r._id) === editingReview.id);
    let updated;
    if (existingIdx > -1) {
      updated = [...reviewsList];
      updated[existingIdx] = savedItem;
    } else {
      updated = [savedItem, ...reviewsList];
    }

    setReviewsList(updated);
    localStorage.setItem('royal_admin_reviews', JSON.stringify(updated));
    dispatchStorageUpdate();
    setIsReviewModalOpen(false);
    setEditingReview(null);
    triggerToast('Review saved and synced to client store!');
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingReview((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const iconOptions = [
    { name: 'ShieldCheck', label: 'Shield / Quality' },
    { name: 'Sparkles', label: 'Sparkles / Luxury' },
    { name: 'Award', label: 'Award / Warranty' },
    { name: 'Truck', label: 'Truck / Delivery' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl border border-amber-300/40 flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-black">{saveToast}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>HOMEPAGE VALUE STORY & REVIEWS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Why Choose Us & Reviews
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage Craftsmanship Story Banner and Verified Customer Reviews.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">

          <button
            onClick={() => setActiveSubTab('craftsmanship')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'craftsmanship'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Craft Story</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'reviews'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-white'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Reviews ({reviewsList.length})</span>
          </button>
        </div>
      </div>



      {/* TAB 2: CRAFTSMANSHIP STORY BANNER */}
      {activeSubTab === 'craftsmanship' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 font-serif">
                  Craftsmanship Story Banner
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  The green luxury craftsmanship showcase section on the homepage.
                </p>
              </div>

              <button
                onClick={handleSaveCraftBanner}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Craft Story</span>
              </button>
            </div>

            {/* Live Preview Card */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2">Live Banner Preview</span>
              <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 items-center shadow-lg">
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-amber-300 bg-emerald-800/80 px-2.5 py-1 rounded-full border border-amber-300/30 uppercase tracking-widest">
                    {craftBanner.badge || 'THE MATERIALS & CRAFT'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-serif text-white leading-tight">
                    {craftBanner.title}
                  </h3>
                  <p className="text-emerald-100 text-xs leading-relaxed">
                    {craftBanner.description}
                  </p>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-md h-48 sm:h-56">
                  <img
                    src={craftBanner.image}
                    alt="Craftsmanship Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[10px] font-bold text-amber-200 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-300/30">
                      {craftBanner.caption}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={craftBanner.badge}
                  onChange={(e) => setCraftBanner({ ...craftBanner, badge: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-amber-800 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={craftBanner.title}
                  onChange={(e) => setCraftBanner({ ...craftBanner, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Story Description
                </label>
                <textarea
                  rows={3}
                  value={craftBanner.description}
                  onChange={(e) => setCraftBanner({ ...craftBanner, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Workshop Image URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={craftBanner.image}
                    onChange={(e) => setCraftBanner({ ...craftBanner, image: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleBannerFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl border border-slate-200 transition text-xs font-bold flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Location Overlay Caption
                </label>
                <input
                  type="text"
                  value={craftBanner.caption}
                  onChange={(e) => setCraftBanner({ ...craftBanner, caption: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleSaveCraftBanner}
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Craft Story</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER REVIEWS */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  Customer Reviews ({reviewsList.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified reviews stored in the database and shown on the live store.
                </p>
              </div>

              <button
                onClick={handleOpenAddReview}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Review</span>
              </button>
            </div>

            {reviewsList.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquareQuote className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 font-serif">
                    No Customer Reviews Yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Click "Add New Review" above to create your first verified customer review. It will instantly sync to the client website via the API.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddReview}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Review</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviewsList.map((rev) => (
                  <div key={rev.id || rev._id} className="p-6 hover:bg-slate-50/60 transition space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={rev.name || rev.customer}
                          className="w-12 h-12 rounded-full object-cover border-2 border-emerald-800/20 shadow-xs shrink-0"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-extrabold text-slate-900 font-serif">
                              {rev.name || rev.customer}
                            </h3>
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Verified
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {rev.role} {rev.location ? `• ${rev.location}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 self-end sm:self-auto">
                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>

                        <button
                          onClick={() => handleEditReview(rev)}
                          className="p-2 text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 rounded-xl transition cursor-pointer border border-slate-200"
                          title="Edit Review"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteReview(rev.id || rev._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-slate-200"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic bg-white p-3.5 rounded-xl border border-slate-200/70">
                      "{rev.comment}"
                    </p>

                    <div className="text-[11px] text-slate-500 font-bold flex items-center space-x-1.5">
                      <span>Purchased Product:</span>
                      <span className="text-emerald-900 font-extrabold">{rev.productName || rev.product}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Add / Edit Modal */}
      {isReviewModalOpen && editingReview && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <MessageSquareQuote className="w-5 h-5 text-emerald-700" />
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  {reviewsList.some((r) => (r.id || r._id) === editingReview.id) ? 'Edit Review' : 'Add New Review'}
                </h2>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReviewModal} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Reviewer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord Alistair Sterling"
                  value={editingReview.name}
                  onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified Buyer"
                    value={editingReview.role}
                    onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. London, UK"
                    value={editingReview.location}
                    onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={editingReview.rating}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white cursor-pointer"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Purchased Chair Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sovereign Ergonomic"
                    value={editingReview.productName}
                    onChange={(e) => setEditingReview({ ...editingReview, productName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Avatar Photo URL / Upload
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={editingReview.avatar}
                    onChange={(e) => setEditingReview({ ...editingReview, avatar: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                  />
                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl border border-slate-200 transition text-xs font-bold flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Review Comment Text *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter the customer review feedback..."
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
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
        </div>,
        document.body
      )}
    </div>
  );
}
