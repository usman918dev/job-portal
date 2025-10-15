// Status Notification Constants
export const STATUS_TYPES = {
  SUSPENDED: 'suspended',
  ACTIVE: 'active',
  PENDING: 'pending'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const NOTIFICATION_CONFIGS = {
  [STATUS_TYPES.SUSPENDED]: {
    type: NOTIFICATION_TYPES.ERROR,
    icon: 'XCircle',
    title: 'Account Suspended',
    message: 'Your account has been suspended. Please contact support for assistance.',
    duration: 0 // Don't auto-hide
  },
  [STATUS_TYPES.ACTIVE]: {
    type: NOTIFICATION_TYPES.SUCCESS,
    icon: 'CheckCircle',
    title: 'Account Restored',
    message: 'Your account has been reactivated. Welcome back!',
    duration: 5000,
    condition: (previousStatus) => previousStatus?.toLowerCase() === STATUS_TYPES.SUSPENDED
  },
  [STATUS_TYPES.PENDING]: {
    type: NOTIFICATION_TYPES.WARNING,
    icon: 'AlertCircle',
    title: 'Account Under Review',
    message: 'Your account is currently under review. You may experience limited access.',
    duration: 7000
  },
  DEFAULT: {
    type: NOTIFICATION_TYPES.INFO,
    icon: 'Info',
    title: 'Account Status Updated',
    message: 'Your account status has been changed.',
    duration: 5000
  }
};

export const ANIMATION_VARIANTS = {
  container: {
    initial: { opacity: 0, y: -100, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -100, scale: 0.95 }
  }
};

export const POLLING_CONFIG = {
  INTERVAL: 30000, // 30 seconds
  IMMEDIATE_CHECK: true
};

export const COLOR_SCHEMES = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    container: 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-200 text-green-800 shadow-green-500/20',
    icon: 'text-green-600',
    iconBg: 'bg-white/30'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    container: 'bg-gradient-to-r from-red-50 to-pink-100 border-red-200 text-red-800 shadow-red-500/20',
    icon: 'text-red-600',
    iconBg: 'bg-white/30'
  },
  [NOTIFICATION_TYPES.WARNING]: {
    container: 'bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-200 text-yellow-800 shadow-yellow-500/20',
    icon: 'text-yellow-600',
    iconBg: 'bg-white/30'
  },
  [NOTIFICATION_TYPES.INFO]: {
    container: 'bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200 text-blue-800 shadow-blue-500/20',
    icon: 'text-blue-600',
    iconBg: 'bg-white/30'
  }
};

export const POSITIONING = {
  container: 'fixed top-6 right-6 z-50 max-w-md'
};