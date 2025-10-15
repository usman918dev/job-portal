// ForgotPasswordForm component constants
export const FORGOT_PASSWORD_CONSTANTS = {
  // Email validation
  EMAIL_REGEX: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,

  // Form configuration
  FORM_CONFIG: {
    EMAIL_PLACEHOLDER: 'Enter your email',
    EMAIL_LABEL: 'Email Address',
    SUBMIT_BUTTON_TEXT: 'Send Reset Link',
    BACK_BUTTON_TEXT: 'Back to Sign In',
    LOADING_TEXT: 'Sending...',
  },

  // Messages
  MESSAGES: {
    EMAIL_REQUIRED: 'Please enter your email address',
    EMAIL_INVALID: 'Please enter a valid email address',
    SUCCESS: 'Password reset link sent! Please check your email.',
    ERROR_DEFAULT: 'Failed to send password reset email',
    SUCCESS_TITLE: 'Check Your Email',
    SUCCESS_DESCRIPTION: (email) => `We've sent a password reset link to ${email}`,
    SUCCESS_EXPIRY: 'The link will expire in 15 minutes for security reasons.',
    SEND_ANOTHER: 'Send Another Email',
  },

  // Animation variants
  ANIMATION_VARIANTS: {
    container: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    },
    successContainer: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    },
    buttonHover: { scale: 1.02 },
    buttonTap: { scale: 0.98 },
    loadingButtonHover: { scale: 1 },
    loadingButtonTap: { scale: 1 },
  },

  // UI Configuration
  UI_CONFIG: {
    ICON_SIZE: {
      main: 'w-8 h-8',
      small: 'w-4 h-4'
    },
    COLORS: {
      primary: 'from-blue-600 to-indigo-600',
      primaryHover: 'from-blue-700 to-indigo-700',
      success: 'bg-green-100',
      successIcon: 'text-green-600',
      primaryIcon: 'text-blue-600',
      gray: 'bg-gray-100',
      grayHover: 'hover:bg-gray-200',
      grayText: 'text-gray-700',
    },
    SIZES: {
      iconContainer: 'w-16 h-16',
      button: 'py-3 px-4',
      input: 'px-4 py-3',
    }
  },

  // Timing
  TIMING: {
    SUCCESS_MESSAGE_DELAY: 3000,
  },

  // CSS Classes
  CLASSES: {
    input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
    inputDisabled: 'disabled:opacity-70 disabled:cursor-not-allowed',
    buttonPrimary: 'w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2',
    buttonSecondary: 'w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2',
    spinner: 'w-4 h-4 border-2 border-white border-t-transparent rounded-full',
  }
};