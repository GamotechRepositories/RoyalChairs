import { useState, useEffect, useMemo } from 'react';
import { Star, Heart, ShoppingBag, Check, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Initial color finish (hex of 1st variant/color)
  const initialColor = useMemo(() => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants[0].colorHex || '#3D8B68';
    }
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      const first = product.colors[0];
      return typeof first === 'string' ? first : (first.hex || '#3D8B68');
    }
    return '#3D8B68';
  }, [product]);

  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [addedAnim, setAddedAnim] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      setSelectedColor(product.variants[0].colorHex);
    } else if (Array.isArray(product.colors) && product.colors.length > 0) {
      const first = product.colors[0];
      setSelectedColor(typeof first === 'string' ? first : first.hex);
    }
  }, [product._id, product.id]);

  const inWishlist = isInWishlist(product._id || product.id);

  // Active Variant / Color object matching selectedColor
  const activeVariant = useMemo(() => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const matched = product.variants.find(
        (v) => (v.colorHex || '').toUpperCase() === (selectedColor || '').toUpperCase()
      );
      if (matched) return matched;
      return product.variants[0];
    }
    return null;
  }, [product.variants, selectedColor]);

  const activeColorObj = useMemo(() => {
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors.find((c) => {
        const hex = typeof c === 'string' ? c : c.hex;
        return (hex || '').toUpperCase() === (selectedColor || '').toUpperCase();
      });
    }
    return null;
  }, [product.colors, selectedColor]);

  // 1st Main Image of the selected color variant
  const currentMainImage =
    activeVariant?.mainImage ||
    activeVariant?.image ||
    (typeof activeColorObj === 'object' ? activeColorObj?.image : '') ||
    product.mainImage;

  // 2nd Hover Image of the selected color variant
  const currentHoverImage =
    activeVariant?.hoverImage ||
    product.hoverImage ||
    currentMainImage;

  // Dynamic Price for the selected color variant
  const currentPrice = activeVariant?.price !== undefined ? Number(activeVariant.price) : Number(product.price);
  const currentOriginalPrice =
    activeVariant?.originalPrice !== undefined && Number(activeVariant.originalPrice) > currentPrice
      ? Number(activeVariant.originalPrice)
      : product.originalPrice !== undefined && Number(product.originalPrice) > currentPrice
        ? Number(product.originalPrice)
        : currentPrice;

  const currentDiscount =
    currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : product.discountPercent || 0;

  const currentQty = getItemQuantity(product._id || product.id, selectedColor);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const itemToAdd = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      mainImage: currentMainImage,
      selectedVariantName: activeVariant?.name || activeVariant?.colorName || (typeof activeColorObj === 'object' ? activeColorObj?.name : ''),
    };
    addToCart(itemToAdd, selectedColor);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView({
        ...product,
        selectedColor,
        activeVariant,
      });
    }
  };

  const defaultFallbackImage = 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80';

  // Swatches list: Extract from variants or colors
  const swatchesList = useMemo(() => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.map((v) => ({
        hex: v.colorHex || '#2E6B4D',
        name: v.colorName || v.name || 'Finish',
        image: v.mainImage || v.image || '',
        hoverImage: v.hoverImage || '',
        price: v.price,
      }));
    }
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors.map((c) => ({
        hex: typeof c === 'string' ? c : c.hex,
        name: typeof c === 'string' ? c : (c.name || c.hex),
        image: typeof c === 'object' ? c.image : '',
        hoverImage: product.hoverImage || '',
        price: product.price,
      }));
    }
    return [];
  }, [product]);

  return (
    <div
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between relative h-full border ${isCardHovered
        ? 'border-emerald-500 shadow-lg ring-1 ring-emerald-500/20'
        : 'border-emerald-100 shadow-xs'
        }`}
    >
      {/* Full-Bleed Image Container (Compact on mobile) */}
      <div
        className="relative h-44 sm:h-60 lg:h-64 w-full overflow-hidden bg-cream-soft cursor-pointer group/cardimg"
        onClick={handleQuickViewClick}
      >
        {/* Primary Main Image (1st Image of active color variant) */}
        <img
          key={`main-${selectedColor}-${currentMainImage}`}
          src={currentMainImage}
          alt={product.name}
          onError={(e) => {
            e.target.src = defaultFallbackImage;
          }}
          className={`w-full h-full object-cover transform transition-all duration-500 ease-out ${isCardHovered && currentHoverImage && currentHoverImage !== currentMainImage
            ? 'opacity-0 scale-105'
            : 'opacity-100 scale-100'
            }`}
          loading="lazy"
        />

        {/* Secondary Alternate Image (2nd Image of active color variant - Shown on Hover) */}
        {currentHoverImage && currentHoverImage !== currentMainImage && (
          <img
            key={`hover-${selectedColor}-${currentHoverImage}`}
            src={currentHoverImage}
            alt={`${product.name} alternate view`}
            onError={(e) => {
              e.target.src = defaultFallbackImage;
            }}
            className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-500 ease-out pointer-events-none ${isCardHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
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
          className={`absolute top-2.5 right-2.5 p-1.5 sm:p-2 rounded-full shadow-md backdrop-blur-xs transition z-20 cursor-pointer ${inWishlist
            ? 'bg-rose-500 text-white'
            : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-600'
            }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Details & Action Section */}
      <div className="p-3 sm:p-4 pt-2.5 sm:pt-3 flex flex-col justify-between flex-1">
        {/* Product Title & Category */}
        <div className="space-y-0.5 sm:space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block truncate">
            {typeof product.category === 'object'
              ? product.category?.name || product.categorySlug
              : product.categorySlug || product.category}
          </span>

          <h3
            onClick={handleQuickViewClick}
            className={`text-sm sm:text-base font-bold text-gray-900 transition line-clamp-1 cursor-pointer font-serif ${isCardHovered ? 'text-emerald-700' : ''
              }`}
          >
            {product.name}
          </h3>
        </div>

        {/* Card Bottom Price & Action */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-2">
          {/* Price & Discount Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-1 sm:space-x-1.5 font-mono">
              <span className="text-base sm:text-lg font-bold text-emerald-950">₹{currentPrice.toLocaleString('en-IN')}</span>
              {currentOriginalPrice > currentPrice && (
                <span className="text-[11px] sm:text-xs text-gray-400 line-through">₹{currentOriginalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            {currentDiscount > 0 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                Save {currentDiscount}%
              </span>
            )}
          </div>

          {/* Add to Cart Button / Quantity Controller on Next Line */}
          <div>
            {currentQty > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full h-10 sm:h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-between shadow-xs overflow-hidden border border-emerald-800/30"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product._id || product.id, selectedColor, -1);
                  }}
                  className="w-12 h-full flex items-center justify-center hover:bg-emerald-800 text-amber-300 transition font-extrabold cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </button>
                <span className="flex-1 text-center text-sm sm:text-base font-bold text-white font-mono select-none">
                  {currentQty}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product._id || product.id, selectedColor, 1);
                  }}
                  className="w-12 h-full flex items-center justify-center hover:bg-emerald-800 text-amber-300 transition font-extrabold cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-full h-10 sm:h-11 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer ${addedAnim
                  ? 'bg-amber-400 text-emerald-950'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  }`}
              >
                {addedAnim ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
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
      </div>
    </div>
  );
}
