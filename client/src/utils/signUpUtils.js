import {
  VALIDATION_RULES,
  ERROR_MESSAGES,
  FORM_FIELDS,
  PASSWORD_STRENGTH,
  USER_ROLES
} from '../constants/signUpConstants';

/**
 * Sign up utility functions
 */

/**
 * Check password strength based on criteria
 * @param {string} password - Password to check
 * @returns {number} - Strength score (0-5)
 */
export const checkPasswordStrength = (password) => {
  let score = 0;
  if (!password) return score;

  // Length checks
  if (password.length > 6) score += 1;
  if (password.length > 10) score += 1;

  // Character type checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return score;
};

/**
 * Get password strength message
 * @param {number} strength - Password strength score
 * @returns {string} - Strength message
 */
export const getPasswordStrengthMessage = (strength) => {
  return PASSWORD_STRENGTH.MESSAGES[strength] || PASSWORD_STRENGTH.MESSAGES[0];
};

/**
 * Validate name field
 * @param {string} name - Name to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.NAME_REQUIRED };
  }

  return { isValid: true, error: null };
};

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

  const strength = checkPasswordStrength(password);
  if (strength < VALIDATION_RULES.PASSWORD.STRENGTH_MIN) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORD_TOO_WEAK };
  }

  return { isValid: true, error: null };
};

/**
 * Validate confirm password field
 * @param {string} confirmPassword - Confirm password to validate
 * @param {string} password - Original password for comparison
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword || !confirmPassword.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED };
  }

  if (confirmPassword !== password) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH };
  }

  return { isValid: true, error: null };
};

/**
 * Validate company name field (required for admin role)
 * @param {string} companyName - Company name to validate
 * @param {string} role - User role
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateCompanyName = (companyName, role) => {
  if (role === USER_ROLES.ADMIN && (!companyName || !companyName.trim())) {
    return { isValid: false, error: ERROR_MESSAGES.COMPANY_NAME_REQUIRED };
  }

  return { isValid: true, error: null };
};

/**
 * Validate complete sign up form
 * @param {Object} formData - Form data object
 * @returns {Object} - Validation result with isValid and errors object
 */
export const validateSignUpForm = (formData) => {
  const errors = {};

  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors[FORM_FIELDS.NAME] = nameValidation.error;
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors[FORM_FIELDS.EMAIL] = emailValidation.error;
  }

  const companyValidation = validateCompanyName(formData.companyName, formData.role);
  if (!companyValidation.isValid) {
    errors[FORM_FIELDS.COMPANY_NAME] = companyValidation.error;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors[FORM_FIELDS.PASSWORD] = passwordValidation.error;
  }

  const confirmPasswordValidation = validateConfirmPassword(formData.confirmPassword, formData.password);
  if (!confirmPasswordValidation.isValid) {
    errors[FORM_FIELDS.CONFIRM_PASSWORD] = confirmPasswordValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Handle form input changes with validation and error clearing
 * @param {string} field - Field name
 * @param {string} value - Field value
 * @param {Object} currentFormData - Current form data
 * @param {Object} currentErrors - Current errors
 * @param {Function} setPasswordStrength - Function to set password strength
 * @returns {Object} - Updated form data and errors
 */
export const handleSignUpInputChange = (field, value, currentFormData, currentErrors, setPasswordStrength) => {
  const updatedFormData = { ...currentFormData, [field]: value };

  // Clear errors when user starts typing
  const updatedErrors = { ...currentErrors };
  if (updatedErrors[field]) {
    delete updatedErrors[field];
  }

  // Handle password-specific logic
  if (field === FORM_FIELDS.PASSWORD) {
    if (setPasswordStrength) {
      setPasswordStrength(checkPasswordStrength(value));
    }
    // Clear confirm password error if passwords now match
    if (currentFormData.confirmPassword && value === currentFormData.confirmPassword) {
      delete updatedErrors[FORM_FIELDS.CONFIRM_PASSWORD];
    }
  }

  // Handle confirm password real-time validation
  if (field === FORM_FIELDS.CONFIRM_PASSWORD) {
    const confirmValidation = validateConfirmPassword(value, currentFormData.password);
    if (!confirmValidation.isValid) {
      updatedErrors[FORM_FIELDS.CONFIRM_PASSWORD] = confirmValidation.error;
    }
  }

  return { formData: updatedFormData, errors: updatedErrors };
};

/**
 * Check if passwords match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {boolean} - Whether passwords match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Get role configuration
 * @param {string} role - User role
 * @returns {Object} - Role configuration object
 */
export const getRoleConfig = (role) => {
  return {
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
  }[role] || {
    [USER_ROLES.USER]: {
      label: "Job Seeker",
      icon: "User",
      requiresCompany: false
    }
  };
};

/**
 * Check if role requires company name
 * @param {string} role - User role
 * @returns {boolean} - Whether company name is required
 */
export const requiresCompanyName = (role) => {
  return role === USER_ROLES.ADMIN;
};

/**
 * Get available user roles
 * @returns {Array} - Array of available roles
 */
export const getAvailableRoles = () => {
  return Object.values(USER_ROLES);
};