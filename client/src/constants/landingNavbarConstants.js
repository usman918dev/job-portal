// LandingNavbar component constants
export const LANDING_NAVBAR_CONSTANTS = {
  // Scroll threshold for navbar styling
  SCROLL_THRESHOLD: 20,

  // Auth modes
  AUTH_MODES: {
    SIGN_UP: 'Sign Up',
    LOGIN: 'Login'
  },

  // Navigation paths
  NAVIGATION: {
    ADMIN: '/admin'
  },

  // Content strings
  CONTENT: {
    BRAND_NAME: 'Jobly',
    BRAND_TAGLINE: 'Find Your Future',
    RECRUITER_PORTAL: 'Recruiter Portal',
    SIGN_IN: 'Sign In',
    GET_STARTED: 'Get Started'
  },

  // Animation configurations
  ANIMATIONS: {
    NAV_INITIAL: { y: -100, opacity: 0 },
    NAV_ANIMATE: { y: 0, opacity: 1 },
    NAV_TRANSITION: { duration: 0.6, ease: "easeOut" },

    LOGO_INITIAL: { opacity: 0, x: -20 },
    LOGO_ANIMATE: { opacity: 1, x: 0 },
    LOGO_TRANSITION: { delay: 0.2, duration: 0.5 },

    DESKTOP_NAV_INITIAL: { opacity: 0 },
    DESKTOP_NAV_ANIMATE: { opacity: 1 },
    DESKTOP_NAV_TRANSITION: { delay: 0.3, duration: 0.5 },

    DESKTOP_AUTH_INITIAL: { opacity: 0, x: 20 },
    DESKTOP_AUTH_ANIMATE: { opacity: 1, x: 0 },
    DESKTOP_AUTH_TRANSITION: { delay: 0.4, duration: 0.5 },

    MOBILE_BUTTON_INITIAL: { opacity: 0 },
    MOBILE_BUTTON_ANIMATE: { opacity: 1 },
    MOBILE_BUTTON_TRANSITION: { delay: 0.4, duration: 0.5 },

    MOBILE_MENU_INITIAL: { opacity: 0, height: 0 },
    MOBILE_MENU_TRANSITION: { duration: 0.3 }
  }
};