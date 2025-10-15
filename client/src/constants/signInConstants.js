/**
 * Sign in constants and configuration
 */

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: true,
    PATTERN: /\S+@\S+\.\S+/,
    MIN_LENGTH: 1
  },
  PASSWORD: {
    REQUIRED: true,
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  }
};

// Error messages
export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  GENERIC_ERROR: 'An error occurred. Please try again.'
};

// Form field configurations
export const FORM_FIELDS = {
  email: {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email address',
    icon: 'Mail',
    required: true
  },
  password: {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    icon: 'Lock',
    required: true
  }
};

// Role configurations
export const ROLE_CONFIG = {
  [USER_ROLES.USER]: {
    label: 'User',
    icon: 'User',
    route: '/'
  },
  [USER_ROLES.ADMIN]: {
    label: 'Admin',
    icon: 'Shield',
    route: '/admin'
  }
};

// Animation variants for framer-motion
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, type: "spring", damping: 20 }
    }
  },
  form: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  backButton: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  glowEffect: {
    animate: {
      scale: [1, 1.02, 1],
    },
    transition: { duration: 3, repeat: Infinity }
  },
  buttonArrow: {
    initial: { x: 0 },
    whileHover: { x: 4 },
    transition: { type: "spring", stiffness: 400, damping: 30 }
  },
  loadingSpinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
};

// Default form state
export const DEFAULT_FORM_STATE = {
  email: '',
  password: '',
  role: USER_ROLES.USER
};