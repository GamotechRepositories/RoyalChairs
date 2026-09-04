import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, 'Banner image is required'],
    },
    link: {
      type: String,
      default: '#shop-by-category',
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: 'SHOP NOW',
    },
    categorySlug: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['hero', 'new_collection', 'spotlight', 'instagram'],
      default: 'hero',
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
