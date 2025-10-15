import { PASSWORD_REQUIREMENTS, VALIDATION_MESSAGES, RESET_REDIRECT_DELAY } from '../constants/resetPasswordConstants';

/**
 * Password reset utility functions
 */

/**
 * Validate password strength based on requirements
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }

  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    return { isValid: false, error: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT };
  }

  if (password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Password must be less than ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters long`
    };
  }

  // Additional validation rules can be added here based on PASSWORD_REQUIREMENTS

  return { isValid: true, error: null };
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} - Validation result with isValid and error message
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH };
  }

  return { isValid: true, error: null };
};

/**
 * Validate complete password reset form
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} - Validation result with isValid and error message
 */
export const validatePasswordResetForm = (newPassword, confirmPassword) => {
  // Validate new password
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  // Validate password confirmation
  const confirmationValidation = validatePasswordConfirmation(newPassword, confirmPassword);
  if (!confirmationValidation.isValid) {
    return confirmationValidation;
  }

  return { isValid: true, error: null };
};

/**
 * Handle form input changes for password reset form
 * @param {Event} e - Input change event
 * @param {Object} currentFormData - Current form data
 * @returns {Object} - Updated form data
 */
export const handlePasswordResetInputChange = (e, currentFormData) => {
  const { name, value } = e.target;
  return {
    ...currentFormData,
    [name]: value
  };
};

/**
 * Navigate to signin page after successful password reset
 * @param {Function} navigate - React Router navigate function
 * @param {string} email - User email address
 * @param {number} delay - Delay in milliseconds before navigation (default: RESET_REDIRECT_DELAY)
 */
export const navigateToSigninAfterReset = (navigate, email, delay = RESET_REDIRECT_DELAY) => {
  setTimeout(() => {
    navigate('/signin', {
      state: {
        message: 'Password reset successfully! You can now sign in with your new password.',
        email: email
      }
    });
  }, delay);
};

/**
 * Get password requirements text for display
 * @returns {string} - Formatted password requirements text
 */
export const getPasswordRequirementsText = () => {
  return `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`;
};

/**
 * Check if token is present in URL parameters
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {Object} - Token validation result with isValid, token, and error message
 */
export const validateResetTokenParams = (searchParams) => {
  const token = searchParams.get('token');

  if (!token) {
    return {
      isValid: false,
      token: null,
      error: 'Invalid reset link. Missing token.'
    };
  }

  return {
    isValid: true,
    token: token,
    error: null
  };
};