import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

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

    // Find admin user in database (including password hash)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials. Account not found.',
      });
    }

    // Verify password against bcrypt hash in database
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.',
      });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    // Generate JWT token
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
