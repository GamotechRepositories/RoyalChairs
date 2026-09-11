import { useState, useEffect } from 'react';
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
  Tag,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function OrderDetailModal({ isOpen, onClose, order }) {
  const { updateOrderStatus } = useAdminData();

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  // Safe Financial Computations
  const safeItems = Array.isArray(order.items) ? order.items : [];
  const itemsSubtotal = safeItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const totalPaid = Number(order.totalAmount !== undefined ? order.totalAmount : (order.total || 0));

  let discount = Number(order.discountAmount !== undefined ? order.discountAmount : (order.discount || 0));
  if (discount === 0 && itemsSubtotal > totalPaid) {
    discount = itemsSubtotal - totalPaid;
  }

  const grossSubtotal = Number(order.subtotal && order.subtotal > totalPaid ? order.subtotal : (itemsSubtotal > 0 ? itemsSubtotal : (totalPaid + discount)));

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain relative p-6 sm:p-8 cursor-default space-y-6 text-slate-800 my-auto"
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
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold uppercase">
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

          {/* Shipping Address & Payment Gateway Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Delivery Destination</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {order.customer?.address || 'Royal Villa, Luxury Estate, Mayfair, London'}
              {order.customer?.city ? `, ${order.customer.city}` : ''}
              {order.customer?.state ? `, ${order.customer.state}` : ''}
              {order.customer?.pincode ? ` - ${order.customer.pincode}` : ''}
            </p>
            <div className="flex items-center space-x-2 text-slate-700 pt-1 font-bold">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="uppercase">{order.paymentMethod || 'Online Payment'}</span>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Itemized Luxury Chairs ({safeItems.length})
          </h4>
          <div className="space-y-2">
            {safeItems.map((item, i) => (
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
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
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
                  <p className="text-xs font-bold text-slate-600">₹{(Number(item.price) || 0).toLocaleString()} each</p>
                  <p className="text-xs font-black text-emerald-800">
                    ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Financial Breakdown with Promo Voucher & Final Total */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Gross Items Subtotal</span>
            <span className="font-mono font-bold text-slate-900">₹{grossSubtotal.toLocaleString()}</span>
          </div>

          {/* Promo Voucher Discount Row */}
          {discount > 0 && (
            <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200/90 font-bold">
              <span className="flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  Promo Voucher Applied {order.couponCode ? `(${order.couponCode})` : ''}
                </span>
              </span>
              <span className="font-mono font-black text-emerald-900">-₹{discount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600 font-medium">
            <span>Courier & White-Glove Packaging</span>
            <span className="text-emerald-700 font-bold">Complimentary (Free)</span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm font-black text-slate-900">
            <div>
              <span>Final Money Paid / Collectable</span>
              <span className="text-[11px] font-normal text-slate-500 block">
                via {order.paymentMethod || 'Online'} ({order.paymentStatus || 'PAID'})
              </span>
            </div>
            <span className="text-base text-emerald-950 font-mono font-black">
              ₹{totalPaid.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Update Order Status & Tracking Form */}
        <form onSubmit={handleSaveStatus} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
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
              <span className="text-[11px] text-slate-500 font-medium">Carrier: {order.carrier || 'Royal Express Logistics'}</span>
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
