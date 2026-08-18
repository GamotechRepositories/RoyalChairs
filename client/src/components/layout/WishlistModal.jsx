import { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Star, Eye, Plus, Minus } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function WishlistModal({ isOpen, onClose, onQuickView }) {
  const { wishlistItems, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart, updateQuantity, getItemQuantity, showNotification } = useCart();

  const [addedItems, setAddedItems] = useState({});

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

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach((product) => addToCart(product));
    showNotification(`Added all ${wishlistItems.length} wishlist items to your bag!`);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/10 flex flex-col max-h-[90vh] cursor-default"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-cream-soft">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-emerald-950 font-serif">
                  Saved Wishlist
                </h3>
                <span className="bg-rose-500 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              </div>
              <p className="text-xs text-gray-500">Your curated collection of favorite luxury seats</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-gray-200 text-gray-700 transition border border-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 divide-y divide-gray-100">
          {wishlistItems.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
                <Heart className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Your Wishlist is Empty</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Click the heart icon on any chair to save it to your personal luxury wishlist.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center space-x-2"
              >
                <span>Browse Chairs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Wishlist Items List */
            wishlistItems.map((product) => (
              <div
                key={product.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Product Info */}
                <div className="flex items-center space-x-4">
                  <div
                    className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream-soft border border-gray-200 flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      onQuickView(product);
                      onClose();
                    }}
                  >
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                      {product.category}
                    </span>
                    <h4
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      className="text-sm font-bold text-gray-900 hover:text-emerald-800 transition cursor-pointer font-serif line-clamp-1"
                    >
                      {product.name}
                    </h4>

                    {/* Star Rating & Price */}
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-extrabold text-emerald-900">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>

                      <div className="flex items-center text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                        <span className="font-bold text-gray-700">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onQuickView(product);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-cream-soft hover:bg-gray-200 text-gray-700 transition"
                    title="Quick Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {getItemQuantity(product.id) > 0 ? (
                    <div className="w-32 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-between shadow-xs overflow-hidden border border-emerald-800/30">
                      <button
                        onClick={() => updateQuantity(product.id, null, -1)}
                        className="w-10 h-full flex items-center justify-center hover:bg-emerald-800 text-amber-300 transition font-extrabold cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <span className="flex-1 text-center text-xs font-black text-white font-mono select-none">
                        {getItemQuantity(product.id)}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, null, 1)}
                        className="w-10 h-full flex items-center justify-center hover:bg-emerald-800 text-amber-300 transition font-extrabold cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`w-32 h-10 rounded-full font-extrabold text-xs flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer ${addedItems[product.id]
                          ? 'bg-amber-400 text-emerald-950'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{addedItems[product.id] ? 'Added!' : 'Add to Bag'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition border border-rose-200"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {wishlistItems.length > 0 && (
          <div className="p-4 bg-cream-soft border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Showing <strong>{wishlistCount}</strong> saved items
            </span>

            <button
              onClick={handleAddAllToCart}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Bag</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
