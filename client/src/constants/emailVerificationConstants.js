/**
 * Email verification constants
 */

// Verification status values
export const VERIFICATION_STATUS = {
  VERIFYING: 'verifying',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Redirect delay after successful verification (in milliseconds)
export const VERIFICATION_REDIRECT_DELAY = 3000;

// API endpoints
export const EMAIL_VERIFICATION_ENDPOINTS = {
  VERIFY: '/api/auth/verify-email',
  RESEND: '/api/auth/resend-verification'
};