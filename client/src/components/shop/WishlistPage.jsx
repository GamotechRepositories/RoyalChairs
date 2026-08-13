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

        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 mb-6">
          <button onClick={onBackToHome} className="hover:text-emerald-900 transition flex items-center cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-emerald-950 font-extrabold">My Saved Wishlist</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-emerald-900/10 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 font-serif">
                My Saved Wishlist
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'saved chair' : 'saved chairs'} in your favorites
              </p>
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleMoveAllToCart}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All Items to Cart</span>
              </button>

              <button
                onClick={clearWishlist}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Wishlist</span>
              </button>
            </div>
          )}
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
          /* WISHLIST PRODUCTS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
