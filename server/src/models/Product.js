import mongoose from 'mongoose';

const colorFinishSchema = new mongoose.Schema(
  {
    hex: {
      type: String,
      required: true,
      default: '#2E6B4D',
    },
    name: {
      type: String,
      required: true,
      default: 'British Racing Green',
    },
    image: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const variantItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    colorHex: {
      type: String,
      default: '#2E6B4D',
    },
    colorName: {
      type: String,
      default: 'British Racing Green',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price;
      },
    },
    stock: {
      type: Number,
      default: 15,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    mainImage: {
      type: String,
      default: '',
    },
    hoverImage: {
      type: String,
      default: '',
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    sku: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    sku: {
      type: String,
      trim: true,
      default: function () {
        return `RC-${Date.now().toString().slice(-4)}`;
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },
    categorySlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subCategory: {
      type: String,
      default: 'All',
      trim: true,
    },
    variantType: {
      type: String,
      enum: ['single', 'multi'],
      default: 'single',
    },
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variants: {
      type: [variantItemSchema],
      default: [],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price;
      },
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      required: true,
      default: 15,
      min: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    fullDescription: {
      type: String,
      default: '',
      trim: true,
    },
    features: {
      type: [String],
      default: ['Dynamic Lumbar Support', 'Solid Timber Frame', '10-Year Master Warranty'],
    },
    specifications: {
      frameMaterial: { type: String, default: 'Solid English Oak & Carbon Steel' },
      foamDensity: { type: String, default: 'High-Resilience Molded 65kg/m³' },
      upholstery: { type: String, default: 'Top-Grain Italian Leather / Velvet' },
      dimensions: { type: String, default: 'W 66cm x D 64cm x H 115-125cm' },
      maxWeight: { type: String, default: '180 kg (396 lbs)' },
      assembly: { type: String, default: '100% Pre-Assembled (Plug & Sit)' },
      warranty: { type: String, default: '10-Year Master Guarantee' },
    },
    customSpecs: [
      {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
    ],
    showAnatomySection: {
      type: Boolean,
      default: true,
    },
    anatomyHeading: {
      type: String,
      default: 'Built for Generations of Unmatched Comfort',
    },
    showPillarsSection: {
      type: Boolean,
      default: true,
    },
    customPillars: [
      {
        title: { type: String, default: '' },
        desc: { type: String, default: '' },
        icon: { type: String, default: 'Armchair' },
      },
    ],
    showCareGuide: {
      type: Boolean,
      default: true,
    },
    careInstructions: {
      type: String,
      default: '',
    },
    colors: {
      type: [colorFinishSchema],
      default: [
        { hex: '#2E6B4D', name: 'British Racing Green', image: '' },
        { hex: '#2B2D42', name: 'Royal Midnight Navy', image: '' },
      ],
    },
    mainImage: {
      type: String,
      required: [true, 'Main product image is required'],
    },
    hoverImage: {
      type: String,
      default: '',
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    isOffer: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto slug generation hook if slug not provided
productSchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      Date.now().toString().slice(-4);
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
