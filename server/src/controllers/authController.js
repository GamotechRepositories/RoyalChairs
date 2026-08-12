import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const getOAuthClient = () => {
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
};

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'royalchairs_secret_key', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to RoyalChairs.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password',
      });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during authentication',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

// @desc    Authenticate/Register user via Google OAuth Token
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential / ID token is required',
      });
    }

    const client = getOAuthClient();

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token payload',
      });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google account does not provide an email address',
      });
    }

    // Check if user already exists by email or googleId
    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { googleId }],
    });

    if (user) {
      let isUpdated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        isUpdated = true;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
        isUpdated = true;
      }
      if (isUpdated) {
        await user.save();
      }
    } else {
      // Create new user for Google Sign-In
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId,
        avatar: picture || '',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `Welcome to RoyalChairs, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google Auth Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Google authentication failed',
    });
  }
};

