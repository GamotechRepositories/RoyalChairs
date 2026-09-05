import {
  LayoutDashboard,
  Armchair,
  ShoppingBag,
  Layers,
  Users,
  Star,
  ChevronRight,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Image,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import LogoImg from '../../assets/logo.svg';

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const { products, orders, reviews } = useAdminData();
  const { adminUser, logout } = useAdminAuth();

  const pendingOrders = orders.filter((o) => o.fulfillmentStatus === 'Pending' || o.fulfillmentStatus === 'In Production').length;
  const pendingReviews = reviews.filter((r) => r.status === 'Pending').length;

  const NAV_ITEMS = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'orders',
      label: 'Order History',
      icon: ShoppingBag,
      badge: pendingOrders > 0 ? `${pendingOrders} New` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800 font-black',
    },
    {
      id: 'category-handling',
      label: 'Category Handling',
      icon: Layers,
      badge: null,
    },
    {
      id: 'products',
      label: 'Catalogue',
      icon: Armchair,
      badge: `${products.length}`,
      badgeColor: 'bg-slate-100 text-slate-700 font-bold',
    },
    {
      id: 'banner-slideshow',
      label: 'Hero Banners',
      icon: Image,
      badge: null,
    },
    {
      id: 'new-collection',
      label: 'New Arrivals Banners',
      icon: Sparkles,
      badge: null,
    },
    {
      id: 'category-spotlight',
      label: 'Category Spotlight',
      icon: Image,
      badge: null,
    },
    {
      id: 'why-choose-us',
      label: 'Why Choose Us',
      icon: Star,
      badge: null,
    },
    {
      id: 'customers',
      label: 'Users',
      icon: Users,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xs ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-200 bg-[#F8FAF9]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                <img src={LogoImg} alt="Royal Chairs" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="font-serif font-black text-lg tracking-wider text-slate-900 flex items-center space-x-1.5">
                  <span>ROYAL</span>
                  <span className="text-emerald-700 font-light">CHAIRS</span>
                </h1>
                <p className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest">
                  Executive Suite
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            <p className="px-3 pt-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Operations & Management
            </p>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition text-xs font-bold group cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm border border-emerald-900 font-extrabold'
                      : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-emerald-700'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-amber-300 text-emerald-950 font-black' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-300" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile & Quick Logout Footer */}
        <div className="p-4 border-t border-slate-200 bg-[#F8FAF9]">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-700">
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 leading-tight truncate">
                  {adminUser?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-emerald-700 font-bold truncate">
                  {adminUser?.role || 'Super Admin'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
              title="Sign Out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
