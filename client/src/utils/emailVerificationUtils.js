/**
 * Email verification utility functions
 */

/**
 * Decode email from URL parameter
 * @param {string} email - Encoded email string
 * @returns {string} - Decoded email string
 */
export const decodeEmail = (email) => {
  return decodeURIComponent(email);
};

/**
 * Navigate to signin page with verification success state
 * @param {Function} navigate - React Router navigate function
 * @param {string} email - User email address
 * @param {number} delay - Delay in milliseconds before navigation (default: 3000)
 */
export const navigateToSigninAfterVerification = (navigate, email, delay = 3000) => {
  setTimeout(() => {
    navigate("/signin", {
      state: {
        message: "Email verified! You can now sign in.",
        verified: true,
        email: decodeEmail(email),
      },
    });
  }, delay);
};

/**
 * Get backend URL from environment or default
 * @returns {string} - Backend URL
 */
export const getBackendUrl = () => {
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
};