import {
  STATUS_TYPES,
  NOTIFICATION_TYPES,
  NOTIFICATION_CONFIGS,
  COLOR_SCHEMES
} from '../constants/statusNotificationConstants';

/**
 * Status Notification utility functions
 */

/**
 * Get notification configuration based on status change
 * @param {string} newStatus - The new user status
 * @param {string} previousStatus - The previous user status
 * @returns {Object|null} - Notification configuration or null if no notification should be shown
 */
export const getNotificationConfig = (newStatus, previousStatus) => {
  if (!newStatus || newStatus === previousStatus) {
    return null;
  }

  const normalizedNewStatus = newStatus.toLowerCase();
  const normalizedPreviousStatus = previousStatus?.toLowerCase();

  // Check specific status configurations
  const config = NOTIFICATION_CONFIGS[normalizedNewStatus];

  if (config) {
    // Check if there's a condition for showing this notification
    if (config.condition && !config.condition(normalizedPreviousStatus)) {
      return null;
    }
    return config;
  }

  // Return default configuration for unknown status changes
  return {
    ...NOTIFICATION_CONFIGS.DEFAULT,
    message: `${NOTIFICATION_CONFIGS.DEFAULT.message} Your account status has been changed to ${newStatus}.`
  };
};

/**
 * Get notification container colors based on notification type
 * @param {string} type - Notification type
 * @returns {string} - CSS classes for container styling
 */
export const getNotificationColors = (type) => {
  return COLOR_SCHEMES[type]?.container || COLOR_SCHEMES[NOTIFICATION_TYPES.INFO].container;
};

/**
 * Get notification icon color based on notification type
 * @param {string} type - Notification type
 * @returns {string} - CSS classes for icon styling
 */
export const getIconColor = (type) => {
  return COLOR_SCHEMES[type]?.icon || COLOR_SCHEMES[NOTIFICATION_TYPES.INFO].icon;
};

/**
 * Get notification icon background color based on notification type
 * @param {string} type - Notification type
 * @returns {string} - CSS classes for icon background styling
 */
export const getIconBackgroundColor = (type) => {
  return COLOR_SCHEMES[type]?.iconBg || COLOR_SCHEMES[NOTIFICATION_TYPES.INFO].iconBg;
};

/**
 * Check if notification should be shown based on status change
 * @param {string} newStatus - The new user status
 * @param {string} previousStatus - The previous user status
 * @returns {boolean} - Whether to show a notification
 */
export const shouldShowNotification = (newStatus, previousStatus) => {
  return getNotificationConfig(newStatus, previousStatus) !== null;
};

/**
 * Check if user has valid ID for status checking
 * @param {Object} currentUser - Current user object
 * @returns {boolean} - Whether user has valid ID
 */
export const hasValidUserId = (currentUser) => {
  return !!(currentUser?.id || currentUser?._id);
};

/**
 * Normalize status string for consistent comparison
 * @param {string} status - Status string to normalize
 * @returns {string} - Normalized status string
 */
export const normalizeStatus = (status) => {
  return status?.toLowerCase() || '';
};

/**
 * Check if status has changed
 * @param {string} newStatus - New status
 * @param {string} previousStatus - Previous status
 * @returns {boolean} - Whether status has changed
 */
export const hasStatusChanged = (newStatus, previousStatus) => {
  return normalizeStatus(newStatus) !== normalizeStatus(previousStatus);
};

/**
 * Get status polling configuration
 * @returns {Object} - Polling configuration
 */
export const getPollingConfig = () => {
  return {
    interval: 30000, // 30 seconds
    shouldCheckImmediately: true
  };
};

/**
 * Create notification configuration with icon component
 * @param {Object} config - Base notification config
 * @param {Object} iconComponents - Icon components object
 * @returns {Object} - Notification config with icon component
 */
export const createNotificationWithIcon = (config, iconComponents) => {
  if (!config) return null;

  return {
    ...config,
    icon: iconComponents[config.icon] || iconComponents.Info
  };
};