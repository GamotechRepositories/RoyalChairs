import { useState, useEffect } from 'react';
import {
  X,
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

export default function TrackOrderModal({ isOpen, onClose, initialOrderId = '' }) {
  const [orderId, setOrderId] = useState(initialOrderId || '');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialOrderId) {
        setOrderId(initialOrderId);
        fetchOrderTracking(initialOrderId);
      }
    } else {
      document.body.style.overflow = '';
      setErrorMessage('');
      setTrackedOrder(null);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, initialOrderId, onClose]);

  if (!isOpen) return null;

  const fetchOrderTracking = async (searchId) => {
    if (!searchId || !searchId.trim()) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const cleanId = searchId.trim();
      const res = await api.get(`/orders/track/${encodeURIComponent(cleanId)}`);
      if (res.data?.success && res.data.data) {
        setTrackedOrder(res.data.data);
        return;
      }
      throw new Error(res.data?.message || 'Shipment not found');
    } catch (err) {
      // Check localStorage for offline / recent fallback
      try {
        const localSaved = localStorage.getItem('royal_user_orders');
        const adminSaved = localStorage.getItem('royal_admin_orders');
        const combined = [
          ...(localSaved ? JSON.parse(localSaved) : []),
          ...(adminSaved ? JSON.parse(adminSaved) : []),
        ];

        const match = combined.find(
          (o) =>
            (o.orderNumber && o.orderNumber.toLowerCase() === searchId.toLowerCase().trim()) ||
            (o.id && o.id.toLowerCase() === searchId.toLowerCase().trim()) ||
            (o.trackingNumber && o.trackingNumber.toLowerCase() === searchId.toLowerCase().trim())
        );

        if (match) {
          const rawStatus = (match.fulfillmentStatus || match.orderStatus || 'Pending').toLowerCase();
          let fulfillmentStatus = 'Pending';
          if (rawStatus === 'in production' || rawStatus === 'confirmed') fulfillmentStatus = 'In Production';
          else if (rawStatus === 'dispatched' || rawStatus === 'shipped') fulfillmentStatus = 'Dispatched';
          else if (rawStatus === 'delivered') fulfillmentStatus = 'Delivered';
          else if (rawStatus === 'cancelled') fulfillmentStatus = 'Cancelled';

          const steps = [
            {
              title: 'Order Placed & Verified',
              description: 'Your bespoke order was received and payment was confirmed.',
              date: new Date(match.createdAt || match.date || Date.now()).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
              completed: fulfillmentStatus !== 'Cancelled',
            },
            {
              title: 'Artisan Benchcrafting & Quality Check',
              description: 'Handcrafted by master woodworkers with ergonomic certification.',
              date: fulfillmentStatus === 'Pending' ? 'Pending Allocation' : 'Benchcrafting Completed',
              completed: ['In Production', 'Dispatched', 'Delivered'].includes(fulfillmentStatus),
            },
            {
              title: `Dispatched via Royal Express (${match.trackingNumber || 'TRK-EXP'})`,
              description: 'Package secured in protective white-glove transit packaging.',
              date: ['Dispatched', 'Delivered'].includes(fulfillmentStatus) ? 'Dispatched from Logistics Hub' : 'Awaiting Courier Handover',
              completed: ['Dispatched', 'Delivered'].includes(fulfillmentStatus),
            },
            {
              title: 'Doorstep White-Glove Delivery & Assembly',
              description: 'Carefully delivered and assembled in your designated room.',
              date: fulfillmentStatus === 'Delivered' ? 'Delivered & Assembled' : 'Estimated within 3-5 days',
              completed: fulfillmentStatus === 'Delivered',
            },
          ];

          setTrackedOrder({
            ...match,
            fulfillmentStatus,
            carrier: match.carrier || 'Royal Express Logistics',
            trackingNumber: match.trackingNumber || 'TRK-12887066',
            steps,
          });
          return;
        }
      } catch {}

      setErrorMessage(
        err.response?.data?.message ||
          `No active shipment found with reference "${searchId}". Please verify your Order or Tracking ID.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    fetchOrderTracking(orderId);
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
    if (s.includes('dispatched') || s.includes('shipped')) {
      return 'bg-blue-100 text-blue-900 border-blue-300';
    }
    if (s.includes('production') || s.includes('confirmed')) {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (s.includes('cancelled')) {
      return 'bg-rose-100 text-rose-900 border-rose-300';
    }
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh] border border-slate-200 relative p-5 sm:p-7 cursor-default space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-serif">
                Track Royal Delivery
              </h3>
              <p className="text-xs text-slate-500">Live order & courier logistics tracker</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!trackedOrder ? (
          /* Search Form */
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Order ID or Courier Tracking Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. RC-51965 or TRK-12887066"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 font-mono"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-800 text-xs font-medium animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition text-xs sm:text-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Searching Shipment Database...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Shipment Live</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Result Details */
          <div className="space-y-5 animate-fadeIn">
            {/* Live Logistics Summary Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-slate-900 text-sm">
                      Order #{trackedOrder.orderNumber || trackedOrder.id}
                    </span>
                    <button
                      onClick={() => handleCopy(trackedOrder.orderNumber || trackedOrder.id)}
                      className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedCode === (trackedOrder.orderNumber || trackedOrder.id) ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Placed on {new Date(trackedOrder.createdAt || trackedOrder.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${getStatusBadge(
                    trackedOrder.fulfillmentStatus || trackedOrder.orderStatus
                  )}`}
                >
                  {trackedOrder.fulfillmentStatus || 'In Production'}
                </span>
              </div>

              {/* Courier Tracking Code Row */}
              <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-emerald-800" />
                  <span className="text-slate-600 font-medium">Carrier:</span>
                  <span className="font-bold text-slate-900">
                    {trackedOrder.carrier || 'Royal Express Logistics'}
                  </span>
                </div>

                {trackedOrder.trackingNumber && (
                  <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="text-slate-500 font-medium">Tracking Code:</span>
                    <span className="font-mono font-bold text-emerald-900">
                      {trackedOrder.trackingNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(trackedOrder.trackingNumber)}
                      className="text-slate-400 hover:text-emerald-800 ml-1 cursor-pointer"
                      title="Copy Tracking Number"
                    >
                      {copiedCode === trackedOrder.trackingNumber ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-Step Delivery Progress Stepper */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-800" />
                <span>Live Delivery Journey</span>
              </h4>

              <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {(trackedOrder.steps || []).map((step, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3.5 text-xs">
                    <div
                      className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        step.completed
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : step.current
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {step.completed ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>

                    <div className="pt-0.5 space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-bold ${
                            step.completed || step.current ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        {step.current && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                            CURRENT STAGE
                          </span>
                        )}
                      </div>
                      {step.description && (
                        <p className="text-[11px] text-slate-500">{step.description}</p>
                      )}
                      {step.date && (
                        <p className="text-[10px] font-mono text-emerald-800 font-semibold">
                          {step.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Payment Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Delivery Destination
                </span>
                <p className="font-bold text-slate-900">
                  {trackedOrder.customer?.name || 'Valued Client'}
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {trackedOrder.customer?.address || 'Royal Villa'}
                  {trackedOrder.customer?.city ? `, ${trackedOrder.customer.city}` : ''}
                  {trackedOrder.customer?.pincode ? ` - ${trackedOrder.customer.pincode}` : ''}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Total Paid
                </span>
                <p className="text-base font-black font-mono text-emerald-950">
                  ₹{Number(trackedOrder.totalAmount || trackedOrder.total || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-600 uppercase font-semibold">
                  Via {trackedOrder.paymentMethod || 'Online'} ({trackedOrder.paymentStatus || 'PAID'})
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => {
                setTrackedOrder(null);
                setErrorMessage('');
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Track Another Package
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
