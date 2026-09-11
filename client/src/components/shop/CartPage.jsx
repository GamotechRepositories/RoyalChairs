import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles, Tag, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CartPage({
  onBackToHome,
  onQuickView,
  onProceedToCheckout,
  onRequireLogin,
}) {
  const { cartItems = [], removeFromCart, updateQuantity, clearCart, cartTotal, cartSubtotal, cartCount = 0 } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Full coupon details object from database
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Fallback safe calculation for total amount
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

  // Dynamic Coupon Validation from MongoDB Backend
  const handleApplyPromo = async (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    if (!promoCode.trim()) {
      setPromoError('Please enter a voucher code');
      return;
    }

    setPromoLoading(true);
    try {
      const res = await api.post('/coupons/validate', {
        code: promoCode.trim(),
        cartTotal: subtotalAmount,
      });

      if (res.data?.success && res.data.data) {
        setAppliedCoupon(res.data.data);
        setPromoSuccess(res.data.message || `Voucher '${res.data.data.code}' applied!`);
        setPromoCode('');
      } else {
        throw new Error(res.data?.message || 'Invalid voucher code');
      }
    } catch (err) {
      setAppliedCoupon(null);
      setPromoError(err.response?.data?.message || err.message || 'Unable to apply promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromoSuccess('');
    setPromoError('');
  };

  const handleProceedToCheckout = () => {
    if (!cartItems || cartItems.length === 0) return;

    // Check if user is logged in
    if (!isAuthenticated) {
      if (onRequireLogin) {
        onRequireLogin(() => {
          if (onProceedToCheckout) {
            onProceedToCheckout(appliedCoupon);
          }
        });
      }
      return;
    }

    if (onProceedToCheckout) {
      onProceedToCheckout(appliedCoupon);
    }
  };

  return (

    <div className="min-h-screen bg-cream-soft pt-6 pb-20">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-900/10 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Your Shopping Cart
          </h1>

          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-bold text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
            </span>

            {Array.isArray(cartItems) && cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl border border-rose-200 transition cursor-pointer"
                title="Empty Entire Cart"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Empty Cart</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {(!Array.isArray(cartItems) || cartItems.length === 0) ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-emerald-900/10 shadow-sm space-y-5">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-800">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">Your Cart is Empty</h2>
              <p className="text-slate-500 text-xs mt-1">
                Explore our handcrafted British luxury chairs and elevate your living space.
              </p>
            </div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center space-x-2 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Product List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, idx) => {
                const itemId = item._id || item.id || `cart-item-${idx}`;
                const itemPrice = typeof item.price === 'number' ? item.price : Number(String(item.price || 0).replace(/[^0-9.-]+/g, '')) || 0;
                const itemQuantity = Math.max(1, Number(item.quantity) || 1);
                const itemTotal = itemPrice * itemQuantity;
                const itemColorHex = typeof item.color === 'string' ? item.color : (item.color?.hex || '#1E3E2B');
                const itemVariantName = item.selectedVariantName || item.colorName || (typeof item.color === 'string' ? item.color : 'Standard Finish');
                const itemImage = item.mainImage || item.image || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85';

                return (
                  <div
                    key={`${itemId}-${idx}`}
                    className="bg-white rounded-3xl p-4 sm:p-6 border border-emerald-900/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:shadow-md"
                  >
                    {/* Image & Title */}
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <img
                        src={itemImage}
                        alt={item.name || 'Chair'}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-cream-soft border border-emerald-900/10 shrink-0"
                      />
                      <div className="space-y-1">
                        <h3 className="text-sm sm:text-base font-bold text-emerald-950 font-serif leading-tight">
                          {item.name || 'Royal Luxury Chair'}
                        </h3>
                        <p className="text-xs font-bold text-emerald-800 font-mono">
                          ₹{itemPrice.toLocaleString('en-IN')} each
                        </p>

                        {/* Selected Color Badge */}
                        {itemColorHex && (
                          <div className="flex items-center space-x-1.5 pt-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-xs inline-block shrink-0"
                              style={{ backgroundColor: itemColorHex }}
                            />
                            {itemVariantName && (
                              <span className="text-[11px] font-semibold text-gray-700 capitalize truncate max-w-[180px]">
                                {itemVariantName}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Item Total */}
                    <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="w-28 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-between shadow-xs overflow-hidden border border-emerald-900/30">
                        <button
                          onClick={() => updateQuantity(itemId, item.color, -1)}
                          className="w-9 h-full flex items-center justify-center hover:bg-emerald-700 text-amber-300 transition cursor-pointer"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="flex-1 text-center text-xs font-bold text-white font-mono select-none">
                          {itemQuantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(itemId, item.color, 1)}
                          className="w-9 h-full flex items-center justify-center hover:bg-emerald-700 text-amber-300 transition cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="text-sm font-bold text-emerald-950 block">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(itemId, item.color)}
                        className="p-2 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary Box */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-lg space-y-6 sticky top-24">
              <h2 className="text-lg font-bold text-emerald-950 font-serif border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items):</span>
                  <span className="font-bold text-gray-900">₹{subtotalAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Express Home Delivery:</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/80">
                    <span>Voucher Discount:</span>
                    <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-base font-bold text-emerald-950">
                  <span>Order Total:</span>
                  <span className="text-xl text-emerald-900">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Promo Coupon Details or Input */}
              {appliedCoupon ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-xs text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-800">
                        {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% OFF` : `₹${appliedCoupon.value} OFF`}
                      </span>
                    </div>

                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-slate-500 hover:text-rose-600 font-bold flex items-center space-x-1 cursor-pointer transition"
                      title="Remove voucher"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Coupon Details Specs */}
                  <div className="text-[11px] text-emerald-900/80 space-y-1 pt-1 border-t border-emerald-200/60 font-medium">
                    <p className="flex justify-between">
                      <span>Minimum Required Order:</span>
                      <span className="font-bold text-emerald-950 font-mono">₹{Number(appliedCoupon.minSpend || 0).toLocaleString()}</span>
                    </p>
                    {appliedCoupon.maxDiscount && (
                      <p className="flex justify-between">
                        <span>Maximum Discount Limit:</span>
                        <span className="font-bold text-emerald-950 font-mono">₹{Number(appliedCoupon.maxDiscount).toLocaleString()}</span>
                      </p>
                    )}
                    <p className="flex justify-between font-bold text-emerald-900 pt-0.5">
                      <span>Total Savings Applied:</span>
                      <span className="text-emerald-700 font-mono">-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-950 flex items-center">
                    <Tag className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    <span>Voucher / Promo Code</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. ROYAL50)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase focus:outline-hidden focus:border-emerald-700 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={promoLoading}
                      className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                    >
                      {promoLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>

                  {promoError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-start space-x-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{promoError}</span>
                    </div>
                  )}
                  {promoSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{promoSuccess}</span>
                    </div>
                  )}
                </form>
              )}

              {/* Checkout Action Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Proceed to Checkout (₹{finalTotal.toLocaleString('en-IN')})</span>
              </button>

              <div className="pt-2 text-[11px] text-gray-500 space-y-1.5 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Free Express Delivery on all orders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>10-Year Master Frame Guarantee Included</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
