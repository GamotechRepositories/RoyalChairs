import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

// Helper function to generate Admin JWT Token
const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      isAdmin: true,
    },
    process.env.JWT_SECRET || 'royalchairs_secret_key',
    {
      expiresIn: '7d',
    }
  );
};

// @desc    Admin Login Authentication
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both administrator email and password',
      });
    }

    // 1. Find in Admin collection (including password hash)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (admin) {
      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password. Please check your credentials.',
        });
      }

      admin.lastLogin = new Date();
      await admin.save({ validateBeforeSave: false });

      const token = generateAdminToken(admin);

      return res.status(200).json({
        success: true,
        message: `Welcome back, ${admin.name}!`,
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role === 'superadmin' ? 'Super Administrator' : 'Administrator',
          avatar: admin.avatar,
          lastLogin: admin.lastLogin,
        },
      });
    }

    // 2. Fallback: Find in User collection (if admin role)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (user && user.role === 'admin') {
      const isUserMatch = await user.matchPassword(password);
      if (!isUserMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password. Please check your credentials.',
        });
      }

      const token = generateAdminToken(user);

      return res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'Administrator',
          avatar: user.avatar,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid admin credentials. Account not found.',
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during admin authentication',
    });
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/admin/me
// @access  Private (Admin)
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role === 'superadmin' ? 'Super Administrator' : 'Administrator',
        avatar: admin.avatar,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving admin profile',
    });
  }
};
