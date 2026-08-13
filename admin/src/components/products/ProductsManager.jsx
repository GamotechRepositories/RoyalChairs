import { useState } from 'react';
import {
  Armchair,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Star,
  Sparkles,
  Crown,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import ProductModal from './ProductModal';

export default function ProductsManager() {
  const { products, categories, deleteProduct, updateStock } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStock =
      stockFilter === 'All' ||
      (stockFilter === 'In Stock' && p.stock >= 10) ||
      (stockFilter === 'Low Stock' && p.stock > 0 && p.stock < 10) ||
      (stockFilter === 'Out of Stock' && p.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Luxury Chair Catalog</h2>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {products.length} Models
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage product inventory, pricing, finish options, and promotional discounts
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
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
            placeholder="Search by chair title, category, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
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
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price & MSRP</th>
                <th className="py-4 px-4">Stock Inventory</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-4">Finishes</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 font-medium">
                    No chairs matched the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition group">
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
                                const fallback = e.target.parentNode.querySelector('.fallback-icon');
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`fallback-icon absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-800 ${product.mainImage && product.mainImage.startsWith('http') ? 'hidden' : ''}`}>
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

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-extrabold text-[10px] capitalize border border-slate-200">
                        {product.category}
                      </span>
                    </td>

                    {/* Price & MSRP */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono">
                        <span className="font-black text-emerald-800 text-sm">₹{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-slate-400 line-through ml-1.5">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.discountPercent > 0 && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                          Save {product.discountPercent}%
                        </span>
                      )}
                    </td>

                    {/* Stock & Quick Adjust */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateStock(product.id, product.stock - 1)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition font-bold"
                            title="Decrease Stock"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono font-black text-slate-900 min-w-[24px] text-center">
                            {product.stock}
                          </span>
                          <button
                            onClick={() => updateStock(product.id, product.stock + 1)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition font-bold"
                            title="Increase Stock"
                          >
                            +
                          </button>
                        </div>

                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            product.stock === 0
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : product.stock < 10
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {product.stock === 0 ? 'Out' : product.stock < 10 ? 'Low' : 'OK'}
                        </span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-slate-800">{product.rating}</span>
                        <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                      </div>
                    </td>

                    {/* Colors */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1">
                        {(product.colors || []).slice(0, 3).map((hex, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                          title="Edit Chair Specifications"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                          title="Remove from Catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">Remove Chair Model?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this product from the live catalog? This action will archive its availability.
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md"
              >
                Yes, Delete Chair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productToEdit={editingProduct}
      />
    </div>
  );
}
