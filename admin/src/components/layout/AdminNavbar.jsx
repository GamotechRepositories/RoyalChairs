import { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  ExternalLink,
  Crown,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Menu,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';

export default function AdminNavbar({ onToggleSidebar, activeTab }) {
  const { adminUser, logout } = useAdminAuth();
  const { orders, products, reviews } = useAdminData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const lowStockCount = products.filter((p) => p.stock < 10).length;
  const pendingOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'Pending' || o.fulfillmentStatus === 'In Production').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'Pending').length;
  const totalAlerts = (lowStockCount > 0 ? 1 : 0) + (pendingOrdersCount > 0 ? 1 : 0) + (pendingReviewsCount > 0 ? 1 : 0);

  return (
    <header className="h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden md:inline">HQ Command Portal</span>
          </div>
          <span className="text-slate-400">/</span>
          <span className="text-emerald-900 capitalize tracking-wide font-mono font-black">
            {activeTab.replace('-', ' ')}
          </span>
        </div>

        {/* Mobile: show active tab only */}
        <div className="sm:hidden">
          <span className="text-sm font-black text-emerald-900 capitalize font-mono">
            {activeTab.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Right: Clock, Live Alerts, Storefront Link, Admin User */}
      <div className="flex items-center space-x-3 sm:space-x-4">


        {/* View Storefront Button — text hidden on mobile */}
        <a
          href={import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition text-xs font-extrabold shadow-xs"
          title="Open Customer Storefront in New Tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Live Store</span>
        </a>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 relative transition cursor-pointer"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-900 font-black text-[9px] rounded-full flex items-center justify-center ring-2 ring-white">
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Store Operations Alerts
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  {totalAlerts} Active
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {pendingOrdersCount > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">{pendingOrdersCount} Orders Awaiting Dispatch</p>
                      <p className="text-slate-500 text-[11px]">Benchcrafted production in queue</p>
                    </div>
                  </div>
                )}

                {lowStockCount > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-900">{lowStockCount} Chairs in Low Stock</p>
                      <p className="text-amber-700/80 text-[11px]">Restock suggested immediately</p>
                    </div>
                  </div>
                )}

                {pendingReviewsCount > 0 && (
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex items-start space-x-2.5">
                    <Crown className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-purple-900">{pendingReviewsCount} Testimonial Pending</p>
                      <p className="text-purple-700/80 text-[11px]">Ready for homepage moderation</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
          >
            <img
              src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={adminUser?.name || 'Admin'}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-600/50"
            />
            <div className="text-left hidden xl:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{adminUser?.name || 'Lord Director'}</p>
              <p className="text-[10px] text-emerald-700 font-bold">{adminUser?.role || 'Super Admin'}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="p-3 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{adminUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{adminUser?.email}</p>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out Admin Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
