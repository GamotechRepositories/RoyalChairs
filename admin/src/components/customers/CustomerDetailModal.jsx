import { X, Mail, Calendar, Shield, ShoppingBag, DollarSign, UserCheck, Activity, Key, CheckCircle } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function CustomerDetailModal({ customer, isOpen, onClose }) {
  const { orders } = useAdminData();

  if (!isOpen || !customer) return null;

  // Filter orders matching this customer's email or ID
  const customerOrders = (orders || []).filter(
    (o) => o.customer?.email?.toLowerCase() === customer.email?.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-start justify-between relative overflow-hidden">
          <div className="flex items-center space-x-4 z-10">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl sm:text-2xl font-bold font-serif">{customer.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {customer.role === 'admin' ? 'Admin' : 'Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center mt-1">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                {customer.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="z-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Background Ambient Glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Lifetime Orders</span>
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-slate-900 font-mono">
                {customerOrders.length || customer.ordersCount || 0} Orders
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Total Expenditure</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-emerald-700 font-mono">
                ₹{(customer.totalSpent || 0).toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Account Status</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-emerald-800 flex items-center mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                Verified & Active
              </p>
            </div>
          </div>

          {/* Detailed Profile Info Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center">
              <Shield className="w-4 h-4 mr-1.5 text-slate-500" />
              User Account Overview
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Database MongoDB ID</span>
                <span className="font-mono text-slate-700 select-all font-semibold bg-slate-100 px-2 py-1 rounded-md inline-block">
                  {customer.id}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Member Since</span>
                <span className="font-medium text-slate-800 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {customer.joinedDate || 'Recent'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Account Role Privilege</span>
                <span className="font-medium text-slate-800 capitalize">
                  {customer.role || 'user'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Authentication Provider</span>
                <span className="font-medium text-slate-800 flex items-center">
                  <Key className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  {customer.googleId ? 'Google OAuth 2.0' : 'Email & Password'}
                </span>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center">
              <Activity className="w-4 h-4 mr-1.5 text-slate-500" />
              Order & Transaction History ({customerOrders.length})
            </h4>

            {customerOrders.length > 0 ? (
              <div className="space-y-3">
                {customerOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-900">{order.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {order.paymentStatus || 'Paid'}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1">
                        {order.items?.length || 1} Items • {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-slate-900 text-sm">
                        ₹{(order.total || 0).toLocaleString()}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        {order.fulfillmentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No Orders Found</p>
                <p className="text-[11px] text-slate-400">
                  This user has not placed any orders yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
