// Navbar component utilities
import { NAVBAR_CONSTANTS } from '../constants/navbarConstants.js';

/**
 * Handles opening the auth modal with specified mode
 * @param {function} setShowAuthModal - Function to show/hide auth modal
 * @param {string} mode - Authentication mode ('Sign Up', 'Login', etc.)
 */
export const openAuthModal = (setShowAuthModal, mode = NAVBAR_CONSTANTS.AUTH_MODES?.SIGN_UP || 'Sign Up') => {
  setShowAuthModal(true);
  // Note: Mode is passed through context or custom event
};

/**
 * Creates a scroll handler for navbar styling
 * @param {function} setScrolled - Function to set scrolled state
 * @returns {function} Scroll event handler
 */
export const createScrollHandler = (setScrolled) => {
  return () => {
    setScrolled(window.scrollY > NAVBAR_CONSTANTS.SCROLL_THRESHOLD);
  };
};

/**
 * Loads profile image from localStorage
 * @param {object} currentUser - Current user object
 * @returns {string|null} Profile image URL or null
 */
export const loadProfileImage = (currentUser) => {
  if (currentUser?.email) {
    return localStorage.getItem(`${NAVBAR_CONSTANTS.STORAGE_KEYS.PROFILE_IMAGE_PREFIX}${currentUser.email}`);
  }
  return null;
};

/**
 * Creates a profile image update event handler
 * @param {object} currentUser - Current user object
 * @param {function} setProfileImage - Function to set profile image
 * @returns {function} Event handler
 */
export const createProfileImageUpdateHandler = (currentUser, setProfileImage) => {
  return (event) => {
    if (event.detail.userEmail === currentUser?.email) {
      setProfileImage(event.detail.imageUrl);
    }
  };
};

/**
 * Creates a click outside handler for user menu
 * @param {boolean} showUserMenu - Whether user menu is shown
 * @param {function} setShowUserMenu - Function to set user menu state
 * @returns {function} Click outside handler
 */
export const createClickOutsideHandler = (showUserMenu, setShowUserMenu) => {
  return (event) => {
    if (showUserMenu && !event.target.closest('.user-menu-container')) {
      setShowUserMenu(false);
    }
  };
};

/**
 * Handles user logout
 * @param {function} logout - Logout function from authService
 * @param {function} setCurrentUser - Function to set current user
 * @param {function} setShowUserMenu - Function to hide user menu
 * @param {function} navigate - React Router navigate function
 */
export const handleLogout = (logout, setCurrentUser, setShowUserMenu, navigate) => {
  logout();
  setCurrentUser(null);
  setShowUserMenu(false);
  navigate(NAVBAR_CONSTANTS.ROUTES.HOME);
};

/**
 * Checks if user is admin
 * @param {object} currentUser - Current user object
 * @returns {boolean} Whether user is admin
 */
export const isAdmin = (currentUser) => {
  return currentUser?.role === NAVBAR_CONSTANTS.USER_ROLES.ADMIN ||
         currentUser?.role === NAVBAR_CONSTANTS.USER_ROLES.ADMIN_CAPITALIZED;
};

/**
 * Checks if environment is development
 * @returns {boolean} Whether in development mode
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === NAVBAR_CONSTANTS.ENV.DEVELOPMENT;
};