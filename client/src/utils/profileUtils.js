import { STATUS_COLORS, ROLE_ICONS, FILE_UPLOAD_CONFIG } from '../constants/profileConstants';

/**
 * Profile utility functions
 */

/**
 * Get status color class based on user status
 * @param {string} status - User status
 * @returns {string} - CSS class for status styling
 */
export const getStatusColor = (status) => {
  const normalizedStatus = status?.toLowerCase();
  return STATUS_COLORS[normalizedStatus] || STATUS_COLORS.default;
};

/**
 * Get role icon component for display
 * @param {string} role - User role
 * @returns {React.Component} - Icon component for the role
 */
export const getRoleIcon = (role) => {
  const normalizedRole = role?.toLowerCase();
  const IconComponent = ROLE_ICONS[normalizedRole] || ROLE_ICONS.default;
  return IconComponent;
};

/**
 * Validate image file for upload
 * @param {File} file - Image file to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'Please select a file' };
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select a valid image file' };
  }

  // Check file size
  if (file.size > FILE_UPLOAD_CONFIG.MAX_SIZE) {
    return {
      isValid: false,
      error: `Image size should be less than ${FILE_UPLOAD_CONFIG.MAX_SIZE_DISPLAY}`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Process image file for upload
 * @param {File} file - Image file to process
 * @returns {Promise<string>} - Base64 encoded image data URL
 */
export const processImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.onerror = () => {
      reject(new Error('Failed to process image file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Save user data to localStorage
 * @param {Object} userData - User data to save
 */
export const saveUserToLocalStorage = (userData) => {
  try {
    const userDataWrapper = JSON.parse(localStorage.getItem('user') || '{}');
    userDataWrapper.user = userData;
    localStorage.setItem('user', JSON.stringify(userDataWrapper));
  } catch (error) {
    console.error('Failed to save user data to localStorage:', error);
  }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} - User data or null if not found
 */
export const getUserFromLocalStorage = () => {
  try {
    const userDataWrapper = JSON.parse(localStorage.getItem('user') || '{}');
    return userDataWrapper.user || null;
  } catch (error) {
    console.error('Failed to get user data from localStorage:', error);
    return null;
  }
};

/**
 * Initialize form data from user object
 * @param {Object} user - User object
 * @returns {Object} - Form data object
 */
export const initializeFormData = (user) => {
  return {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    company: user?.company || '',
    position: user?.position || '',
    website: user?.website || '',
    skills: user?.skills || [],
    notifications: {
      email: true,
      push: true,
      sms: false,
      applicationAlerts: user?.notifications?.applicationAlerts !== undefined
        ? user.notifications.applicationAlerts
        : true
    }
  };
};

/**
 * Handle form input changes
 * @param {Event} e - Input change event
 * @param {Object} currentFormData - Current form data
 * @returns {Object} - Updated form data
 */
export const handleFormInputChange = (e, currentFormData) => {
  const { name, value, type, checked } = e.target;

  if (name.includes('notifications.')) {
    const notificationKey = name.split('.')[1];
    return {
      ...currentFormData,
      notifications: {
        ...currentFormData.notifications,
        [notificationKey]: checked
      }
    };
  } else {
    return {
      ...currentFormData,
      [name]: type === 'checkbox' ? checked : value
    };
  }
};

/**
 * Trigger profile image update event
 * @param {string} userEmail - User email
 * @param {string} imageUrl - Image URL
 */
export const triggerProfileImageUpdate = (userEmail, imageUrl) => {
  window.dispatchEvent(new CustomEvent('profileImageUpdated', {
    detail: { userEmail, imageUrl }
  }));
};