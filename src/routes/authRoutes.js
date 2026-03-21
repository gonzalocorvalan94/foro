import express from 'express';
import { register, login, getMe, getSecurityQuestion, resetPassword } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password/question', getSecurityQuestion);
router.post('/forgot-password/reset', resetPassword);
export default router;