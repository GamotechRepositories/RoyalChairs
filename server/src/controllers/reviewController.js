import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get reviews for a product or category
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const { productId, status = 'approved' } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (productId) {
      query.product = productId;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews.map((r) => ({
        ...r.toObject(),
        id: r._id.toString(),
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching reviews',
      error: error.message,
    });
  }
};

// @desc    Submit a verified customer review
// @route   POST /api/reviews
// @access  Public
export const createReview = async (req, res) => {
  try {
    const { productId, userName, rating, comment, finish, location, avatar } = req.body;

    if (!productId || !userName || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, user name, and comment are required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const review = await Review.create({
      product: product._id,
      productName: product.name,
      userName: userName.trim(),
      rating: Number(rating) || 5,
      comment: comment.trim(),
      finish: finish || 'Artisan Selected Finish',
      location: location || 'India',
      avatar:
        avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'approved',
    });

    // Update product review count and average rating
    const allProductReviews = await Review.find({ product: product._id, status: 'approved' });
    const avgRating =
      allProductReviews.reduce((acc, item) => item.rating + acc, 0) / allProductReviews.length;

    product.reviewCount = allProductReviews.length;
    product.rating = Number(avgRating.toFixed(1));
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your verified review has been posted.',
      data: {
        ...review.toObject(),
        id: review._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to post review',
      error: error.message,
    });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Admin
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};
