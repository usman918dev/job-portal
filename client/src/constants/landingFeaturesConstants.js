// LandingFeatures component constants
export const LANDING_FEATURES_CONSTANTS = {
  // Features data
  FEATURES: [
    {
      icon: 'Search',
      title: "Smart Job Matching",
      description: "Our AI-powered algorithm matches you with the perfect job opportunities based on your skills, experience, and preferences.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: 'Users',
      title: "Top Companies",
      description: "Connect with leading companies across industries. From startups to Fortune 500, find your next career opportunity.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: 'Shield',
      title: "Secure & Private",
      description: "Your personal information is protected with enterprise-grade security. Control who sees your profile and when.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: 'Zap',
      title: "Instant Alerts",
      description: "Get notified immediately when new jobs matching your criteria are posted. Never miss an opportunity again.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: 'Target',
      title: "Career Guidance",
      description: "Get personalized career advice and insights to help you make informed decisions about your professional journey.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: 'Globe',
      title: "Global Opportunities",
      description: "Explore job opportunities worldwide. Find remote work or relocate to your dream destination with ease.",
      color: "from-teal-500 to-blue-500"
    }
  ],

  // Animation variants
  CONTAINER_VARIANTS: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },

  ITEM_VARIANTS: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  },

  // Auth modes
  AUTH_MODES: {
    SIGN_UP: 'Sign Up'
  }
};