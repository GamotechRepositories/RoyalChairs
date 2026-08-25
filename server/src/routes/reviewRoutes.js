import express from 'express';
import { getReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.route('/').get(getReviews).post(createReview);
router.route('/:id').put(updateReview).delete(deleteReview);

export default router;
