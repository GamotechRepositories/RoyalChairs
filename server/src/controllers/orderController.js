import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Public / Authenticated
export const createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod, paymentStatus } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required',
      });
    }

    const safeCustomer = {
      name: customer?.name || (req.user?.name || 'Valued Client'),
      email: customer?.email || (req.user?.email || 'client@royalchairs.com'),
      phone: customer?.phone || '+91 98765 43210',
      address: customer?.address || 'Royal Villa, Mayfair Estate',
      city: customer?.city || 'London',
      state: customer?.state || 'Greater London',
      pincode: customer?.pincode || 'SW1A 1AA',
    };

    const orderData = {
      user: req.user ? req.user._id : null,
      customer: safeCustomer,
      items,
      totalAmount: Number(totalAmount) || 0,
      paymentMethod: paymentMethod || 'online',
      paymentStatus: paymentStatus || 'paid',
      orderStatus: req.body.orderStatus || 'confirmed',
    };

    if (req.body.orderNumber) {
      orderData.orderNumber = req.body.orderNumber;
    }

    let order;
    if (req.body.orderNumber) {
      order = await Order.findOne({ orderNumber: req.body.orderNumber });
      if (order) {
        Object.assign(order, orderData);
        await order.save();
      }
    }

    if (!order) {
      order = await Order.create(orderData);
    }

    const obj = order.toObject();

    res.status(201).json({
      success: true,
      message: 'Your luxury chair order has been placed successfully!',
      data: {
        ...obj,
        id: obj.orderNumber || obj._id.toString(),
        _id: obj._id.toString(),
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
      const s = status.toLowerCase();
      if (s === 'pending' || s === 'placed') query.orderStatus = { $in: ['placed', 'pending'] };
      else if (s === 'in production' || s === 'confirmed') query.orderStatus = { $in: ['confirmed', 'in production'] };
      else if (s === 'dispatched' || s === 'shipped') query.orderStatus = { $in: ['shipped', 'dispatched'] };
      else if (s === 'delivered') query.orderStatus = 'delivered';
      else if (s === 'cancelled') query.orderStatus = 'cancelled';
      else query.orderStatus = s;
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
      data: orders.map((o) => {
        const obj = o.toObject();
        return {
          ...obj,
          id: obj.orderNumber || obj._id.toString(),
          _id: obj._id.toString(),
          date: obj.createdAt,
          total: obj.totalAmount,
          subtotal: obj.totalAmount,
          discount: 0,
          carrier: 'Royal Express Logistics',
          fulfillmentStatus:
            obj.orderStatus === 'placed' || obj.orderStatus === 'pending'
              ? 'Pending'
              : obj.orderStatus === 'confirmed' || obj.orderStatus === 'in production'
              ? 'In Production'
              : obj.orderStatus === 'shipped' || obj.orderStatus === 'dispatched'
              ? 'Dispatched'
              : obj.orderStatus === 'delivered'
              ? 'Delivered'
              : obj.orderStatus === 'cancelled'
              ? 'Cancelled'
              : 'Pending',
        };
      }),
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

    let order = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      order = await Order.findByIdAndUpdate(id, updates, { new: true });
    }
    if (!order) {
      order = await Order.findOneAndUpdate({ orderNumber: id }, updates, { new: true });
    }

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
        id: order.orderNumber || order._id.toString(),
        _id: order._id.toString(),
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
