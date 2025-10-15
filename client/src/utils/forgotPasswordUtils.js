// ForgotPasswordForm component utilities
import { FORGOT_PASSWORD_CONSTANTS } from '../constants/forgotPasswordConstants.js';
import { forgotPassword } from '../services/authService.jsx';
import { toast } from 'react-toastify';

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const validateEmail = (email) => {
  return FORGOT_PASSWORD_CONSTANTS.EMAIL_REGEX.test(email);
};

/**
 * Handles forgot password form submission
 * @param {Event} e - Form submit event
 * @param {string} email - Email value
 * @param {Function} setIsLoading - Loading state setter
 * @param {Function} setEmailSent - Email sent state setter
 * @param {Function} toast - Toast notification function
 */
export const handleForgotPasswordSubmit = async (e, email, setIsLoading, setEmailSent) => {
  e.preventDefault();

  // Validate email presence
  if (!email) {
    toast.error(FORGOT_PASSWORD_CONSTANTS.MESSAGES.EMAIL_REQUIRED);
    return;
  }

  // Validate email format
  if (!validateEmail(email)) {
    toast.error(FORGOT_PASSWORD_CONSTANTS.MESSAGES.EMAIL_INVALID);
    return;
  }

  try {
    setIsLoading(true);
    const response = await forgotPassword(email);

    if (response.success) {
      setEmailSent(true);
      toast.success(FORGOT_PASSWORD_CONSTANTS.MESSAGES.SUCCESS);
    }
  } catch (error) {
    toast.error(error.message || FORGOT_PASSWORD_CONSTANTS.MESSAGES.ERROR_DEFAULT);
  } finally {
    setIsLoading(false);
  }
};

/**
 * Resets the form to initial state for sending another email
 * @param {Function} setEmailSent - Email sent state setter
 * @param {Function} setEmail - Email value setter
 */
export const resetFormForRetry = (setEmailSent, setEmail) => {
  setEmailSent(false);
  setEmail('');
};

/**
 * Gets the success message description with email
 * @param {string} email - Email address
 * @returns {string} - Formatted success message
 */
export const getSuccessMessage = (email) => {
  return FORGOT_PASSWORD_CONSTANTS.MESSAGES.SUCCESS_DESCRIPTION(email);
};

/**
 * Gets animation variants for different states
 * @param {string} type - Type of animation ('container', 'successContainer', 'buttonHover', etc.)
 * @returns {object} - Animation variant object
 */
export const getAnimationVariant = (type) => {
  return FORGOT_PASSWORD_CONSTANTS.ANIMATION_VARIANTS[type] || {};
};

/**
 * Gets CSS classes for different UI elements
 * @param {string} element - Element type ('input', 'buttonPrimary', 'buttonSecondary', etc.)
 * @param {object} options - Additional options for conditional classes
 * @returns {string} - CSS classes string
 */
export const getCssClasses = (element, options = {}) => {
  let classes = FORGOT_PASSWORD_CONSTANTS.CLASSES[element] || '';

  // Add conditional classes
  if (element === 'input' && options.disabled) {
    classes += ` ${FORGOT_PASSWORD_CONSTANTS.CLASSES.inputDisabled}`;
  }

  return classes;
};