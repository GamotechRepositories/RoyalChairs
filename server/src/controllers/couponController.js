import Coupon from '../models/Coupon.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Public / Admin
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    const now = new Date();

    // Check and auto-disable any coupons that have expired or exceeded redemptions
    const updatedCoupons = await Promise.all(
      coupons.map(async (coupon) => {
        let shouldDisable = false;

        // Check if expiry date has passed
        if (coupon.expiry) {
          const expiryDate = new Date(coupon.expiry);
          if (!isNaN(expiryDate.getTime())) {
            expiryDate.setHours(23, 59, 59, 999);
            if (now > expiryDate) {
              shouldDisable = true;
            }
          }
        }

        // Check if redemption limit has been reached
        if (coupon.limit && Number(coupon.limit) > 0 && coupon.usageCount >= coupon.limit) {
          shouldDisable = true;
        }

        if (shouldDisable && coupon.active) {
          coupon.active = false;
          await coupon.save();
        }

        return coupon;
      })
    );

    return res.status(200).json({
      success: true,
      count: updatedCoupons.length,
      data: updatedCoupons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching coupons',
    });
  }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Admin
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type = 'percentage',
      value,
      minSpend = 0,
      maxDiscount = null,
      limit = 1000,
      expiry = '2026-12-31',
      active = true,
      description = '',
    } = req.body;

    if (!code || value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and discount value are required',
      });
    }

    const cleanCode = code.toUpperCase().trim();

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Voucher code '${cleanCode}' already exists`,
      });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      type,
      value: Number(value),
      minSpend: Number(minSpend) || 0,
      maxDiscount: maxDiscount !== null && maxDiscount !== '' && Number(maxDiscount) > 0 ? Number(maxDiscount) : null,
      limit: Number(limit) || 1000,
      expiry: String(expiry),
      active: Boolean(active),
      description: description || '',
    });

    return res.status(201).json({
      success: true,
      message: `Voucher ${coupon.code} created successfully`,
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating coupon',
    });
  }
};

// @desc    Toggle coupon active status
// @route   PATCH /api/coupons/:id/toggle
// @access  Admin
export const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon voucher not found',
      });
    }

    coupon.active = !coupon.active;
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} is now ${coupon.active ? 'Active' : 'Disabled (Invalid)'}`,
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating coupon status',
    });
  }
};

// @desc    Update coupon details
// @route   PUT /api/coupons/:id
// @access  Admin
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
    }
    if (updateData.minSpend !== undefined) {
      updateData.minSpend = Number(updateData.minSpend) || 0;
    }
    if (updateData.maxDiscount !== undefined) {
      updateData.maxDiscount =
        updateData.maxDiscount !== null && updateData.maxDiscount !== '' && Number(updateData.maxDiscount) > 0
          ? Number(updateData.maxDiscount)
          : null;
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon voucher not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} updated successfully`,
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating coupon',
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon voucher not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting coupon',
    });
  }
};

// @desc    Validate coupon and calculate discount with minSpend & maxDiscount
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal = 0 } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a voucher code',
      });
    }

    const cleanCode = code.toUpperCase().trim();
    const currentTotal = Number(cartTotal) || 0;

    const coupon = await Coupon.findOne({ code: cleanCode });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Voucher '${cleanCode}' is invalid. Please check and try again.`,
      });
    }

    const now = new Date();
    let isExpired = false;
    let isExhausted = false;

    // Check expiration date
    if (coupon.expiry) {
      const expiryDate = new Date(coupon.expiry);
      if (!isNaN(expiryDate.getTime())) {
        expiryDate.setHours(23, 59, 59, 999);
        if (now > expiryDate) {
          isExpired = true;
        }
      }
    }

    // Check redemption limit
    if (coupon.limit && Number(coupon.limit) > 0 && coupon.usageCount >= coupon.limit) {
      isExhausted = true;
    }

    // Auto-disable in database if expired or exhausted
    if ((isExpired || isExhausted) && coupon.active) {
      coupon.active = false;
      await coupon.save();
    }

    // If disabled, expired, or exhausted, return invalid message
    if (!coupon.active || isExpired || isExhausted) {
      return res.status(400).json({
        success: false,
        message: `Voucher '${cleanCode}' is invalid or expired.`,
      });
    }

    // Check Minimum Spend Requirement
    const minSpend = Number(coupon.minSpend) || 0;
    if (minSpend > 0 && currentTotal < minSpend) {
      const shortage = minSpend - currentTotal;
      return res.status(400).json({
        success: false,
        message: `Minimum order of ₹${minSpend.toLocaleString()} required for voucher '${cleanCode}'. Add ₹${shortage.toLocaleString()} more to your cart to unlock this discount.`,
        minSpend,
        currentTotal,
        shortage,
      });
    }

    // Calculate Discount Amount
    let discountAmount = 0;
    let isCapped = false;

    if (coupon.type === 'percentage') {
      const rawDiscount = (currentTotal * coupon.value) / 100;
      if (coupon.maxDiscount && coupon.maxDiscount > 0 && rawDiscount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
        isCapped = true;
      } else {
        discountAmount = rawDiscount;
      }
    } else {
      // Fixed discount
      discountAmount = Math.min(coupon.value, currentTotal);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalTotal = Math.max(0, Math.round((currentTotal - discountAmount) * 100) / 100);

    return res.status(200).json({
      success: true,
      message: `Voucher '${coupon.code}' applied! Saved ₹${discountAmount.toLocaleString()}`,
      data: {
        id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minSpend: coupon.minSpend || 0,
        maxDiscount: coupon.maxDiscount || null,
        isCapped,
        discountAmount,
        originalTotal: currentTotal,
        finalTotal,
        expiry: coupon.expiry,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('Validate Coupon Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error validating coupon',
    });
  }
};
