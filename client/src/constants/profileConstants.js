import {
  User,
  Settings,
  Bell,
  Shield,
  Briefcase
} from "lucide-react";

/**
 * Profile constants and configuration
 */

// Navigation tabs configuration
export const PROFILE_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell }
];

// User status color mappings
export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 border-green-200',
  suspended: 'bg-red-100 text-red-800 border-red-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200'
};

// User role icon mappings
export const ROLE_ICONS = {
  admin: Shield,
  recruiter: Briefcase,
  default: User
};

// File upload configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  MAX_SIZE_DISPLAY: '5MB'
};

// Form field configurations
export const FORM_FIELDS = {
  basic: [
    { name: 'name', label: 'Full Name', type: 'text', icon: null, required: true },
    { name: 'email', label: 'Email Address', type: 'email', icon: 'Mail', disabled: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: 'Phone', required: false },
    { name: 'location', label: 'Location', type: 'text', icon: 'MapPin', required: false }
  ],
  professional: [
    { name: 'company', label: 'Company', type: 'text', icon: 'Briefcase', required: false },
    { name: 'position', label: 'Position', type: 'text', icon: null, required: false },
    { name: 'website', label: 'Website', type: 'url', icon: null, required: false },
    { name: 'bio', label: 'Bio', type: 'textarea', icon: null, required: false }
  ]
};

// Notification preferences configuration
export const NOTIFICATION_PREFERENCES = [
  {
    key: 'applicationAlerts',
    label: 'Application Status Alerts',
    description: 'Receive emails when your job applications are accepted or rejected',
    icon: Bell,
    defaultValue: true
  }
];

// Default notification settings
export const DEFAULT_NOTIFICATIONS = {
  email: true,
  push: true,
  sms: false,
  applicationAlerts: true
};

// Animation variants for framer-motion
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  },
  tab: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  content: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  }
};