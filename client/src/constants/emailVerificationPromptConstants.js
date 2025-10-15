// Email Verification Prompt Constants
export const API_ENDPOINTS = {
  RESEND_VERIFICATION: '/api/auth/resend-verification'
};

export const ANIMATION_VARIANTS = {
  container: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 }
  },
  icon: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { duration: 0.5, delay: 0.2 }
  },
  successMessage: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  },
  button: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    disabled: { scale: 1 }
  },
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
};

export const MESSAGES = {
  SUCCESS_RESEND: 'Verification email sent! Please check your inbox.',
  ERROR_RESEND: 'Failed to resend verification email',
  TITLE: 'Check Your Email',
  SUBTITLE: 'We\'ve sent you a verification link',
  SUCCESS_TITLE: 'Account Created Successfully!',
  EMAIL_SENT_TO: 'We\'ve sent a verification email to:',
  CHECK_INBOX: 'Please check your inbox and click the verification link to activate your account.',
  CHECK_SPAM: 'Don\'t see it? Check your spam/junk folder.',
  RESEND_BUTTON: 'Resend Verification Email',
  BACK_BUTTON: 'Back to Sign In',
  SENDING: 'Sending...',
  ALREADY_VERIFIED: 'Already verified?',
  SIGN_IN_HERE: 'Sign in here'
};

export const STYLING = {
  container: 'bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full mx-4',
  header: 'bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center',
  iconContainer: 'inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4',
  content: 'px-6 py-8',
  emailBox: 'bg-gray-50 rounded-lg px-4 py-3 mb-4',
  successBox: 'bg-green-50 border border-green-200 rounded-lg p-4 mb-6',
  buttonPrimary: 'w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2',
  buttonSecondary: 'w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2',
  link: 'text-blue-600 hover:text-blue-700 font-medium ml-1'
};

export const CONFIG = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
};