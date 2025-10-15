// LandingNavbar component utilities
import { LANDING_NAVBAR_CONSTANTS } from '../constants/landingNavbarConstants.js';

/**
 * Handles the sign up button click
 * @param {function} setAuthMode - Function to set authentication mode
 * @param {function} setShowAuthModal - Function to show/hide auth modal
 * @param {function} setIsMobileMenuOpen - Function to close mobile menu
 */
export const handleSignUp = (setAuthMode, setShowAuthModal, setIsMobileMenuOpen) => {
  setAuthMode(LANDING_NAVBAR_CONSTANTS.AUTH_MODES.SIGN_UP);
  setShowAuthModal(true);
  setIsMobileMenuOpen(false);
};

/**
 * Handles the sign in button click
 * @param {function} setAuthMode - Function to set authentication mode
 * @param {function} setShowAuthModal - Function to show/hide auth modal
 * @param {function} setIsMobileMenuOpen - Function to close mobile menu
 */
export const handleSignIn = (setAuthMode, setShowAuthModal, setIsMobileMenuOpen) => {
  setAuthMode(LANDING_NAVBAR_CONSTANTS.AUTH_MODES.LOGIN);
  setShowAuthModal(true);
  setIsMobileMenuOpen(false);
};

/**
 * Handles navigation to recruiter portal
 * @param {function} navigate - React Router navigate function
 * @param {function} setIsMobileMenuOpen - Function to close mobile menu
 */
export const handleRecruiterPortal = (navigate, setIsMobileMenuOpen) => {
  navigate(LANDING_NAVBAR_CONSTANTS.NAVIGATION.ADMIN);
  setIsMobileMenuOpen(false);
};

/**
 * Handles scroll event to update navbar styling
 * @param {function} setIsScrolled - Function to set scrolled state
 * @returns {function} Scroll event handler
 */
export const createScrollHandler = (setIsScrolled) => {
  return () => {
    setIsScrolled(window.scrollY > LANDING_NAVBAR_CONSTANTS.SCROLL_THRESHOLD);
  };
};