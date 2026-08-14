import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, Truck, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage({ onBackToHome, onQuickView }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartSubtotal, cartCount } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Fallback safe calculation for total amount
  const subtotalAmount = typeof cartTotal === 'number' && !isNaN(cartTotal)
    ? cartTotal
    : typeof cartSubtotal === 'number' && !isNaN(cartSubtotal)
    ? cartSubtotal
    : cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

  const finalTotal = Math.max(0, subtotalAmount - appliedDiscount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'ROYAL50' || promoCode.trim().toUpperCase() === 'ROYAL10') {
      
      setAppliedDiscount(4000); setPromoSuccess('ROYAL50 Applied: ₹4,000 Discount Unlocked!');
    } else if (promoCode.trim().length > 0) {
      setPromoError('Invalid Coupon Code. Try "ROYAL50"');
    }
  };

  return (
    <div className="min-h-screen bg-cream-soft pt-6 pb-20">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 mb-6">
          <button onClick={onBackToHome} className="hover:text-emerald-900 transition flex items-center cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-emerald-950 font-extrabold">Shopping Cart</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-emerald-900/10 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-md">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 font-serif">
                Your Shopping Cart
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                {cartCount} {cartCount === 1 ? 'luxury chair' : 'luxury chairs'} in your bag
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-extrabold text-rose-700 hover:text-rose-900 flex items-center space-x-1.5 bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 transition cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Empty Entire Cart</span>
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="bg-white rounded-3xl p-12 text-center border border-emerald-900/10 shadow-lg max-w-2xl mx-auto my-12">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-800 border border-emerald-200">
              <ShoppingCart className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-emerald-950 font-serif mb-2">
              Your Bag is Currently Empty
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto mb-8">
              Explore our handcrafted seating collection—from solid English oak dining chairs to spinal orthopedic executive leather thrones.
            </p>

            <button
              onClick={onBackToHome}
              className="px-8 py-4 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition inline-flex items-center space-x-2 cursor-pointer"
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
              {cartItems.map((item) => {
                const itemColor = item.color || item.selectedColor;
                const itemPrice = Number(item.price) || 0;
                const itemQuantity = Number(item.quantity) || 1;
                const itemTotal = itemPrice * itemQuantity;

                return (
                  <div
                    key={`${item.id}-${itemColor}`}
                    className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-900/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:border-emerald-700/30"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      {/* Thumbnail */}
                      <img
                        src={item.mainImage}
                        alt={item.name}
                        onClick={() => onQuickView && onQuickView(item)}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100 shadow-2xs cursor-pointer hover:scale-105 transition flex-shrink-0"
                      />

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                          {item.category}
                        </span>
                        <h3
                          onClick={() => onQuickView && onQuickView(item)}
                          className="text-base font-extrabold text-gray-900 font-serif hover:text-emerald-800 transition cursor-pointer line-clamp-1"
                        >
                          {item.name}
                        </h3>

                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 font-medium">Unit Price:</span>
                          <span className="text-xs font-black text-emerald-950">₹{itemPrice}</span>
                          {item.originalPrice > itemPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                          )}
                        </div>

                        {itemColor && (
                          <div className="flex items-center space-x-1.5 mt-2">
                            <span className="text-[11px] font-medium text-gray-500">Finish:</span>
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300"
                              style={{ backgroundColor: itemColor }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Item Total */}
                    <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="w-28 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-between shadow-xs overflow-hidden border border-emerald-900/30">
                        <button
                          onClick={() => updateQuantity(item.id, itemColor, -1)}
                          className="w-9 h-full flex items-center justify-center hover:bg-emerald-700 text-amber-300 transition cursor-pointer"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="flex-1 text-center text-xs font-black text-white font-mono select-none">
                          {itemQuantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, itemColor, 1)}
                          className="w-9 h-full flex items-center justify-center hover:bg-emerald-700 text-amber-300 transition cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="text-sm font-black text-emerald-950 block">
                          ₹{itemTotal}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, itemColor)}
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
              <h2 className="text-lg font-black text-emerald-950 font-serif border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items):</span>
                  <span className="font-bold text-gray-900">₹{subtotalAmount}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>White-Glove Room Delivery:</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg">
                    <span>Voucher Discount:</span>
                    <span>-₹{appliedDiscount}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-base font-black text-emerald-950">
                  <span>Order Total:</span>
                  <span className="text-xl text-emerald-900">₹{finalTotal}</span>
                </div>
              </div>

              {/* Promo Coupon Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2 pt-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 block flex items-center">
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
                    className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {promoError && <p className="text-[11px] font-bold text-rose-600">{promoError}</p>}
                {promoSuccess && <p className="text-[11px] font-bold text-emerald-700">{promoSuccess}</p>}
              </form>

              {/* Checkout Action Button */}
              <button
                onClick={() => alert(`Thank you for ordering with RoyalChairs! Total: ₹${finalTotal}`)}
                className="w-full py-4 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Proceed to Checkout (₹{finalTotal})</span>
              </button>

              <div className="pt-2 text-[11px] text-gray-500 space-y-1.5 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Free White-Glove Shipping on all orders</span>
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
