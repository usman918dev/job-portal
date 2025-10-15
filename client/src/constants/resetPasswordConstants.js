/**
 * Password reset constants and configuration
 */

// Reset status values
export const RESET_STATUS = {
  VERIFYING: 'verifying',
  VALID: 'valid',
  INVALID: 'invalid',
  SUCCESS: 'success'
};

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 6,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: false,
  REQUIRE_LOWERCASE: false,
  REQUIRE_NUMBERS: false,
  REQUIRE_SPECIAL_CHARS: false
};

// Redirect delay after successful password reset (in milliseconds)
export const RESET_REDIRECT_DELAY = 3000;

// Form field configurations
export const RESET_FORM_FIELDS = {
  newPassword: {
    name: 'newPassword',
    label: 'New Password',
    type: 'password',
    placeholder: 'Enter new password',
    required: true
  },
  confirmPassword: {
    name: 'confirmPassword',
    label: 'Confirm New Password',
    type: 'password',
    placeholder: 'Confirm new password',
    required: true
  }
};

// Validation error messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Please fill in all fields',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_TOKEN: 'Invalid or expired reset token',
  RESET_FAILED: 'Failed to reset password'
};

// Animation variants for framer-motion
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  },
  headerIcon: {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 }
    }
  },
  content: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  },
  loadingSpinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  },
  buttonSpinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
};