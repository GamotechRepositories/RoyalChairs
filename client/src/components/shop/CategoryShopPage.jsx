import { useState } from 'react';
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../ui/ProductCard';
import { ProductGridSkeleton } from '../ui/Skeletons';

export default function CategoryShopPage({ initialCategory, onBackToHome, onQuickView }) {
  const { categories, products, isLoading } = useStore();
  const [activeCategoryId, setActiveCategoryId] = useState(
    initialCategory || (categories[0]?.slug || categories[0]?.id || 'wooden')
  );
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  const activeCategoryObj =
    (categories || []).find((c) => c.slug === activeCategoryId || c.id === activeCategoryId || c._id === activeCategoryId) ||
    categories[0] || {
      id: 'wooden',
      name: 'Luxury Chairs',
      description: 'Handcrafted seating collection.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    };

  // Subcategories extracted dynamically from the active category
  const categorySubcategories = Array.isArray(activeCategoryObj?.subcategories)
    ? activeCategoryObj.subcategories.map((s) => (typeof s === 'string' ? s : s.name))
    : [];

  const subcategoryPills = ['All', ...categorySubcategories];

  // Handle switching category
  const handleCategorySwitch = (catId) => {
    setActiveCategoryId(catId);
    setActiveSubcategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get products matching active category
  let categoryProducts = (products || []).filter((p) => {
    const pCat = p.categorySlug || p.category || '';
    const pCatId = typeof p.category === 'object' ? p.category?._id : p.category;
    return (
      pCat.toLowerCase() === activeCategoryId.toLowerCase() ||
      pCatId === activeCategoryId ||
      pCatId === activeCategoryObj._id
    );
  });

  // Filter by Subcategory if not 'All'
  if (activeSubcategory !== 'All') {
    const subQuery = activeSubcategory.toLowerCase();
    const filteredBySub = categoryProducts.filter((p) => {
      const pSub = (p.subCategory || '').toLowerCase();
      return (
        pSub === subQuery ||
        p.name.toLowerCase().includes(subQuery) ||
        (p.description && p.description.toLowerCase().includes(subQuery))
      );
    });
    if (filteredBySub.length > 0) {
      categoryProducts = filteredBySub;
    }
  }

  // Sorting
  if (sortBy === 'price-low') {
    categoryProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    categoryProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    categoryProducts.sort((a, b) => b.discountPercent - a.discountPercent);
  } else if (sortBy === 'rating') {
    categoryProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen bg-cream-soft py-6 px-3 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT SIDEBAR: Categories List with Real Chair Photo Thumbnails */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm sticky top-24">
              <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-gray-100 text-emerald-900 font-extrabold text-base font-serif">
                <SlidersHorizontal className="w-5 h-5 text-emerald-700" />
                <span>Categories</span>
              </div>

              <div className="space-y-2">
                {(categories || []).map((cat) => {
                  const isSelected =
                    activeCategoryId === cat.slug ||
                    activeCategoryId === cat.id ||
                    activeCategoryId === cat._id;

                  const catCount = (products || []).filter((p) => {
                    const pCat = p.categorySlug || p.category || '';
                    const pCatId = typeof p.category === 'object' ? p.category?._id : p.category;
                    return (
                      pCat.toLowerCase() === (cat.slug || '').toLowerCase() ||
                      pCatId === cat._id ||
                      pCatId === cat.id
                    );
                  }).length;

                  return (
                    <button
                      key={cat._id || cat.slug || cat.id}
                      onClick={() => handleCategorySwitch(cat.slug || cat.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition text-left text-xs font-bold cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-md font-extrabold scale-102'
                          : 'bg-cream-soft hover:bg-emerald-50 text-gray-800 hover:text-emerald-900 border border-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={cat.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80'}
                          alt={cat.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-xs flex-shrink-0"
                        />
                        <span className="text-sm font-bold">{cat.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-amber-300 text-emerald-950' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {catCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT MAIN AREA: Products Grid & Subcategories Filter */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category Header Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={activeCategoryObj.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80'}
                  alt={activeCategoryObj.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-emerald-200 shadow-xs flex-shrink-0"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-serif">
                    {activeCategoryObj.name}
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 leading-relaxed max-w-xl">
                    {activeCategoryObj.description || activeCategoryObj.desc || 'Handcrafted seating collection calibrated for anatomical alignment and timeless luxury.'}
                  </p>
                </div>
              </div>

              {/* Total Number of Chairs Badge */}
              <div className="flex items-center self-start sm:self-center">
                <span className="px-4 py-2 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm font-extrabold shadow-2xs whitespace-nowrap">
                  Showing {categoryProducts.length} {categoryProducts.length === 1 ? 'Premium Chair' : 'Premium Chairs'}
                </span>
              </div>
            </div>

            {/* Subcategory Filter & Sort Toolbar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Filter by Subcategory Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 min-w-0 flex-1 pr-2">
                <span className="text-xs font-extrabold text-emerald-950 flex items-center space-x-1.5 mr-1 flex-shrink-0 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100/80">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Subcategory:</span>
                </span>

                {subcategoryPills.map((sub) => {
                  const isSubActive = activeSubcategory === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => setActiveSubcategory(sub)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                        isSubActive
                          ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-700/30'
                          : 'bg-cream-soft text-gray-700 hover:bg-emerald-100/60 hover:text-emerald-900 border border-gray-200/80'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center space-x-2 flex-shrink-0 md:pl-4 md:border-l md:border-emerald-100/80 pt-2 md:pt-0 border-t border-gray-100 md:border-t-0 justify-end">
                <ArrowUpDown className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-cream-soft text-xs font-bold text-gray-800 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-emerald-700 cursor-pointer shadow-2xs"
                >
                  <option value="recommended">Featured Recommendation</option>
                  <option value="discount">Highest Discount %</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : categoryProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 shadow-xs space-y-3">
                <p className="text-base font-bold text-gray-800">
                  No chair models found in this category / subcategory.
                </p>
                <p className="text-xs text-gray-500">
                  Select another category from the left menu or reset subcategory filters.
                </p>
                <button
                  onClick={() => setActiveSubcategory('All')}
                  className="mt-2 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
