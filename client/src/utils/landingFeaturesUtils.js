// LandingFeatures component utilities
import { LANDING_FEATURES_CONSTANTS } from '../constants/landingFeaturesConstants.js';

/**
 * Handles the get started button click
 * @param {function} setAuthMode - Function to set authentication mode
 * @param {function} setShowAuthModal - Function to show/hide auth modal
 */
export const handleGetStarted = (setAuthMode, setShowAuthModal) => {
  setAuthMode(LANDING_FEATURES_CONSTANTS.AUTH_MODES.SIGN_UP);
  setShowAuthModal(true);
};