import { Heart, ArrowLeft, ArrowRight, ShoppingBag, Trash2, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../ui/ProductCard';

export default function WishlistPage({ onBackToHome, onQuickView }) {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item);
    });
    clearWishlist();
  };

  return (
    <div className="min-h-screen bg-cream-soft pt-6 pb-20">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-900/10 gap-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            My Saved Wishlist
          </h1>

          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-extrabold text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
            </span>

            {wishlistItems.length > 0 && (
              <>
                <button
                  onClick={handleMoveAllToCart}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Move All to Cart</span>
                </button>

                <button
                  onClick={clearWishlist}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition flex items-center space-x-1 cursor-pointer"
                  title="Clear Wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          /* EMPTY WISHLIST VIEW */
          <div className="bg-white rounded-3xl p-12 text-center border border-emerald-900/10 shadow-lg max-w-2xl mx-auto my-12">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 border border-rose-200">
              <Heart className="w-10 h-10 fill-current" />
            </div>

            <h2 className="text-2xl font-black text-emerald-950 font-serif mb-2">
              Your Wishlist is Empty
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto mb-8">
              Save your favorite luxury armchairs, gaming thrones, and executive leather seats to your wishlist for easy access anytime.
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
          /* WISHLIST PRODUCTS GRID (4 on desktop, 2 on mobile) */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {wishlistItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
