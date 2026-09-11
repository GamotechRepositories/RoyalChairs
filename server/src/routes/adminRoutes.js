import express from 'express';
import {
  getDashboardStats,
  getAdminProducts,
  getAdminOrders,
  updateOrderStatus,
  getAdminUsers,
} from '../controllers/adminController.js';
import { adminLogin, getAdminProfile } from '../controllers/adminAuthController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Authentication Routes
router.post('/login', adminLogin);
router.get('/me', protectAdmin, getAdminProfile);

// Admin Dashboard & Management Routes
router.get('/stats', getDashboardStats);
router.get('/products', getAdminProducts);
router.get('/orders', getAdminOrders);
router.get('/users', getAdminUsers);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;

