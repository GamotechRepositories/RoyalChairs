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
  MessageSquare,
  Send,
  User,
  CheckCircle2,
  ThumbsUp,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../ui/ProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductReviewsModal from './ProductReviewsModal';
import api from '../../services/api';

// Finish color naming mapping
const getColorName = (colorInput, productObj) => {
  if (!colorInput) return 'Curated Finish';

  // 1. If product has custom color objects with names
  if (productObj && Array.isArray(productObj.colors)) {
    const found = productObj.colors.find((c) => {
      const hex = typeof c === 'string' ? c : c?.hex;
      const target = typeof colorInput === 'string' ? colorInput : colorInput?.hex;
      return hex && target && hex.toUpperCase() === target.toUpperCase();
    });
    if (found && typeof found === 'object' && found.name) {
      return found.name;
    }
  }

  // 2. If object with name passed
  if (typeof colorInput === 'object' && colorInput.name) {
    return colorInput.name;
  }

  const rawHex = typeof colorInput === 'string' ? colorInput : (colorInput.hex || '');
  if (!rawHex) return 'Curated Finish';
  const clean = rawHex.toUpperCase();

  const map = {
    '#395DB1': 'Royal Cobalt Blue',
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
    '#008080': 'Deep Teal',
    '#0000FF': 'Electric Blue',
    '#808080': 'Gunmetal Grey',
  };

  return map[clean] || 'Curated Finish';
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

  // Product Reviews & Comments State
  const [productReviews, setProductReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  // Fetch reviews for this specific product
  const fetchProductReviews = async () => {
    if (!product) return;
    setIsLoadingReviews(true);
    try {
      const prodId = product._id || product.id;
      const res = await api.get(`/reviews?productId=${prodId}`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setProductReviews(res.data.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Sync selected color, image, and reviews when product changes
  useEffect(() => {
    if (product) {
      const initCol =
        product.selectedColor ||
        (Array.isArray(product.variants) && product.variants[0]?.colorHex) ||
        (Array.isArray(product.colors) && (typeof product.colors[0] === 'string' ? product.colors[0] : product.colors[0]?.hex)) ||
        '#2E6B4D';
      setSelectedColor(initCol);
      setSelectedImage(product.mainImage || defaultFallbackImage);
      fetchProductReviews();
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

  // Active Color matching selectedColor
  const activeColorObj = useMemo(() => {
    if (Array.isArray(product?.colors) && product.colors.length > 0) {
      return product.colors.find((c) => {
        const hex = typeof c === 'string' ? c : c?.hex;
        return (hex || '').toUpperCase() === (selectedColor || '').toUpperCase();
      });
    }
    return null;
  }, [product?.colors, selectedColor]);

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

  // Dynamic availability for active variant / color
  const isAvailable = useMemo(() => {
    if (activeVariant && activeVariant.isAvailable !== undefined) {
      return Boolean(activeVariant.isAvailable);
    }
    if (activeVariant && activeVariant.stock !== undefined && activeVariant.stock !== null) {
      return Number(activeVariant.stock) > 0;
    }
    if (activeColorObj && typeof activeColorObj === 'object' && activeColorObj.isAvailable !== undefined) {
      return Boolean(activeColorObj.isAvailable);
    }
    if (activeColorObj && typeof activeColorObj === 'object' && activeColorObj.stock !== undefined && activeColorObj.stock !== null) {
      return Number(activeColorObj.stock) > 0;
    }
    if (product?.isAvailable !== undefined) {
      return Boolean(product.isAvailable);
    }
    if (product?.inStock !== undefined) {
      return Boolean(product.inStock);
    }
    if (product?.stock !== undefined) {
      return Number(product.stock) > 0;
    }
    return true;
  }, [activeVariant, activeColorObj, product]);

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

  // Related products from the same category only (excluding current product, strictly max 20 items)
  const relatedCategoryProducts = useMemo(() => {
    return (products || [])
      .filter((p) => {
        const isSameCat =
          (p.categorySlug && product.categorySlug && p.categorySlug.toLowerCase() === product.categorySlug.toLowerCase()) ||
          (p.category && product.category && String(p.category).toLowerCase() === String(product.category).toLowerCase()) ||
          (p.categorySlug && product.category && p.categorySlug.toLowerCase() === String(product.category).toLowerCase()) ||
          (p.category && product.categorySlug && String(p.category).toLowerCase() === product.categorySlug.toLowerCase());
        const isNotCurrent = (p._id || p.id) !== (product._id || product.id);
        return isSameCat && isNotCurrent;
      })
      .slice(0, 20);
  }, [products, product]);

  const handleAddToCart = () => {
    if (!isAvailable) return;
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

  // Calculate average rating from fetched reviews or fallback to product rating
  const avgRating = useMemo(() => {
    if (productReviews.length > 0) {
      const sum = productReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      return (sum / productReviews.length).toFixed(1);
    }
    return product.rating || 5.0;
  }, [productReviews, product.rating]);

  return (
    <div className="min-h-screen bg-cream-soft py-6 px-3 sm:px-6 lg:px-8 text-slate-800">
      <div className="w-full max-w-[1600px] mx-auto space-y-6">
        {/* MAIN 2-COLUMN PRODUCT SHOWCASE CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT: GALLERY & IMAGES (Sticky Desktop) */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm relative">
              <div className="aspect-square w-full overflow-hidden bg-slate-900 relative">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* Gallery Thumbnails */}
              {imageGallery.length > 1 && (
                <div className="p-4 flex items-center space-x-3 overflow-x-auto scrollbar-none border-t border-slate-100 bg-white">
                  {imageGallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden transition shrink-0 cursor-pointer ${
                        selectedImage === imgUrl
                          ? 'border-emerald-800 ring-2 ring-emerald-800/20 bg-emerald-50/50'
                          : 'border-slate-200 hover:border-emerald-400 bg-white'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: DETAILS, SPECS & PRICING */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
              {/* Product Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-serif leading-tight">
                      {product.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">
                      {product.tagline || 'Mastercrafted Ergonomic Chair with Lifetime Spine Support'}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-11 h-11 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                      inWishlist
                        ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                    title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-emerald-950 font-sans">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentOriginalPrice > currentPrice && (
                  <span className="text-base font-bold text-slate-400 line-through">
                    ₹{currentOriginalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Variant / Color Option Cards */}
              {((Array.isArray(product.variants) && product.variants.length > 0) || (Array.isArray(product.colors) && product.colors.length > 0)) && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      SELECT VARIANT / COLOR:
                    </span>
                    <span className="text-xs font-black text-emerald-950 capitalize">
                      {getColorName(selectedColor, product)}
                    </span>
                  </div>

                  {/* Grid of Variant Cards with Image, Name, and Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(() => {
                      const variantList = Array.isArray(product.variants) && product.variants.length > 0
                        ? product.variants
                        : product.colors.map((c) => ({
                            colorHex: typeof c === 'string' ? c : (c.hex || '#2E6B4D'),
                            name: typeof c === 'object' && c.name ? c.name : getColorName(c, product),
                            colorName: typeof c === 'object' && c.name ? c.name : getColorName(c, product),
                            image: typeof c === 'object' && c.image ? c.image : (c.mainImage || ''),
                            price: product.price,
                          }));

                      return variantList.map((variant, vIdx) => {
                        const hex = variant.colorHex || variant.hex || '#2E6B4D';
                        const variantName = variant.name || variant.colorName || getColorName(hex, product);
                        const variantImg = variant.mainImage || variant.image || selectedImage || product.mainImage;
                        const variantPrice = variant.price !== undefined ? Number(variant.price) : Number(product.price);
                        const isSelected = (selectedColor || '').toUpperCase() === hex.toUpperCase();

                        return (
                          <button
                            key={vIdx}
                            type="button"
                            onClick={() => {
                              setSelectedColor(hex);
                              if (variantImg) setSelectedImage(variantImg);
                            }}
                            className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between text-left cursor-pointer bg-white ${
                              isSelected
                                ? 'border-emerald-700 ring-2 ring-emerald-700/20 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              {/* Variant Thumbnail Image with color badge */}
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative">
                                <img
                                  src={variantImg}
                                  alt={variantName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = product.mainImage || defaultFallbackImage;
                                  }}
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                                  </div>
                                )}
                                <span
                                  className="w-3.5 h-3.5 rounded-full border-2 border-white absolute bottom-0.5 right-0.5 shadow-sm"
                                  style={{ backgroundColor: hex }}
                                />
                              </div>

                              {/* Variant Info: Name + Price */}
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                  {variantName}
                                </h4>
                                <p className="text-xs sm:text-sm font-black text-slate-900 font-sans mt-0.5">
                                  ₹{variantPrice.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>

                            {/* Radio Selection Dot */}
                            <div className="shrink-0 ml-2">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full border-2 border-emerald-800 flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-800" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Dynamic Availability Status Line per Variant */}
                  <div className="flex items-center space-x-2 text-xs font-bold pt-1">
                    {isAvailable ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                        <span className="text-emerald-800">
                          In Stock • Available for Immediate Dispatch
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                        <span className="text-rose-700">
                          Currently Out of Stock in {getColorName(selectedColor, product)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Standalone Availability if no variant cards */}
              {!((Array.isArray(product.variants) && product.variants.length > 0) || (Array.isArray(product.colors) && product.colors.length > 0)) && (
                <div className="flex items-center space-x-2 text-xs font-bold pt-1">
                  {isAvailable ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                      <span className="text-emerald-800">In Stock • Available for Immediate Dispatch</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                      <span className="text-rose-700">Currently Out of Stock</span>
                    </>
                  )}
                </div>
              )}

              {/* Key Features List */}
              {Array.isArray(product.features) && product.features.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                    SIGNATURE HIGHLIGHTS:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
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
                    disabled={!isAvailable}
                    className={`flex-1 w-full h-12 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-lg transition ${
                      !isAvailable
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                        : addedAnim
                          ? 'bg-amber-400 text-emerald-950 shadow-amber-300/40 cursor-pointer'
                          : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-emerald-900/20 cursor-pointer'
                    }`}
                  >
                    {!isAvailable ? (
                      <span>Currently Out of Stock</span>
                    ) : addedAnim ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Added to Shopping Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Bag • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Cohesive Product Meta Bar (Category & Ratings) */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-bold text-slate-600">
                      Category: <strong className="text-emerald-950 font-black uppercase tracking-wider">{categoryObj.name}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReviewsModal(true)}
                    className="flex items-center space-x-2 group hover:opacity-80 transition cursor-pointer"
                    title="Click to view all reviews for this chair"
                  >
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(Number(avgRating)) ? 'fill-current text-amber-500' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-900">{avgRating}</span>
                    <span className="text-xs text-emerald-800 underline font-bold group-hover:text-emerald-950">
                      ({productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'})
                    </span>
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

            {/* FULL STORY & TECHNICAL SPECIFICATIONS CARD */}
            {product.showAnatomySection !== false && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-emerald-100 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                    {product.anatomyHeading && product.anatomyHeading !== 'Built for Generations of Unmatched Comfort'
                      ? product.anatomyHeading
                      : 'Product Description'}
                  </h3>
                </div>

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

                {/* Technical Specs */}
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. FULL WIDTH BOTTOM: SAME CATEGORY / RELATED PRODUCTS SHOWCASE (Max 20 Items) */}
        {relatedCategoryProducts.length > 0 && (
          <div className="pt-10 sm:pt-14 space-y-6 sm:space-y-8">
            <div className="text-left sm:text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                More {categoryObj.name}
              </h2>
            </div>

            {/* Product Cards Grid (4 in desktop, 2 in mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
        )}
      </div>

      {/* Dedicated Product Reviews Modal */}
      <ProductReviewsModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        product={product}
        reviews={productReviews}
        avgRating={avgRating}
      />
    </div>
  );
}
