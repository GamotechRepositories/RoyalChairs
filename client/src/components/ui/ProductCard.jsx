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
      {/* Full-Bleed Image Container */}
      <div
        className="relative h-64 sm:h-72 w-full overflow-hidden bg-cream-soft cursor-pointer group/cardimg"
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
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md backdrop-blur-xs transition z-20 cursor-pointer ${inWishlist
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-600'
            }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Details & Action Section with Padding */}
      <div className="p-4 pt-3 flex flex-col justify-between flex-1">
        {/* Product Title & Category */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
            {typeof product.category === 'object'
              ? product.category?.name || product.categorySlug
              : product.categorySlug || product.category}
          </span>

          <h3
            onClick={handleQuickViewClick}
            className={`text-base font-extrabold text-gray-900 transition line-clamp-1 cursor-pointer font-serif ${isCardHovered ? 'text-emerald-700' : ''
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
            <span className="text-xs font-bold text-gray-700">{product.rating || 5}</span>
            <span className="text-xs text-gray-400">({product.reviewCount || 0})</span>
          </div>

          {/* Color Swatches (Clicking changes 1st & 2nd images & price instantly!) */}
          {swatchesList.length > 0 && (
            <div className="flex items-center space-x-2 pt-1.5">
              {swatchesList.map((swatch, idx) => {
                const isSelected = (selectedColor || '').toUpperCase() === (swatch.hex || '').toUpperCase();
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(swatch.hex);
                    }}
                    className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer shadow-xs ${isSelected
                        ? 'border-emerald-800 ring-2 ring-emerald-500 scale-125'
                        : 'border-white hover:scale-110 opacity-90'
                      }`}
                    style={{ backgroundColor: swatch.hex }}
                    title={`${swatch.name} (Click to switch images & price)`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Card Bottom Price & Action */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5 font-mono">
              <span className="text-lg font-extrabold text-emerald-900">₹{currentPrice}</span>
              {currentOriginalPrice > currentPrice && (
                <span className="text-xs text-gray-400 line-through">₹{currentOriginalPrice}</span>
              )}
            </div>
            {currentDiscount > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                Save {currentDiscount}%
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
                  updateQuantity(product._id || product.id, selectedColor, -1);
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
                  updateQuantity(product._id || product.id, selectedColor, 1);
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
              className={`w-32 h-10 rounded-full font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer ${addedAnim
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
    </div>
  );
}
