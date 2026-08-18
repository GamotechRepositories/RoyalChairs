import { useState } from 'react';
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
  ChevronRight,
  CheckCircle2,
  Share2,
  Layers,
  Award,
  Send,
  X,
  Armchair,
  Feather,
  Wrench,
  Sparkle,
  BookOpen,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, REVIEWS } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

// Finish color naming mapping
const getColorName = (hex) => {
  if (!hex) return 'Artisan Selected Finish';
  const clean = hex.toUpperCase();
  const map = {
    '#2E6B4D': 'British Racing Green',
    '#2D6A4F': 'English Forest Emerald',
    '#3D8B68': 'Sage Velvet Weave',
    '#2B2D42': 'Royal Midnight Navy',
    '#8D99AE': 'Slate Sterling Silver',
    '#C68B59': 'Vintage English Oak',
    '#DDA15E': 'Natural Beeswax Birch',
    '#1A1A1A': 'Onyx Executive Black',
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
  return map[clean] || 'Curated Artisan Finish';
};

export default function ProductDetailPage({
  product,
  onBack,
  onNavigateHome,
  onNavigateCategory,
  onOpenProduct,
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const defaultFallbackImage =
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80';

  // Active product details state
  const [selectedColor, setSelectedColor] = useState(
    (product?.colors && product.colors[0]) || '#2E6B4D'
  );
  const [selectedImage, setSelectedImage] = useState(
    product?.mainImage || defaultFallbackImage
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [customReviews, setCustomReviews] = useState([]);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const categoryObj = CATEGORIES.find((c) => c.id === product.category) || {
    id: product.category,
    name: product.type || 'Luxury Chair',
  };

  // Multiple image gallery thumbnails
  const imageGallery = [
    product.mainImage || defaultFallbackImage,
    product.hoverImage ||
      'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
  ];

  // Related products from the same category (excluding current product)
  const relatedCategoryProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  // Reviews related to this product or category
  const productReviews = [
    ...customReviews,
    ...REVIEWS.filter(
      (r) =>
        r.productName?.toLowerCase().includes(product.name.toLowerCase()) ||
        r.productName?.toLowerCase().includes(product.category.toLowerCase())
    ),
  ];

  // If no direct match, show general verified reviews
  const displayedReviews = productReviews.length > 0 ? productReviews : REVIEWS.slice(0, 3);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedColor);
    }
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
  };

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    const newRev = {
      id: `rev-user-${Date.now()}`,
      name: reviewName,
      role: 'Verified Buyer',
      rating: reviewRating,
      comment: reviewText,
      productName: product.name,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      location: 'India',
      date: 'Just now',
    };

    setCustomReviews([newRev, ...customReviews]);
    setReviewName('');
    setReviewText('');
    setIsWriteReviewOpen(false);
    setReviewSuccessMsg('Thank you! Your verified review has been posted.');
    setTimeout(() => setReviewSuccessMsg(''), 4000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on RoyalChairs`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 sm:py-10 animate-fadeIn">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 space-y-12">
        {/* Toast Notification for review submission */}
        {reviewSuccessMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-300/40 flex items-center space-x-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-extrabold">{reviewSuccessMsg}</span>
          </div>
        )}

        {/* 1. Breadcrumb Navigation & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 overflow-x-auto no-scrollbar">
            <button
              onClick={onNavigateHome}
              className="hover:text-emerald-800 transition cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              onClick={() => onNavigateCategory && onNavigateCategory(product.category)}
              className="hover:text-emerald-800 transition capitalize cursor-pointer shrink-0"
            >
              {categoryObj.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-extrabold truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-extrabold shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
              title="Share Chair"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Share</span>
            </button>

            <button
              onClick={onBack || onNavigateHome}
              className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 hover:text-emerald-800 border border-slate-200 text-xs font-extrabold shadow-2xs flex items-center space-x-2 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalog</span>
            </button>
          </div>
        </div>

        {/* 2. Main Product Showcase Hero Section (2 Columns) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left Column: Interactive Image Gallery (5 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Large Image Box */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-lg group">
              <img
                src={selectedImage || product.mainImage || defaultFallbackImage}
                alt={product.name}
                onError={(e) => {
                  e.target.src = defaultFallbackImage;
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Wishlist Floating Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg backdrop-blur-md transition z-20 cursor-pointer ${
                  inWishlist
                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                    : 'bg-white/90 text-slate-800 hover:bg-white hover:text-rose-600'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>

              {/* Discount / Badge Tags */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black shadow-md uppercase tracking-wider">
                    Save {product.discountPercent}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-md uppercase tracking-wider">
                    ✨ 2026 New Arrival
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-[11px] font-black shadow-md uppercase tracking-wider">
                    👑 Best Seller
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails List */}
            <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-1">
              {imageGallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer bg-slate-100 ${
                    selectedImage === imgUrl
                      ? 'border-emerald-700 ring-2 ring-emerald-600/30 scale-102 shadow-xs'
                      : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    onError={(e) => {
                      e.target.src = defaultFallbackImage;
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Information, Pricing, Specs & Purchase (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Badge */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {categoryObj.name}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  SKU: RC-{product.id?.slice(-4) || '2026'}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-serif leading-tight">
                {product.name}
              </h1>

              {/* Rating & Review Header */}
              <div className="flex items-center space-x-3 pt-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-extrabold text-slate-800">
                  {product.rating || 4.9}
                </span>
                <span className="text-slate-300">•</span>
                <a
                  href="#product-reviews"
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  {product.reviewCount || 142} Verified Reviews
                </a>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-950 font-mono">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-slate-400 line-through font-mono">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                    You Save ₹{product.originalPrice - product.price} ({product.discountPercent}%)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Color Finish Picker */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider">
                      Selected Finish:
                    </span>
                    <span className="font-bold text-emerald-900">
                      {getColorName(selectedColor)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {product.colors.map((colorHex) => (
                      <button
                        key={colorHex}
                        onClick={() => setSelectedColor(colorHex)}
                        className={`w-9 h-9 rounded-full border-2 transition flex items-center justify-center cursor-pointer shadow-xs ${
                          selectedColor === colorHex
                            ? 'border-emerald-800 ring-4 ring-emerald-600/30 scale-110'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: colorHex }}
                        title={getColorName(colorHex)}
                      >
                        {selectedColor === colorHex && (
                          <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Features List Checklist */}
              {product.features && product.features.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                    Key Craftsmanship Highlights:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                      <span>Add to Bag • ₹{product.price * quantity}</span>
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
        </div>

        {/* 3. Available Color Finishes & Variations Cards */}
        {product.colors && product.colors.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900 font-serif">
                  Available Finishes & Color Schemes
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select between handcrafted upholstery and timber finish choices for {product.name}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                {product.colors.length} Finishes Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.colors.map((colorHex) => {
                const colorTitle = getColorName(colorHex);
                const isSelected = selectedColor === colorHex;

                return (
                  <div
                    key={colorHex}
                    onClick={() => {
                      setSelectedColor(colorHex);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-4 ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl border border-slate-300 shrink-0 shadow-xs flex items-center justify-center"
                      style={{ backgroundColor: colorHex }}
                    >
                      {isSelected && (
                        <Check className="w-5 h-5 text-white drop-shadow-md stroke-[3]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-900 font-serif truncate">
                        {colorTitle}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">{colorHex}</p>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                        isSelected
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Active Finish' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. FULL DESCRIPTION & TECHNICAL SPECIFICATIONS SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-md space-y-10">
          {/* Section Header */}
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full mb-3 border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>COMPREHENSIVE PRODUCT DOSSIER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-serif">
              Full Product Description &amp; Anatomy
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Explore the engineering secrets, ergonomic biomechanics, sustainable timber origins, and precision stitching behind {product.name}.
            </p>
          </div>

          {/* Deep Story & Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                Built for Generations of Unmatched Comfort
              </h3>
              <p>
                The <strong className="text-emerald-950 font-bold">{product.name}</strong> represents the pinnacle of luxury British seating architecture. Conceived in our Cotswold workshops and co-developed with leading spinal orthopedists, every curve is calibrated to distribute lumbar pressure evenly across the thoracic spine.
              </p>
              <p>
                Unlike mass-produced commercial seating that degrades within years, each frame is fashioned from solid, responsibly harvested FSC-certified English Oak and high-tensile carbon steel. We hand-buff each wooden element with natural beeswax and organic linseed oils, imparting a deep, lustrous patina that enriches over decades.
              </p>
              <p>
                The upholstery features multi-density high-resilience memory foam encased in breathable Italian Nappa leather or spill-resistant plush bouclé velvet. Whether you are seating clients in a C-suite boardroom, enjoying 12-hour design sprints, or hosting family dining banquets, this chair provides a sanctuary of posture-perfect support.
              </p>
            </div>

            {/* Quick Specs Highlight Box */}
            <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <h4 className="text-base font-extrabold text-slate-900 font-serif flex items-center space-x-2">
                <Sparkle className="w-4 h-4 text-amber-500 fill-current" />
                <span>Quick Specification Summary</span>
              </h4>

              <div className="divide-y divide-slate-200/80 text-xs sm:text-sm">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Category</span>
                  <span className="font-extrabold text-slate-900 capitalize">{categoryObj.name}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Frame Backbone</span>
                  <span className="font-extrabold text-slate-900">Solid English Oak &amp; Carbon Steel</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Foam Density</span>
                  <span className="font-extrabold text-slate-900">High-Resilience Molded 65kg/m³</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Max User Capacity</span>
                  <span className="font-extrabold text-emerald-900">180 kg (396 lbs)</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Assembly Status</span>
                  <span className="font-extrabold text-slate-900">100% Pre-Assembled (Plug &amp; Sit)</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Warranty Coverage</span>
                  <span className="font-extrabold text-emerald-800">10-Year Master Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Anatomy & Craftsmanship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
            <div className="p-5 bg-cream-soft rounded-2xl border border-emerald-900/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-emerald-800">
                <Armchair className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-serif">1. Ergonomic Contouring</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dynamic 4D lumbar alignment tracking pelvic tilt to reduce lower back fatigue during extensive sitting sessions.
              </p>
            </div>

            <div className="p-5 bg-cream-soft rounded-2xl border border-emerald-900/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-emerald-800">
                <Feather className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-serif">2. Luxury Upholstery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Top-grain Italian Nappa leathers and double-woven stain-resistant plush velvets that repel accidental liquid spills.
              </p>
            </div>

            <div className="p-5 bg-cream-soft rounded-2xl border border-emerald-900/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-emerald-800">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-serif">3. FSC English Timbers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harvested from managed English woodlands with traditional mortise-and-tenon interlocking joint carpentry.
              </p>
            </div>

            <div className="p-5 bg-cream-soft rounded-2xl border border-emerald-900/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-emerald-800">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-serif">4. Zero-Hassle Assembly</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Delivered pre-inspected, precision balanced, and ready to use straight out of the protective shipping container.
              </p>
            </div>
          </div>

          {/* Maintenance & Care Guide */}
          <div className="p-6 bg-emerald-900 text-white rounded-3xl border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <h4 className="text-base font-extrabold font-serif text-amber-300">
                Lifetime Care &amp; Maintenance Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Clean simply with a dry or lightly dampened microfiber cloth. Our stain-resistant nano-barrier ensures oils, coffee, and wines lift off with ease without discolouration.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold bg-emerald-800/80 px-4 py-2.5 rounded-xl border border-emerald-700 shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Certified RoyalChairs Standard</span>
            </div>
          </div>
        </div>

        {/* 5. Full Products of That Category (Related Products) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                More Handcrafted {categoryObj.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Explore the complete {categoryObj.name} collection designed for posture & luxury.
              </p>
            </div>

            <button
              onClick={() => onNavigateCategory && onNavigateCategory(product.category)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-emerald-900 text-xs font-extrabold border border-slate-200 transition cursor-pointer self-start sm:self-auto"
            >
              View Full {categoryObj.name} ({relatedCategoryProducts.length + 1})
            </button>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedCategoryProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
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

        {/* 6. Product Customer Reviews Section */}
        <div id="product-reviews" className="bg-cream-soft rounded-3xl p-6 sm:p-10 border border-emerald-900/10 shadow-md space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <span className="text-emerald-950 font-black text-sm ml-2">
                  {product.rating || 4.9} / 5.0 Star Overall Rating
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 font-serif">
                Verified Reviews for {product.name}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                Authentic feedback from verified owners who purchased this seating model.
              </p>
            </div>

            <button
              onClick={() => setIsWriteReviewOpen(true)}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      Verified Owner
                    </span>
                  </div>

                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-sans mb-6">
                    {review.comment}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-auto space-y-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                      }}
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-800/20 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-extrabold text-emerald-950 font-serif truncate">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        {review.role} • {review.location}
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 rounded-xl p-2 border border-emerald-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 font-medium truncate">Finish:</span>
                    <span className="font-extrabold text-emerald-900 truncate ml-1">
                      {getColorName(selectedColor)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 relative">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900 font-serif">
                Write a Review for {product.name}
              </h3>
              <button
                onClick={() => setIsWriteReviewOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alistair Sterling"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-current'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-slate-700 ml-2 font-mono">
                    {reviewRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Your Review & Experience
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Share details about comfort, frame quality, leather/velvet finish, delivery..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
