import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Armchair,
  Trash2,
  Edit2,
  Sparkles,
  Check,
  Palette,
  Percent,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

// Auto-detect friendly color name from hex if name is not typed
const getDefaultColorName = (hex) => {
  if (!hex) return 'Custom Finish';
  const clean = hex.toUpperCase();
  const map = {
    '#2E6B4D': 'British Racing Green',
    '#2D6A4F': 'Forest Emerald',
    '#3D8B68': 'Sage Velvet',
    '#2B2D42': 'Midnight Navy Blue',
    '#8D99AE': 'Slate Sterling Silver',
    '#C68B59': 'Vintage English Oak',
    '#DDA15E': 'Natural Beeswax Birch',
    '#1A1A1A': 'Onyx Executive Black',
    '#000000': 'Classic Black',
    '#FFFFFF': 'Pure White',
    '#E6C365': 'Champagne Gold',
    '#9B2226': 'Imperial Velvet Crimson',
    '#6B705C': 'Heritage Olive',
    '#4A4E69': 'Twilight Indigo',
    '#F4A261': 'Warm Terracotta',
    '#E76F51': 'Burnt Sunset Copper',
    '#B8860B': 'Dark Goldenrod',
    '#4A2E2B': 'Mahogany Brown',
  };
  return map[clean] || `Color (${clean})`;
};

