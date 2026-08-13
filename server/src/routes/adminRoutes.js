import express from 'express';
import {
  getDashboardStats,
  getAdminProducts,
  getAdminOrders,
  updateOrderStatus,
  getAdminUsers,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/products', getAdminProducts);
router.get('/orders', getAdminOrders);
router.get('/users', getAdminUsers);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
