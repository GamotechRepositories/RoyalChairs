import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Armchair,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Palette,
  DollarSign,
  Package,
  Layers,
  Image as ImageIcon,
  Percent,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen,
  Sliders,
  ShieldCheck,
  Wrench,
  Sparkle,
  Truck,
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
    '#1E3A8A': 'Royal Sapphire Blue',
    '#0284C7': 'Sky Blue',
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

const DEFAULT_PILLARS = [
  {
    title: '1. Ergonomic Contouring',
    desc: 'Dynamic 4D lumbar alignment tracking pelvic tilt to reduce lower back fatigue during extensive sitting sessions.',
    icon: 'Armchair',
  },
  {
    title: '2. Luxury Upholstery',
    desc: 'Top-grain Italian Nappa leathers and double-woven stain-resistant plush velvets that repel accidental liquid spills.',
    icon: 'Sparkles',
  },
  {
    title: '3. FSC English Timbers',
    desc: 'Harvested from managed English woodlands with traditional mortise-and-tenon interlocking joint carpentry.',
    icon: 'ShieldCheck',
  },
  {
    title: '4. Zero-Hassle Assembly',
    desc: 'Delivered pre-inspected, precision balanced, and ready to use straight out of the protective shipping container.',
    icon: 'Wrench',
  },
];

