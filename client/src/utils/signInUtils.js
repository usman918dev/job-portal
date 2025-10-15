import {
  VALIDATION_RULES,
  ERROR_MESSAGES,
  USER_ROLES,
  ROLE_CONFIG
} from '../constants/signInConstants';

/**
 * Sign in utility functions
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.EMAIL_REQUIRED };
  }

  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.EMAIL_INVALID };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORD_REQUIRED };
  }

  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORD_TOO_SHORT };
  }

  return { isValid: true, error: null };
};

/**
 * Validate complete sign in form
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Object} - Validation result with isValid and errors object
 */
export const validateSignInForm = (email, password) => {
  const errors = {};

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Handle form input changes with error clearing
 * @param {string} field - Field name
 * @param {string} value - Field value
 * @param {Object} currentFormData - Current form data
 * @param {Object} currentErrors - Current errors
 * @returns {Object} - Updated form data and errors
 */
export const handleSignInInputChange = (field, value, currentFormData, currentErrors) => {
  const updatedFormData = { ...currentFormData, [field]: value };

  // Clear errors when user starts typing
  const updatedErrors = { ...currentErrors };
  if (updatedErrors[field]) {
    delete updatedErrors[field];
  }

  return { formData: updatedFormData, errors: updatedErrors };
};

/**
 * Navigate user based on their role after successful login
 * @param {Function} navigate - React Router navigate function
 * @param {string} role - User role
 */
export const navigateAfterLogin = (navigate, role) => {
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG[USER_ROLES.USER];
  navigate(roleConfig.route);
};

/**
 * Get role configuration
 * @param {string} role - User role
 * @returns {Object} - Role configuration object
 */
export const getRoleConfig = (role) => {
  return ROLE_CONFIG[role] || ROLE_CONFIG[USER_ROLES.USER];
};

/**
 * Check if user is already authenticated
 * @param {Object} currentUser - Current user object
 * @returns {boolean} - Whether user is authenticated
 */
export const isUserAuthenticated = (currentUser) => {
  return !!currentUser;
};

/**
 * Get available user roles
 * @returns {Array} - Array of available roles
 */
export const getAvailableRoles = () => {
  return Object.values(USER_ROLES);
};