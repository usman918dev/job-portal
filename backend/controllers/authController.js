import { validationResult } from 'express-validator';
import {
  signupUser,
  signinUser,
  verifyEmail as verifyEmailService,
  resendVerificationEmail as resendVerificationEmailService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  verifyResetToken as verifyResetTokenService,
  updateNotificationPreferences as updateNotificationPreferencesService
} from '../services/authService.js';

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, role, companyName } = req.body;

    const result = await signupUser({ name, email, password, role, companyName });

    res.status(201).json({
      success: true,
      message: 'User registered successfully! Please check your email to verify your account.',
      data: result
    });

  } catch (error) {
    console.error('Signup error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    // Handle custom errors
    if (error.message === 'User with this email already exists' || error.message === 'Company name is required for admin/recruiter accounts') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
export const signin = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const result = await signinUser(email, password);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: result
    });

  } catch (error) {
    console.error('Signin error:', error);

    // Handle specific error messages
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'Your account has been suspended. Please contact support.') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'Please verify your email address before signing in. Check your inbox for the verification link.') {
      return res.status(401).json({
        success: false,
        message: error.message,
        emailVerificationRequired: true,
        email: email
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: 'Token and email are required'
      });
    }

    const result = await verifyEmailService(token, email);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to Jobly!',
      data: result
    });

  } catch (error) {
    console.error('Email verification error:', error);

    if (error.message === 'Invalid or expired verification token') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    await resendVerificationEmailService(email);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully! Please check your inbox.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'Email is already verified') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    await forgotPasswordService(email);

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);

    if (error.message === 'Failed to send password reset email') {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    await resetPasswordService(token, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);

    if (error.message === 'Invalid or expired reset token') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Verify reset token
// @route   POST /api/auth/verify-reset-token
// @access  Public
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const result = await verifyResetTokenService(token);

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: result
    });

  } catch (error) {
    console.error('Verify reset token error:', error);

    if (error.message === 'Invalid or expired reset token') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/auth/notification-preferences
// @access  Private
export const updateNotificationPreferences = async (req, res) => {
  try {
    const { email, notifications } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    if (!notifications || typeof notifications !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Valid notifications object is required'
      });
    }

    const result = await updateNotificationPreferencesService(email, notifications);

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: result
    });

  } catch (error) {
    console.error('Update notification preferences error:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences',
      error: error.message
    });
  }
};

