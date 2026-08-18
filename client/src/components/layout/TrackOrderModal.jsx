import { useState, useEffect } from 'react';
import { X, Package, Search, Truck, CheckCircle2, Clock } from 'lucide-react';

export default function TrackOrderModal({ isOpen, onClose }) {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      setTrackedOrder({
        id: orderId.toUpperCase(),
        status: 'In Transit - Express Courier',
        carrier: 'Royal Logistics UK',
        estimatedDelivery: 'Tomorrow by 2:00 PM',
        steps: [
          { title: 'Order Confirmed & Benchcrafted', date: 'Aug 10, 09:30 AM', completed: true },
          { title: 'Quality & Ergonomic Inspection', date: 'Aug 10, 02:15 PM', completed: true },
          { title: 'Dispatched from Gloucestershire Workshop', date: 'Aug 11, 08:00 AM', completed: true },
          { title: 'Out for Doorstep Delivery', date: 'Estimated Tomorrow', completed: false },
        ],
      });
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/10 relative p-6 sm:p-8 cursor-default"
      >
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-cream-soft hover:bg-gray-200 text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center shadow-md">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-emerald-950 font-serif">Track Your Royal Delivery</h3>
            <p className="text-xs text-gray-500">Live courier dispatch updates</p>
          </div>
        </div>

        {!trackedOrder ? (
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                Order Tracking ID / Reference
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RC-9821-UK"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 bg-cream-soft border border-gray-300 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                Billing Email Address
              </label>
              <input
                type="email"
                required
                placeholder="your.email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cream-soft border border-gray-300 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-emerald-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Order Live</span>
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Order #{trackedOrder.id}</span>
                  <h4 className="text-base font-extrabold text-emerald-950 mt-0.5">{trackedOrder.status}</h4>
                </div>
                <span className="bg-amber-100 text-emerald-950 text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-amber-300">
                  {trackedOrder.carrier}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-medium">
                ⏱️ Estimated Arrival: <strong>{trackedOrder.estimatedDelivery}</strong>
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pl-2">
              {trackedOrder.steps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={`font-bold block ${step.completed ? 'text-emerald-950' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                    <span className="text-[11px] text-gray-400">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTrackedOrder(null)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition"
            >
              Track Another Package
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
