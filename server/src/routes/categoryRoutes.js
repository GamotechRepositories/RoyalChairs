import express from 'express';
import {
  getCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getCategories).post(createCategory);
router
  .route('/:idOrSlug')
  .get(getCategoryByIdOrSlug)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
