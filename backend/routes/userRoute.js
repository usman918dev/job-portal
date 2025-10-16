import express from 'express';
import { signup, signin, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword, verifyResetToken, updateNotificationPreferences } from '../controllers/authController.js';
import { updateUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Signup route (for all users including admins)
router.post('/signup', signup);

// Signin route (for all users including admins)
router.post('/signin', signin);

// Email verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-token', verifyResetToken);

// Notification preferences route
router.put('/notification-preferences', updateNotificationPreferences);

// User profile update route (authenticated users can update their own profile)
router.put('/profile/:id', verifyToken, updateUser);

export default router;
