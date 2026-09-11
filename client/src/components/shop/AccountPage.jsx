import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Package,
  LogOut,
  ArrowLeft,
  MapPin,
  Phone,
  Star,
  X,
  Send,
  Check,
  CheckCircle2,
  Calendar,
  Copy,
  Truck,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import TrackOrderModal from '../layout/TrackOrderModal';
import { OrderCardSkeleton } from '../ui/Skeletons';
import api from '../../services/api';

export default function AccountPage({
  onBackToHome,
  onNavigateShop,
}) {
  const { user, logout } = useAuth();
  const { products } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'address'
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState('');
  const [trackingModalOrderId, setTrackingModalOrderId] = useState('');
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

  // Robust product image resolver matching live store items & variants
  const resolveItemImage = (item) => {
    if (!item) return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';

    const itemCleanName = (item.name || item.title || '').toLowerCase().trim();
    const itemId = (item.productId || item.product || item.id || item._id || '').toString();

    // 1. Try matching with live products from MongoDB store
    const matchedProduct = (products || []).find((p) => {
      const pId = (p._id || p.id || '').toString();
      if (pId && itemId && pId === itemId) return true;
      if (p.name && itemCleanName) {
        const pName = p.name.toLowerCase().trim();
        if (pName === itemCleanName || itemCleanName.startsWith(pName) || pName.startsWith(itemCleanName)) {
          return true;
        }
      }
      return false;
    });

    if (matchedProduct) {
      // If item has a selected variant/color finish, look for matching variant image
      if (Array.isArray(matchedProduct.variants) && matchedProduct.variants.length > 0) {
        const variantName = (item.selectedVariantName || item.variant || item.colorName || '').toLowerCase().trim();
        const variantHex = (item.color || '').toLowerCase().trim();

        const matchedVariant = matchedProduct.variants.find((v) => {
          const vName = (v.colorName || v.name || '').toLowerCase().trim();
          const vHex = (v.colorHex || '').toLowerCase().trim();
          return (
            (variantName && (vName === variantName || vName.includes(variantName) || variantName.includes(vName))) ||
            (variantHex && vHex === variantHex)
          );
        });

        if (matchedVariant?.mainImage || matchedVariant?.image) {
          return matchedVariant.mainImage || matchedVariant.image;
        }
      }

      // Return the product's real mainImage from DB
      if (matchedProduct.mainImage) {
        return matchedProduct.mainImage;
      }
    }

    // 2. Direct stored images on item
    if (item.mainImage) return item.mainImage;
    if (item.image && !item.image.includes('photo-1598300042247-d088f8ab3a91') && !item.image.includes('photo-1580481072645-022f9a6d8310')) {
      return item.image;
    }
    if (item.image) return item.image;

    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
  };

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
          setIsOrdersLoading(false);
          return;
        }
      }
    } catch {}

    // Fallback local list
    try {
      const localSaved = localStorage.getItem('royal_user_orders');
      if (localSaved) {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          setIsOrdersLoading(false);
          return;
        }
      }
    } catch {}

    setOrders([]);
    setIsOrdersLoading(false);
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

  const handleCopyOrder = (orderNum) => {
    if (!orderNum) return;
    navigator.clipboard?.writeText(orderNum);
    setCopiedOrderNumber(orderNum);
    setTimeout(() => setCopiedOrderNumber(''), 2000);
  };

  const handleOpenReviewModal = (item, order) => {
    const itemImg = resolveItemImage(item);
    setSelectedItemForReview({
      ...item,
      productId: item.productId || item.product || item.id || item._id,
      productName: item.name || item.title,
      orderNumber: order.orderNumber || order.id,
      image: itemImg,
    });
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
        productName: selectedItemForReview.productName || selectedItemForReview.name || selectedItemForReview.title,
        userName: user?.name || 'Verified Buyer',
        name: user?.name || 'Verified Buyer',
        userRole: 'Verified Buyer',
        role: 'Verified Buyer',
        location: reviewLocation.trim() || 'India',
        rating: Number(reviewRating) || 5,
        comment: reviewComment.trim(),
        finish: selectedItemForReview.selectedVariantName || selectedItemForReview.variant || 'Artisan Selected Finish',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Verified Buyer')}&background=2E6B4D&color=fff`,
        status: 'approved',
      };

      const res = await api.post('/reviews', payload);
      if (res.data?.success) {
        // Record that this product has been reviewed by user
        const key1 = selectedItemForReview.productId;
        const key2 = selectedItemForReview.name;
        const key3 = selectedItemForReview.productName;
        const updatedReviews = {
          ...reviewedProductIds,
          ...(key1 ? { [key1]: true } : {}),
          ...(key2 ? { [key2]: true } : {}),
          ...(key3 ? { [key3]: true } : {}),
        };
        setReviewedProductIds(updatedReviews);
        localStorage.setItem('royal_reviewed_items', JSON.stringify(updatedReviews));

        // Dispatch storage update so product pages refresh reviews and ratings immediately
        window.dispatchEvent(new Event('royal_storage_update'));
        window.dispatchEvent(new Event('storage'));

        setReviewSuccessToast(`Thank you! Your verified review has been submitted.`);
        handleCloseReviewModal();
        setTimeout(() => setReviewSuccessToast(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-800">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Sign in Required</h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Please sign in to view your orders, delivery address, and account details.
          </p>
          <button
            onClick={onBackToHome}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-[#faf8f5] py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {reviewSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-950 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-700 flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{reviewSuccessToast}</span>
        </div>
      )}

      <div className="w-full max-w-[1200px] mx-auto space-y-6">

        {/* 1. SIMPLE CLEAN HEADER */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xs shrink-0">
              {userInitial}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 font-serif">
                {user.name}
              </h1>
              <p className="text-xs text-slate-500 font-medium flex items-center mt-0.5">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-rose-200 transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition cursor-pointer shrink-0 ${
              activeTab === 'orders'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders &amp; History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Details</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition cursor-pointer shrink-0 ${
              activeTab === 'address'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Address</span>
          </button>
        </div>

        {/* 3. TAB CONTENTS */}

        {/* TAB 1: ORDERS & HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            {isOrdersLoading ? (
              <div className="space-y-4">
                <OrderCardSkeleton />
                <OrderCardSkeleton />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 space-y-3">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  When you purchase chairs, your live order progress, tracking codes, and review options will appear here.
                </p>
                <button
                  onClick={onNavigateShop}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const orderNum = order.orderNumber || order.id || 'RC-ORDER';
                  const orderDate = order.createdAt || order.date
                    ? new Date(order.createdAt || order.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recent Order';

                  const rawFulfillment = (order.fulfillmentStatus || order.orderStatus || 'Pending').toLowerCase();
                  let displayStatus = 'Pending Assignment';
                  let badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300';
                  let stepIndex = 0; // 0: Placed, 1: Production, 2: Dispatched, 3: Delivered

                  if (rawFulfillment.includes('production') || rawFulfillment === 'confirmed') {
                    displayStatus = 'In Production (Benchcrafting)';
                    badgeStyle = 'bg-sky-100 text-sky-900 border-sky-300';
                    stepIndex = 1;
                  } else if (rawFulfillment.includes('dispatch') || rawFulfillment === 'shipped') {
                    displayStatus = 'Dispatched (Express Courier)';
                    badgeStyle = 'bg-indigo-100 text-indigo-900 border-indigo-300';
                    stepIndex = 2;
                  } else if (rawFulfillment.includes('deliver')) {
                    displayStatus = 'Delivered & Assembled';
                    badgeStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                    stepIndex = 3;
                  } else if (rawFulfillment.includes('cancel')) {
                    displayStatus = 'Order Cancelled';
                    badgeStyle = 'bg-rose-100 text-rose-900 border-rose-300';
                    stepIndex = -1;
                  }

                  const safeItems = Array.isArray(order.items) ? order.items : [];
                  const itemsSubtotal = safeItems.reduce(
                    (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1),
                    0
                  );
                  const totalPaid = Number(
                    order.totalAmount !== undefined ? order.totalAmount : (order.total || 0)
                  );
                  const discountAmount = Number(
                    order.discountAmount !== undefined
                      ? order.discountAmount
                      : (order.discount || 0)
                  );
                  const grossSubtotal = Number(
                    order.subtotal && order.subtotal > totalPaid
                      ? order.subtotal
                      : (itemsSubtotal > 0 ? itemsSubtotal : (totalPaid + discountAmount))
                  );

                  const trackingCode = order.trackingNumber || `TRK-${(order._id || order.id || '').toString().slice(-8).toUpperCase()}`;

                  return (
                    <div
                      key={order._id || order.id || orderNum}
                      className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs space-y-0"
                    >
                      {/* Top Bar Header */}
                      <div className="bg-slate-50 px-5 sm:px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => handleCopyOrder(orderNum)}
                            className="font-mono font-bold text-slate-900 flex items-center space-x-1.5 hover:text-emerald-800 transition cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200"
                            title="Copy Order ID"
                          >
                            <span>#{orderNum}</span>
                            {copiedOrderNumber === orderNum ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {orderDate}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2.5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${badgeStyle}`}>
                            {displayStatus}
                          </span>
                          <span className="text-[11px] bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-full font-bold uppercase">
                            {order.paymentMethod || 'Online'} ({order.paymentStatus || 'PAID'})
                          </span>
                        </div>
                      </div>

                      {/* Live Logistics & Progress Stepper Bar */}
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50/90 to-emerald-50/40 border-b border-slate-200/70 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-emerald-800 shrink-0" />
                            <span className="text-slate-600 font-medium">Carrier:</span>
                            <span className="font-bold text-slate-900">{order.carrier || 'Royal Express Logistics'}</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-600 font-medium">Tracking:</span>
                            <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                              {trackingCode}
                            </span>
                            <button
                              onClick={() => handleCopyOrder(trackingCode)}
                              className="text-slate-400 hover:text-emerald-800 cursor-pointer"
                              title="Copy Tracking Number"
                            >
                              {copiedOrderNumber === trackingCode ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <button
                            onClick={() => setTrackingModalOrderId(orderNum)}
                            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5 mr-1" />
                            <span>Track Live</span>
                          </button>
                        </div>

                        {/* 4-Step Visual Progress Stepper */}
                        {stepIndex >= 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                            {[
                              { label: '1. Order Placed', active: stepIndex >= 0 },
                              { label: '2. In Production', active: stepIndex >= 1 },
                              { label: '3. Dispatched', active: stepIndex >= 2 },
                              { label: '4. Delivered', active: stepIndex >= 3 },
                            ].map((step, sIdx) => (
                              <div
                                key={sIdx}
                                className={`p-2 rounded-xl flex items-center space-x-2 border transition ${
                                  step.active
                                    ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs font-bold'
                                    : 'bg-white/80 text-slate-400 border-slate-200 font-medium'
                                }`}
                              >
                                {step.active ? (
                                  <Check className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 shrink-0" />
                                )}
                                <span className="truncate">{step.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Purchased Item List */}
                      <div className="p-4 sm:p-5 divide-y divide-slate-100">
                        {safeItems.map((item, itemIdx) => {
                          const resolvedImage = resolveItemImage(item);
                          const isReviewed =
                            reviewedProductIds[item.productId] ||
                            reviewedProductIds[item.product] ||
                            reviewedProductIds[item.name] ||
                            reviewedProductIds[item.id] ||
                            false;

                          return (
                            <div
                              key={itemIdx}
                              className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-center space-x-4">
                                <img
                                  src={resolvedImage}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 font-serif">
                                    {item.name}
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Finish: <span className="text-slate-800 font-medium">{item.selectedVariantName || item.colorName || 'Standard'}</span> • Qty: {item.quantity || 1}
                                  </p>
                                  <p className="text-xs font-bold text-emerald-900 mt-1 font-mono">
                                    ₹{(item.price || 0).toLocaleString('en-IN')} each
                                  </p>
                                </div>
                              </div>

                              <div className="self-start sm:self-center">
                                {isReviewed ? (
                                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Reviewed</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleOpenReviewModal(item, order)}
                                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
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

                      {/* Financial Breakdown Footer */}
                      <div className="bg-slate-50/70 p-4 sm:p-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1 text-slate-600 font-medium">
                          <div className="flex items-center space-x-2">
                            <span>Subtotal:</span>
                            <span className="font-mono font-bold text-slate-900">₹{grossSubtotal.toLocaleString('en-IN')}</span>
                            {discountAmount > 0 && (
                              <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                                <Tag className="w-3 h-3" />
                                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}: -₹{discountAmount.toLocaleString('en-IN')}</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            White-Glove Delivery &amp; Transit: <strong className="text-emerald-800">Complimentary (Free)</strong>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Money Paid</span>
                          <span className="font-mono font-black text-slate-900 text-base sm:text-lg">
                            ₹{totalPaid.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PERSONAL DETAILS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 font-serif pb-3 border-b border-slate-100">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </span>
                <span className="text-sm font-bold text-slate-900">{user.name}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </span>
                <span className="text-sm font-bold text-slate-900">{user.email}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Phone
                </span>
                <span className="text-sm font-bold text-slate-900">{user.phone || '+91 98765 43210'}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Account Status
                </span>
                <span className="text-sm font-bold text-emerald-800">Active Member</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DELIVERY ADDRESS */}
        {activeTab === 'address' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 font-serif pb-3 border-b border-slate-100">
              Delivery Address
            </h3>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                Primary Shipping Address
              </span>
              <p className="text-sm text-slate-800 leading-relaxed pt-1">
                {user.address || 'Suite 402, Mayfair Royal Residencies, Off MG Road'}
                <br />
                {user.city || 'Bangalore, Karnataka'} - {user.pincode || '560001'}
                <br />
                India
              </p>
              <div className="pt-2 flex items-center space-x-4 text-xs text-slate-500">
                <span className="flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {user.phone || '+91 98765 43210'}
                </span>
                <span className="flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. WRITE REVIEW MODAL */}
      {selectedItemForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            onClick={handleCloseReviewModal}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
            {/* Header */}
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <h3 className="text-sm font-bold">Write Product Review</h3>
              </div>
              <button
                onClick={handleCloseReviewModal}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="p-5 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <img
                  src={selectedItemForReview.image}
                  alt={selectedItemForReview.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900">{selectedItemForReview.name}</h4>
                  <p className="text-slate-500">
                    {selectedItemForReview.selectedVariantName || 'Standard Finish'}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'fill-current text-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-500 ml-2">
                    {reviewRating} of 5
                  </span>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={reviewLocation}
                  onChange={(e) => setReviewLocation(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your feedback on the comfort, material, and build quality..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-emerald-700 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. LIVE TRACKING MODAL */}
      <TrackOrderModal
        isOpen={!!trackingModalOrderId}
        onClose={() => setTrackingModalOrderId('')}
        initialOrderId={trackingModalOrderId}
      />
    </div>
  );
}
