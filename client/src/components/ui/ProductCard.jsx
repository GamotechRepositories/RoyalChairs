import { useState } from 'react';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState((product.colors && product.colors[0]) || '#3D8B68');
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, selectedColor);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  return (
    <div
      className="bg-white rounded-2xl p-4 border border-emerald-100 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Image Container */}
        <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-cream-soft mb-4 cursor-pointer" onClick={() => onQuickView(product)}>
          <img
            src={isHovered && product.hoverImage ? product.hoverImage : product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />

          {/* Top Left Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-emerald-700 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md border border-amber-300/30">
              {product.badge}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md backdrop-blur-xs transition ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-600'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Preview Hover Trigger */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full py-2 bg-white/95 hover:bg-emerald-700 hover:text-white text-emerald-900 text-xs font-extrabold rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition backdrop-blur-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick Preview</span>
            </button>
          </div>
        </div>

        {/* Product Title & Category */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
            {product.category}
          </span>

          <h3
            onClick={() => onQuickView(product)}
            className="text-base font-extrabold text-gray-900 group-hover:text-emerald-700 transition line-clamp-1 cursor-pointer font-serif"
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

        <button
          onClick={handleAddToCart}
          className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition shadow-sm ${
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
      </div>
    </div>
  );
}
