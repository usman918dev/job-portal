// Sign In Page Constants
export const ROUTES = {
  HOME: "/",
  ADMIN: "/admin",
  SIGN_UP: "/sign-up"
};

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin"
};

export const FORM_FIELDS = {
  EMAIL: "email",
  PASSWORD: "password",
  ROLE: "role"
};

export const ANIMATION_VARIANTS = {
  backButton: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  },
  card: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, type: "spring", damping: 20 }
  },
  glowEffect: {
    animate: {
      scale: [1, 1.02, 1],
    },
    transition: { duration: 3, repeat: Infinity }
  },
  roleButton: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  },
  submitButton: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    disabled: { scale: 1 }
  },
  arrow: {
    initial: { x: 0 },
    whileHover: { x: 4 },
    transition: { type: "spring", stiffness: 400, damping: 30 }
  }
};

export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: true,
    PATTERN: /\S+@\S+\.\S+/
  },
  PASSWORD: {
    REQUIRED: true,
    MIN_LENGTH: 6
  }
};

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters"
};

export const DEFAULT_FORM_STATE = {
  email: "",
  password: "",
  role: USER_ROLES.USER
};

export const ROLE_CONFIG = {
  [USER_ROLES.USER]: {
    label: "User",
    icon: "User",
    route: ROUTES.HOME
  },
  [USER_ROLES.ADMIN]: {
    label: "Admin",
    icon: "Shield",
    route: ROUTES.ADMIN
  }
};

export const STYLING = {
  roleButton: {
    active: "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100",
    inactive: "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
  },
  input: {
    base: "w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400",
    error: "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50",
    normal: "border-gray-200 focus:ring-blue-500 focus:border-transparent"
  },
  button: {
    primary: "relative w-full py-4 font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
  }
};