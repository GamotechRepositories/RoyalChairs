import { useState } from 'react';
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, Tag } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/chairProductsData';
import ProductCard from '../ui/ProductCard';

export default function CategoryShopPage({ initialCategory, onBackToHome, onQuickView }) {
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategory || CATEGORIES[0].id);
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  const activeCategoryObj = CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];

  // Subcategories mapping per category
  const subcategoriesMap = {
    gaming: ['All', 'Premium Gaming Chairs', 'Pro Streamer Recliners', 'Ergonomic Gaming Thrones', 'Magnetic Lumbar Chairs'],
    wooden: ['All', 'Solid Oak Vintage', 'Hand-Carved Walnut', 'Teak Country Dining', 'Stylish Wooden Armchairs'],
    ergonomic: ['All', 'Spinal Orthopedic Pro', 'Breathable Mesh Task', '4D Lumbar Executive', 'Compact Home Office'],
    velvet: ['All', 'Plush Velvet Loungers', 'English Wingback Accent', '360° Brass Swivel', 'Royal Button Tufted'],
    plastic: ['All', 'Modern Polypropylene Shell', 'Minimalist Tripod Plastic', 'Stackable Terrace Chairs', 'Stylish Molded Plastic'],
    executive: ['All', 'High-Back Executive Thrones', 'Full-Grain Nappa Leather', 'Synchro-Tilt Directors', 'Corporate Boardroom'],
    dining: ['All', 'Royal Banquet Dining', 'Upholstered Host Armchairs', 'Country Oak Dining', 'Stylish Velvet Dining'],
    outdoor: ['All', 'Grade-A Plantation Teak', 'UV-Resistant Synthetic Rattan', 'Terrace Patio Loungers', 'Garden Folding Seats'],
  };

  const subcategoryPills = subcategoriesMap[activeCategoryId] || [
    'All',
    'Premium Chairs',
    'Stylish Chairs',
    'Executive Thrones',
    'Modern Accent',
  ];

  // Handle switching category
  const handleCategorySwitch = (catId) => {
    setActiveCategoryId(catId);
    setActiveSubcategory('All');
  };

  // Get products matching active category
  let categoryProducts = PRODUCTS.filter(
    (p) => p.category === activeCategoryId || p.type.toLowerCase() === activeCategoryId.toLowerCase()
  );

  if (categoryProducts.length < 3) {
    categoryProducts = PRODUCTS;
  }

  // Filter by Subcategory if not 'All'
  if (activeSubcategory !== 'All') {
    const subQuery = activeSubcategory.toLowerCase();
    const filteredBySub = categoryProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(subQuery) ||
        p.description.toLowerCase().includes(subQuery) ||
        p.badge?.toLowerCase().includes(subQuery)
    );
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
        
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition border border-emerald-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-gray-300 text-sm">/</span>
            <span className="text-xs font-semibold text-gray-500">Shop Categories</span>
            <span className="text-gray-300 text-sm">/</span>
            <span className="text-xs font-bold text-emerald-900 capitalize">{activeCategoryObj.name}</span>
          </div>

          <div className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            Showing {categoryProducts.length} Premium Chairs
          </div>
        </div>

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
                {CATEGORIES.map((cat) => {
                  const isSelected = activeCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySwitch(cat.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition text-left text-xs font-bold ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-md font-extrabold scale-102'
                          : 'bg-cream-soft hover:bg-emerald-50 text-gray-800 hover:text-emerald-900 border border-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={cat.image}
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
                        {cat.count}
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <img
                  src={activeCategoryObj.image}
                  alt={activeCategoryObj.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-emerald-200 shadow-xs flex-shrink-0"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-serif">
                    {activeCategoryObj.name}
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed max-w-xl">
                    {activeCategoryObj.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Subcategory Filter & Sort Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
              
              {/* Filter by Subcategory Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 flex-1">
                <span className="text-xs font-bold text-gray-500 flex items-center space-x-1 mr-1 flex-shrink-0">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Filter by Subcategory:</span>
                </span>
                
                {subcategoryPills.map((sub) => {
                  const isSubActive = activeSubcategory === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => setActiveSubcategory(sub)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                        isSubActive
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-cream-soft text-gray-700 hover:bg-emerald-50 border border-gray-200'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <ArrowUpDown className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-gray-600">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-cream-soft text-xs font-bold text-gray-800 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-emerald-700"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
