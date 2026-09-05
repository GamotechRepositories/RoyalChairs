import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Package,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  MapPin,
  Phone,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Star,
  MessageSquare,
  X,
  Send,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../services/api';

export default function AccountPage({
  onBackToHome,
  onNavigateCart,
  onNavigateWishlist,
  onNavigateShop,
  onOpenTrackOrder,
}) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState('orders'); // default to 'orders' or 'profile'
  const [orders, setOrders] = useState([]);
  const [reviewedProductIds, setReviewedProductIds] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_reviewed_items');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Review Modal State
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLocation, setReviewLocation] = useState('India');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessToast, setReviewSuccessToast] = useState('');

  // Fetch and auto-sync user orders with backend database
  const fetchOrders = async () => {
    let serverOrders = [];
    try {
      const res = await api.get('/orders');
      if (res.data?.success && Array.isArray(res.data.data)) {
        serverOrders = res.data.data;
      }
    } catch {}

    // Check localStorage for client orders and sync any missing ones to backend
    try {
      const localSaved = localStorage.getItem('royal_user_orders');
      if (localSaved) {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const serverOrderNums = new Set(serverOrders.map((o) => o.orderNumber || o.id));

          for (const localOrder of parsed) {
            const orderNum = localOrder.orderNumber || localOrder.id;
            if (!serverOrderNums.has(orderNum)) {
              try {
                await api.post('/orders', {
                  orderNumber: orderNum,
                  customer: localOrder.customer || {
                    name: user?.name || 'Alex',
                    email: user?.email || 'customer@royalchairs.com',
                    phone: user?.phone || '+91 98765 43210',
                    address: 'Royal Villa, Luxury Estate, Mayfair',
                    city: 'London',
                    pincode: 'SW1A 1AA',
                  },
                  items: localOrder.items || [],
                  totalAmount: Number(localOrder.totalAmount || localOrder.total || 0),
                  paymentMethod: localOrder.paymentMethod || 'online',
                  paymentStatus: localOrder.paymentStatus || 'paid',
                  orderStatus: localOrder.orderStatus || 'confirmed',
                });
              } catch {}
            }
          }
        }
      }
    } catch {}

    // Retrieve fresh unified orders from API
    try {
      const res = await api.get('/orders');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const userOrders = res.data.data.filter(
          (o) =>
            (user?.email && o.customer?.email?.toLowerCase() === user.email.toLowerCase()) ||
            (user?._id && o.user === user._id) ||
            !user?.email
        );
        if (userOrders.length > 0) {
          setOrders(userOrders);
          return;
        }
      }
    } catch {}

    // Fallback local list
    try {
      const localSaved = localStorage.getItem('royal_user_orders');
      if (localSaved) {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
          return;
        }
      }
    } catch {}
    setOrders([]);
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
    const handleStorageUpdate = () => {
      fetchOrders();
    };
    window.addEventListener('royal_storage_update', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('royal_storage_update', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    if (onBackToHome) onBackToHome();
  };

  const handleOpenReviewModal = (item, order) => {
    setSelectedItemForReview({ ...item, orderNumber: order.orderNumber });
    setReviewRating(5);
    setReviewComment('');
    setReviewLocation(user?.city || 'Mumbai, India');
  };

  const handleCloseReviewModal = () => {
    setSelectedItemForReview(null);
    setReviewComment('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedItemForReview || !reviewComment.trim()) {
      alert('Please write your review comment before submitting.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const payload = {
        productId: selectedItemForReview.productId || selectedItemForReview.product || selectedItemForReview.id,
        productName: selectedItemForReview.name || selectedItemForReview.title,
        userName: user?.name || 'Verified Buyer',
        name: user?.name || 'Verified Buyer',
        userRole: 'Verified Buyer',
        role: 'Verified Buyer',
        location: reviewLocation.trim() || 'India',
        rating: Number(reviewRating) || 5,
        comment: reviewComment.trim(),
        finish: selectedItemForReview.selectedVariantName || selectedItemForReview.variant || 'Artisan Selected Finish',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
        status: 'approved',
      };

      const res = await api.post('/reviews', payload);
      if (res.data?.success) {
        // Record that this product has been reviewed by user
        const key = selectedItemForReview.productId || selectedItemForReview.name;
        const updatedReviews = { ...reviewedProductIds, [key]: true };
        setReviewedProductIds(updatedReviews);
        localStorage.setItem('royal_reviewed_items', JSON.stringify(updatedReviews));

        // Dispatch storage update so product pages refresh reviews
        window.dispatchEvent(new Event('royal_storage_update'));

        setReviewSuccessToast(`Thank you! Your review for ${selectedItemForReview.name} has been verified and published.`);
        handleCloseReviewModal();
        setTimeout(() => setReviewSuccessToast(''), 5000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-soft pt-10 pb-20">
        <div className="w-full max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-10 border border-emerald-900/10 shadow-xl">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-600 border border-amber-200">
              <User className="w-8 h-8 text-emerald-800" />
            </div>
            <h2 className="text-2xl font-black text-emerald-950 font-serif mb-2">
              Sign In Required
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Please sign in to access your account profile, order history, and verified product reviews.
            </p>
            <button
              onClick={onBackToHome}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-6 pb-24">
      {/* Toast Notification */}
      {reviewSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-300/40 flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-xs font-black">{reviewSuccessToast}</span>
        </div>
      )}

      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 mb-6">
          <button
            onClick={onBackToHome}
            className="hover:text-emerald-900 transition flex items-center cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-emerald-950 font-extrabold">My Member Account</span>
        </div>

        {/* Hero Profile Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 sm:p-10 shadow-2xl overflow-hidden mb-8 border border-emerald-700/40">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              {/* Luxury Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-emerald-950 flex items-center justify-center font-serif text-3xl sm:text-4xl font-black shadow-xl border-4 border-emerald-950/60 flex-shrink-0">
                  {userInitial}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-700 text-amber-300 p-1.5 rounded-xl border border-amber-300/40 shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 border border-amber-300">
                    VIP VERIFIED CLIENT
                  </span>
                  <span className="text-xs text-emerald-300 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
                    Active Session
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
                  {user.name}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200/80 font-medium flex items-center mt-0.5">
                  <Mail className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 transition flex items-center space-x-1.5 backdrop-blur-md cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Cart Highlights */}
          <div
            onClick={onNavigateCart}
            className="bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-emerald-600/40 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-400 group-hover:text-emerald-800 flex items-center">
                View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-950 font-serif">{cartCount}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">Items in Cart</div>
          </div>

          {/* Wishlist Highlights */}
          <div
            onClick={onNavigateWishlist}
            className="bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-rose-300 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xs font-bold text-gray-400 group-hover:text-rose-600 flex items-center">
                View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-950 font-serif">{wishlistCount}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">Saved Favorites</div>
          </div>

          {/* Membership Tier */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Gold
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-950 font-serif">Royal Patron</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">Tier Benefits Active</div>
          </div>

          {/* Order Tracker Shortcut */}
          <div
            onClick={onOpenTrackOrder}
            className="bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-emerald-600/40 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-400 group-hover:text-blue-700 flex items-center">
                Track <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-950 font-serif">Live Tracking</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">Check Order Status</div>
          </div>
        </div>

        {/* Content Tabs & Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-sm space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-extrabold text-xs transition cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-900 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-4 h-4" />
                  <span>Orders & Verified Reviews</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-extrabold text-xs transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-emerald-900 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4" />
                  <span>Personal Details</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-extrabold text-xs transition cursor-pointer ${
                  activeTab === 'address'
                    ? 'bg-emerald-900 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery & Contact</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Concierge Card */}
            <div className="bg-gradient-to-br from-amber-100/70 via-amber-50 to-orange-50/50 rounded-3xl p-6 border border-amber-200 shadow-sm relative overflow-hidden">
              <Sparkles className="w-8 h-8 text-amber-500/40 absolute -top-1 -right-1" />
              <h4 className="text-sm font-black font-serif text-amber-950 mb-1">
                Verified Purchaser Policy
              </h4>
              <p className="text-xs text-amber-900/80 leading-relaxed mb-4">
                Reviews are strictly restricted to customers who have purchased the chair, guaranteeing 100% authentic feedback.
              </p>
              <button
                onClick={onNavigateShop}
                className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer inline-flex items-center space-x-1.5"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="lg:col-span-8">
            {/* ORDERS & VERIFIED REVIEWS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div>
                    <h3 className="text-xl font-black font-serif text-emerald-950">
                      Orders & Purchase History ({orders.length})
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Review products from your confirmed orders below. Only verified purchasers can review.
                    </p>
                  </div>
                  <button
                    onClick={onOpenTrackOrder}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Package className="w-4 h-4" />
                    <span>Track Live Shipments</span>
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                    <Package className="w-10 h-10 text-gray-300 mx-auto" />
                    <h4 className="text-sm font-black text-gray-800">No Orders Found</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      You haven't placed any chair orders yet. Once you make a purchase, you can track it and write verified reviews here.
                    </p>
                    <button
                      onClick={onNavigateShop}
                      className="px-5 py-2.5 bg-emerald-900 text-white font-black text-xs rounded-xl shadow cursor-pointer inline-flex items-center space-x-1.5"
                    >
                      <span>Explore Luxury Chairs</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id || order._id || order.orderNumber}
                        className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs"
                      >
                        {/* Order Card Header */}
                        <div className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center space-x-3">
                            <span className="font-black text-slate-900 font-mono">
                              #{order.orderNumber || order.id}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'Recent Order'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                              {order.orderStatus || 'Delivered'}
                            </span>
                            <span className="font-black text-slate-900">
                              ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="p-4 sm:p-5 divide-y divide-slate-100">
                          {(order.items || []).map((item, itemIdx) => {
                            const isReviewed =
                              reviewedProductIds[item.productId || item.name] || false;

                            return (
                              <div
                                key={itemIdx}
                                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                    <img
                                      src={item.image || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85'}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-black text-slate-900 font-serif">
                                      {item.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      Finish: <strong className="text-slate-700">{item.selectedVariantName || 'Standard'}</strong> • Qty: {item.quantity || 1}
                                    </p>
                                    <p className="text-xs font-black text-emerald-900 mt-1">
                                      ₹{(item.price || 0).toLocaleString('en-IN')}
                                    </p>
                                  </div>
                                </div>

                                {/* Review Action Button */}
                                <div>
                                  {isReviewed ? (
                                    <div className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-black">
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Reviewed</span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenReviewModal(item, order)}
                                      className="px-4 py-2 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                                    >
                                      <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                      <span>Write Review</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE DETAILS TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-black font-serif text-emerald-950">
                      Profile Information
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Your registered account credentials and membership status
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-xl border border-emerald-200 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                    Verified Client
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      Full Name
                    </span>
                    <span className="text-sm font-black text-gray-900 flex items-center">
                      <User className="w-4 h-4 mr-2 text-emerald-700" />
                      {user.name}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      Email Address
                    </span>
                    <span className="text-sm font-bold text-gray-900 flex items-center break-all">
                      <Mail className="w-4 h-4 mr-2 text-emerald-700 flex-shrink-0" />
                      {user.email}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      Client Role
                    </span>
                    <span className="text-sm font-bold text-emerald-900 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-emerald-700" />
                      {user.role ? user.role.toUpperCase() : 'REGISTERED CLIENT'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      Security Status
                    </span>
                    <span className="text-sm font-bold text-emerald-700 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                      Encrypted JWT Authentication
                    </span>
                  </div>
                </div>

                {/* Account Actions Box */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-gray-500">
                    Manage your active sessions or sign out safely.
                  </p>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition flex items-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* ADDRESS TAB */}
            {activeTab === 'address' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-black font-serif text-emerald-950">
                    Delivery & Contact Information
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Primary shipping address on file for luxury courier delivery
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                        Primary Residence
                      </span>
                      <span className="text-xs font-bold text-gray-400">Verified Address</span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {user.address || 'Suite 402, Mayfair Royal Residencies, Off MG Road'}
                      <br />
                      {user.city || 'Bangalore, Karnataka'} - {user.pincode || '560001'}
                      <br />
                      India
                    </p>

                    <div className="pt-2 border-t border-gray-200/40 flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                        {user.phone || '+91 98765 43210'}
                      </span>
                      <span className="flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WRITE REVIEW MODAL (FOR VERIFIED PURCHASES) */}
      {selectedItemForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={handleCloseReviewModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFIED PURCHASE REVIEW</span>
                  </div>
                  <h3 className="text-base font-black font-serif truncate max-w-sm">
                    {selectedItemForReview.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleCloseReviewModal}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              {/* Product mini summary */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center space-x-3">
                <img
                  src={selectedItemForReview.image || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85'}
                  alt={selectedItemForReview.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="text-xs">
                  <h4 className="font-black text-slate-900">{selectedItemForReview.name}</h4>
                  <p className="text-slate-500 font-medium">
                    Order #{selectedItemForReview.orderNumber} • {selectedItemForReview.selectedVariantName || 'Standard'}
                  </p>
                </div>
              </div>

              {/* Rating Selector */}
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1.5">
                  Overall Rating *
                </label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-500 hover:scale-125 transition cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'fill-current text-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    ({reviewRating} out of 5 Stars)
                  </span>
                </div>
              </div>

              {/* City / Location */}
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1">
                  Your City / Location
                </label>
                <input
                  type="text"
                  value={reviewLocation}
                  onChange={(e) => setReviewLocation(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1">
                  Your Review / Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us about the ergonomic comfort, lumbar support, build quality, and delivery experience..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Publishing...' : 'Submit Verified Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
