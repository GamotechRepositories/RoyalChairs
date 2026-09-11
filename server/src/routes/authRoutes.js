import express from 'express';
import { registerUser, loginUser, getMe, googleLogin } from '../controllers/authController.js';
import { adminLogin } from '../controllers/adminAuthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

export default router;


