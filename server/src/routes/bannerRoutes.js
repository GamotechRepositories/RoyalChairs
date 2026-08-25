import express from 'express';
import { getBanners, saveBanners, deleteBanner } from '../controllers/bannerController.js';

const router = express.Router();

router.route('/').get(getBanners).post(saveBanners);
router.route('/:id').delete(deleteBanner);

export default router;
