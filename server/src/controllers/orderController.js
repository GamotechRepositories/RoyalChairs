import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Public / Authenticated
export const createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod, paymentStatus, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required',
      });
    }

    // Increment coupon usage count if coupon was applied
    if (couponCode) {
      try {
        await Coupon.findOneAndUpdate(
          { code: String(couponCode).toUpperCase().trim() },
          { $inc: { usageCount: 1 } }
        );
      } catch (err) {
        console.warn('Coupon usage increment note:', err.message);
      }
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

    const calculatedSubtotal =
      Number(req.body.subtotal) ||
      items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

    const orderData = {
      user: req.user ? req.user._id : null,
      customer: safeCustomer,
      items,
      subtotal: calculatedSubtotal,
      couponCode: couponCode ? String(couponCode).toUpperCase().trim() : null,
      discountAmount: Number(req.body.discountAmount) || 0,
      deliveryFee: Number(req.body.deliveryFee) || 0,
      totalAmount: Number(totalAmount) || Math.max(0, calculatedSubtotal - (Number(req.body.discountAmount) || 0)),
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

// @desc    Get all orders (Admin / Client)
// @route   GET /api/orders
// @access  Public / Admin
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
        const rawStatus = (obj.orderStatus || 'confirmed').toLowerCase();
        let displayFulfillment = 'Pending';
        if (rawStatus === 'in production' || rawStatus === 'confirmed') displayFulfillment = 'In Production';
        else if (rawStatus === 'dispatched' || rawStatus === 'shipped') displayFulfillment = 'Dispatched';
        else if (rawStatus === 'delivered') displayFulfillment = 'Delivered';
        else if (rawStatus === 'cancelled') displayFulfillment = 'Cancelled';
        else displayFulfillment = 'Pending';

        const total = Number(obj.totalAmount) || 0;
        const subtotal = Number(obj.subtotal) > 0 ? Number(obj.subtotal) : total;
        const discountAmount = Number(obj.discountAmount) || 0;

        return {
          ...obj,
          id: obj.orderNumber || obj._id.toString(),
          _id: obj._id.toString(),
          date: obj.createdAt,
          total,
          totalAmount: total,
          subtotal,
          discount: discountAmount,
          discountAmount,
          couponCode: obj.couponCode || null,
          carrier: obj.carrier || 'Royal Express Logistics',
          trackingNumber: obj.trackingNumber || `TRK-${obj._id.toString().slice(-8).toUpperCase()}`,
          fulfillmentStatus: displayFulfillment,
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
        { orderNumber: new RegExp(cleanId, 'i') },
        { trackingNumber: new RegExp(cleanId, 'i') },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No active shipment found with reference "${orderOrTrackId}". Please verify your Order or Tracking ID.`,
      });
    }

    const obj = order.toObject();
    const rawStatus = (obj.orderStatus || 'confirmed').toLowerCase();
    
    let displayStatus = 'In Production (Benchcrafting)';
    let fulfillmentStatus = 'In Production';
    if (rawStatus === 'placed' || rawStatus === 'pending') {
      displayStatus = 'Pending Assignment';
      fulfillmentStatus = 'Pending';
    } else if (rawStatus === 'confirmed' || rawStatus === 'in production') {
      displayStatus = 'In Production (Benchcrafting)';
      fulfillmentStatus = 'In Production';
    } else if (rawStatus === 'shipped' || rawStatus === 'dispatched') {
      displayStatus = 'Dispatched (Express Courier)';
      fulfillmentStatus = 'Dispatched';
    } else if (rawStatus === 'delivered') {
      displayStatus = 'Delivered & Assembled';
      fulfillmentStatus = 'Delivered';
    } else if (rawStatus === 'cancelled') {
      displayStatus = 'Order Cancelled';
      fulfillmentStatus = 'Cancelled';
    }

    const placedDateStr = new Date(obj.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const isPending = fulfillmentStatus === 'Pending';
    const isProduction = fulfillmentStatus === 'In Production';
    const isDispatched = fulfillmentStatus === 'Dispatched';
    const isDelivered = fulfillmentStatus === 'Delivered';
    const isCancelled = fulfillmentStatus === 'Cancelled';

    const steps = [
      {
        title: 'Order Placed & Verified',
        description: 'Your bespoke order was received and payment was confirmed.',
        date: placedDateStr,
        completed: !isCancelled,
        current: isPending,
      },
      {
        title: 'Artisan Benchcrafting & Quality Check',
        description: 'Handcrafted by master woodworkers with ergonomic certification.',
        date: isPending ? 'Pending Workshop Allocation' : 'Benchcrafting in Progress',
        completed: isProduction || isDispatched || isDelivered,
        current: isProduction,
      },
      {
        title: `Dispatched via Royal Express (${obj.trackingNumber || 'TRK-EXP'})`,
        description: 'Package secured in protective white-glove transit packaging.',
        date: isDispatched || isDelivered ? 'Dispatched from Central Logistics Hub' : 'Awaiting Courier Handover',
        completed: isDispatched || isDelivered,
        current: isDispatched,
      },
      {
        title: 'Doorstep White-Glove Delivery & Assembly',
        description: 'Carefully delivered and assembled in your designated room.',
        date: isDelivered ? 'Delivered & Completed' : 'Estimated within 3-5 business days',
        completed: isDelivered,
        current: isDelivered,
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        ...obj,
        id: obj.orderNumber || obj._id.toString(),
        _id: obj._id.toString(),
        fulfillmentStatus,
        displayStatus,
        carrier: obj.carrier || 'Royal Express Logistics',
        trackingNumber: obj.trackingNumber || `TRK-${obj._id.toString().slice(-8).toUpperCase()}`,
        steps,
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
    const { orderStatus, status, fulfillmentStatus, paymentStatus, trackingNumber } = req.body;

    const rawStatus = (orderStatus || status || fulfillmentStatus || '').toLowerCase();
    let backendStatus = rawStatus;
    if (rawStatus === 'pending' || rawStatus === 'pending assignment') backendStatus = 'placed';
    else if (rawStatus === 'in production' || rawStatus === 'in production (benchcrafting)') backendStatus = 'confirmed';
    else if (rawStatus === 'dispatched' || rawStatus === 'dispatched (express courier)' || rawStatus === 'shipped') backendStatus = 'shipped';
    else if (rawStatus === 'delivered' || rawStatus === 'delivered & assembled') backendStatus = 'delivered';
    else if (rawStatus === 'cancelled') backendStatus = 'cancelled';

    const updates = {};
    if (backendStatus) updates.orderStatus = backendStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus.toLowerCase();
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;

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
      message: 'Order status updated successfully',
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
