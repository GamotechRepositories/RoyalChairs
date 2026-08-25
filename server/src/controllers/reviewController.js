import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get reviews for a product or category or store
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
      data: reviews.map((r) => {
        const obj = r.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          name: obj.userName,
          customer: obj.userName,
          role: obj.userRole,
          product: obj.productName,
        };
      }),
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
    const {
      productId,
      userName,
      name,
      customer,
      rating,
      comment,
      finish,
      role,
      userRole,
      location,
      avatar,
      productName,
      status = 'approved',
    } = req.body;

    const finalName = (userName || name || customer || '').trim();
    const finalComment = (comment || '').trim();

    if (!finalName || !finalComment) {
      return res.status(400).json({
        success: false,
        message: 'Reviewer name and comment are required',
      });
    }

    let productDoc = null;
    let finalProductName = productName || 'Royal Handcrafted Seating';

    if (productId) {
      try {
        productDoc = await Product.findById(productId);
        if (productDoc) {
          finalProductName = productDoc.name;
        }
      } catch {
        // Not a valid ObjectId, keep productName as string
      }
    }

    const review = await Review.create({
      product: productDoc ? productDoc._id : undefined,
      productName: finalProductName,
      userName: finalName,
      userRole: role || userRole || 'Verified Buyer',
      rating: Number(rating) || 5,
      comment: finalComment,
      finish: finish || 'Artisan Selected Finish',
      location: location || 'India',
      avatar:
        avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: status || 'approved',
    });

    // Update product review count and average rating if linked
    if (productDoc) {
      const allProductReviews = await Review.find({ product: productDoc._id, status: 'approved' });
      const avgRating =
        allProductReviews.reduce((acc, item) => item.rating + acc, 0) / (allProductReviews.length || 1);

      productDoc.reviewCount = allProductReviews.length;
      productDoc.rating = Number(avgRating.toFixed(1));
      await productDoc.save();
    }

    const obj = review.toObject();
    res.status(201).json({
      success: true,
      message: 'Verified review has been saved.',
      data: {
        ...obj,
        id: obj._id.toString(),
        name: obj.userName,
        customer: obj.userName,
        role: obj.userRole,
        product: obj.productName,
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

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Admin
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userName,
      name,
      customer,
      role,
      userRole,
      rating,
      comment,
      finish,
      location,
      avatar,
      productName,
      product,
      status,
    } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (userName || name || customer) review.userName = (userName || name || customer).trim();
    if (role || userRole) review.userRole = role || userRole;
    if (rating !== undefined) review.rating = Number(rating);
    if (comment) review.comment = comment.trim();
    if (finish !== undefined) review.finish = finish;
    if (location !== undefined) review.location = location;
    if (avatar !== undefined) review.avatar = avatar;
    if (productName || product) review.productName = productName || product;
    if (status !== undefined) review.status = status;

    await review.save();

    const obj = review.toObject();
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: {
        ...obj,
        id: obj._id.toString(),
        name: obj.userName,
        customer: obj.userName,
        role: obj.userRole,
        product: obj.productName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
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
