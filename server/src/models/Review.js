import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    productName: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
    },
    userRole: {
      type: String,
      default: 'Verified Buyer',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment cannot be empty'],
      trim: true,
    },
    finish: {
      type: String,
      default: 'Artisan Selected Finish',
    },
    location: {
      type: String,
      default: 'India',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
