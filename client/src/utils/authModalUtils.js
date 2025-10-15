import {
  MODAL_STATES,
  API_RESPONSE_TYPES,
  AUTH_MESSAGES,
  ROLE_LABELS
} from '../constants/authModalConstants';

/**
 * Auth Modal utility functions
 */

/**
 * Parse API response to extract user data
 * @param {Object} result - API response
 * @returns {Object} - Parsed user data
 * @throws {Error} - If response structure is invalid
 */
export const parseApiResponse = (result) => {
  if (result.user) {
    // If API returns { user: {...} }
    return { type: API_RESPONSE_TYPES.USER_IN_RESULT, user: result.user };
  } else if (result.data && result.data.user) {
    // If API returns { data: { user: {...} } }
    return { type: API_RESPONSE_TYPES.USER_IN_DATA, user: result.data.user };
  } else if (result.name || result.email) {
    // If API returns user data directly
    return { type: API_RESPONSE_TYPES.USER_DIRECT, user: result };
  } else {
    console.error("Unknown API response structure:", result);
    throw new Error(AUTH_MESSAGES.ERROR_INVALID_RESPONSE);
  }
};

/**
 * Handle login form submission
 * @param {Object} formData - Form data
 * @param {Function} login - Login service function
 * @param {Function} onLogin - Login callback
 * @param {Function} onClose - Modal close callback
 * @returns {Promise<void>}
 */
export const handleLoginSubmission = async (formData, login, onLogin, onClose) => {
  const result = await login(formData);
  console.log("Login result received:", result); // Debug log

  const { user } = parseApiResponse(result);
  console.log("Extracted user data:", user); // Debug log

  // Call onLogin with the user data
  onLogin(user);
  onClose();
};

/**
 * Handle sign up form submission
 * @param {Object} formData - Form data
 * @param {Function} register - Register service function
 * @param {Function} setVerificationEmail - Set verification email callback
 * @param {Function} setState - Set modal state callback
 * @returns {Promise<void>}
 */
export const handleSignUpSubmission = async (formData, register, setVerificationEmail, setState) => {
  const result = await register(formData);
  console.log("Sign up completed:", result); // Debug log

  // Check if email verification is required
  if (result.success && result.data?.user?.isEmailVerified === false) {
    // Show email verification prompt
    setVerificationEmail(formData.email);
    setState(MODAL_STATES.EMAIL_VERIFICATION);
  } else {
    // Old flow for backward compatibility
    const roleLabel = ROLE_LABELS[formData.role] || ROLE_LABELS.user;
    const message = AUTH_MESSAGES.SIGNUP_SUCCESS_LEGACY.replace('{role}', roleLabel);
    setState(MODAL_STATES.LOGIN); // Switch to Sign In UI component
    return message;
  }
};

/**
 * Get authentication success message
 * @param {string} state - Modal state
 * @param {Object} formData - Form data (for sign up)
 * @returns {string} - Success message
 */
export const getAuthSuccessMessage = (state, formData = null) => {
  if (state === MODAL_STATES.LOGIN) {
    return AUTH_MESSAGES.LOGIN_SUCCESS;
  } else if (state === MODAL_STATES.SIGN_UP) {
    if (formData) {
      const roleLabel = ROLE_LABELS[formData.role] || ROLE_LABELS.user;
      return AUTH_MESSAGES.SIGNUP_SUCCESS_LEGACY.replace('{role}', roleLabel);
    }
    return AUTH_MESSAGES.SIGNUP_SUCCESS_VERIFICATION;
  }
  return AUTH_MESSAGES.LOGIN_SUCCESS;
};

/**
 * Get modal header content
 * @param {string} state - Modal state
 * @returns {Object} - Header content with title and subtitle
 */
export const getModalHeaderContent = (state) => {
  return {
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
  }[state] || {
    title: "Authentication",
    subtitle: "Please sign in or sign up"
  };
};

/**
 * Check if modal should show toggle section
 * @param {string} state - Modal state
 * @returns {boolean} - Whether to show toggle section
 */
export const shouldShowToggleSection = (state) => {
  return state !== MODAL_STATES.EMAIL_VERIFICATION && state !== MODAL_STATES.FORGOT_PASSWORD;
};

/**
 * Get toggle section text
 * @param {string} state - Modal state
 * @returns {Object} - Toggle text content
 */
export const getToggleSectionText = (state) => {
  if (state === MODAL_STATES.LOGIN) {
    return {
      text: "Don't have an account? ",
      linkText: "Sign up now"
    };
  } else {
    return {
      text: "Already have an account? ",
      linkText: "Sign in"
    };
  }
};

/**
 * Handle modal escape key
 * @param {KeyboardEvent} e - Keyboard event
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Close callback
 */
export const handleModalEscape = (e, isOpen, onClose) => {
  if (e.key === 'Escape' && isOpen) {
    onClose();
  }
};

/**
 * Handle modal overlay click
 * @param {MouseEvent} e - Mouse event
 * @param {Function} onClose - Close callback
 */
export const handleModalOverlayClick = (e, onClose) => {
  if (e.target === e.currentTarget) {
    onClose();
  }
};

/**
 * Get available modal states
 * @returns {Array} - Array of available modal states
 */
export const getAvailableModalStates = () => {
  return Object.values(MODAL_STATES);
};

/**
 * Check if state transition is valid
 * @param {string} fromState - Current state
 * @param {string} toState - Target state
 * @returns {boolean} - Whether transition is valid
 */
export const isValidStateTransition = (fromState, toState) => {
  const validTransitions = {
    [MODAL_STATES.SIGN_UP]: [MODAL_STATES.LOGIN, MODAL_STATES.EMAIL_VERIFICATION],
    [MODAL_STATES.LOGIN]: [MODAL_STATES.SIGN_UP, MODAL_STATES.FORGOT_PASSWORD],
    [MODAL_STATES.EMAIL_VERIFICATION]: [MODAL_STATES.LOGIN],
    [MODAL_STATES.FORGOT_PASSWORD]: [MODAL_STATES.LOGIN]
  };

  return validTransitions[fromState]?.includes(toState) || false;
};