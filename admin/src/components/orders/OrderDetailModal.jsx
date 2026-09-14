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
  CheckCircle2,
  Printer,
  User,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function OrderDetailModal({ isOpen, onClose, order }) {
  const { updateOrderStatus } = useAdminData();

  const [status, setStatus] = useState('Pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever selected order changes
  useEffect(() => {
    if (order) {
      setStatus(order.fulfillmentStatus || 'Pending');
      setTrackingNumber(order.trackingNumber || '');
      setSavedSuccess(false);
    }
  }, [order]);

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

  const handleSaveStatus = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    try {
      const orderIdentifier = order._id || order.id || order.orderNumber;
      await updateOrderStatus(orderIdentifier, status, trackingNumber);

      // Update local order object immediately so the modal view updates instantly
      order.fulfillmentStatus = status;
      order.trackingNumber = trackingNumber;

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating order logistics:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickSetStatus = async (newStatus) => {
    setStatus(newStatus);
    setIsUpdating(true);
    try {
      const orderIdentifier = order._id || order.id || order.orderNumber;
      await updateOrderStatus(orderIdentifier, newStatus, trackingNumber);
      order.fulfillmentStatus = newStatus;
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  // Safe Financial Computations
  const safeItems = Array.isArray(order.items) ? order.items : [];
  const itemsSubtotal = safeItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const totalPaid = Number(
    order.totalAmount !== undefined ? order.totalAmount : order.total || 0
  );

  let discount = Number(
    order.discountAmount !== undefined ? order.discountAmount : order.discount || 0
  );
  if (discount === 0 && itemsSubtotal > totalPaid) {
    discount = itemsSubtotal - totalPaid;
  }

  const grossSubtotal = Number(
    order.subtotal && order.subtotal > totalPaid
      ? order.subtotal
      : itemsSubtotal > 0
      ? itemsSubtotal
      : totalPaid + discount
  );

  const formattedDate = new Date(
    order.createdAt || order.date || Date.now()
  ).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return createPortal(
    <>
      {/* Dedicated Print Stylesheet: Isolation and Clean A4 Layout */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide all page elements outside the printable slip */
          body > *:not(#royal-portal-root):not(dialog) {
            display: none !important;
          }
          .no-print,
          .no-print * {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }
          .print-only {
            display: block !important;
          }
          .print-flex {
            display: flex !important;
          }
          .modal-overlay-print-fix {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            overflow: visible !important;
            backdrop-filter: none !important;
          }
          .modal-box-print-fix {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            max-height: none !important;
            overflow: visible !important;
            background: white !important;
          }
          .printable-card {
            border: 1px solid #e2e8f0 !important;
            background-color: #f8fafc !important;
            break-inside: avoid !important;
          }
          .printable-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .printable-table th, .printable-table td {
            border-bottom: 1px solid #e2e8f0 !important;
            padding: 8px 10px !important;
          }
        }
      `}</style>

      <div
        id="royal-portal-root"
        onClick={onClose}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer overflow-y-auto modal-overlay-print-fix"
      >
        <div
          id="royal-printable-slip"
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain relative p-6 sm:p-8 cursor-default space-y-6 text-slate-800 my-auto modal-box-print-fix"
        >
          {/* Official Brand Header for Print & Invoice */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex items-start justify-between">
              {/* Brand identity */}
              <div className="flex items-center space-x-3.5">
                <img
                  src="/logo.svg"
                  alt="Royal Chairs"
                  className="w-14 h-14 object-contain rounded-2xl border border-amber-400/60 p-1 shadow-xs bg-emerald-950"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <h1 className="text-2xl font-black text-emerald-950 tracking-tight font-serif">
                    ROYAL CHAIRS
                  </h1>
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Handcrafted Luxury Seating & Interiors
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Pune & London • Concierge: +91 98765 43210 • info@royalchairs.com
                  </p>
                </div>
              </div>

              {/* Document identifier & action buttons */}
              <div className="text-right flex flex-col items-end">
                <div className="flex items-center space-x-2 no-print mb-2">
                  <button
                    onClick={handlePrintSlip}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white transition text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
                    title="Print / Save PDF Packing Slip"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice / PDF</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition border border-slate-200 cursor-pointer"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-right inline-block printable-card">
                  <span className="text-[10px] font-black text-emerald-900 tracking-wider uppercase block">
                    TAX INVOICE & PACKING SLIP
                  </span>
                  <div className="font-mono text-sm font-black text-slate-900">
                    Order #{order.orderNumber || order.id}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Date: {formattedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Ribbon (Screen & Print) */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs printable-card">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Payment:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 uppercase">
                {order.paymentStatus || 'PAID'}
              </span>
              <span className="text-slate-700 font-bold uppercase text-[10px]">
                via {order.paymentMethod || 'Online'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Logistics:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  order.fulfillmentStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.fulfillmentStatus === 'Dispatched'
                    ? 'bg-blue-100 text-blue-800'
                    : order.fulfillmentStatus === 'In Production'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {order.fulfillmentStatus || 'Pending'}
              </span>
              <span className="font-mono text-[10px] text-slate-600 font-bold">
                Tracking: {order.trackingNumber || 'TRK-ASSIGNED'}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Customer Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 printable-card">
              <div className="flex items-center space-x-1.5 text-emerald-900 font-bold uppercase tracking-wider text-[10px]">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Billed To / Client</span>
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
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 printable-card">
              <div className="flex items-center space-x-1.5 text-emerald-900 font-bold uppercase tracking-wider text-[10px]">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Ship To / Delivery Address</span>
              </div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                {order.customer?.address || 'Royal Villa, Luxury Estate, Mayfair, London'}
                {order.customer?.city ? `, ${order.customer.city}` : ''}
                {order.customer?.state ? `, ${order.customer.state}` : ''}
                {order.customer?.pincode ? ` - ${order.customer.pincode}` : ''}
              </p>
              <div className="flex items-center space-x-2 text-slate-600 pt-1 text-[11px]">
                <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Carrier: {order.carrier || 'Royal Express Logistics'}</span>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Itemized Luxury Chairs ({safeItems.length})
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden printable-card">
              <table className="w-full text-left text-xs printable-table">
                <thead className="bg-slate-100 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {safeItems.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              item.image ||
                              item.mainImage ||
                              'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85'
                            }
                            alt={item.name || 'Chair'}
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80';
                            }}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.name || 'Royal Luxury Chair'}</p>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block shrink-0"
                                style={{ backgroundColor: item.color || '#1E3E2B' }}
                              />
                              <span className="text-[10px] text-slate-500 font-medium">
                                Curated Finish
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {item.quantity || 1}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        ₹{(Number(item.price) || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown & Grand Total */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs printable-card">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Gross Items Subtotal</span>
              <span className="font-mono font-bold text-slate-900">₹{grossSubtotal.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between items-center bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-200 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    Promo Voucher Applied {order.couponCode ? `(${order.couponCode})` : ''}
                  </span>
                </span>
                <span className="font-mono font-black text-emerald-900">
                  -₹{discount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Courier & White-Glove Packaging</span>
              <span className="text-emerald-800 font-bold">Complimentary (Free)</span>
            </div>

            <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline text-sm font-black text-slate-900">
              <div>
                <span>Final Money Paid / Collectable</span>
                <span className="text-[10px] font-normal text-slate-500 block">
                  via {order.paymentMethod || 'Online'} ({order.paymentStatus || 'PAID'})
                </span>
              </div>
              <span className="text-base text-emerald-950 font-mono font-black">
                ₹{totalPaid.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Print-Only Quality Guarantee & Signature Section */}
          <div className="hidden print-only pt-4 border-t border-slate-200 space-y-4 text-[10px] text-slate-600">
            <div className="flex justify-between items-end pt-2">
              <div className="space-y-1">
                <p className="font-bold text-slate-800">
                  Master Craftsmanship Warranty Guarantee:
                </p>
                <p className="text-slate-500 max-w-md leading-relaxed">
                  All Royal Chairs components carry full structural frame coverage. For customer concierge or re-upholstery support, present this packing slip with your Order ID #{order.orderNumber || order.id}.
                </p>
              </div>

              <div className="text-right space-y-3 min-w-[180px]">
                <div className="border-b border-slate-400 w-full h-8" />
                <p className="font-bold text-slate-800">Authorized Logistics Signatory</p>
              </div>
            </div>
          </div>

          {/* Interactive Fulfillment & Courier Logistics Form (HIDDEN IN PRINT) */}
          <div className="no-print pt-2">
            <form
              onSubmit={handleSaveStatus}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Update Order Logistics (Admin Only)</span>
                </div>
                {savedSuccess && (
                  <span className="text-xs text-emerald-800 bg-emerald-100 font-bold px-3 py-1 rounded-full flex items-center space-x-1 animate-pulse">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>Status Synced!</span>
                  </span>
                )}
              </div>

              {/* Quick Status Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Pending', 'In Production', 'Dispatched', 'Delivered', 'Cancelled'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleQuickSetStatus(s)}
                    disabled={isUpdating}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                      status === s
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
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
                    placeholder="e.g. TRK-12887066"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:border-emerald-600 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  Carrier: <span className="font-bold text-slate-700">{order.carrier || 'Royal Express Logistics'}</span>
                </span>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  {isUpdating ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Update Logistics</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
