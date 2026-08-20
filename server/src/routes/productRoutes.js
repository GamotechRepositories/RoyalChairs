import express from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').put(updateProduct).delete(deleteProduct);
router.route('/:idOrSlug').get(getProductByIdOrSlug);
router.route('/:id/stock').patch(updateProductStock);

export default router;
