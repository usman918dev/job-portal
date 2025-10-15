// Hero component utilities
import { HERO_CONSTANTS } from '../constants/heroConstants.js';

/**
 * Handles search form submission
 * @param {Event} e - Form submit event
 * @param {Object} searchRef - Reference to search input
 * @param {Function} setSearchFilter - Context function to set search filter
 * @param {Function} setIsSearched - Context function to set search state
 */
export const handleSearch = (e, searchRef, setSearchFilter, setIsSearched) => {
  e.preventDefault();
  const searchTerm = searchRef.current.value.trim();
  console.log('Hero search triggered with:', searchTerm);

  setSearchFilter({
    query: searchTerm
  });
  setIsSearched(true);

  // Scroll to job listings section
  scrollToJobListings();
};

/**
 * Scrolls to the job listings section
 */
export const scrollToJobListings = () => {
  setTimeout(() => {
    const jobListingSection = document.querySelector('#job-listings');
    if (jobListingSection) {
      jobListingSection.scrollIntoView(HERO_CONSTANTS.SCROLL_CONFIG);
    }
  }, HERO_CONSTANTS.TIMING.SCROLL_DELAY);
};

/**
 * Handles tag click to populate search input
 * @param {string} tag - The clicked tag
 * @param {Function} setActiveTag - State setter for active tag
 * @param {Object} searchRef - Reference to search input
 */
export const handleTagClick = (tag, setActiveTag, searchRef) => {
  setActiveTag(tag);
  searchRef.current.value = tag;
  // Optional: automatically trigger search
  // handleSearch({ preventDefault: () => {} }, searchRef, setSearchFilter, setIsSearched);
};

/**
 * Gets animation configuration for a specific element
 * @param {string} element - Element type ('container', 'title', 'stats', etc.)
 * @param {number} index - Index for items in arrays (optional)
 * @returns {object} - Animation configuration object
 */
export const getAnimationConfig = (element, index = null) => {
  if (element === 'logoItem' && index !== null) {
    return HERO_CONSTANTS.ANIMATIONS.LOGO_ITEM(index);
  }
  return HERO_CONSTANTS.ANIMATIONS[element.toUpperCase()] || {};
};

/**
 * Gets interaction animation for hover/tap effects
 * @param {string} interaction - Interaction type ('statHover', 'searchButtonHover', etc.)
 * @returns {object} - Animation configuration object
 */
export const getInteractionAnimation = (interaction) => {
  return HERO_CONSTANTS.INTERACTIONS[interaction] || {};
};

/**
 * Gets CSS classes for a specific element
 * @param {string} element - Element type
 * @param {object} options - Additional options for conditional classes
 * @returns {string} - CSS classes string
 */
export const getCssClasses = (element, options = {}) => {
  let classes = HERO_CONSTANTS.CLASSES[element] || '';

  // Add conditional classes
  if (element === 'TAG_BUTTON') {
    classes += options.active ? ` ${HERO_CONSTANTS.CLASSES.TAG_BUTTON_ACTIVE}` : ` ${HERO_CONSTANTS.CLASSES.TAG_BUTTON_INACTIVE}`;
  }

  return classes;
};

/**
 * Gets background animation delays
 * @param {string} element - Background element type
 * @returns {string} - Animation delay value
 */
export const getBackgroundAnimationDelay = (element) => {
  return HERO_CONSTANTS.BACKGROUND_ANIMATION_DELAYS[element] || '0s';
};

/**
 * Gets timing configuration
 * @param {string} timing - Timing type
 * @param {number} index - Index for incremental delays (optional)
 * @returns {number} - Timing value
 */
export const getTimingConfig = (timing, index = 0) => {
  const baseTiming = HERO_CONSTANTS.TIMING[timing] || 0;
  if (timing === 'TAG_ANIMATION_DELAY_BASE') {
    return baseTiming + (index * HERO_CONSTANTS.TIMING.TAG_ANIMATION_DELAY_INCREMENT);
  }
  return baseTiming;
};