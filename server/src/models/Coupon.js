import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please enter a voucher/promo code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    value: {
      type: Number,
      required: [true, 'Please enter discount value (percentage or fixed amount)'],
      min: [0, 'Discount value cannot be negative'],
    },
    minSpend: {
      type: Number,
      default: 0,
      min: [0, 'Minimum spend cannot be negative'],
    },
    maxDiscount: {
      type: Number,
      default: null, // null means no cap or fixed discount
      min: [0, 'Maximum discount cap cannot be negative'],
    },
    limit: {
      type: Number,
      default: 1000,
      min: [1, 'Redemption limit must be at least 1'],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiry: {
      type: String,
      default: '2026-12-31',
    },
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
