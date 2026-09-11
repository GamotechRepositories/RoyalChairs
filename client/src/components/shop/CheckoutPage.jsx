import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Smartphone,
  Building,
  Wallet,
  Loader2,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CheckoutPage({
  appliedCoupon,
  onBackToCart,
  onNavigateHome,
  onNavigateAccount,
}) {
  const { cartItems = [], clearCart, cartTotal, cartSubtotal, cartCount } = useCart();
  const { user } = useAuth();

  // Customer Shipping & Contact form
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    address: 'Royal Villa, Luxury Estate, Mayfair Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  });

  // Payment Method: 'cod' or 'razorpay'
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [razorpaySubMethod, setRazorpaySubMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'wallet'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Sync logged in user if changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Calculations
  const subtotalAmount = typeof cartTotal === 'number' && !isNaN(cartTotal)
    ? cartTotal
    : typeof cartSubtotal === 'number' && !isNaN(cartSubtotal)
      ? cartSubtotal
      : (cartItems || []).reduce((acc, item) => {
          const p = typeof item?.price === 'number' ? item.price : Number(String(item?.price || 0).replace(/[^0-9.-]+/g, '')) || 0;
          const q = Math.max(1, Number(item?.quantity) || 1);
          return acc + p * q;
        }, 0);

  const appliedDiscount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;
  const finalTotal = Math.max(0, subtotalAmount - appliedDiscount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Please fill in all required shipping and contact details.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    setLoading(true);

    try {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const orderNum = `RC-${randomNum}`;

      const orderPayload = {
        orderNumber: orderNum,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: cartItems.map((item) => ({
          productId: item._id || item.id,
          product: item._id || item.id,
          name: item.name || 'Royal Luxury Chair',
          selectedVariantName: item.selectedVariantName || item.colorName || (typeof item.color === 'string' ? item.color : 'Standard Finish'),
          color: typeof item.color === 'string' ? item.color : (item.color?.hex || '#1E3E2B'),
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.mainImage || item.image || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85',
        })),
        totalAmount: finalTotal,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay (Online Payment)',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'confirmed',
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        discountAmount: appliedDiscount,
      };

      // Simulate payment gateway delay if Razorpay
      if (paymentMethod === 'razorpay') {
        await new Promise((res) => setTimeout(res, 1200));
      }

      // Save order to MongoDB
      const res = await api.post('/orders', orderPayload);

      let savedOrder = orderPayload;
      if (res.data?.success && res.data.data) {
        savedOrder = { ...orderPayload, ...res.data.data };
      }

      // Update local storage order history for immediate reflection in Account Page
      try {
        const existing = JSON.parse(localStorage.getItem('royal_user_orders') || '[]');
        const updated = [savedOrder, ...existing.filter((o) => (o.orderNumber || o.id) !== savedOrder.orderNumber)];
        localStorage.setItem('royal_user_orders', JSON.stringify(updated));
      } catch {}

      // Clear Cart
      clearCart();
      window.dispatchEvent(new Event('royal_storage_update'));

      setOrderSuccess(savedOrder);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-cream-soft py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-emerald-900/10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-800 shadow-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-700" />
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-50 text-emerald-900 font-mono font-bold text-xs px-3.5 py-1 rounded-full border border-emerald-200">
              Order Confirmed & Placed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Thank You for Your Patronage
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your handcrafted RoyalChairs piece is now queued for benchcrafted artisan inspection and packaging.
            </p>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Order Reference Number:</span>
              <span className="font-mono font-black text-emerald-950 text-sm">{orderSuccess.orderNumber}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Option:</span>
              <span className="font-bold text-slate-900">{orderSuccess.paymentMethod}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                {orderSuccess.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Recipient & Address:</span>
              <span className="font-medium text-slate-800 text-right max-w-[260px] truncate">
                {orderSuccess.customer?.name} — {orderSuccess.customer?.city}, {orderSuccess.customer?.state}
              </span>
            </div>

            {orderSuccess.couponCode && (
              <div className="flex justify-between items-center text-emerald-800 font-bold">
                <span>Voucher Applied ({orderSuccess.couponCode}):</span>
                <span>-₹{Number(orderSuccess.discountAmount || 0).toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
              <span>Total Amount:</span>
              <span className="text-base text-emerald-950 font-mono">₹{Number(orderSuccess.totalAmount).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateAccount ? onNavigateAccount() : onNavigateHome()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <span>View in Order History</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-soft py-8 px-3 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">

        {/* Back navigation & Title */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToCart}
            className="inline-flex items-center space-x-2 text-xs font-extrabold text-emerald-900 hover:text-emerald-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Cart</span>
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT 7 COLS: Shipping & Payment Method */}
          <div className="lg:col-span-7 space-y-6">

            {/* Step 1: Delivery Address & Contact */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">
                  1
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                    Delivery Address & Client Details
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Logged in as <span className="font-bold text-emerald-900">{user?.email || 'Valued Member'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Lord / Lady Full Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Phone Number (For Delivery Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Street Address & Estate / Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Villa, Residence, Street Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai / London"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Pincode / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="400001"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                    Select Payment Method
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Choose between Online Secure Checkout or Cash on Delivery
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Option 1: Razorpay (Cards, UPI, NetBanking, Wallets) */}
                <label
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'razorpay'
                      ? 'border-emerald-700 bg-emerald-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="mt-1 text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">
                            Razorpay Secure Checkout
                          </span>
                          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                            Instant & Recommended
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Pay securely via UPI (GPay, PhonePe, Paytm), Credit / Debit Cards, NetBanking & Wallets.
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1.5 text-slate-400">
                      <CreditCard className="w-5 h-5 text-emerald-800" />
                      <Smartphone className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>

                  {/* Razorpay Sub-options when active */}
                  {paymentMethod === 'razorpay' && (
                    <div className="mt-4 pt-4 border-t border-emerald-200/80 space-y-3 text-xs animate-fadeIn">
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'upi', label: 'UPI / QR Scan', icon: Smartphone },
                          { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                          { id: 'netbanking', label: 'Net Banking', icon: Building },
                          { id: 'wallet', label: 'Wallets', icon: Wallet },
                        ].map((m) => {
                          const IconComp = m.icon;
                          const isSel = razorpaySubMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setRazorpaySubMethod(m.id);
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer ${
                                isSel
                                  ? 'bg-emerald-800 text-white shadow-xs'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                              <span>{m.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Sub-method input helpers */}
                      {razorpaySubMethod === 'upi' && (
                        <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2">
                          <label className="block text-[11px] font-bold text-slate-700">Enter UPI ID (e.g. yourname@oksbi / @paytm)</label>
                          <input
                            type="text"
                            placeholder="username@okhdfcbank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
                          />
                          <p className="text-[10px] text-slate-400">Or scan QR code on the next screen</p>
                        </div>
                      )}

                      {razorpaySubMethod === 'card' && (
                        <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase">Card Number</label>
                            <input
                              type="text"
                              placeholder="4111 2222 3333 4444"
                              maxLength={19}
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 uppercase">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                placeholder="12/28"
                                maxLength={5}
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 uppercase">CVV</label>
                              <input
                                type="password"
                                placeholder="•••"
                                maxLength={4}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </label>

                {/* Option 2: Cash on Delivery (COD) */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-700 bg-emerald-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">
                            Cash on Delivery (COD)
                          </span>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                            Pay at Doorstep
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Pay with cash or UPI QR code directly to the logistics courier upon safe delivery.
                        </p>
                      </div>
                    </div>

                    <Banknote className="w-5 h-5 text-emerald-800 hidden sm:block" />
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-5 sticky top-20">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-900/10 shadow-lg space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-900" />
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    Order Summary ({cartCount} {cartCount === 1 ? 'Item' : 'Items'})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onBackToCart}
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Edit Cart
                </button>
              </div>

              {/* Items List Preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-slate-100 text-xs">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <img
                      src={item.mainImage || item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Qty: <span className="font-bold text-slate-800">{item.quantity}</span> × ₹{Number(item.price).toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">
                      ₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900 font-mono">₹{subtotalAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Express White-Glove Shipping:</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span className="flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Voucher Discount ({appliedCoupon?.code}):</span>
                    </span>
                    <span className="font-mono">-₹{appliedDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Payable:</span>
                  <span className="text-xl font-black text-emerald-950 font-mono">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-950/20 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                    <span>
                      {paymentMethod === 'cod'
                        ? `Place Order with COD (₹${finalTotal.toLocaleString()})`
                        : `Pay with Razorpay (₹${finalTotal.toLocaleString()})`}
                    </span>
                  </>
                )}
              </button>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <p className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Doorstep delivery with tracked dispatch</span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>10-Year Master Frame Guarantee on all chairs</span>
                </p>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
