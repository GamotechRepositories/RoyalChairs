import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  Armchair,
  Upload,
  X,
  Sparkles,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function CategoryHandlingManager() {
  const { categories, setCategories, products } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState('');
  const fileInputRef = useRef(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Filter and sort categories
  const filteredCategories = categories
    .filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.desc && c.desc.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const countA = products.filter((p) => p.category === a.id).length;
      const countB = products.filter((p) => p.category === b.id).length;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'count-high') return countB - countA;
      if (sortBy === 'count-low') return countA - countB;
      return 0;
    });

  const showNotification = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingCategory({
      id: `cat-${Date.now().toString().slice(-4)}`,
      name: '',
      emoji: '🪑',
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      description: '',
      desc: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory({
      ...category,
      desc: category.desc || category.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id, name) => {
    if (confirm(`Are you sure you want to remove the "${name}" category from the catalog?`)) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      localStorage.setItem('royal_admin_categories', JSON.stringify(updated));
      showNotification(`Category "${name}" removed successfully.`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setEditingCategory((prev) => ({
            ...prev,
            image: uploadEvent.target.result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    const payload = {
      ...editingCategory,
      desc: editingCategory.desc || editingCategory.description || '',
      description: editingCategory.desc || editingCategory.description || '',
    };

    const existingIdx = categories.findIndex((c) => c.id === editingCategory.id);
    let updated;
    if (existingIdx > -1) {
      updated = [...categories];
      updated[existingIdx] = payload;
    } else {
      updated = [...categories, payload];
    }

    setCategories(updated);
    localStorage.setItem('royal_admin_categories', JSON.stringify(updated));
    setIsModalOpen(false);
    setEditingCategory(null);
    showNotification(`Category "${payload.name}" saved successfully!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-300/40 flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-extrabold">{saveToast}</span>
        </div>
      )}

      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Chair Category Catalog
          </h2>
          <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
            {categories.length} Collections
          </span>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* 2. Search & Filters */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by category name, description, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
          />
        </div>

        {/* Sort Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:border-emerald-600 focus:outline-hidden cursor-pointer"
          >
            <option value="default">Default Order</option>
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="count-high">Most Products</option>
            <option value="count-low">Least Products</option>
          </select>
        </div>
      </div>

      {/* 3. Category Catalogue Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-extrabold">
              <tr>
                <th className="py-3.5 px-4">Category Collection</th>
                <th className="py-3.5 px-4">Description &amp; Story</th>
                <th className="py-3.5 px-4 text-center">Catalog Products</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-400">
                    <p className="font-bold text-sm">No categories found matching "{searchQuery}"</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const productCount = products.filter((p) => p.category === cat.id).length;
                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Column 1: Image, Title, ID */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative shadow-2xs group-hover:border-emerald-300 transition">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80';
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h3 className="font-extrabold text-slate-900 text-sm font-serif group-hover:text-emerald-800 transition">
                                {cat.name}
                              </h3>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                              ID: {cat.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Description */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                          {cat.desc || cat.description || 'Handcrafted seating category.'}
                        </p>
                      </td>

                      {/* Column 3: Products Count */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-bold font-mono">
                          <Armchair className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{productCount} Chairs</span>
                        </span>
                      </td>

                      {/* Column 4: Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(cat)}
                            className="p-2 text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-2 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                            title="Delete Category"
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

      {/* 4. Add / Edit Category Modal (Mounted to Document Body via Portal) */}
      {isModalOpen &&
        editingCategory &&
        createPortal(
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] cursor-default animate-scaleUp"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shadow-2xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-serif">
                      {categories.some((c) => c.id === editingCategory.id)
                        ? 'Edit Category Details'
                        : 'Add New Category'}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Configure cover photograph, name, identifier slug, and store description
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Body (Two Columns on sm+) */}
              <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Image Upload & Live Preview (5 cols) */}
                  <div className="md:col-span-5 space-y-4">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      Cover Photograph
                    </label>

                    {/* Image Preview Box */}
                    <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
                      <img
                        src={editingCategory.image}
                        alt="Category Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      <span className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                        Live Preview
                      </span>
                    </div>

                    {/* Upload from Device Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-900 font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-emerald-700" />
                      <span>Upload from Device</span>
                    </button>

                    {/* Image URL Input */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Or enter direct Image URL:
                      </span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={editingCategory.image || ''}
                        onChange={(e) =>
                          setEditingCategory((prev) => ({ ...prev, image: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-emerald-700 transition"
                      />
                    </div>
                  </div>

                  {/* Right Column: Name, Slug & Description (7 cols) */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Category Name */}
                    <div>
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                        Category Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Solid Oak Wooden Chairs"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-700 transition"
                      />
                    </div>

                    {/* Category Slug / ID */}
                    <div>
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                        Category ID Slug <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. wooden, ergonomic, velvet"
                        value={editingCategory.id}
                        onChange={(e) =>
                          setEditingCategory((prev) => ({
                            ...prev,
                            id: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-700 transition"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Unique URL slug used to link and filter store chairs
                      </span>
                    </div>

                    {/* Collection Description */}
                    <div>
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                        Collection Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe the craftsmanship, timber species, leather grade, or posture benefits..."
                        value={editingCategory.desc || editingCategory.description || ''}
                        onChange={(e) =>
                          setEditingCategory((prev) => ({
                            ...prev,
                            desc: e.target.value,
                            description: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-700 transition resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Save Category</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
