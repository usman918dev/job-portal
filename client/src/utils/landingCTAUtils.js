// LandingCTA component utilities
import { LANDING_CTA_CONSTANTS } from '../constants/landingCTAConstants.js';

/**
 * Handles the get started button click
 * @param {function} setAuthMode - Function to set authentication mode
 * @param {function} setShowAuthModal - Function to show/hide auth modal
 */
export const handleGetStarted = (setAuthMode, setShowAuthModal) => {
  setAuthMode(LANDING_CTA_CONSTANTS.AUTH_MODES.SIGN_UP);
  setShowAuthModal(true);
};

/**
 * Handles the sign in button click
 * @param {function} setAuthMode - Function to set authentication mode
 * @param {function} setShowAuthModal - Function to show/hide auth modal
 */
export const handleSignIn = (setAuthMode, setShowAuthModal) => {
  setAuthMode(LANDING_CTA_CONSTANTS.AUTH_MODES.LOGIN);
  setShowAuthModal(true);
};