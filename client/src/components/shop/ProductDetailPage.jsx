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
import { ProductDetailSkeleton } from '../ui/Skeletons';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
  const [productReviews, setProductReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  // Write Review Modal / Inline State
  const [writeReviewModalOpen, setWriteReviewModalOpen] = useState(false);
  const [writeRating, setWriteRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [writeComment, setWriteComment] = useState('');
  const [writeLocation, setWriteLocation] = useState(user?.city || 'India');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewToast, setReviewToast] = useState('');
  const [helpfulVotes, setHelpfulVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_helpful_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Fetch reviews for this specific product
  const fetchProductReviews = async () => {
    if (!product) return;
    setIsLoadingReviews(true);
    try {
      const prodId = product._id || product.id || product.name;
      const res = await api.get(`/reviews?productId=${encodeURIComponent(prodId)}`);
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
  }, [product?._id, product?.id, product?.name]);

  // Live real-time sync with review submissions
  useEffect(() => {
    const handleSync = () => {
      fetchProductReviews();
    };
    window.addEventListener('royal_storage_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('royal_storage_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [product?._id, product?.id, product?.name]);

  const handleSubmitReviewDirect = async (e) => {
    e.preventDefault();
    if (!writeComment.trim()) {
      alert('Please enter your review feedback.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const payload = {
        productId: product._id || product.id,
        productName: product.name,
        userName: user?.name || 'Verified Buyer',
        name: user?.name || 'Verified Buyer',
        userRole: 'Verified Buyer',
        role: 'Verified Buyer',
        location: writeLocation.trim() || 'India',
        rating: Number(writeRating) || 5,
        comment: writeComment.trim(),
        finish: activeVariant?.name || activeVariant?.colorName || getColorName(selectedColor, product),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Verified Buyer')}&background=2E6B4D&color=fff`,
        status: 'approved',
      };

      const res = await api.post('/reviews', payload);
      if (res.data?.success) {
        setReviewToast('Thank you! Your verified review has been published.');
        setWriteComment('');
        setWriteReviewModalOpen(false);

        // Fetch fresh reviews
        await fetchProductReviews();

        // Mark as reviewed in localStorage
        try {
          const current = JSON.parse(localStorage.getItem('royal_reviewed_items') || '{}');
          const pKey1 = product._id || product.id;
          const pKey2 = product.name;
          localStorage.setItem(
            'royal_reviewed_items',
            JSON.stringify({ ...current, ...(pKey1 ? { [pKey1]: true } : {}), ...(pKey2 ? { [pKey2]: true } : {}) })
          );
        } catch {}

        window.dispatchEvent(new Event('royal_storage_update'));
        setTimeout(() => setReviewToast(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleToggleHelpful = (reviewId) => {
    const current = helpfulVotes[reviewId] || 0;
    const next = { ...helpfulVotes, [reviewId]: current + 1 };
    setHelpfulVotes(next);
    try {
      localStorage.setItem('royal_helpful_votes', JSON.stringify(next));
    } catch {}
  };

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
    return typeof product.rating === 'number' ? product.rating.toFixed(1) : (product.rating || '5.0');
  }, [productReviews, product.rating]);

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      dist[star] = (dist[star] || 0) + 1;
    });
    return dist;
  }, [productReviews]);

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-soft py-6 px-3 sm:px-6 lg:px-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

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

        {/* 3. VERIFIED CUSTOMER REVIEWS & EXPERIENCES SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Client Feedback
                </span>
                <span className="text-xs text-slate-400 font-bold">•</span>
                <span className="text-xs font-black text-slate-700">100% Authentic Purchases</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif flex items-center gap-2">
                <span>Verified Customer Reviews</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-xl border border-emerald-200/80">
                  ({productReviews.length})
                </span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setWriteReviewModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-950/15 flex items-center space-x-2 transition cursor-pointer self-start sm:self-auto"
            >
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Rating Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 items-center">
            {/* Left: Big Score */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 font-serif">{avgRating}</span>
                <span className="text-sm font-bold text-slate-400">/ 5.0</span>
              </div>

              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(Number(avgRating)) ? 'fill-current text-amber-500' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs font-medium text-slate-500">
                Based on <strong className="text-slate-800">{productReviews.length}</strong> verified customer {productReviews.length === 1 ? 'review' : 'reviews'}
              </p>

              <div className="pt-1">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700" />
                  100% Recommended by Owners
                </span>
              </div>
            </div>

            {/* Middle: Star Bars */}
            <div className="md:col-span-5 space-y-2">
              {[5, 4, 3, 2, 1].map((starVal) => {
                const count = ratingDistribution[starVal] || 0;
                const pct = productReviews.length > 0 ? Math.round((count / productReviews.length) * 100) : 0;
                return (
                  <div key={starVal} className="flex items-center space-x-3 text-xs">
                    <span className="w-12 font-extrabold text-slate-700 font-mono text-right flex items-center justify-end space-x-0.5">
                      <span>{starVal}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-[11px] font-mono text-slate-500 text-right">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Verified Authenticity Assurance */}
            <div className="md:col-span-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-center md:text-left">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Verified Buyer Promise</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Only clients with confirmed deliveries can publish reviews. All feedback reflects genuine daily usage.
              </p>
            </div>
          </div>

          {/* Reviews List */}
          {productReviews.length === 0 ? (
            <div className="p-10 sm:p-14 text-center rounded-3xl bg-slate-50/60 border border-dashed border-slate-300 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
                <MessageSquare className="w-7 h-7 text-emerald-800" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 font-serif">
                  No verified reviews yet for {product.name}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first verified customer to share your seating experience, lumbar comfort, and craftsmanship feedback!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWriteReviewModalOpen(true)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer inline-flex items-center space-x-2"
              >
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Write the First Review</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {productReviews.map((rev, rIdx) => {
                const author = rev.name || rev.userName || rev.customer || 'Verified Buyer';
                const role = rev.role || rev.userRole || 'Verified Buyer';
                const dateStr = rev.createdAt
                  ? new Date(rev.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Recent Purchase';
                const rating = Number(rev.rating) || 5;
                const revId = rev._id || rev.id || `rev-${rIdx}`;
                const upvotes = helpfulVotes[revId] || 0;

                return (
                  <div
                    key={revId}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-200 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Review Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 overflow-hidden">
                            {rev.avatar && rev.avatar.startsWith('http') && !rev.avatar.includes('photo-1534528741775') ? (
                              <img src={rev.avatar} alt={author} className="w-full h-full object-cover" />
                            ) : (
                              <span>{author.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="font-extrabold text-slate-900 text-sm">{author}</h4>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-black border border-emerald-200">
                                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
                                {role}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-medium flex items-center space-x-1.5">
                              <span>{rev.location || 'India'}</span>
                              <span>•</span>
                              <span>{dateStr}</span>
                            </div>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center text-amber-500 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rating ? 'fill-current text-amber-500' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Finish Badge */}
                      {rev.finish && (
                        <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <span>Configuration:</span>
                          <strong className="text-slate-700">{rev.finish}</strong>
                        </div>
                      )}

                      {/* Comment Body */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100 italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Helpful Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="text-[10px] text-emerald-800 font-bold">✓ Verified Order Purchase</span>
                      <button
                        type="button"
                        onClick={() => handleToggleHelpful(revId)}
                        className="flex items-center space-x-1 hover:text-emerald-800 transition cursor-pointer p-1 rounded-lg hover:bg-slate-50"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({upvotes})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* WRITE REVIEW MODAL */}
        {writeReviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                    Verified Customer Feedback
                  </span>
                  <h3 className="text-lg font-black font-serif">Review {product.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setWriteReviewModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer text-xl font-bold leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitReviewDirect} className="p-6 space-y-5">
                {/* Rating Select */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
                    Overall Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setWriteRating(s)}
                        className="p-1 focus:outline-hidden cursor-pointer transition transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            s <= (hoverRating || writeRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-mono font-black text-sm text-slate-700">
                      {hoverRating || writeRating} / 5
                    </span>
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
                    Your Review & Ergonomic Experience
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={writeComment}
                    onChange={(e) => setWriteComment(e.target.value)}
                    placeholder="Describe lumbar comfort, material feel, build quality, and assembly experience..."
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-hidden resize-none"
                  ></textarea>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
                    Your Location / City
                  </label>
                  <input
                    type="text"
                    value={writeLocation}
                    onChange={(e) => setWriteLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India or London, UK"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setWriteReviewModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingReview ? 'Publishing...' : 'Publish Review'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
