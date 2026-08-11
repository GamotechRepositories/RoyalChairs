import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-cream-soft">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-emerald-900" />
              <h3 className="text-lg font-extrabold text-emerald-950">Your Shopping Bag</h3>
              <span className="bg-amber-100 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-emerald-800" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Your bag is empty</h4>
                <p className="text-sm text-gray-500 max-w-xs mt-2">
                  Discover our English handcrafted chairs and bring ergonomic luxury to your home.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-3 bg-emerald-900 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-800 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.id}-${item.color}`} className="py-4 flex space-x-4">
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.color)}
                          className="text-gray-400 hover:text-rose-600 transition ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="w-3 h-3 rounded-full border border-gray-300 shadow-xs" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          Selected Color
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, -1)}
                          className="p-1 hover:bg-gray-200 rounded-l-lg transition text-gray-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, 1)}
                          className="p-1 hover:bg-gray-200 rounded-r-lg transition text-gray-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-950">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-cream-soft space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">${cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>White-Glove Shipping</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-emerald-950 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-lg text-emerald-900">${cartSubtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Encrypted 256-bit Secure Checkout & 10-Yr Warranty</span>
              </div>

              <button
                onClick={() => alert(`Proceeding to checkout for $${cartSubtotal.toLocaleString()}! Thank you for choosing RoyalChairs.`)}
                className="w-full py-4 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition tracking-wide text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
