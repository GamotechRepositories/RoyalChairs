import { useState } from 'react';
import { Star, Heart, ShoppingBag, Check, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState((product.colors && product.colors[0]) || '#3D8B68');
  const [addedAnim, setAddedAnim] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const currentQty = getItemQuantity(product.id, selectedColor);


  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, selectedColor);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const defaultFallbackImage = 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className={`bg-white rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between relative h-full border ${
        isCardHovered
          ? 'border-emerald-500 shadow-lg ring-1 ring-emerald-500/20'
          : 'border-emerald-100 shadow-xs'
      }`}
    >
      <div>
        {/* Image Container with strict overflow-hidden so ONLY the inner image scales */}
        <div
          className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-cream-soft mb-4 cursor-pointer"
          onClick={() => onQuickView(product)}
        >
          {/* Primary Main Image - Zooms smoothly on hover of THIS specific card */}
          <img
            src={product.mainImage}
            alt={product.name}
            onError={(e) => {
              e.target.src = defaultFallbackImage;
            }}
            className={`w-full h-full object-cover transform transition-all duration-700 ease-out ${
              isCardHovered ? 'scale-105' : 'scale-100'
            } ${product.hoverImage && isCardHovered ? 'opacity-0 delay-200' : 'opacity-100'}`}
            loading="lazy"
          />

          {/* Secondary Alternate Image - Appears smoothly after minor delay (200ms) on hover of THIS specific card */}
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt={`${product.name} alternate view`}
              onError={(e) => {
                e.target.src = defaultFallbackImage;
              }}
              className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-700 ease-out delay-200 pointer-events-none ${
                isCardHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
              loading="lazy"
            />
          )}



          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md backdrop-blur-xs transition z-10 ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-600'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Title & Category */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
            {product.category}
          </span>

          <h3
            onClick={() => onQuickView(product)}
            className={`text-base font-extrabold text-gray-900 transition line-clamp-1 cursor-pointer font-serif ${
              isCardHovered ? 'text-emerald-700' : ''
            }`}
          >
            {product.name}
          </h3>

          {/* Star Ratings */}
          <div className="flex items-center space-x-2 pt-0.5">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Color Swatch Picker */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1.5 pt-2">
              <span className="text-[11px] font-medium text-gray-500 mr-1">Finish:</span>
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  className={`w-4 h-4 rounded-full border border-gray-300 transition ${
                    selectedColor === color ? 'ring-2 ring-emerald-600 scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color finish: ${color}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Bottom Price & Action */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-lg font-extrabold text-emerald-900">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          {product.discountPercent > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
              Save {product.discountPercent}%
            </span>
          )}
        </div>

        {currentQty > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-32 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-between shadow-sm overflow-hidden border border-emerald-800/30"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, selectedColor, -1);
              }}
              className="w-10 h-full flex items-center justify-center hover:bg-emerald-800 text-amber-300 transition font-extrabold cursor-pointer"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <span className="flex-1 text-center text-xs font-black text-white font-mono select-none">
              {currentQty}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, selectedColor, 1);
              }}
              className="w-10 h-full flex items-center justify-center hover:bg-emerald-800 text-amber-300 transition font-extrabold cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-32 h-10 rounded-full font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer ${
              addedAnim
                ? 'bg-amber-400 text-emerald-950'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
