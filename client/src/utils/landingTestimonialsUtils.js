// LandingTestimonials component utilities
import { LANDING_TESTIMONIALS_CONSTANTS } from '../constants/landingTestimonialsConstants.js';

/**
 * Handles the get started button click
 * @param {function} setAuthMode - Function to set authentication mode
 * @param {function} setShowAuthModal - Function to show/hide auth modal
 */
export const handleGetStarted = (setAuthMode, setShowAuthModal) => {
  setAuthMode(LANDING_TESTIMONIALS_CONSTANTS.AUTH_MODES.SIGN_UP);
  setShowAuthModal(true);
};

/**
 * Creates a next slide handler for the carousel
 * @param {function} setCurrentIndex - Function to set current index
 * @param {number} totalItems - Total number of testimonials
 * @returns {function} Next slide handler
 */
export const createNextSlideHandler = (setCurrentIndex, totalItems) => {
  return () => {
    setCurrentIndex((prev) =>
      (prev + 1) % Math.ceil(totalItems / LANDING_TESTIMONIALS_CONSTANTS.CAROUSEL.ITEMS_PER_SLIDE)
    );
  };
};

/**
 * Creates a previous slide handler for the carousel
 * @param {function} setCurrentIndex - Function to set current index
 * @param {number} totalItems - Total number of testimonials
 * @returns {function} Previous slide handler
 */
export const createPrevSlideHandler = (setCurrentIndex, totalItems) => {
  return () => {
    setCurrentIndex((prev) =>
      (prev - 1 + Math.ceil(totalItems / LANDING_TESTIMONIALS_CONSTANTS.CAROUSEL.ITEMS_PER_SLIDE)) %
      Math.ceil(totalItems / LANDING_TESTIMONIALS_CONSTANTS.CAROUSEL.ITEMS_PER_SLIDE)
    );
  };
};

/**
 * Creates a dot click handler for the carousel
 * @param {function} setCurrentIndex - Function to set current index
 * @param {number} index - Target index
 * @returns {function} Dot click handler
 */
export const createDotClickHandler = (setCurrentIndex, index) => {
  return () => setCurrentIndex(index);
};