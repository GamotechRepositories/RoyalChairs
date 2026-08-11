import { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Shield, Check, Plus, Minus, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState((product.colors && product.colors[0]) || '#1E3E2B');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.mainImage);

  const inWishlist = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, selectedColor, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/10 max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-cream-soft hover:bg-gray-200 text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 p-6 md:p-8 gap-8">
          {/* Left Column: Product Images */}
          <div className="space-y-4">
            <div className="h-72 md:h-96 w-full rounded-2xl overflow-hidden bg-cream-soft border border-gray-100 relative">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-emerald-950 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-md shadow-md border border-amber-300/30">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Pickers */}
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveImage(product.mainImage)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                  activeImage === product.mainImage ? 'border-emerald-900 ring-2 ring-emerald-900/20' : 'border-gray-200'
                }`}
              >
                <img src={product.mainImage} alt="Main" className="w-full h-full object-cover" />
              </button>
              {product.hoverImage && (
                <button
                  onClick={() => setActiveImage(product.hoverImage)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === product.hoverImage ? 'border-emerald-900 ring-2 ring-emerald-900/20' : 'border-gray-200'
                  }`}
                >
                  <img src={product.hoverImage} alt="Angle" className="w-full h-full object-cover" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Product Specs & Ordering */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                {product.category}
              </span>

              <h2 className="text-2xl md:text-3xl font-black text-emerald-950 font-serif mt-2">
                {product.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                <span className="text-xs text-gray-500">({product.reviewCount} verified reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mt-4">
                <span className="text-3xl font-black text-emerald-950">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-gray-400 line-through">${product.originalPrice}</span>
                )}
                {product.discountPercent > 0 && (
                  <span className="bg-amber-100 text-emerald-950 text-xs font-extrabold px-2.5 py-1 rounded-full border border-amber-300">
                    Save {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Bullet Features */}
              {product.features && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">Craftsmanship Specs</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-center text-xs text-gray-700">
                        <Check className="w-3.5 h-3.5 text-emerald-700 mr-1.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Finish / Swatch Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
                    Select Finish
                  </label>
                  <div className="flex space-x-3">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          selectedColor === col ? 'ring-3 ring-emerald-900 scale-110 border-white' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag • ${(product.price * quantity).toLocaleString()}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition ${
                    inWishlist ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-500 bg-cream-soft p-3 rounded-xl">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-emerald-800" />
                  <span>Free White-Glove Room Delivery</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-emerald-800" />
                  <span>10-Year Master Frame Guarantee</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
