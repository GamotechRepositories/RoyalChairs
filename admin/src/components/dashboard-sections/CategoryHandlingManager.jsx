import { useState } from 'react';
import { Layers, Plus, Trash2, Edit3, Image, Sparkles } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function CategoryHandlingManager() {
  const { categories, setCategories } = useAdminData();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setEditingCategory({
      id: `cat-${Date.now().toString().slice(-4)}`,
      name: 'New Custom Category',
      emoji: '🪑',
      count: 0,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      desc: 'Description of the new handcrafted chair collection.',
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    if (confirm('Are you sure you want to remove this chair category?')) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      localStorage.setItem('royal_admin_categories', JSON.stringify(updated));
    }
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    const existingIdx = categories.findIndex((c) => c.id === editingCategory.id);
    let updated;
    if (existingIdx > -1) {
      updated = [...categories];
      updated[existingIdx] = editingCategory;
    } else {
      updated = [...categories, editingCategory];
    }
    setCategories(updated);
    localStorage.setItem('royal_admin_categories', JSON.stringify(updated));
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>CATEGORY TAXONOMY CONTROLLER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Chair Category Handling
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage storefront category images, titles, descriptions, emojis, and add new custom seating categories.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-emerald-700/40 hover:shadow-lg transition duration-300"
          >
            <div>
              <div className="relative h-44 overflow-hidden group">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-4">
                  <span className="text-lg font-black text-white bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                    {cat.emoji} {cat.name}
                  </span>
                  <span className="text-xs font-black text-amber-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-amber-300/30">
                    {cat.count || 0} Products
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {cat.desc}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingCategory(cat);
                  setIsModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 rounded-xl border border-slate-200 transition cursor-pointer flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Edit Details</span>
              </button>

              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="p-2 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-900 font-serif mb-4 pb-2 border-b border-slate-100">
              {categories.some((c) => c.id === editingCategory.id) ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Emoji Icon
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.emoji}
                    onChange={(e) => setEditingCategory({ ...editingCategory, emoji: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-base font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Category Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editingCategory.image}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
                {editingCategory.image && (
                  <img
                    src={editingCategory.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl mt-2 border border-slate-200"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingCategory.desc}
                  onChange={(e) => setEditingCategory({ ...editingCategory, desc: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
