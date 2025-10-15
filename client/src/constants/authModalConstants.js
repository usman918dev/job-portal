// Auth Modal Constants
export const MODAL_STATES = {
  SIGN_UP: "Sign Up",
  LOGIN: "Login",
  EMAIL_VERIFICATION: "EmailVerification",
  FORGOT_PASSWORD: "ForgotPassword"
};

export const ANIMATION_VARIANTS = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  },
  modal: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 350, damping: 25 }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  },
  closeButton: {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  }
};

export const MODAL_CONFIG = {
  DEFAULT_INITIAL_MODE: MODAL_STATES.SIGN_UP,
  CAN_CLOSE_DEFAULT: true,
  ESCAPE_KEY: 'Escape',
  MAX_HEIGHT: 'max-h-[95vh]',
  Z_INDEX: 'z-50'
};

export const API_RESPONSE_TYPES = {
  USER_IN_RESULT: 'user',
  USER_IN_DATA: 'data.user',
  USER_DIRECT: 'direct',
  UNKNOWN: 'unknown'
};

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  SIGNUP_SUCCESS_VERIFICATION: "Account created! Please check your email to verify your account.",
  SIGNUP_SUCCESS_LEGACY: "Account created successfully as {role}! Please sign in to continue.",
  ERROR_GENERIC: "An error occurred. Please try again.",
  ERROR_INVALID_RESPONSE: "Invalid response structure from server"
};

export const ROLE_LABELS = {
  admin: 'Recruiter',
  user: 'Job Seeker'
};

export const HEADER_CONTENT = {
  [MODAL_STATES.LOGIN]: {
    title: "Welcome Back",
    subtitle: "Sign in to access your account"
  },
  [MODAL_STATES.SIGN_UP]: {
    title: "Join Our Platform",
    subtitle: "Create an account to get started"
  },
  [MODAL_STATES.FORGOT_PASSWORD]: {
    title: "Reset Password",
    subtitle: "Enter your email to receive a reset link"
  }
};