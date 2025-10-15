// Sign Up Constants
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin"
};

export const VALIDATION_RULES = {
  NAME: {
    REQUIRED: true,
    MIN_LENGTH: 1
  },
  EMAIL: {
    REQUIRED: true,
    PATTERN: /\S+@\S+\.\S+/
  },
  PASSWORD: {
    REQUIRED: true,
    MIN_LENGTH: 6,
    STRENGTH_MIN: 3
  },
  CONFIRM_PASSWORD: {
    REQUIRED: true
  },
  COMPANY_NAME: {
    REQUIRED_FOR_ADMIN: true,
    MIN_LENGTH: 1
  }
};

export const ERROR_MESSAGES = {
  NAME_REQUIRED: "Full name is required",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",
  COMPANY_NAME_REQUIRED: "Company name is required for recruiters",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
  PASSWORD_TOO_WEAK: "Please use a stronger password",
  CONFIRM_PASSWORD_REQUIRED: "Password confirmation is required",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match"
};

export const FORM_FIELDS = {
  NAME: "name",
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
  ROLE: "role",
  COMPANY_NAME: "companyName"
};

export const PASSWORD_STRENGTH = {
  LEVELS: {
    VERY_WEAK: 0,
    WEAK: 1,
    FAIR: 2,
    GOOD: 3,
    STRONG: 4,
    VERY_STRONG: 5
  },
  MESSAGES: {
    0: "Enter a password",
    1: "Password is too weak",
    2: "Password is weak",
    3: "Password is good",
    4: "Password is strong",
    5: "Password is very strong"
  },
  CRITERIA: {
    LENGTH_6: 1,
    LENGTH_10: 2,
    UPPERCASE: 3,
    NUMBER: 4,
    SPECIAL_CHAR: 5
  }
};

export const ROLE_CONFIG = {
  [USER_ROLES.USER]: {
    label: "Job Seeker",
    icon: "User",
    requiresCompany: false
  },
  [USER_ROLES.ADMIN]: {
    label: "Recruiter",
    icon: "Shield",
    requiresCompany: true
  }
};

export const ANIMATION_VARIANTS = {
  form: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  companyField: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 }
  },
  button: {
    hover: { scale: 1.01 },
    tap: { scale: 0.99 },
    disabled: { scale: 1 }
  }
};

export const DEFAULT_FORM_STATE = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: USER_ROLES.USER,
  companyName: ""
};