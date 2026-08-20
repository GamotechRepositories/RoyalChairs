import { useState, useMemo, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  BookOpen,
  Sparkle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../ui/ProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

// Finish color naming mapping
const getColorName = (hex) => {
  if (!hex) return 'Artisan Selected Finish';
  const val = typeof hex === 'string' ? hex : (hex.name || hex.hex || '');
  if (!val) return 'Artisan Selected Finish';
  const clean = val.toUpperCase();
  const map = {
    '#2E6B4D': 'British Racing Green',
    '#2D6A4F': 'English Forest Emerald',
    '#3D8B68': 'Sage Velvet Weave',
    '#2B2D42': 'Royal Midnight Navy',
    '#8D99AE': 'Slate Sterling Silver',
    '#C68B59': 'Vintage English Oak',
    '#DDA15E': 'Natural Beeswax Birch',
    '#1A1A1A': 'Onyx Executive Black',
    '#000000': 'Classic Black',
    '#FFFFFF': 'Pure White',
    '#E9D8A6': 'Champagne Gold Bouclé',
    '#9B2226': 'Imperial Velvet Crimson',
    '#6B705C': 'Heritage Olive Weave',
    '#4A4E69': 'Dusk Twilight Indigo',
    '#F4A261': 'Warm Terracotta Velvet',
    '#E76F51': 'Burnt Sunset Copper',
    '#264653': 'Deep Marine Teal',
    '#E2E8F0': 'Pure Ivory Pearl',
    '#475569': 'Charcoal Slate',
  };
  return map[clean] || (typeof hex === 'object' && hex.name ? hex.name : val || 'Curated Artisan Finish');
};

export default function ProductDetailPage({
  product,
  onBack,
  onNavigateHome,
  onNavigateCategory,
  onOpenProduct,
}) {
  const { categories, products } = useStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const defaultFallbackImage =
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80';

  // Initial color
  const initialColor = (() => {
    if (product?.selectedColor) return product.selectedColor;
    if (Array.isArray(product?.variants) && product.variants.length > 0) {
      return product.variants[0].colorHex || '#2E6B4D';
    }
    if (Array.isArray(product?.colors) && product.colors.length > 0) {
      const first = product.colors[0];
      return typeof first === 'string' ? first : (first.hex || '#2E6B4D');
    }
    return '#2E6B4D';
  })();

  // Active product details state
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedImage, setSelectedImage] = useState(
    product?.mainImage || defaultFallbackImage
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  // Sync selected color and image when product changes
  useEffect(() => {
    if (product) {
      const initCol =
        product.selectedColor ||
        (Array.isArray(product.variants) && product.variants[0]?.colorHex) ||
        (Array.isArray(product.colors) && (typeof product.colors[0] === 'string' ? product.colors[0] : product.colors[0]?.hex)) ||
        '#2E6B4D';
      setSelectedColor(initCol);
      setSelectedImage(product.mainImage || defaultFallbackImage);
    }
  }, [product?._id, product?.id]);

  // Active Variant matching selectedColor
  const activeVariant = useMemo(() => {
    if (Array.isArray(product?.variants) && product.variants.length > 0) {
      return product.variants.find(
        (v) => (v.colorHex || '').toUpperCase() === (selectedColor || '').toUpperCase()
      );
    }
    return null;
  }, [product?.variants, selectedColor]);

  // Current dynamic pricing
  const currentPrice = activeVariant?.price !== undefined ? Number(activeVariant.price) : Number(product?.price || 0);
  const currentOriginalPrice =
    activeVariant?.originalPrice !== undefined && Number(activeVariant.originalPrice) > currentPrice
      ? Number(activeVariant.originalPrice)
      : product?.originalPrice !== undefined && Number(product.originalPrice) > currentPrice
        ? Number(product.originalPrice)
        : currentPrice;

  const currentDiscount =
    currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : product?.discountPercent || 0;

  const currentStock = activeVariant?.stock !== undefined ? Number(activeVariant.stock) : Number(product?.stock || 0);

  if (!product) return null;

  const inWishlist = isInWishlist(product._id || product.id);
  const categoryObj = (categories || []).find(
    (c) => c.slug === product.categorySlug || c.id === product.category || c._id === product.category
  ) || {
    id: product.category,
    name: product.type || 'Luxury Chair',
  };

  // Multiple image gallery thumbnails prioritizing active variant images & extra photos
  const variantGallery = Array.isArray(activeVariant?.galleryImages) ? activeVariant.galleryImages : [];
  const productGallery = Array.isArray(product?.galleryImages) ? product.galleryImages : [];

  const rawGallery = [
    activeVariant?.mainImage || product.mainImage || defaultFallbackImage,
    activeVariant?.hoverImage || (product.hoverImage && product.hoverImage !== product.mainImage ? product.hoverImage : ''),
    ...variantGallery,
    ...productGallery,
  ].filter(Boolean);

  // Deduplicate while maintaining exact order
  const imageGallery = rawGallery.filter((img, index, self) => self.indexOf(img) === index);

  // Related products from the same category (excluding current product)
  const relatedCategoryProducts = (products || []).filter((p) => {
    const isSameCat =
      (p.categorySlug && p.categorySlug === product.categorySlug) ||
      (p.category && p.category === product.category);
    const isNotCurrent = (p._id || p.id) !== (product._id || product.id);
    return isSameCat && isNotCurrent;
  });

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      mainImage: activeVariant?.mainImage || activeVariant?.image || selectedImage || product.mainImage,
      selectedVariantName: activeVariant?.name || activeVariant?.colorName || getColorName(selectedColor),
    };
    for (let i = 0; i < quantity; i++) {
      addToCart(itemToAdd, selectedColor);
    }
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
  };

  return (
    <div className="min-h-screen bg-cream-soft py-6 px-3 sm:px-6 lg:px-8 text-slate-800">
      <div className="w-full max-w-[1600px] mx-auto space-y-6">
        {/* 1. TOP BREADCRUMB HEADER CARD (Matching Category Page Style) */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center space-x-3 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition border border-emerald-200 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-gray-300 text-sm">/</span>
            <button
              onClick={onNavigateHome}
              className="text-xs font-semibold text-gray-500 hover:text-emerald-800 transition cursor-pointer"
            >
              Home
            </button>
            <span className="text-gray-300 text-sm">/</span>
            <button
              onClick={() => onNavigateCategory && onNavigateCategory(product.category)}
              className="text-xs font-bold text-emerald-900 hover:underline transition cursor-pointer capitalize"
            >
              {categoryObj.name}
            </button>
            <span className="text-gray-300 text-sm">/</span>
            <span className="text-xs font-extrabold text-slate-900 truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </div>

          <div className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shrink-0">
            SKU: RC-{product._id?.slice(-4) || '2026'}
          </div>
        </div>

        {/* 2. SPLIT SECTION: STICKY LEFT IMAGE + SCROLLING RIGHT DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: STICKY IMAGE SHOWCASE & THUMBNAILS */}
          <div className="lg:col-span-7 lg:sticky lg:top-6 space-y-4">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-4/3 sm:aspect-16/11 bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-xs group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.src = defaultFallbackImage;
                }}
              />

              {/* Wishlist Button Overlay */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                  inWishlist
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-white/80 text-slate-700 hover:text-rose-600 hover:bg-white'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Gallery Thumbnails List */}
            {imageGallery.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                {imageGallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === img
                        ? 'border-emerald-700 ring-2 ring-emerald-600/30 scale-100 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumb ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = defaultFallbackImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SCROLLING DETAILS, BUY BOX & FULL SPECIFICATIONS */}
          <div className="lg:col-span-5 space-y-6">
            {/* BUY BOX CARD */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-emerald-100 shadow-xs space-y-6">
              <div className="space-y-4">
                {/* Category & SKU */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {categoryObj.name}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    SKU: RC-{product._id?.slice(-4) || '2026'}
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-serif leading-tight">
                  {product.name}
                </h1>

                {/* Rating Summary */}
                <div className="flex items-center space-x-2 pt-1">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-extrabold text-slate-800">
                    {product.rating || 5.0}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                {/* Price Row */}
                <div className="flex items-baseline space-x-3 pt-2">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-950 font-mono">
                    ₹{currentPrice}
                  </span>
                  {currentOriginalPrice > currentPrice && (
                    <span className="text-lg text-slate-400 line-through font-mono">
                      ₹{currentOriginalPrice}
                    </span>
                  )}
                  {currentDiscount > 0 && (
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                      You Save ₹{currentOriginalPrice - currentPrice} ({currentDiscount}%)
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-sm text-slate-600 leading-relaxed font-sans pt-1">
                  {product.description ||
                    'Masterfully crafted ergonomic seating engineered for superior spinal alignment, tailored upholstery luxury, and enduring architectural beauty.'}
                </p>
              </div>

              {/* VARIANT SELECTION (Small image + Variant Name + Price) */}
              {(Array.isArray(product.variants) && product.variants.length > 0
                ? product.variants
                : Array.isArray(product.colors) && product.colors.length > 0
                ? product.colors
                : []
              ).length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Select Variant / Color:
                    </span>
                    <span className="text-xs font-black text-emerald-900 font-serif">
                      {activeVariant?.colorName || activeVariant?.name || getColorName(selectedColor)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(Array.isArray(product.variants) && product.variants.length > 0
                      ? product.variants
                      : product.colors
                    ).map((item, idx) => {
                      const colorHex = item.colorHex || item.hex || (typeof item === 'string' ? item : '#2E6B4D');
                      const rawName = item.colorName || item.name || (typeof item === 'string' ? item : '');
                      const name = rawName && !rawName.startsWith('Color (#')
                        ? rawName
                        : getColorName(colorHex) !== 'Curated Artisan Finish'
                        ? getColorName(colorHex)
                        : (product.variantType === 'single' ? (product.name || 'Standard Edition') : `Finish #${idx + 1}`);

                      const image = item.mainImage || item.image || product.mainImage || defaultFallbackImage;
                      const price = item.price !== undefined ? Number(item.price) : Number(product.price);
                      const isSelected = (selectedColor || '').toUpperCase() === (colorHex || '').toUpperCase();

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedColor(colorHex);
                            if (item.mainImage || item.image) {
                              setSelectedImage(item.mainImage || item.image);
                            }
                          }}
                          className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center space-x-3 text-left ${
                            isSelected
                              ? 'border-emerald-700 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-600/20'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                          }`}
                        >
                          {/* Small Variant Thumbnail */}
                          <div className="w-12 h-12 rounded-xl border border-slate-200 shrink-0 overflow-hidden relative flex items-center justify-center bg-slate-100 shadow-2xs">
                            <img
                              src={image}
                              alt={name}
                              className="w-full h-full object-cover object-center"
                              onError={(e) => {
                                e.target.src = defaultFallbackImage;
                              }}
                            />

                            {/* Corner Color Swatch Indicator */}
                            <div
                              className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-2xs"
                              style={{ backgroundColor: colorHex }}
                              title={colorHex}
                            />

                            {isSelected && (
                              <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                              </div>
                            )}
                          </div>

                          {/* Variant Name & Price */}
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-black text-slate-900 block truncate font-serif">
                              {name}
                            </span>
                            <span className="text-xs font-black text-emerald-900 font-mono">
                              ₹{price}
                            </span>
                          </div>

                          {/* Radio Selection Indicator */}
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-emerald-700 bg-emerald-700 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STOCK STATUS */}
              <div className="flex items-center space-x-2 text-xs font-bold pt-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentStock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span className={currentStock > 0 ? 'text-emerald-800' : 'text-rose-600'}>
                  {currentStock > 0
                    ? `In Stock (${currentStock} units available in ${activeVariant?.colorName || activeVariant?.name || getColorName(selectedColor)})`
                    : 'Out of Stock'}
                </span>
              </div>

              {/* KEY CRAFTSMANSHIP BULLETS */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Signature Highlights:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart Controls */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Quantity Control */}
                  <div className="flex items-center justify-between w-full sm:w-36 h-12 bg-slate-100 rounded-2xl p-1 border border-slate-200">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-full flex items-center justify-center text-slate-700 hover:bg-white rounded-xl transition cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black text-sm text-slate-900 font-mono select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-full flex items-center justify-center text-slate-700 hover:bg-white rounded-xl transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 w-full h-12 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-lg transition cursor-pointer ${
                      addedAnim
                        ? 'bg-amber-400 text-emerald-950 shadow-amber-300/40'
                        : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-emerald-900/20'
                    }`}
                  >
                    {addedAnim ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Added to Shopping Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Bag • ₹{currentPrice * quantity}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Assurance Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
                    <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div className="text-[11px] leading-tight">
                      <span className="font-extrabold text-slate-900 block">Free Shipping</span>
                      <span className="text-slate-500">Doorstep delivery</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div className="text-[11px] leading-tight">
                      <span className="font-extrabold text-slate-900 block">10-Yr Warranty</span>
                      <span className="text-slate-500">Master frame warranty</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
                    <RotateCcw className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div className="text-[11px] leading-tight">
                      <span className="font-extrabold text-slate-900 block">30-Day Trial</span>
                      <span className="text-slate-500">Risk-free return</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL STORY & TECHNICAL SPECIFICATIONS CARD (Scrolls in Right Column) */}
            {product.showAnatomySection !== false && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-emerald-100 shadow-xs space-y-6">
                {/* Section Title */}
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                    {product.anatomyHeading && product.anatomyHeading !== 'Built for Generations of Unmatched Comfort'
                      ? product.anatomyHeading
                      : 'Product Description'}
                  </h3>
                </div>

                {/* Story narrative */}
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans space-y-3">
                  {product.fullDescription ? (
                    <div className="whitespace-pre-line leading-relaxed">
                      {product.fullDescription}
                    </div>
                  ) : (
                    <p>
                      {product.description ||
                        `Conceived in our workshops and co-developed with leading spinal orthopedists, every curve is calibrated to distribute lumbar pressure evenly across the spine. Each frame is fashioned from solid, responsibly harvested timber and high-tensile carbon steel.`}
                    </p>
                  )}
                </div>

                {/* Quick Specification Summary Matrix */}
                <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-950 tracking-wider flex items-center space-x-1.5">
                    <Sparkle className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span>Technical Specification Matrix</span>
                  </h4>

                  <div className="divide-y divide-emerald-100/80 text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Category</span>
                      <span className="font-extrabold text-slate-900 capitalize">{categoryObj.name}</span>
                    </div>
                    {product.specifications?.maxWeight && (
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Max User Capacity</span>
                        <span className="font-extrabold text-emerald-900">{product.specifications.maxWeight}</span>
                      </div>
                    )}
                    {product.specifications?.frameMaterial && (
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Frame Backbone</span>
                        <span className="font-extrabold text-slate-900">{product.specifications.frameMaterial}</span>
                      </div>
                    )}
                    {product.specifications?.foamDensity && (
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Foam Density</span>
                        <span className="font-extrabold text-slate-900">{product.specifications.foamDensity}</span>
                      </div>
                    )}
                    {product.specifications?.upholstery && (
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Upholstery</span>
                        <span className="font-extrabold text-slate-900">{product.specifications.upholstery}</span>
                      </div>
                    )}
                    {product.specifications?.dimensions && (
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Dimensions</span>
                        <span className="font-extrabold text-slate-900">{product.specifications.dimensions}</span>
                      </div>
                    )}
                    {product.specifications?.assembly && (
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Assembly Status</span>
                        <span className="font-extrabold text-slate-900">{product.specifications.assembly}</span>
                      </div>
                    )}
                    {product.specifications?.warranty && (
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Warranty Coverage</span>
                        <span className="font-extrabold text-emerald-800">{product.specifications.warranty}</span>
                      </div>
                    )}

                    {/* Custom Added Specs */}
                    {Array.isArray(product.customSpecs) &&
                      product.customSpecs.map((spec, sIdx) => (
                        <div key={sIdx} className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-500 font-medium">{spec.label}</span>
                          <span className="font-extrabold text-slate-900">{spec.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. FULL WIDTH BOTTOM: SAME CATEGORY / RELATED PRODUCTS SHOWCASE */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-50 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                More Handcrafted {categoryObj.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Explore the complete {categoryObj.name} collection designed for posture & luxury.
              </p>
            </div>

            <button
              onClick={() => onNavigateCategory && onNavigateCategory(product.category)}
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-200 transition cursor-pointer self-start sm:self-auto shadow-2xs"
            >
              View Full {categoryObj.name} ({relatedCategoryProducts.length + 1})
            </button>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedCategoryProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id || relProduct._id}
                product={relProduct}
                onQuickView={() => {
                  if (onOpenProduct) {
                    onOpenProduct(relProduct);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
