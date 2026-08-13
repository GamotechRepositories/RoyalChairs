import User from '../models/User.js';

// Admin Controller for RoyalChairs Express API

export const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const stats = {
      totalRevenue: 128450,
      monthlyGrowth: 18.4,
      totalOrders: 342,
      ordersGrowth: 12.1,
      avgOrderValue: 584,
      catalogCount: 42,
      activeVIPMembers: userCount,
      lowStockAlerts: 6,
      pendingDispatches: 8,
    };
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
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
    return res.status(200).json({ success: true, message: 'Orders retrieved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;
    return res.status(200).json({
      success: true,
      message: `Order #${id} logistics updated to ${status}`,
      data: { id, status, trackingNumber },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
