import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Armchair, Plus, Trash2, Sparkles, Check, Image, Tag, DollarSign, Percent } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function ProductModal({ isOpen, onClose, productToEdit }) {
  const { addProduct, updateProduct, categories } = useAdminData();

  const [formData, setFormData] = useState({
    name: '',
    category: 'ergonomic',
    price: 499,
    originalPrice: 499,
    discountPercent: 0,
    stock: 20,
    mainImage: '',
    hoverImage: '',
    description: '',
    features: ['Dynamic Lumbar Support', 'Solid Frame', '10-Year Warranty'],
    colors: ['#2E6B4D', '#2B2D42', '#E6C365'],
    isBestSeller: false,
    isNew: true,
    isOffer: false,
  });

  const [featureInput, setFeatureInput] = useState('');
  const [colorInput, setColorInput] = useState('#2E6B4D');

  useEffect(() => {
    if (productToEdit) {
      const isOfferActive = productToEdit.isOffer !== undefined
        ? !!productToEdit.isOffer
        : (productToEdit.discountPercent > 0 && productToEdit.originalPrice > productToEdit.price);

      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || 'ergonomic',
        price: productToEdit.price || 450,
        originalPrice: productToEdit.originalPrice || productToEdit.price || 450,
        discountPercent: isOfferActive ? (productToEdit.discountPercent || 25) : 0,
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 15,
        mainImage: productToEdit.mainImage || '',
        hoverImage: productToEdit.hoverImage || '',
        description: productToEdit.description || '',
        features: productToEdit.features || ['Ergonomic Support', 'English Oak Frame'],
        colors: productToEdit.colors || ['#2E6B4D', '#2B2D42'],
        isBestSeller: !!productToEdit.isBestSeller,
        isNew: !!productToEdit.isNew,
        isOffer: isOfferActive,
      });
    } else {
      setFormData({
        name: '',
        category: 'ergonomic',
        price: 499,
        originalPrice: 499,
        discountPercent: 0,
        stock: 25,
        mainImage: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
        hoverImage: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
        description: 'Handcrafted luxury seat engineered for supreme comfort and posture alignment.',
        features: ['4D Lumbar Adjustment', 'Top-Grain Italian Leather', 'Class-4 Gas Lift'],
        colors: ['#2E6B4D', '#2B2D42', '#E6C365'],
        isBestSeller: false,
        isNew: true,
        isOffer: false,
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Normalize prices if offer is disabled
    const submissionData = {
      ...formData,
      discountPercent: formData.isOffer ? Number(formData.discountPercent) : 0,
      originalPrice: formData.isOffer && formData.discountPercent > 0
        ? Number(formData.originalPrice)
        : Number(formData.price),
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, submissionData);
    } else {
      addProduct(submissionData);
    }
    onClose();
  };

  const handlePriceChange = (newPrice) => {
    const p = Math.max(1, Number(newPrice));
    setFormData((prev) => {
      if (prev.isOffer && prev.discountPercent > 0) {
        const orig = Math.round(p / (1 - prev.discountPercent / 100));
        return { ...prev, price: p, originalPrice: orig };
      }
      return { ...prev, price: p, originalPrice: p };
    });
  };

  const handleToggleOffer = () => {
    setFormData((prev) => {
      const nextOffer = !prev.isOffer;
      if (nextOffer) {
        const defaultDiscount = prev.discountPercent > 0 ? prev.discountPercent : 30;
        const orig = Math.round(prev.price / (1 - defaultDiscount / 100));
        return {
          ...prev,
          isOffer: true,
          discountPercent: defaultDiscount,
          originalPrice: orig,
        };
      } else {
        return {
          ...prev,
          isOffer: false,
          discountPercent: 0,
          originalPrice: prev.price,
        };
      }
    });
  };

  const handleDiscountPercentChange = (percent) => {
    const disc = Math.min(95, Math.max(1, Number(percent)));
    setFormData((prev) => {
      const orig = Math.round(prev.price / (1 - disc / 100));
      return {
        ...prev,
        discountPercent: disc,
        originalPrice: orig,
      };
    });
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
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl max-h-[85vh] flex flex-col relative p-5 sm:p-6 cursor-default text-slate-800"
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
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition border border-slate-200 cursor-pointer"
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

            {/* Only Selling Price (Clean & Focused) */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="499"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-emerald-800 font-black font-mono focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
              />
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
                        className="text-slate-400 hover:text-rose-600 font-bold text-[11px] leading-none cursor-pointer"
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
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200 text-[10px] cursor-pointer"
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
                      className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Homepage Promotion Placements & Badges */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">
                Homepage Placement & Promotion Badges
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Best Seller */}
                <div
                  onClick={() => setFormData({ ...formData, isBestSeller: !formData.isBestSeller })}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    formData.isBestSeller
                      ? 'bg-amber-50/90 border-amber-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm">👑</span>
                      <span className="font-extrabold text-xs text-slate-900">Best Seller</span>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        formData.isBestSeller
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {formData.isBestSeller ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Display in Best Sellers section
                  </p>
                </div>

                {/* 2. New Collection */}
                <div
                  onClick={() => setFormData({ ...formData, isNew: !formData.isNew })}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    formData.isNew
                      ? 'bg-emerald-50/90 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm">✨</span>
                      <span className="font-extrabold text-xs text-slate-900">New 2026</span>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        formData.isNew
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {formData.isNew ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Feature in New Collection lineup
                  </p>
                </div>

                {/* 3. Special Offer & Discount Toggle */}
                <div
                  onClick={handleToggleOffer}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    formData.isOffer
                      ? 'bg-rose-50/90 border-rose-300 shadow-xs ring-1 ring-rose-400/40'
                      : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm">🔥</span>
                      <span className="font-extrabold text-xs text-slate-900">Flash Offer</span>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        formData.isOffer
                          ? 'bg-rose-500 text-white font-black'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {formData.isOffer ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {formData.isOffer ? `${formData.discountPercent}% discount active` : 'Enable promotional discount'}
                  </p>
                </div>
              </div>

              {/* Dynamic Discount Configuration - ONLY SHOWN WHEN OFFERS BTN IS ON */}
              {formData.isOffer && (
                <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-2xl animate-fadeIn space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-rose-900 font-extrabold text-xs">
                      <Percent className="w-3.5 h-3.5 text-rose-600" />
                      <span>Set Promotional Discount %</span>
                    </div>
                    <span className="text-[10px] text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-md">
                      MSRP will display as ₹{formData.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-32 relative">
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={formData.discountPercent || ''}
                        onChange={(e) => handleDiscountPercentChange(e.target.value)}
                        placeholder="e.g. 40"
                        className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs font-black text-rose-800 text-center font-mono focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-600 font-bold text-xs pointer-events-none">
                        %
                      </span>
                    </div>

                    {/* Quick Select Preset Pills */}
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {[15, 25, 35, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleDiscountPercentChange(pct)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition cursor-pointer border ${
                            formData.discountPercent === pct
                              ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                              : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {pct}% OFF
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-rose-700">
                    Buyers see: <strong className="font-mono">₹{formData.price}</strong> <span className="line-through text-slate-400 ml-1">₹{formData.originalPrice}</span> <span className="font-bold text-rose-600 ml-1">({formData.discountPercent}% OFF)</span>
                  </p>
                </div>
              )}
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
