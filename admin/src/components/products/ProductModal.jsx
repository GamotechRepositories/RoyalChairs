import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Armchair, Plus, Trash2, Sparkles, Check, Image, Tag, DollarSign } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function ProductModal({ isOpen, onClose, productToEdit }) {
  const { addProduct, updateProduct, categories } = useAdminData();

  const [formData, setFormData] = useState({
    name: '',
    category: 'ergonomic',
    price: 450,
    originalPrice: 800,
    discountPercent: 40,
    stock: 20,
    mainImage: '',
    hoverImage: '',
    description: '',
    features: ['Dynamic Lumbar Support', 'Solid Frame', '10-Year Warranty'],
    colors: ['#2E6B4D', '#2B2D42', '#E6C365'],
    isBestSeller: false,
    isNew: true,
  });

  const [featureInput, setFeatureInput] = useState('');
  const [colorInput, setColorInput] = useState('#2E6B4D');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || 'ergonomic',
        price: productToEdit.price || 450,
        originalPrice: productToEdit.originalPrice || 800,
        discountPercent: productToEdit.discountPercent || 0,
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 15,
        mainImage: productToEdit.mainImage || '',
        hoverImage: productToEdit.hoverImage || '',
        description: productToEdit.description || '',
        features: productToEdit.features || ['Ergonomic Support', 'English Oak Frame'],
        colors: productToEdit.colors || ['#2E6B4D', '#2B2D42'],
        isBestSeller: !!productToEdit.isBestSeller,
        isNew: !!productToEdit.isNew,
      });
    } else {
      setFormData({
        name: '',
        category: 'ergonomic',
        price: 499,
        originalPrice: 899,
        discountPercent: 45,
        stock: 25,
        mainImage: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
        hoverImage: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
        description: 'Handcrafted luxury seat engineered for supreme comfort and posture alignment.',
        features: ['4D Lumbar Adjustment', 'Top-Grain Italian Leather', 'Class-4 Gas Lift'],
        colors: ['#2E6B4D', '#2B2D42', '#E6C365'],
        isBestSeller: false,
        isNew: true,
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (productToEdit) {
      updateProduct(productToEdit.id, formData);
    } else {
      addProduct(formData);
    }
    onClose();
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleAddColor = () => {
    if (!formData.colors.includes(colorInput)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput],
      }));
    }
  };

  const handleRemoveColor = (hex) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== hex),
    }));
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl max-h-[80vh] md:max-h-[85vh] flex flex-col relative p-5 sm:p-6 cursor-default text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
              <Armchair className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                {productToEdit ? 'Edit Luxury Chair' : 'Add New Luxury Chair'}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500">Configure catalog specs, pricing, and finish options</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 text-xs mt-3">
          {/* Scrollable Fields Container */}
          <div className="flex-1 overflow-y-auto pr-1.5 space-y-3.5 min-h-0">
            {/* Chair Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                Chair Model Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sovereign Ergonomic Task Pro"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden text-xs sm:text-sm"
              />
            </div>

            {/* Category & Stock Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Chair Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden capitalize"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Inventory Units in Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold font-mono focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Price, Original Price, Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.price}
                  onChange={(e) => {
                    const p = Number(e.target.value);
                    const orig = formData.originalPrice || p;
                    const disc = orig > p ? Math.round(((orig - p) / orig) * 100) : 0;
                    setFormData({ ...formData, price: p, discountPercent: disc });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-emerald-800 font-black font-mono focus:bg-white focus:border-emerald-600 focus:outline-hidden text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  MSRP / Original (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.originalPrice}
                  onChange={(e) => {
                    const orig = Number(e.target.value);
                    const p = formData.price || orig;
                    const disc = orig > p ? Math.round(((orig - p) / orig) * 100) : 0;
                    setFormData({ ...formData, originalPrice: orig, discountPercent: disc });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-bold font-mono focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Discount %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-emerald-700 font-bold font-mono focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Image URLs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Primary High-Res Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.mainImage}
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px] focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Secondary Alternate Image
                </label>
                <input
                  type="url"
                  value={formData.hoverImage}
                  onChange={(e) => setFormData({ ...formData, hoverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px] focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                Craftsmanship Description
              </label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe materials, leather grain, wood joinery, and ergonomics..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden leading-relaxed text-[11px]"
              />
            </div>

            {/* Color Finishes */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 mb-0.5 uppercase tracking-wider text-[10px]">
                Color Finishes
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 shrink-0">
                  <input
                    type="color"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    className="w-6 h-6 rounded-md bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-slate-700 font-bold text-[10px] uppercase">{colorInput}</span>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold transition cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {formData.colors.map((hex) => (
                    <div
                      key={hex}
                      className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: hex }} />
                      <span className="text-[9px] font-mono text-slate-700 font-bold uppercase">{hex}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(hex)}
                        className="text-slate-400 hover:text-rose-600 font-bold text-[11px] leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Features List */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 mb-0.5 uppercase tracking-wider text-[10px]">
                Key Specifications & Features
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g. 100% Solid English Oak"
                  className="flex-1 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200 text-[10px]"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {formData.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-rose-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="flex items-center space-x-6 pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="rounded-md border-slate-300 text-emerald-700 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="font-bold text-slate-700 text-[11px]">Feature as Best Seller</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="rounded-md border-slate-300 text-emerald-700 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="font-bold text-slate-700 text-[11px]">Mark as New Collection</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition cursor-pointer text-[11px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold shadow-md transition flex items-center space-x-1.5 cursor-pointer text-[11px]"
            >
              <Check className="w-3.5 h-3.5 text-amber-300" />
              <span>{productToEdit ? 'Save Changes' : 'Publish to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