export default function ProductModal({ isOpen, onClose, productToEdit }) {
  const { addProduct, updateProduct, categories } = useAdminData();

  const [formData, setFormData] = useState({
    name: '',
    category: (categories && categories[0]?.slug) || 'wooden',
    subCategory: 'All',
    price: 499,
    originalPrice: 499,
    discountPercent: 0,
    stock: 20,
    mainImage: '',
    hoverImage: '',
    description: '',
    features: ['Dynamic Lumbar Support', 'Solid Frame', '10-Year Warranty'],
    colors: [
      { hex: '#2E6B4D', name: 'British Racing Green' },
      { hex: '#2B2D42', name: 'Midnight Navy Blue' },
    ],
    isBestSeller: false,
    isNew: true,
    isOffer: false,
  });

  const [featureInput, setFeatureInput] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');

  // Color Variant Add State
  const [colorHexInput, setColorHexInput] = useState('#2E6B4D');
  const [colorNameInput, setColorNameInput] = useState('');

  // Color Variant Edit Inline State
  const [editingColorIdx, setEditingColorIdx] = useState(null);
  const [editHex, setEditHex] = useState('');
  const [editName, setEditName] = useState('');

  // Selected Category Object to extract subcategories
  const selectedCategoryObj = (categories || []).find(
    (c) => c.slug === formData.category || c.id === formData.category || c._id === formData.category
  );

  const availableSubcategories = selectedCategoryObj?.subcategories || [];
  const subcategoryList = availableSubcategories.map((s) => (typeof s === 'string' ? s : s.name));

  useEffect(() => {
    if (productToEdit) {
      const isOfferActive = productToEdit.isOffer !== undefined
        ? !!productToEdit.isOffer
        : (productToEdit.discountPercent > 0 && productToEdit.originalPrice > productToEdit.price);

      // Normalize colors into [{ hex, name }]
      const normalizedColors = Array.isArray(productToEdit.colors)
        ? productToEdit.colors.map((c) => {
            if (typeof c === 'string') {
              return { hex: c, name: getDefaultColorName(c) };
            }
            return {
              hex: c.hex || '#2E6B4D',
              name: c.name || getDefaultColorName(c.hex),
            };
          })
        : [];

      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.categorySlug || productToEdit.category || 'wooden',
        subCategory: productToEdit.subCategory || 'All',
        price: productToEdit.price || 450,
        originalPrice: productToEdit.originalPrice || productToEdit.price || 450,
        discountPercent: isOfferActive ? (productToEdit.discountPercent || 25) : 0,
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 15,
        mainImage: productToEdit.mainImage || '',
        hoverImage: productToEdit.hoverImage || '',
        description: productToEdit.description || '',
        features: productToEdit.features || ['Ergonomic Support', 'English Oak Frame'],
        colors: normalizedColors.length > 0 ? normalizedColors : [{ hex: '#2E6B4D', name: 'British Racing Green' }],
        isBestSeller: !!productToEdit.isBestSeller,
        isNew: !!productToEdit.isNew,
        isOffer: isOfferActive,
      });
    } else {
      const firstCat = (categories && categories[0]?.slug) || 'wooden';
      setFormData({
        name: '',
        category: firstCat,
        subCategory: 'All',
        price: 499,
        originalPrice: 499,
        discountPercent: 0,
        stock: 25,
        mainImage: '',
        hoverImage: '',
        description: 'Handcrafted luxury seat engineered for supreme comfort and posture alignment.',
        features: ['4D Lumbar Adjustment', 'Top-Grain Italian Leather', 'Class-4 Gas Lift'],
        colors: [
          { hex: '#2E6B4D', name: 'British Racing Green' },
          { hex: '#2B2D42', name: 'Midnight Navy Blue' },
        ],
        isBestSeller: false,
        isNew: true,
        isOffer: false,
      });
    }
    setEditingColorIdx(null);
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const submissionData = {
      ...formData,
      categorySlug: formData.category,
      subCategory: customSubcategory.trim() || formData.subCategory || 'All',
      discountPercent: formData.isOffer ? Number(formData.discountPercent) : 0,
      originalPrice: formData.isOffer && formData.discountPercent > 0
        ? Number(formData.originalPrice)
        : Number(formData.price),
    };

    if (productToEdit) {
      updateProduct(productToEdit._id || productToEdit.id, submissionData);
    } else {
      addProduct(submissionData);
    }
    onClose();
  };

  const handleCategoryChange = (newCat) => {
    const matched = (categories || []).find((c) => c.slug === newCat || c.id === newCat || c._id === newCat);
    const firstSub = matched?.subcategories?.[0] ? (typeof matched.subcategories[0] === 'string' ? matched.subcategories[0] : matched.subcategories[0].name) : 'All';
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      subCategory: firstSub,
    }));
    setCustomSubcategory('');
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

  // Color Variants Management
  const handleAddColorVariant = () => {
    const hex = colorHexInput || '#2E6B4D';
    const name = colorNameInput.trim() || getDefaultColorName(hex);

    // Check if hex already exists in the list
    if (formData.colors.some((c) => (typeof c === 'string' ? c : c.hex).toUpperCase() === hex.toUpperCase())) {
      alert(`Color finish "${name}" (${hex}) is already added.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { hex, name }],
    }));

    setColorNameInput('');
  };

  const handleStartEditColor = (index, colorObj) => {
    const hex = typeof colorObj === 'string' ? colorObj : colorObj.hex;
    const name = typeof colorObj === 'string' ? getDefaultColorName(colorObj) : colorObj.name;

    setEditingColorIdx(index);
    setEditHex(hex);
    setEditName(name);
  };

  const handleSaveEditedColor = () => {
    if (editingColorIdx === null) return;

    setFormData((prev) => {
      const updated = [...prev.colors];
      updated[editingColorIdx] = {
        hex: editHex || '#2E6B4D',
        name: editName.trim() || getDefaultColorName(editHex),
      };
      return { ...prev, colors: updated };
    });

    setEditingColorIdx(null);
  };

  const handleCancelEditColor = () => {
    setEditingColorIdx(null);
  };

  const handleRemoveColorVariant = (indexToRemove) => {
    if (editingColorIdx === indexToRemove) {
      setEditingColorIdx(null);
    }
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Armchair className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {productToEdit ? 'Edit Chair Model' : 'Add New Chair to Catalog'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure chair details, parent category, subcategory classification, color finishes, and pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
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

            {/* Category & Subcategory Dynamic Classification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Category */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  1. Parent Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden capitalize cursor-pointer"
                >
                  {(categories || []).map((c) => (
                    <option key={c._id || c.slug || c.id} value={c.slug || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory under this category */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  2. Subcategory / Style Under ({selectedCategoryObj?.name || 'Category'})
                </label>
                {subcategoryList.length > 0 ? (
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden cursor-pointer"
                  >
                    <option value="All">All {selectedCategoryObj?.name || 'Styles'}</option>
                    {subcategoryList.map((sub, sIdx) => (
                      <option key={sIdx} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={customSubcategory || (formData.subCategory !== 'All' ? formData.subCategory : '')}
                    onChange={(e) => {
                      setCustomSubcategory(e.target.value);
                      setFormData({ ...formData, subCategory: e.target.value });
                    }}
                    placeholder="e.g. Vintage Recliner, Task Swivel..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                  />
                )}
              </div>
            </div>

            {/* Price & Stock Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Selling Price */}
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
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-emerald-800 font-black font-mono focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Inventory Stock Units *
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

            {/* Image URLs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.mainImage}
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Second Image URL
                </label>
                <input
                  type="url"
                  value={formData.hoverImage}
                  onChange={(e) => setFormData({ ...formData, hoverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                Product Story & Craftsmanship Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Handcrafted luxury seat engineered for supreme comfort..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden resize-none"
              />
            </div>

            {/* Multiple Color Finishes & Variants Manager */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-emerald-800" />
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                    Available Color Finishes
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {formData.colors.length} Finishes Added
                </span>
              </div>

              {/* Added Color Variants List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.colors.map((c, i) => {
                  const hexVal = typeof c === 'string' ? c : c.hex;
                  const nameVal = typeof c === 'string' ? getDefaultColorName(c) : c.name;
                  const isEditingThis = editingColorIdx === i;

                  if (isEditingThis) {
                    return (
                      <div
                        key={i}
                        className="sm:col-span-2 p-3 rounded-2xl bg-emerald-50/70 border-2 border-emerald-600 space-y-2 animate-fadeIn shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider flex items-center space-x-1">
                            <Edit2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Editing Finish #{i + 1}</span>
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={handleSaveEditedColor}
                              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold flex items-center space-x-1 transition cursor-pointer shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5 text-amber-300" />
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditColor}
                              className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          {/* Hex Color Picker (3 cols) */}
                          <div className="sm:col-span-3 flex items-center space-x-2">
                            <input
                              type="color"
                              value={editHex}
                              onChange={(e) => setEditHex(e.target.value)}
                              className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0"
                            />
                            <span className="font-mono text-[11px] text-slate-700 font-bold">
                              {editHex}
                            </span>
                          </div>

                          {/* Name Input (9 cols) */}
                          <div className="sm:col-span-9">
                            <input
                              type="text"
                              placeholder="Color Title (e.g. Midnight Navy Blue)"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between space-x-2.5 hover:border-emerald-300 transition group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {/* Swatch */}
                        <div
                          className="w-8 h-8 rounded-lg border border-slate-300 shadow-inner shrink-0"
                          style={{ backgroundColor: hexVal }}
                        />

                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-800 text-xs truncate">
                            {nameVal}
                          </p>
                          <p className="font-mono text-[10px] text-slate-400 truncate">
                            {hexVal}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditColor(i, c)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Edit color name or swatch"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariant(i)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Remove color finish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Color Variant Inputs Box */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/90 space-y-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  + Add Color Finish for this Chair
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  {/* Swatch Picker (3 cols) */}
                  <div className="sm:col-span-3 flex items-center space-x-2">
                    <input
                      type="color"
                      value={colorHexInput}
                      onChange={(e) => {
                        setColorHexInput(e.target.value);
                        if (!colorNameInput) {
                          setColorNameInput(getDefaultColorName(e.target.value));
                        }
                      }}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0"
                      title="Choose Color Hex"
                    />
                    <span className="font-mono text-[11px] text-slate-600 font-bold">
                      {colorHexInput}
                    </span>
                  </div>

                  {/* Color Finish Name (7 cols) */}
                  <div className="sm:col-span-7">
                    <input
                      type="text"
                      placeholder="e.g. Midnight Navy Blue"
                      value={colorNameInput}
                      onChange={(e) => setColorNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddColorVariant();
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Add Button (2 cols) */}
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddColorVariant}
                      className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition cursor-pointer shadow-2xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Bullets */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                Key Highlight Bullets
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.features.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium text-[11px]"
                  >
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="text-emerald-700 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g. Dynamic Spine Alignment..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Flags (Best Seller / New Arrival / Discount Offer) */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500"
                />
                <span className="font-bold text-slate-800 text-xs">👑 Best Seller</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500"
                />
                <span className="font-bold text-slate-800 text-xs">✨ New Arrival</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isOffer}
                  onChange={handleToggleOffer}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-bold text-slate-800 text-xs">🏷️ Promotional Offer</span>
              </label>
            </div>

            {/* Offer Discount Settings */}
            {formData.isOffer && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Percent className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-950">Discount Percentage:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="95"
                    value={formData.discountPercent}
                    onChange={(e) => handleDiscountPercentChange(e.target.value)}
                    className="w-16 px-2.5 py-1 rounded-xl bg-white border border-amber-300 font-mono font-bold text-amber-900 text-center text-xs"
                  />
                  <span className="text-xs font-mono font-bold text-amber-800">% OFF</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black shadow-md flex items-center space-x-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{productToEdit ? 'Update Chair' : 'Save Chair to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
