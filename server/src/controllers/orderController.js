import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Public / Authenticated
export const createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod, paymentStatus } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer information and order items are required',
      });
    }

    // Deduct stock from products
    for (const item of items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -Math.max(1, Number(item.quantity) || 1) },
        });
      }
    }

    const order = await Order.create({
      user: req.user ? req.user._id : null,
      customer,
      items,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentStatus || 'pending',
      orderStatus: 'placed',
    });

    res.status(201).json({
      success: true,
      message: 'Your luxury chair order has been placed successfully!',
      data: {
        ...order.toObject(),
        id: order._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message,
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
export const getOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status.toLowerCase();
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: regex },
        { 'customer.name': regex },
        { 'customer.email': regex },
        { 'customer.phone': regex },
        { trackingNumber: regex },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders.map((o) => ({
        ...o.toObject(),
        id: o._id.toString(),
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching orders',
      error: error.message,
    });
  }
};

// @desc    Track single order by orderNumber or trackingNumber
// @route   GET /api/orders/track/:orderOrTrackId
// @access  Public
export const trackOrder = async (req, res) => {
  try {
    const { orderOrTrackId } = req.params;
    const cleanId = orderOrTrackId.trim();

    const order = await Order.findOne({
      $or: [
        { orderNumber: new RegExp(`^${cleanId}$`, 'i') },
        { trackingNumber: new RegExp(`^${cleanId}$`, 'i') },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No active shipment found with reference "${orderOrTrackId}". Please verify your Order or Tracking ID.`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...order.toObject(),
        id: order._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error looking up tracking details',
      error: error.message,
    });
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    const updates = {};
    if (orderStatus) updates.orderStatus = orderStatus.toLowerCase();
    if (paymentStatus) updates.paymentStatus = paymentStatus.toLowerCase();
    if (trackingNumber) updates.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(id, updates, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: {
        ...order.toObject(),
        id: order._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};