export default function ProductFormPage({ productToEdit, onBack }) {
  const { addProduct, updateProduct, categories } = useAdminData();

  const [formData, setFormData] = useState({
    name: '',
    category: (categories && categories[0]?.slug) || 'wooden',
    subCategory: 'All',
    variantType: 'single', // 'single' or 'multi'
    price: '',
    originalPrice: '',
    discountPercent: 0,
    stock: 15,
    mainImage: '',
    hoverImage: '',
    galleryImages: [],
    description: '',
    fullDescription: '',
    anatomyHeading: 'Product Description',
    showAnatomySection: true,
    showPillarsSection: true,
    showCareGuide: true,
    careInstructions: 'Clean simply with a dry or lightly dampened microfiber cloth. Our stain-resistant nano-barrier ensures spilled espresso, tea, or ink can be wiped away within seconds without damaging the grain.',
    specifications: {
      maxWeight: '180 kg (396 lbs)',
      frameMaterial: 'Solid English Oak & Carbon Steel',
      foamDensity: 'High-Resilience Molded 65kg/m³',
      upholstery: 'Top-Grain Italian Leather / Velvet',
      dimensions: 'W 66cm x D 64cm x H 115-125cm',
      assembly: '100% Pre-Assembled (Plug & Sit)',
      warranty: '10-Year Master Guarantee',
    },
    customSpecs: [],
    customPillars: DEFAULT_PILLARS,
    features: ['Dynamic Lumbar Support', 'Solid Timber Frame', '10-Year Master Frame Guarantee'],
    colors: [{ hex: '#2E6B4D', name: '' }],
    variants: [
      {
        colorHex: '#2E6B4D',
        colorName: '',
        price: '',
        stock: '',
        mainImage: '',
        hoverImage: '',
        galleryImages: [],
      },
    ],
    isBestSeller: false,
    isNew: true,
    isOffer: false,
    isActive: true,
  });

  const [featureInput, setFeatureInput] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [saveToast, setSaveToast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Normalize colors
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
        : [{ hex: '#2E6B4D', name: 'British Racing Green' }];

      // Normalize variants
      const hasMulti = productToEdit.variantType === 'multi' || (Array.isArray(productToEdit.variants) && productToEdit.variants.length > 0);
      const normalizedVariants = hasMulti && Array.isArray(productToEdit.variants) && productToEdit.variants.length > 0
        ? productToEdit.variants.map((v) => ({
          colorHex: v.colorHex || '#2E6B4D',
          colorName: v.colorName || v.name || getDefaultColorName(v.colorHex),
          price: v.price || productToEdit.price || 499,
          stock: v.stock !== undefined ? v.stock : 15,
          mainImage: v.mainImage || v.image || '',
          hoverImage: v.hoverImage || '',
          galleryImages: Array.isArray(v.galleryImages) ? v.galleryImages : [],
        }))
        : [
          {
            colorHex: normalizedColors[0]?.hex || '#2E6B4D',
            colorName: normalizedColors[0]?.name || 'British Racing Green',
            price: productToEdit.price || 499,
            stock: productToEdit.stock || 20,
            mainImage: productToEdit.mainImage || '',
            hoverImage: productToEdit.hoverImage || '',
            galleryImages: Array.isArray(productToEdit.galleryImages) ? productToEdit.galleryImages : [],
          },
        ];

      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.categorySlug || productToEdit.category || 'wooden',
        subCategory: productToEdit.subCategory || 'All',
        variantType: hasMulti ? 'multi' : 'single',
        price: productToEdit.price || 450,
        originalPrice: productToEdit.originalPrice || productToEdit.price || 450,
        discountPercent: productToEdit.discountPercent || 0,
        stock: productToEdit.stock || 15,
        mainImage: productToEdit.mainImage || '',
        hoverImage: productToEdit.hoverImage || '',
        galleryImages: Array.isArray(productToEdit.galleryImages) ? productToEdit.galleryImages : [],
        description: productToEdit.description || '',
        fullDescription: productToEdit.fullDescription || '',
        anatomyHeading: productToEdit.anatomyHeading || 'Built for Generations of Unmatched Comfort',
        showAnatomySection: productToEdit.showAnatomySection !== undefined ? !!productToEdit.showAnatomySection : true,
        showPillarsSection: productToEdit.showPillarsSection !== undefined ? !!productToEdit.showPillarsSection : true,
        showCareGuide: productToEdit.showCareGuide !== undefined ? !!productToEdit.showCareGuide : true,
        careInstructions: productToEdit.careInstructions || 'Clean simply with a dry or lightly dampened microfiber cloth. Our stain-resistant nano-barrier ensures spilled espresso, tea, or ink can be wiped away within seconds without damaging the grain.',
        specifications: {
          maxWeight: productToEdit.specifications?.maxWeight || '180 kg (396 lbs)',
          frameMaterial: productToEdit.specifications?.frameMaterial || 'Solid English Oak & Carbon Steel',
          foamDensity: productToEdit.specifications?.foamDensity || 'High-Resilience Molded 65kg/m³',
          upholstery: productToEdit.specifications?.upholstery || 'Top-Grain Italian Leather / Velvet',
          dimensions: productToEdit.specifications?.dimensions || 'W 66cm x D 64cm x H 115-125cm',
          assembly: productToEdit.specifications?.assembly || '100% Pre-Assembled (Plug & Sit)',
          warranty: productToEdit.specifications?.warranty || '10-Year Master Guarantee',
        },
        customSpecs: Array.isArray(productToEdit.customSpecs) ? productToEdit.customSpecs : [],
        customPillars: Array.isArray(productToEdit.customPillars) && productToEdit.customPillars.length > 0
          ? productToEdit.customPillars
          : DEFAULT_PILLARS,
        features: Array.isArray(productToEdit.features) && productToEdit.features.length > 0
          ? productToEdit.features
          : ['Dynamic Lumbar Support', 'Solid Timber Frame', '10-Year Master Frame Guarantee'],
        colors: normalizedColors,
        variants: normalizedVariants,
        isBestSeller: !!productToEdit.isBestSeller,
        isNew: productToEdit.isNew !== undefined ? !!productToEdit.isNew : true,
        isOffer: isOfferActive,
        isActive: productToEdit.isActive !== undefined ? !!productToEdit.isActive : true,
      });
    }
  }, [productToEdit]);

  const handlePriceChange = (val) => {
    const p = Number(val);
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

  // --- MULTI-VARIANT HELPERS ---
  const handleAddVariantRow = () => {
    const newVariant = {
      colorHex: '#2E6B4D',
      colorName: '',
      price: '',
      stock: '',
      mainImage: '',
      hoverImage: '',
      galleryImages: [],
    };

    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const handleUpdateVariant = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'colorHex' && (!updated[index].colorName || updated[index].colorName.startsWith('Color ('))) {
        updated[index].colorName = getDefaultColorName(value);
      }
      return { ...prev, variants: updated };
    });
  };

  const handleRemoveVariant = (indexToRemove) => {
    if (formData.variants.length <= 1) {
      alert('A multi-variant product must have at least 1 variant. Switch to Single Variant if you only have one color.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // --- ADDITIONAL IMAGES PER VARIANT ---
  const handleAddVariantImage = (variantIndex) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      const curImages = Array.isArray(updated[variantIndex].galleryImages)
        ? [...updated[variantIndex].galleryImages]
        : [];
      updated[variantIndex] = {
        ...updated[variantIndex],
        galleryImages: [...curImages, ''],
      };
      return { ...prev, variants: updated };
    });
  };

  const handleUpdateVariantImage = (variantIndex, imageIndex, val) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      const curImages = [...(updated[variantIndex].galleryImages || [])];
      curImages[imageIndex] = val;
      updated[variantIndex] = {
        ...updated[variantIndex],
        galleryImages: curImages,
      };
      return { ...prev, variants: updated };
    });
  };

  const handleRemoveVariantImage = (variantIndex, imageIndex) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      const curImages = (updated[variantIndex].galleryImages || []).filter((_, idx) => idx !== imageIndex);
      updated[variantIndex] = {
        ...updated[variantIndex],
        galleryImages: curImages,
      };
      return { ...prev, variants: updated };
    });
  };

  // --- ADDITIONAL IMAGES FOR SINGLE VARIANT ---
  const handleAddSingleGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), ''],
    }));
  };

  const handleUpdateSingleGalleryImage = (imgIdx, val) => {
    setFormData((prev) => {
      const cur = [...(prev.galleryImages || [])];
      cur[imgIdx] = val;
      return { ...prev, galleryImages: cur };
    });
  };

  const handleRemoveSingleGalleryImage = (imgIdx) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, idx) => idx !== imgIdx),
    }));
  };

  // --- SPECIFICATIONS HANDLERS ---
  const handleSpecChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  const handleAddCustomSpec = () => {
    setFormData((prev) => ({
      ...prev,
      customSpecs: [...(prev.customSpecs || []), { label: '', value: '' }],
    }));
  };

  const handleUpdateCustomSpec = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...(prev.customSpecs || [])];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, customSpecs: updated };
    });
  };

  const handleRemoveCustomSpec = (idx) => {
    setFormData((prev) => ({
      ...prev,
      customSpecs: (prev.customSpecs || []).filter((_, i) => i !== idx),
    }));
  };

  // --- PILLAR HANDLERS ---
  const handleUpdatePillar = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.customPillars];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, customPillars: updated };
    });
  };

  const handleAddPillar = () => {
    setFormData((prev) => ({
      ...prev,
      customPillars: [
        ...prev.customPillars,
        { title: 'New Pillar Title', desc: 'Describe this craftsmanship advantage...', icon: 'Sparkles' },
      ],
    }));
  };

  const handleRemovePillar = (idx) => {
    setFormData((prev) => ({
      ...prev,
      customPillars: prev.customPillars.filter((_, i) => i !== idx),
    }));
  };

  // Single Variant Color Swatch Change
  const handleSingleColorChange = (hex) => {
    const name = getDefaultColorName(hex);
    setFormData((prev) => ({
      ...prev,
      colors: [{ hex, name }],
    }));
  };

  const handleSingleColorNameChange = (name) => {
    setFormData((prev) => ({
      ...prev,
      colors: [{ hex: prev.colors[0]?.hex || '#2E6B4D', name }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a Chair Model Title.');
      return;
    }

    setIsSubmitting(true);

    const mainImgToUse = formData.variantType === 'multi'
      ? (formData.variants[0]?.mainImage || formData.mainImage || 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80')
      : formData.mainImage;

    const hoverImgToUse = formData.variantType === 'multi'
      ? (formData.variants[0]?.hoverImage || formData.hoverImage || mainImgToUse)
      : (formData.hoverImage || mainImgToUse);

    const finalColors = formData.variantType === 'multi'
      ? formData.variants.map((v) => ({
        hex: v.colorHex,
        name: v.colorName || getDefaultColorName(v.colorHex),
        image: v.mainImage || '',
      }))
      : formData.colors;

    const finalVariants = formData.variantType === 'multi'
      ? formData.variants.map((v) => ({
        name: `${formData.name} - ${v.colorName || getDefaultColorName(v.colorHex)}`,
        colorHex: v.colorHex,
        colorName: v.colorName || getDefaultColorName(v.colorHex),
        price: Number(v.price) || Number(formData.price),
        stock: Number(v.stock) || 0,
        image: v.mainImage || '',
        mainImage: v.mainImage || '',
        hoverImage: v.hoverImage || '',
        galleryImages: Array.isArray(v.galleryImages) ? v.galleryImages.filter(Boolean) : [],
      }))
      : [];

    const calculatedStock = formData.variantType === 'multi'
      ? formData.variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
      : Number(formData.stock);

    const firstVariantPrice = formData.variantType === 'multi' && formData.variants.length > 0
      ? Number(formData.variants[0].price)
      : Number(formData.price);

    const submissionData = {
      ...formData,
      mainImage: mainImgToUse,
      hoverImage: hoverImgToUse,
      galleryImages: formData.variantType === 'multi'
        ? (formData.variants[0]?.galleryImages || formData.galleryImages || []).filter(Boolean)
        : (formData.galleryImages || []).filter(Boolean),
      price: firstVariantPrice,
      categorySlug: formData.category,
      subCategory: customSubcategory.trim() || formData.subCategory || 'All',
      variantType: formData.variantType,
      hasVariants: formData.variantType === 'multi',
      variants: finalVariants,
      colors: finalColors,
      stock: calculatedStock,
      discountPercent: formData.isOffer ? Number(formData.discountPercent) : 0,
      originalPrice: formData.isOffer && formData.discountPercent > 0
        ? Number(formData.originalPrice)
        : Number(firstVariantPrice),
      customSpecs: (formData.customSpecs || []).filter((s) => s.label && s.value),
    };

    try {
      if (productToEdit) {
        await updateProduct(productToEdit._id || productToEdit.id, submissionData);
      } else {
        await addProduct(submissionData);
      }
      setSaveToast(`Chair "${formData.name}" saved to database successfully!`);
      setTimeout(() => {
        onBack();
      }, 900);
    } catch (err) {
      console.error(err);
      alert('Failed to save product. Check console logs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-300/40 flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-extrabold">{saveToast}</span>
        </div>
      )}

      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition shadow-2xs cursor-pointer flex items-center space-x-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
              {productToEdit ? 'Editing Chair' : 'Product Studio'}
            </span>
            <h1 className="text-2xl font-black text-slate-900 font-serif">
              {productToEdit ? `Edit "${productToEdit.name}"` : 'Add New Luxury Chair'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-950/20 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4 text-amber-300" />
            <span>{isSubmitting ? 'Saving to Database...' : productToEdit ? 'Save Changes' : 'Publish Chair'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Armchair className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 font-serif">
                1. General Product Details
              </h2>
              <p className="text-xs text-slate-400">Chair model title, category taxonomy &amp; summary description</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Chair Title */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">
                Chair Model Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kensington Royal Tufted Velvet Highback"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
              />
            </div>

            {/* Category & Subcategory Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">
                  Primary Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      subCategory: 'All',
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden text-xs cursor-pointer"
                >
                  {(categories || []).map((cat) => (
                    <option key={cat._id || cat.slug || cat.id} value={cat.slug || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">
                  Subcategory / Style
                </label>
                <div className="flex space-x-2">
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden text-xs cursor-pointer"
                  >
                    <option value="All">All Styles</option>
                    {subcategoryList.map((sub, idx) => (
                      <option key={idx} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={customSubcategory}
                    onChange={(e) => setCustomSubcategory(e.target.value)}
                    placeholder="Or type custom..."
                    className="w-36 px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">
                Product Short Summary (Displayed next to price)
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Handcrafted luxury seat engineered for supreme comfort and posture alignment..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden text-xs resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: VARIANT SELECTION (Single Color vs Multi Color/Variants) */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-serif">
                  2. Product Variant &amp; Image Configuration
                </h2>
                <p className="text-xs text-slate-400">Choose single color or customize images &amp; prices per variant</p>
              </div>
            </div>
          </div>

          {/* RADIO BUTTONS FOR SINGLE VS MULTI VARIANT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option A: Single Variant */}
            <label
              className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3.5 ${formData.variantType === 'single'
                  ? 'border-emerald-700 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
            >
              <input
                type="radio"
                name="variantType"
                value="single"
                checked={formData.variantType === 'single'}
                onChange={() => setFormData({ ...formData, variantType: 'single' })}
                className="mt-1 w-4 h-4 text-emerald-800 focus:ring-emerald-600"
              />
              <div>
                <span className="font-extrabold text-slate-900 text-sm block">
                  Single Variant (Single Color)
                </span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Chair sold in 1 single color with fixed price and images.
                </p>
              </div>
            </label>

            {/* Option B: Multi Variant */}
            <label
              className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3.5 ${formData.variantType === 'multi'
                  ? 'border-emerald-700 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
            >
              <input
                type="radio"
                name="variantType"
                value="multi"
                checked={formData.variantType === 'multi'}
                onChange={() => setFormData({ ...formData, variantType: 'multi' })}
                className="mt-1 w-4 h-4 text-emerald-800 focus:ring-emerald-600"
              />
              <div>
                <span className="font-extrabold text-slate-900 text-sm block flex items-center space-x-1.5">
                  <span>Multi Variant (Different Colors, Prices &amp; Photos)</span>
                </span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Same chair offered in multiple colors where each color has its own <strong>Photos</strong>, <strong>Price (₹)</strong>, and <strong>Stock</strong>!
                </p>
              </div>
            </label>
          </div>

          {/* IF SINGLE VARIANT: Standard Price, Stock, Images & Color */}
          {formData.variantType === 'single' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 animate-fadeIn">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                Single Variant Pricing, Images &amp; Finish
              </span>

              {/* Single Product Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-xs">
                    Primary Image URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required={formData.variantType === 'single'}
                    value={formData.mainImage}
                    onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-emerald-600 focus:outline-hidden font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-xs">
                    Second Image URL (Hover View)
                  </label>
                  <input
                    type="url"
                    value={formData.hoverImage}
                    onChange={(e) => setFormData({ ...formData, hoverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-emerald-600 focus:outline-hidden font-mono text-xs"
                  />
                </div>
              </div>

              {/* Additional Gallery Images for Single Variant */}
              <div className="space-y-2 pt-1 border-t border-slate-200/60">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Additional Gallery Images ({formData.galleryImages?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSingleGalleryImage}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center space-x-1 border border-emerald-200 cursor-pointer transition shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+ Add Image</span>
                  </button>
                </div>

                {formData.galleryImages && formData.galleryImages.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {formData.galleryImages.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 w-16">
                          Image #{imgIdx + 3}
                        </span>
                        <input
                          type="url"
                          value={imgUrl}
                          onChange={(e) => handleUpdateSingleGalleryImage(imgIdx, e.target.value)}
                          placeholder="https://.../chair-angle-view.jpg"
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                        />
                        {imgUrl && (
                          <img
                            src={imgUrl}
                            alt="preview"
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveSingleGalleryImage(imgIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Remove this image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Single Price, Stock, Color */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200/60">
                {/* Selling Price */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-xs">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required={formData.variantType === 'single'}
                    value={formData.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="1299"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-emerald-900 font-black font-mono focus:border-emerald-600 focus:outline-hidden text-sm"
                  />
                </div>

                {/* Stock Units */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-xs">
                    Inventory Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold font-mono focus:border-emerald-600 focus:outline-hidden text-sm"
                  />
                </div>

                {/* Color Swatch & Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-xs">
                    Finish Color &amp; Swatch
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.colors[0]?.hex || '#2E6B4D'}
                      onChange={(e) => handleSingleColorChange(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0 bg-transparent shrink-0"
                      title="Choose Hex Swatch"
                    />
                    <input
                      type="text"
                      value={formData.colors[0]?.name || 'British Racing Green'}
                      onChange={(e) => handleSingleColorNameChange(e.target.value)}
                      placeholder="e.g. British Racing Green"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IF MULTI VARIANT: Each variant has its own Images, Color, Price & Stock */}
          {formData.variantType === 'multi' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                    Color Variants Matrix ({formData.variants.length} Colors / Styles)
                  </span>
                  <p className="text-xs text-slate-400">Each variant has its own custom photos, color name, price (₹), and inventory stock</p>
                </div>

                <button
                  type="button"
                  onClick={handleAddVariantRow}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>+ Add Color Variant</span>
                </button>
              </div>

              {/* Variants Cards List */}
              <div className="space-y-4">
                {formData.variants.map((variant, vIdx) => (
                  <div
                    key={vIdx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-4 hover:border-emerald-400 transition group"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-black flex items-center justify-center shadow-2xs">
                          {vIdx + 1}
                        </span>
                        <div
                          className="w-5 h-5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: variant.colorHex || '#2E6B4D' }}
                        />
                        <span className="text-sm font-black text-slate-800 font-serif">
                          Variant {vIdx + 1}: {variant.colorName || 'New Color Finish'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(vIdx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Row 1: Color Name & Swatch, Price, Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                      {/* Color Picker & Single Color Name (6 cols) */}
                      <div className="sm:col-span-6">
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                          Color Swatch &amp; Name *
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={variant.colorHex || '#2E6B4D'}
                            onChange={(e) => handleUpdateVariant(vIdx, 'colorHex', e.target.value)}
                            className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0 bg-transparent shrink-0"
                            title="Pick Hex Color"
                          />
                          <input
                            type="text"
                            value={variant.colorName || ''}
                            onChange={(e) => handleUpdateVariant(vIdx, 'colorName', e.target.value)}
                            placeholder="e.g. British Racing Green / Royal Blue"
                            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Variant Price (3 cols) */}
                      <div className="sm:col-span-3">
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                          Price for this Color (₹) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={variant.price || 0}
                          onChange={(e) => handleUpdateVariant(vIdx, 'price', Number(e.target.value))}
                          placeholder="1299"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-black font-mono text-emerald-900 focus:border-emerald-600 focus:outline-hidden"
                        />
                      </div>

                      {/* Variant Stock (3 cols) */}
                      <div className="sm:col-span-3">
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                          Stock Units (Units in this color) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={variant.stock || 0}
                          onChange={(e) => handleUpdateVariant(vIdx, 'stock', Number(e.target.value))}
                          placeholder="15"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Row 2: Variant Specific Images & + Add Image Button */}
                    <div className="space-y-3 pt-2 border-t border-slate-200/60">
                      <div className="flex items-center justify-between">
                        <label className="block font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                          Photos for Variant {vIdx + 1} ({variant.colorName || 'This Color'})
                        </label>

                        {/* + Add Image Button for this Variant */}
                        <button
                          type="button"
                          onClick={() => handleAddVariantImage(vIdx)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center space-x-1 border border-emerald-200 cursor-pointer transition shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-700" />
                          <span>+ Add Image</span>
                        </button>
                      </div>

                      {/* Primary & Second Image inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Primary Image */}
                        <div>
                          <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                            Primary Image URL (1st View) *
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="url"
                              required
                              value={variant.mainImage || ''}
                              onChange={(e) => handleUpdateVariant(vIdx, 'mainImage', e.target.value)}
                              placeholder="https://.../chair-front.jpg"
                              className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[11px] font-mono text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                            />
                            {variant.mainImage && (
                              <img
                                src={variant.mainImage}
                                alt="primary preview"
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Second Hover Image */}
                        <div>
                          <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                            Second Image URL (Hover View)
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="url"
                              value={variant.hoverImage || ''}
                              onChange={(e) => handleUpdateVariant(vIdx, 'hoverImage', e.target.value)}
                              placeholder="https://.../chair-angle.jpg"
                              className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[11px] font-mono text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                            />
                            {variant.hoverImage && (
                              <img
                                src={variant.hoverImage}
                                alt="hover preview"
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Additional Images for this Variant */}
                      {variant.galleryImages && variant.galleryImages.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-200/50">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                            Additional Angles &amp; Detail Photos
                          </span>
                          {variant.galleryImages.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono font-bold text-slate-400 w-16">
                                Image #{imgIdx + 3}
                              </span>
                              <input
                                type="url"
                                value={imgUrl}
                                onChange={(e) => handleUpdateVariantImage(vIdx, imgIdx, e.target.value)}
                                placeholder="https://.../chair-side-view.jpg"
                                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                              />
                              {imgUrl && (
                                <img
                                  src={imgUrl}
                                  alt="preview"
                                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantImage(vIdx, imgIdx)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Remove this photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Highlights & Marketing Flags */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center border border-purple-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 font-serif">
                3. Highlights, Features &amp; Storefront Badges
              </h2>
              <p className="text-xs text-slate-400">Badges, key craftsmanship points, and promotional discounts</p>
            </div>
          </div>

          {/* Feature Bullets */}
          <div>
            <label className="block font-bold text-slate-700 mb-2 uppercase tracking-wider text-xs">
              Key Craftsmanship Highlights (Bullet points on product card/showcase)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="ml-1 p-0.5 hover:text-rose-600 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
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
                placeholder="e.g. Italian Nappa Leather Upholstery"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 rounded-2xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
              >
                + Add Spec
              </button>
            </div>
          </div>

          {/* Promotional Offer Toggle & Discount */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-extrabold text-slate-800">
                  Feature in "Royal Offers &amp; Discounts" Section
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.isOffer}
                onChange={handleToggleOffer}
                className="w-5 h-5 rounded-md text-emerald-800 focus:ring-emerald-600 cursor-pointer"
              />
            </div>

            {formData.isOffer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-200/60 animate-fadeIn">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={formData.discountPercent}
                    onChange={(e) => handleDiscountPercentChange(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-900 font-mono focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    Calculated Original Strike-Through Price (₹)
                  </label>
                  <input
                    type="number"
                    readOnly
                    value={formData.originalPrice}
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Storefront Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="w-4 h-4 text-emerald-800 rounded-sm focus:ring-emerald-600"
              />
              <span className="text-xs font-bold text-slate-800">Best Seller Badge</span>
            </label>

            <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-4 h-4 text-emerald-800 rounded-sm focus:ring-emerald-600"
              />
              <span className="text-xs font-bold text-slate-800">New Collection Badge</span>
            </label>

            <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-emerald-800 rounded-sm focus:ring-emerald-600"
              />
              <span className="text-xs font-bold text-slate-800">Published / Active</span>
            </label>
          </div>
        </div>

        {/* SECTION 4: FULL ANATOMY, TECHNICAL SPECS & CRAFTSMANSHIP DOSSIER */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-serif">
                  4. Technical Specifications, Anatomy &amp; Dossier
                </h2>
                <p className="text-xs text-slate-400">
                  Customizable max user kg capacity, frame backbone, dimensions &amp; anatomy story
                </p>
              </div>
            </div>

            {/* Master Toggle to show/hide Anatomy Section on Product Page */}
            <label className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl cursor-pointer transition self-start sm:self-auto">
              <input
                type="checkbox"
                checked={formData.showAnatomySection}
                onChange={(e) => setFormData({ ...formData, showAnatomySection: e.target.checked })}
                className="w-4 h-4 text-emerald-800 rounded-sm focus:ring-emerald-600 cursor-pointer"
              />
              <span className="text-xs font-black text-slate-800">
                {formData.showAnatomySection ? 'Anatomy Section: Enabled' : 'Anatomy Section: Hidden'}
              </span>
            </label>
          </div>

          {formData.showAnatomySection && (
            <div className="space-y-6 animate-fadeIn">
              {/* Detailed Anatomy Story & Heading */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-xs">
                    Anatomy Story Main Heading
                  </label>
                  <input
                    type="text"
                    value={formData.anatomyHeading}
                    onChange={(e) => setFormData({ ...formData, anatomyHeading: e.target.value })}
                    placeholder="Product Description"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-xs">
                    Full Product Story &amp; Anatomy Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder={`Conceived with leading spinal orthopedists, every curve is calibrated to distribute lumbar pressure evenly across the spine. Fashioned from solid timber and carbon steel with natural beeswax finishes...`}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden text-xs resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Quick Specification Summary Matrix */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Sparkle className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      Quick Specification Summary (Pre-filled with defaults)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCustomSpec}
                    className="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+ Add Custom Spec</span>
                  </button>
                </div>

                {/* Core Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Max User Capacity (kg/lbs) */}
                  <div>
                    <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                      Max User Capacity (Weight kg / lbs)
                    </label>
                    <input
                      type="text"
                      value={formData.specifications?.maxWeight || ''}
                      onChange={(e) => handleSpecChange('maxWeight', e.target.value)}
                      placeholder="180 kg (396 lbs)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-emerald-950 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Frame Material */}
                  <div>
                    <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                      Frame Backbone Material
                    </label>
                    <input
                      type="text"
                      value={formData.specifications?.frameMaterial || ''}
                      onChange={(e) => handleSpecChange('frameMaterial', e.target.value)}
                      placeholder="Solid English Oak & Carbon Steel"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Foam Density */}
                  <div>
                    <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                      Foam / Cushion Density
                    </label>
                    <input
                      type="text"
                      value={formData.specifications?.foamDensity || ''}
                      onChange={(e) => handleSpecChange('foamDensity', e.target.value)}
                      placeholder="High-Resilience Molded 65kg/m³"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Upholstery */}
                  <div>
                    <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                      Upholstery Material
                    </label>
                    <input
                      type="text"
                      value={formData.specifications?.upholstery || ''}
                      onChange={(e) => handleSpecChange('upholstery', e.target.value)}
                      placeholder="Top-Grain Italian Leather / Velvet"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={formData.specifications?.dimensions || ''}
                      onChange={(e) => handleSpecChange('dimensions', e.target.value)}
                      placeholder="W 66cm x D 64cm x H 115-125cm"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Assembly Requirement */}
                  <div>
                    <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                      Assembly Status
                    </label>
                    <input
                      type="text"
                      value={formData.specifications?.assembly || ''}
                      onChange={(e) => handleSpecChange('assembly', e.target.value)}
                      placeholder="100% Pre-Assembled (Plug & Sit)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Warranty */}
                  <div>
                    <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1">
                      Warranty Coverage
                    </label>
                    <input
                      type="text"
                      value={formData.specifications?.warranty || ''}
                      onChange={(e) => handleSpecChange('warranty', e.target.value)}
                      placeholder="10-Year Master Guarantee"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-emerald-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Dynamic Custom Specs Added by Admin */}
                {formData.customSpecs && formData.customSpecs.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-200/80">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Custom Added Specifications
                    </span>
                    {formData.customSpecs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => handleUpdateCustomSpec(sIdx, 'label', e.target.value)}
                          placeholder="Spec Label (e.g. Recline Angle / RGB)"
                          className="w-1/3 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleUpdateCustomSpec(sIdx, 'value', e.target.value)}
                          placeholder="Value (e.g. 90° - 165° Recline / Chroma Sync)"
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomSpec(sIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Remove Spec"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SAVE & PUBLISH ACTION BAR */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-black shadow-lg shadow-emerald-950/20 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4 text-amber-300" />
            <span>{isSubmitting ? 'Saving to Database...' : productToEdit ? 'Save Changes' : 'Publish Chair'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
