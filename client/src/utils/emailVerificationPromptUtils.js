import { toast } from 'react-toastify';
import {
  resendVerificationEmail,
  isVerificationEmailSent,
  getVerificationErrorMessage
} from '../services/emailVerificationService';
import { MESSAGES } from '../constants/emailVerificationPromptConstants';

/**
 * Email Verification Prompt utility functions
 */

/**
 * Handle resending verification email
 * @param {string} email - Email address
 * @param {Function} setIsResending - Function to set resending state
 * @param {Function} setEmailSent - Function to set email sent state
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
export const handleResendVerification = async (email, setIsResending, setEmailSent) => {
  try {
    setIsResending(true);

    const response = await resendVerificationEmail(email);

    if (isVerificationEmailSent(response)) {
      setEmailSent(true);
      toast.success(MESSAGES.SUCCESS_RESEND);
      return true;
    }

    return false;
  } catch (error) {
    const errorMessage = getVerificationErrorMessage(error);
    toast.error(errorMessage);
    return false;
  } finally {
    setIsResending(false);
  }
};

/**
 * Get the appropriate callback for back/navigation
 * @param {Function} onBack - Back callback function
 * @param {Function} onClose - Close callback function
 * @returns {Function} - The appropriate callback function
 */
export const getBackCallback = (onBack, onClose) => {
  return onBack || onClose;
};

/**
 * Check if the component should show success message
 * @param {boolean} emailSent - Whether email was sent
 * @returns {boolean} - Whether to show success message
 */
export const shouldShowSuccessMessage = (emailSent) => {
  return emailSent;
};

/**
 * Get button text based on loading state
 * @param {boolean} isResending - Whether email is being resent
 * @returns {string} - Button text
 */
export const getResendButtonText = (isResending) => {
  return isResending ? MESSAGES.SENDING : MESSAGES.RESEND_BUTTON;
};

/**
 * Check if resend button should be disabled
 * @param {boolean} isResending - Whether email is being resent
 * @returns {boolean} - Whether button should be disabled
 */
export const shouldDisableResendButton = (isResending) => {
  return isResending;
};