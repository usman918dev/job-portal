import {
  VALIDATION_RULES,
  ERROR_MESSAGES,
  FORM_FIELDS,
  USER_ROLES,
  ROLE_CONFIG
} from '../constants/signInPageConstants';

/**
 * Sign In Page utility functions
 */

/**
 * Validate email field
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
 * Validate password field
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
 * @param {Object} formData - Form data object
 * @returns {Object} - Validation result with isValid and errors object
 */
export const validateSignInPageForm = (formData) => {
  const errors = {};

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors[FORM_FIELDS.EMAIL] = emailValidation.error;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors[FORM_FIELDS.PASSWORD] = passwordValidation.error;
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
export const handleSignInPageInputChange = (field, value, currentFormData, currentErrors) => {
  const updatedFormData = { ...currentFormData, [field]: value };

  // Clear errors when user starts typing
  const updatedErrors = { ...currentErrors };
  if (updatedErrors[field]) {
    delete updatedErrors[field];
  }

  return { formData: updatedFormData, errors: updatedErrors };
};

/**
 * Navigate user after successful sign in based on their role
 * @param {Function} navigate - React Router navigate function
 * @param {string} role - User role
 */
export const navigateAfterSignIn = (navigate, role) => {
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

/**
 * Get role button styling classes
 * @param {string} buttonRole - Role of the button
 * @param {string} selectedRole - Currently selected role
 * @returns {string} - CSS classes for the button
 */
export const getRoleButtonClasses = (buttonRole, selectedRole) => {
  return buttonRole === selectedRole ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100" : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100";
};

/**
 * Get input field styling classes
 * @param {boolean} hasError - Whether the field has an error
 * @returns {string} - CSS classes for the input
 */
export const getInputClasses = (hasError) => {
  const baseClasses = "w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400";
  const errorClasses = "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50";
  const normalClasses = "border-gray-200 focus:ring-blue-500 focus:border-transparent";

  return `${baseClasses} ${hasError ? errorClasses : normalClasses}`;
};