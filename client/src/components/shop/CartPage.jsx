import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage({ onBackToHome, onQuickView }) {
  const { cartItems = [], removeFromCart, updateQuantity, clearCart, cartTotal, cartSubtotal, cartCount = 0 } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
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

  const finalTotal = Math.max(0, subtotalAmount - appliedDiscount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'ROYAL50' || promoCode.trim().toUpperCase() === 'ROYAL10') {
      setAppliedDiscount(4000);
      setPromoSuccess('ROYAL50 Applied: ₹4,000 Discount Unlocked!');
    } else if (promoCode.trim().length > 0) {
      setPromoError('Invalid Coupon Code. Try "ROYAL50"');
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

        {!Array.isArray(cartItems) || cartItems.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="bg-white rounded-3xl p-12 text-center border border-emerald-900/10 shadow-lg max-w-2xl mx-auto my-12">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-800 border border-emerald-200">
              <ShoppingCart className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-emerald-950 font-serif mb-2">
              Your Bag is Currently Empty
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto mb-8">
              Explore our handcrafted seating collection—from solid English oak dining chairs to spinal orthopedic executive leather thrones.
            </p>

            <button
              onClick={onBackToHome}
              className="px-8 py-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore Chair Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* CART ITEMS & CHECKOUT GRID */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left 2 Columns: Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => {
                if (!item || typeof item !== 'object') return null;
                const itemId = item._id || item.id || `cart-${index}`;
                const rawColor = item.color || item.selectedColor;
                const itemColorHex = typeof rawColor === 'string' && (rawColor.startsWith('#') || rawColor.startsWith('rgb'))
                  ? rawColor
                  : (typeof rawColor === 'object' && typeof rawColor?.hex === 'string' ? rawColor.hex : '#3D8B68');

                const itemVariantName = typeof item.selectedVariantName === 'string'
                  ? item.selectedVariantName
                  : (typeof item.colorName === 'string'
                    ? item.colorName
                    : (typeof rawColor === 'object' && typeof rawColor?.name === 'string'
                      ? rawColor.name
                      : (typeof rawColor === 'string' && !rawColor.startsWith('#') ? rawColor : '')));

                const categoryText = typeof item.category === 'object'
                  ? (item.category?.name || item.categorySlug || '')
                  : (typeof item.category === 'string' ? item.category : (item.categorySlug || ''));

                const nameText = typeof item.name === 'string' ? item.name : 'Handcrafted Luxury Chair';

                const itemPrice = typeof item.price === 'number' && !isNaN(item.price)
                  ? item.price
                  : Number(String(item.price || 0).replace(/[^0-9.-]+/g, '')) || 0;

                const itemOriginalPrice = typeof item.originalPrice === 'number' && !isNaN(item.originalPrice)
                  ? item.originalPrice
                  : Number(String(item.originalPrice || itemPrice).replace(/[^0-9.-]+/g, '')) || itemPrice;

                const itemQuantity = Math.max(1, Number(item.quantity) || 1);
                const itemTotal = itemPrice * itemQuantity;

                const itemImg = typeof item.mainImage === 'string' && item.mainImage
                  ? item.mainImage
                  : (typeof item.image === 'string' && item.image
                    ? item.image
                    : (Array.isArray(item.images) && typeof item.images[0] === 'string' ? item.images[0] : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80'));

                return (
                  <div
                    key={`cart-${itemId}-${index}`}
                    className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-900/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:border-emerald-700/30"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      {/* Thumbnail */}
                      <img
                        src={itemImg}
                        alt={nameText}
                        onClick={() => onQuickView && onQuickView(item)}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80';
                        }}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100 shadow-2xs cursor-pointer hover:scale-105 transition flex-shrink-0 bg-slate-100"
                      />

                      <div>
                        {categoryText ? (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 block">
                            {categoryText}
                          </span>
                        ) : null}

                        <h3
                          onClick={() => onQuickView && onQuickView(item)}
                          className="text-base font-bold text-gray-900 font-serif hover:text-emerald-800 transition cursor-pointer line-clamp-1"
                        >
                          {nameText}
                        </h3>

                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 font-medium">Unit Price:</span>
                          <span className="text-xs font-bold text-emerald-950">₹{itemPrice.toLocaleString('en-IN')}</span>
                          {itemOriginalPrice > itemPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{itemOriginalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>

                        {rawColor && (
                          <div className="flex items-center space-x-1.5 mt-2">
                            <span className="text-[11px] font-medium text-gray-500">Finish:</span>
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs shrink-0"
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
                  <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg">
                    <span>Voucher Discount:</span>
                    <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-base font-bold text-emerald-950">
                  <span>Order Total:</span>
                  <span className="text-xl text-emerald-900">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Promo Coupon Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2 pt-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-950 block flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                  <span>Voucher / Promo Code</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter 'ROYAL50'"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase focus:outline-hidden focus:border-emerald-700"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {promoError && <p className="text-[11px] font-bold text-rose-600">{promoError}</p>}
                {promoSuccess && <p className="text-[11px] font-bold text-emerald-700">{promoSuccess}</p>}
              </form>

              {/* Checkout Action Button */}
              <button
                onClick={() => alert(`Thank you for ordering with RoyalChairs! Total: ₹${finalTotal.toLocaleString('en-IN')}`)}
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
