import {
  LayoutDashboard,
  Armchair,
  ShoppingBag,
  Layers,
  Users,
  Tag,
  Star,
  Settings,
  Crown,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const { products, orders, reviews } = useAdminData();

  const pendingOrders = orders.filter((o) => o.fulfillmentStatus === 'Pending' || o.fulfillmentStatus === 'In Production').length;
  const lowStock = products.filter((p) => p.stock < 10).length;
  const pendingReviews = reviews.filter((r) => r.status === 'Pending').length;

  const NAV_ITEMS = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'banner-slideshow',
      label: 'Banner Slideshow',
      icon: Sparkles,
      badge: 'Hero',
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      id: 'category-handling',
      label: 'Category Handling',
      icon: Layers,
      badge: 'Categories',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    },
    {
      id: 'best-seller',
      label: 'Best Sellers Manager',
      icon: Crown,
      badge: 'Top Seats',
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      id: 'new-collection',
      label: 'Royal New Collection',
      icon: Sparkles,
      badge: '2026',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    },
    {
      id: 'offers-discounts',
      label: 'Offers & Discounts',
      icon: Tag,
      badge: '% Sale',
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
    },
    {
      id: 'why-choose-us',
      label: 'Why Choose Us & Reviews',
      icon: Star,
      badge: 'Reviews',
      badgeColor: 'bg-purple-100 text-purple-800 font-bold',
    },
    {
      id: 'products',
      label: 'Luxury Catalog',
      icon: Armchair,
      badge: lowStock > 0 ? `${lowStock} Low` : `${products.length}`,
      badgeColor: lowStock > 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100 text-slate-700 font-bold',
    },
    {
      id: 'orders',
      label: 'Orders & Logistics',
      icon: ShoppingBag,
      badge: pendingOrders > 0 ? `${pendingOrders} New` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800 font-black',
    },
    {
      id: 'customers',
      label: 'VIP Client CRM',
      icon: Users,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Store Configuration',
      icon: Settings,
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 border border-amber-300/60 flex items-center justify-center shadow-md shadow-emerald-950/20">
                <Crown className="w-5 h-5 text-amber-300" />
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

        {/* Bottom Status Card */}
        <div className="p-4 border-t border-slate-200 bg-[#F8FAF9]">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-slate-900 leading-tight truncate">
                White-Glove Fleet
              </p>
              <p className="text-[10px] text-emerald-700 font-bold truncate">
                All UK Couriers Active
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
