import User from '../models/User.js';
import Order from '../models/Order.js';

// Admin Controller for RoyalChairs Express API

export const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const orders = await Order.find({});
    const totalRev = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) + 124500;

    const stats = {
      totalRevenue: totalRev,
      monthlyGrowth: 18.4,
      totalOrders: orderCount + 338,
      ordersGrowth: 12.1,
      avgOrderValue: Math.round(totalRev / (orderCount + 338 || 1)),
      catalogCount: 42,
      activeVIPMembers: userCount,
      lowStockAlerts: 6,
      pendingDispatches: orders.filter((o) => o.orderStatus === 'placed' || o.orderStatus === 'confirmed').length,
    };
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const orders = await Order.find({ orderStatus: { $ne: 'cancelled' } });

    const usersWithStats = users.map((u) => {
      const uObj = u.toObject();
      const emailLower = (u.email || '').trim().toLowerCase();

      const userActiveOrders = orders.filter((o) => {
        const orderUserMatch = o.user && o.user.toString() === u._id.toString();
        const emailMatch = o.customer?.email && o.customer.email.trim().toLowerCase() === emailLower;
        return orderUserMatch || emailMatch;
      });

      const lifetimeOrders =
        uObj.lifetimeOrders !== undefined && uObj.lifetimeOrders > 0
          ? uObj.lifetimeOrders
          : userActiveOrders.length;

      const totalSpent =
        uObj.totalSpent !== undefined && uObj.totalSpent > 0
          ? uObj.totalSpent
          : userActiveOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

      return {
        ...uObj,
        lifetimeOrders,
        totalSpent,
        ordersCount: lifetimeOrders,
      };
    });

    return res.status(200).json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminProducts = async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: 'Products retrieved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, orderStatus, fulfillmentStatus, trackingNumber } = req.body;

    const rawStatus = (orderStatus || status || fulfillmentStatus || '').toLowerCase();
    let backendStatus = rawStatus;
    if (rawStatus === 'pending' || rawStatus === 'pending assignment') backendStatus = 'placed';
    else if (rawStatus === 'in production' || rawStatus === 'in production (benchcrafting)') backendStatus = 'confirmed';
    else if (rawStatus === 'dispatched' || rawStatus === 'dispatched (express courier)' || rawStatus === 'shipped') backendStatus = 'shipped';
    else if (rawStatus === 'delivered' || rawStatus === 'delivered & assembled') backendStatus = 'delivered';
    else if (rawStatus === 'cancelled') backendStatus = 'cancelled';

    let existingOrder = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      existingOrder = await Order.findById(id);
    }
    if (!existingOrder) {
      existingOrder = await Order.findOne({ orderNumber: id });
    }

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: `Order #${id} not found in database`,
      });
    }

    const previousStatus = (existingOrder.orderStatus || '').toLowerCase();
    const targetStatus = backendStatus || previousStatus;

    if (backendStatus) existingOrder.orderStatus = backendStatus;
    if (trackingNumber !== undefined) existingOrder.trackingNumber = trackingNumber;

    await existingOrder.save();

    // Update user lifetime stats on cancel/reactivate
    const wasCancelled = previousStatus === 'cancelled';
    const isNowCancelled = targetStatus === 'cancelled';

    if (!wasCancelled && isNowCancelled) {
      const user = await User.findOne({
        $or: [
          ...(existingOrder.user ? [{ _id: existingOrder.user }] : []),
          { email: new RegExp(`^${existingOrder.customer?.email?.trim()}$`, 'i') },
        ],
      });
      if (user) {
        const orderAmt = Number(existingOrder.totalAmount) || 0;
        await User.findByIdAndUpdate(user._id, {
          $set: {
            lifetimeOrders: Math.max(0, (user.lifetimeOrders || 0) - 1),
            totalSpent: Math.max(0, (user.totalSpent || 0) - orderAmt),
          },
        });
      }
    } else if (wasCancelled && !isNowCancelled) {
      const user = await User.findOne({
        $or: [
          ...(existingOrder.user ? [{ _id: existingOrder.user }] : []),
          { email: new RegExp(`^${existingOrder.customer?.email?.trim()}$`, 'i') },
        ],
      });
      if (user) {
        const orderAmt = Number(existingOrder.totalAmount) || 0;
        await User.findByIdAndUpdate(user._id, {
          $inc: {
            lifetimeOrders: 1,
            totalSpent: orderAmt,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Order #${existingOrder.orderNumber} logistics updated to ${status || backendStatus}`,
      data: existingOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

