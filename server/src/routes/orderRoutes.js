import express from 'express';
import {
  createOrder,
  getOrders,
  trackOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/').get(getOrders).post(createOrder);
router.route('/track/:orderOrTrackId').get(trackOrder);
router.route('/:id/status').patch(updateOrderStatus);

export default router;
