// Hero component constants
export const HERO_CONSTANTS = {
  // Company logos
  COMPANY_LOGOS: [
    'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
    'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
    'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
  ],

  // Popular search tags
  POPULAR_TAGS: [
    "Developer",
    "Designer",
    "Marketing",
    "Remote",
    "Manager",
  ],

  // Statistics data
  STATS: [
    { icon: 'FiBriefcase', number: "50K+", label: "Active Jobs" },
    { icon: 'FiUsers', number: "1M+", label: "Job Seekers" },
    { icon: 'FiTrendingUp', number: "95%", label: "Success Rate" }
  ],

  // Content
  CONTENT: {
    TITLE: {
      MAIN: "Find Your Dream Job",
      HIGHLIGHT: "Dream Job",
      BRAND: "Jobly",
      WITH: "With"
    },
    SUBTITLE: "Connect with top employers and discover opportunities that match your ambitions. Your career transformation begins today.",
    SEARCH_PLACEHOLDER: "Search jobs, companies, locations...",
    SEARCH_BUTTON: "Search Jobs",
    POPULAR_SEARCHES_LABEL: "Popular Searches:",
    TRUSTED_BY: "Trusted By",
    TRUSTED_DESCRIPTION: "Innovative companies worldwide"
  },

  // Animation configurations
  ANIMATIONS: {
    CONTAINER: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: "easeOut" }
    },
    TITLE: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.2, duration: 0.8 }
    },
    SUBTITLE: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.4, duration: 0.8 }
    },
    STATS: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.5, duration: 0.8 }
    },
    SEARCH_FORM: {
      initial: { opacity: 0, y: 30, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { delay: 0.6, duration: 0.8, type: "spring", damping: 20 }
    },
    TAGS: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.8, duration: 0.8 }
    },
    TRUSTED_SECTION: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 }
    },
    LOGO_ITEM: (index) => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: {
        delay: index * 0.1,
        duration: 0.4
      }
    }),
    ACCENT_LINE: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.8, duration: 0.4 }
    }
  },

  // Timing configurations
  TIMING: {
    SCROLL_DELAY: 100,
    TAG_ANIMATION_DELAY_BASE: 0.9,
    TAG_ANIMATION_DELAY_INCREMENT: 0.1
  },

  // Scroll behavior
  SCROLL_CONFIG: {
    BEHAVIOR: 'smooth',
    BLOCK: 'start'
  },

  // CSS Classes
  CLASSES: {
    MAIN_CONTAINER: "relative overflow-hidden mx-4 my-6 lg:mx-8 lg:my-10 rounded-3xl shadow-2xl",
    GRADIENT_BACKGROUND: "absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900",
    ANIMATED_ELEMENTS: "absolute inset-0 opacity-20",
    GLOW_PARTICLES: [
      "absolute w-2 h-2 bg-white rounded-full top-1/4 left-1/4 animate-pulse",
      "absolute w-1 h-1 bg-emerald-300 rounded-full top-1/2 left-1/2 animate-pulse",
      "absolute w-1.5 h-1.5 bg-blue-300 rounded-full top-3/4 left-3/4 animate-pulse"
    ],
    BLUR_ELEMENTS: [
      "absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse",
      "absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
    ],
    OVERLAY: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent",
    CONTENT_WRAPPER: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40",
    TITLE: "text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6",
    TITLE_HIGHLIGHT: "text-emerald-400",
    TITLE_BRAND: "bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent",
    SUBTITLE: "text-xl text-white/90 max-w-2xl mx-auto mb-10",
    STATS_CONTAINER: "flex flex-wrap justify-center gap-8 mb-10",
    STAT_ITEM: "flex items-center space-x-2 text-white/80",
    STAT_ICON: "text-emerald-400 text-xl",
    STAT_NUMBER: "font-bold text-xl",
    STAT_LABEL: "text-sm",
    SEARCH_FORM_CONTAINER: "max-w-4xl mx-auto group",
    GLOW_EFFECT: "absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity duration-500",
    SEARCH_FORM: "relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20",
    SEARCH_INPUT_CONTAINER: "flex-1 flex items-center px-6 py-5",
    SEARCH_ICON: "text-gray-400 group-hover/input:text-blue-500 text-xl mr-4 transition-colors duration-200",
    SEARCH_INPUT: "w-full text-lg outline-none placeholder-gray-400 bg-transparent font-medium",
    SEARCH_BUTTON: "relative bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-700 hover:to-blue-800 text-white px-8 py-5 font-bold text-lg flex items-center justify-center transition-all duration-300 overflow-hidden group/button",
    SEARCH_BUTTON_SHINE: "absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300",
    SEARCH_BUTTON_TEXT: "relative z-10",
    SEARCH_BUTTON_ICON: "ml-3 relative z-10 group-hover/button:translate-x-1 transition-transform duration-200",
    TAGS_CONTAINER: "mt-8 text-white/80",
    TAGS_LABEL: "mr-4 text-lg font-medium",
    TAGS_GRID: "flex flex-wrap justify-center gap-3 mt-3",
    TAG_BUTTON: "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden group/tag",
    TAG_BUTTON_ACTIVE: "bg-white/30 text-white shadow-lg",
    TAG_BUTTON_INACTIVE: "bg-white/10 hover:bg-white/20 backdrop-blur-sm",
    TAG_BUTTON_HOVER: "absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-blue-400/30 opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300",
    TAG_BUTTON_TEXT: "relative z-10",
    TRUSTED_SECTION: "py-7 px-4 max-w-6xl mx-auto",
    TRUSTED_HEADER: "text-center mb-12",
    TRUSTED_LABEL: "text-xs font-medium text-gray-500 uppercase tracking-wide mb-2",
    TRUSTED_TITLE: "text-base text-gray-700 font-normal",
    LOGOS_CONTAINER: "flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16",
    LOGO_ITEM: "relative group cursor-pointer flex-shrink-0",
    LOGO_WRAPPER: "w-20 h-12 flex items-center justify-center",
    LOGO_IMAGE: "max-h-full max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-300",
    ACCENT_LINE: "flex justify-center mt-12",
    ACCENT_DIVIDER: "w-12 h-px bg-gray-300"
  },

  // Animation delays for background elements
  BACKGROUND_ANIMATION_DELAYS: {
    PARTICLE_2: '1s',
    PARTICLE_3: '2s',
    BLUR_2: '2s'
  },

  // Interactive elements
  INTERACTIONS: {
    STAT_HOVER: { scale: 1.05, color: "#ffffff" },
    SEARCH_BUTTON_HOVER: { scale: 1.02 },
    SEARCH_BUTTON_TAP: { scale: 0.98 },
    TAG_HOVER: { scale: 1.05, y: -2 },
    TAG_TAP: { scale: 0.95 },
    LOGO_HOVER: { scale: 1.05 },
    GLOW_ANIMATION: {
      scale: [1, 1.02, 1],
      transition: { duration: 3, repeat: Infinity }
    },
    SHINE_ANIMATION: {
      initial: { x: "-100%" },
      whileHover: { x: "100%" },
      transition: { duration: 0.6 }
    }
  }
};