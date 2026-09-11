import express from 'express';
import { registerUser, loginUser, getMe, googleLogin } from '../controllers/authController.js';
import { adminLogin, getAdminProfile } from '../controllers/adminAuthController.js';
import { protect, protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin);
router.get('/admin/me', protectAdmin, getAdminProfile);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

export default router;


