import express from 'express';
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController.js';

const router = express.Router();

router.get('/', getCoupons);
router.post('/', createCoupon);
router.post('/validate', validateCoupon);
router.patch('/:id/toggle', toggleCouponStatus);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
