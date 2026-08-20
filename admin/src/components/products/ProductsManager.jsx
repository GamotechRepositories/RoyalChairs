import { useState } from 'react';
import {
  Armchair,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Tag,
  Minus,
  Layers,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import ProductFormPage from './ProductFormPage';

export default function ProductsManager() {
  const { products, categories, deleteProduct, updateStock } = useAdminData();

  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editingProduct, setEditingProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Subcategories for active category
  const activeCategoryObj = (categories || []).find(
    (c) => c.slug === selectedCategory || c.id === selectedCategory || c._id === selectedCategory
  );
  const subcategoryOptions = activeCategoryObj?.subcategories || [];

  // Filter products
  const filteredProducts = (products || []).filter((p) => {
    const pCat = p.categorySlug || p.category || '';
    const pSub = p.subCategory || 'All';

    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pCat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pSub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      pCat.toLowerCase() === selectedCategory.toLowerCase() ||
      p.category === selectedCategory;

    const matchesSubcategory =
      selectedSubcategory === 'All' ||
      pSub.toLowerCase() === selectedSubcategory.toLowerCase();

    const matchesStock =
      stockFilter === 'All' ||
      (stockFilter === 'In Stock' && p.stock >= 10) ||
      (stockFilter === 'Low Stock' && p.stock > 0 && p.stock < 10) ||
      (stockFilter === 'Out of Stock' && p.stock === 0);

    return matchesSearch && matchesCategory && matchesSubcategory && matchesStock;
  });

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setViewMode('form');
  };

  const handleOpenEditForm = (product) => {
    setEditingProduct(product);
    setViewMode('form');
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      deleteProduct(id);
    }
  };

  const handleCategoryFilterChange = (catVal) => {
    setSelectedCategory(catVal);
    setSelectedSubcategory('All');
  };

  if (viewMode === 'form') {
    return (
      <ProductFormPage
        productToEdit={editingProduct}
        onBack={() => {
          setViewMode('list');
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Luxury Chair Catalog
          </h2>
          <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
            {(products || []).length} Models
          </span>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Add New Chair</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by chair title, category, subcategory, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:border-emerald-600 focus:outline-hidden capitalize cursor-pointer"
          >
            <option value="All">All Categories</option>
            {(categories || []).map((c) => (
              <option key={c._id || c.slug || c.id} value={c.slug || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Dynamic Subcategory Filter */}
          {selectedCategory !== 'All' && subcategoryOptions.length > 0 && (
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-300 text-xs font-bold focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Subcategories</option>
              {subcategoryOptions.map((sub, sIdx) => {
                const subLabel = typeof sub === 'string' ? sub : sub.name;
                return (
                  <option key={sIdx} value={subLabel}>
                    {subLabel}
                  </option>
                );
              })}
            </select>
          )}

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:border-emerald-600 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock (10+)</option>
            <option value="Low Stock">Low Stock (&lt;10)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-extrabold">
              <tr>
                <th className="py-4 px-4">Chair Model</th>
                <th className="py-4 px-4">Category &amp; Variants</th>
                <th className="py-4 px-4">Price &amp; Savings</th>
                <th className="py-4 px-4">Stock Inventory</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    <p className="font-bold text-sm">No chairs matched the selected criteria.</p>
                    <button
                      onClick={handleOpenAddForm}
                      className="mt-3 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Add your first chair</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const catSlug = product.categorySlug || product.category || 'General';
                  const subCat = product.subCategory && product.subCategory !== 'All' ? product.subCategory : null;
                  const isMulti = product.variantType === 'multi' || (Array.isArray(product.variants) && product.variants.length > 0);

                  return (
                    <tr key={product._id || product.id} className="hover:bg-slate-50/80 transition group">
                      {/* Model Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs">
                            {product.mainImage && product.mainImage.startsWith('http') ? (
                              <img
                                src={product.mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : null}
                            <div
                              className={`fallback-icon absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-800 ${
                                product.mainImage && product.mainImage.startsWith('http') ? 'hidden' : ''
                              }`}
                            >
                              <Armchair className="w-5 h-5 text-emerald-700/60" />
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition">
                              {product.name}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                              {product.sku || product.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Variants */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 font-extrabold text-[10px] capitalize border border-emerald-200 self-start">
                              {catSlug}
                            </span>
                            {isMulti && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black text-[9px] uppercase border border-amber-300">
                                {product.variants?.length || product.colors?.length || 2} Variants
                              </span>
                            )}
                          </div>
                          {subCat && (
                            <span className="inline-flex items-center space-x-1 text-[10px] text-slate-500 font-medium self-start pl-0.5">
                              <Tag className="w-2.5 h-2.5 text-slate-400" />
                              <span>{subCat}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1.5 font-mono">
                            <span className="font-extrabold text-slate-900 text-sm">₹{product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-[11px] text-slate-400 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          {product.discountPercent > 0 && (
                            <span className="inline-block text-[9px] font-black text-emerald-700 uppercase">
                              Save {product.discountPercent}%
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Inventory */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="inline-flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                            <button
                              onClick={() => updateStock(product._id || product.id, Math.max(0, product.stock - 1))}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition cursor-pointer"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="font-bold text-slate-800 font-mono text-xs px-2 select-none">
                              {product.stock}
                            </span>
                            <button
                              onClick={() => updateStock(product._id || product.id, product.stock + 1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          {product.stock === 0 ? (
                            <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              Out of Stock
                            </span>
                          ) : product.stock < 10 ? (
                            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              Low
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              OK
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating || 5}</span>
                          <span className="text-slate-400 text-[10px]">({product.reviewCount || 0})</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditForm(product)}
                            className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                            title="Edit Chair"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id || product.id, product.name)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                            title="Delete Chair"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
