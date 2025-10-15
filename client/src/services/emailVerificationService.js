import axios from 'axios';
import { API_ENDPOINTS, CONFIG } from '../constants/emailVerificationPromptConstants';

/**
 * Email Verification Service
 */

/**
 * Resend verification email
 * @param {string} email - Email address to resend verification to
 * @returns {Promise<Object>} - API response
 * @throws {Error} - If the request fails
 */
export const resendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.RESEND_VERIFICATION}`, {
      email
    });

    return response.data;
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

/**
 * Check if email verification was successful
 * @param {Object} response - API response
 * @returns {boolean} - Whether verification email was sent successfully
 */
export const isVerificationEmailSent = (response) => {
  return response && response.success === true;
};

/**
 * Get error message from API response
 * @param {Object} error - Error object
 * @returns {string} - Error message
 */
export const getVerificationErrorMessage = (error) => {
  return error.response?.data?.message || 'Failed to resend verification email';
};