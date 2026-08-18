import { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function AccountPage({ 
  onBackToHome, 
  onNavigateCart, 
  onNavigateWishlist, 
  onNavigateShop,
  onOpenTrackOrder 
}) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'address'

  const handleLogout = () => {
    logout();
    if (onBackToHome) onBackToHome();
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
              Please sign in to access your account profile, order history, and saved preferences.
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

  // Generate initial from name
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-6 pb-24">
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
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-amber-300/30">
                    VIP Verified Client
                  </span>
                  <span className="flex items-center text-emerald-300 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    Active Session
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight">
                  {user.name}
                </h1>
                <p className="text-emerald-200/90 text-xs sm:text-sm font-medium flex items-center mt-1">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 font-extrabold text-xs rounded-2xl transition flex items-center space-x-2 cursor-pointer backdrop-blur-xs shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Highlights / Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-extrabold text-xs transition cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-900 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-4 h-4" />
                  <span>Orders & History</span>
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

            {/* Promotional Banner */}
            <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100/70 p-6 border border-amber-200/80 relative overflow-hidden">
              <Sparkles className="w-8 h-8 text-amber-500/40 absolute -top-1 -right-1" />
              <h4 className="text-sm font-black font-serif text-amber-950 mb-1">
                Royal Bespoke Service
              </h4>
              <p className="text-xs text-amber-900/80 leading-relaxed mb-4">
                Need customized upholstery or bulk luxury seating for your office or residence?
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
                    Verified
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

            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div>
                    <h3 className="text-xl font-black font-serif text-emerald-950">
                      Orders & Purchase History
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Track current shipments and review previous orders
                    </p>
                  </div>
                  <button
                    onClick={onOpenTrackOrder}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Package className="w-4 h-4" />
                    <span>Open Live Order Tracker</span>
                  </button>
                </div>

                <div className="p-8 text-center rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="w-14 h-14 bg-emerald-100/60 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-800">
                    <Package className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-black font-serif text-emerald-950 mb-1">
                    Track Orders Real-Time
                  </h4>
                  <p className="text-xs text-gray-600 max-w-md mx-auto mb-5 leading-relaxed">
                    Have an active order number? Use our dedicated courier tracking tool to inspect real-time dispatch, transit, and delivery updates.
                  </p>
                  <button
                    onClick={onOpenTrackOrder}
                    className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer inline-flex items-center space-x-2"
                  >
                    <span>Track with Order ID</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-black font-serif text-emerald-950">
                    Delivery & Contact Information
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your shipping addresses and concierge contact preferences
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5 text-emerald-700" />
                      Primary Delivery Address
                    </span>
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      Default
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Royal Chairs Premium Showroom & Distribution Centre,<br />
                    Pune - Mumbai Highway, Maharashtra, India
                  </p>
                  <div className="pt-2 flex items-center text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
