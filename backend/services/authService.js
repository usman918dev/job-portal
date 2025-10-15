import User from '../models/User.js';
import { createUser } from './userService.js';
import { comparePassword } from '../utils/passwordUtils.js';
import { generateAuthToken } from '../utils/authUtils.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetConfirmationEmail } from '../services/emailService.js';

export const signupUser = async (userData) => {
  const { name, email, password, role, companyName } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Validate companyName for admin/recruiter roles
  const adminRoles = ['admin', 'Admin', 'Recruiter'];
  if (adminRoles.includes(role) && !companyName) {
    throw new Error('Company name is required for admin/recruiter accounts');
  }

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create new user
  const newUserData = {
    name,
    email,
    password,
    role: role || 'user',
    emailVerificationToken,
    emailVerificationExpiry,
    isEmailVerified: false
  };

  // Add companyName if provided
  if (companyName) {
    newUserData.companyName = companyName;
  }

  const user = await createUser(newUserData);

  // Send verification email
  try {
    await sendVerificationEmail(email, emailVerificationToken, name);
    console.log('Verification email sent to:', email);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    // Don't fail registration if email fails
  }

  // Generate JWT token
  const token = generateAuthToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      isEmailVerified: user.isEmailVerified
    },
    token
  };
};

export const signinUser = async (email, password) => {
  // Check if user exists and get password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Check if user is suspended
  if (!user.isActive || user.status === 'Suspended') {
    throw new Error('Your account has been suspended. Please contact support.');
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
  }

  // Generate JWT token
  const token = generateAuthToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      isEmailVerified: user.isEmailVerified
    },
    token
  };
};

export const verifyEmail = async (token, email) => {
  // Find user with matching token and email
  const user = await User.findOne({
    email: email,
    emailVerificationToken: token,
    emailVerificationExpiry: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Invalid or expired verification token');
  }

  // Verify the user
  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpiry = null;
  await user.save();

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.name);
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
  };
};

export const resendVerificationEmail = async (email) => {
  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.isEmailVerified) {
    throw new Error('Email is already verified');
  }

  // Generate new verification token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  user.emailVerificationToken = emailVerificationToken;
  user.emailVerificationExpiry = emailVerificationExpiry;
  await user.save();

  // Send verification email
  await sendVerificationEmail(user.email, emailVerificationToken, user.name);
};

export const forgotPassword = async (email) => {
  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if user exists or not for security
    return;
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();

  // Send password reset email
  try {
    await sendPasswordResetEmail(user.email, resetToken, user.name);
    console.log('Password reset email sent to:', user.email);
  } catch (emailError) {
    console.error('Failed to send password reset email:', emailError);
    // Reset the token if email fails
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    throw new Error('Failed to send password reset email');
  }
};

export const resetPassword = async (token, newPassword) => {
  // Find user with valid reset token
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  // Update password and clear reset token
  user.password = newPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  // Send password reset confirmation email
  try {
    await sendPasswordResetConfirmationEmail(user.email, user.name);
  } catch (emailError) {
    console.error('Failed to send password reset confirmation email:', emailError);
  }
};

export const verifyResetToken = async (token) => {
  // Find user with valid reset token
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  return {
    email: user.email
  };
};

export const updateNotificationPreferences = async (email, notifications) => {
  // Find and update user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  // Update notification preferences
  user.notifications = {
    ...user.notifications,
    ...notifications
  };

  await user.save();

  return {
    notifications: user.notifications
  };
};

/**
 * Verify JWT token and get user
 * @param {String} token - JWT token
 * @returns {Object} - User object
 */
export const verifyUserToken = async (token) => {
  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

  // Get user from token
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new Error('User not found. Authorization denied.');
  }

  // Check if user is active
  if (!user.isActive || user.status === 'Suspended') {
    throw new Error('Your account has been suspended. Please contact support.');
  }

  return user;
};