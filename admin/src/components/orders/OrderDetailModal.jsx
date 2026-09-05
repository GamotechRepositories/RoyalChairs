import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ShoppingBag,
  Truck,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Crown,
  User,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function OrderDetailModal({ isOpen, onClose, order }) {
  const { updateOrderStatus } = useAdminData();

  if (!isOpen || !order) return null;

  const [status, setStatus] = useState(order.fulfillmentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveStatus = (e) => {
    e.preventDefault();
    updateOrderStatus(order.id, status, trackingNumber);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain relative p-6 sm:p-8 cursor-default space-y-6 text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-slate-900 font-serif tracking-wide">
                  Order #{order.orderNumber || order.id}
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  {order.paymentStatus || 'PAID'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Placed on {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintSlip}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200 cursor-pointer"
              title="Print Order Packing Slip"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition border border-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customer & Shipping Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Customer Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>Client Information</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{order.customer?.name || 'Valued Client'}</p>
            <div className="space-y-1 text-slate-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{order.customer?.email || 'client@royalchairs.com'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{order.customer?.phone || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Delivery Destination</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {order.customer?.address || 'Royal Villa, Luxury Estate, Mayfair, London'}
            </p>
            <div className="flex items-center space-x-2 text-slate-500 pt-1 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{order.paymentMethod || 'Online Payment'}</span>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Itemized Luxury Chairs ({(order.items || []).length})
          </h4>
          <div className="space-y-2">
            {(order.items || []).map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image || item.mainImage || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85'}
                    alt={item.name || 'Chair'}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.name || 'Royal Luxury Chair'}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: item.color || '#1E3E2B' }} />
                      <span className="text-[10px] text-slate-500 font-medium">Qty: {item.quantity || 1}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <p className="text-xs font-bold text-slate-600">₹{(item.price || 0).toLocaleString()} each</p>
                  <p className="text-xs font-black text-emerald-800">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Financial Totals */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Subtotal</span>
            <span className="font-mono">₹{Number(order.subtotal || order.total || order.totalAmount || 0).toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Promotional Discount</span>
              <span className="font-mono">-₹{Number(order.discount).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Courier & Packaging</span>
            <span className="text-emerald-700 font-bold">Complimentary</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
            <span>Total Paid</span>
            <span className="text-emerald-800 font-mono">₹{Number(order.total || order.totalAmount || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Update Order Status & Tracking Form */}
        <form onSubmit={handleSaveStatus} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>Fulfillment & Courier Logistics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Fulfillment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="Pending">Pending Assignment</option>
                <option value="In Production">In Production (Benchcrafting)</option>
                <option value="Dispatched">Dispatched (Express Courier)</option>
                <option value="Delivered">Delivered & Assembled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Courier Tracking Code
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. RL-UK-892401"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:border-emerald-600 focus:outline-hidden text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-700 font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Status updated successfully!
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 font-medium">Carrier: {order.carrier}</span>
            )}

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
            >
              Update Logistics
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
