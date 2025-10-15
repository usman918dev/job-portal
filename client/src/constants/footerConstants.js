// Footer component constants
export const FOOTER_CONSTANTS = {
  // Animation variants
  CONTAINER_VARIANTS: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  },

  ITEM_VARIANTS: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  },

  // Social media links
  SOCIAL_LINKS: [
    {
      name: 'twitter',
      url: 'https://x.com/mzher_x',
      icon: 'twitter'
    },
    {
      name: 'linkedin',
      url: 'https://www.linkedin.com/in/noman-aslam-8365a6261/',
      icon: 'linkedin'
    },
    {
      name: 'github',
      url: 'https://github.com/nomanaslam1696',
      icon: 'github'
    },
    {
      name: 'instagram',
      url: 'https://instagram.com/mzherx',
      icon: 'instagram'
    }
  ],

  // Navigation links
  NAVIGATION_LINKS: {
    main: [
      { name: 'Home', href: '/', icon: 'home' },
      { name: 'Dashboard', href: '/', icon: 'dashboard' },
      { name: 'Jobs', href: '/', icon: 'jobs' },
      { name: 'Features', href: '/', icon: 'features' }
    ],
    jobSeekers: [
      'Resume Builder',
      'Job Listings',
      'Career Guidance',
      'Skill Development',
      'Interview Prep'
    ],
    resources: [
      'FAQs',
      'Quick Start',
      'Documentation',
      'User Guide',
      'Blog'
    ],
    support: [
      'Customer Support',
      'Cookies Policy',
      'License Info',
      'Terms & Conditions',
      'Privacy Policy'
    ]
  },

  // Form configuration
  FORM_CONFIG: {
    EMAIL_PLACEHOLDER: 'Your email address',
    SUBMIT_BUTTON_TEXT: 'Subscribe Now',
    SUCCESS_MESSAGE: 'Subscribed!',
    SUCCESS_TIMEOUT: 3000
  },

  // Branding
  BRAND: {
    NAME: 'Jobly',
    LOGO_TEXT: 'P',
    TAGLINE: 'The future of professional networking and career development.',
    NEWSLETTER_TITLE: 'Join the Jobly Community',
    NEWSLETTER_DESCRIPTION: 'Stay ahead with the latest job opportunities, career insights, and exclusive resources delivered straight to your inbox.'
  },

  // Footer sections
  SECTIONS: {
    NEWSLETTER: 'newsletter',
    MAIN: 'main',
    JOB_SEEKERS: 'jobSeekers',
    RESOURCES: 'resources',
    SUPPORT: 'support',
    SOCIAL: 'social',
    BOTTOM: 'bottom'
  },

  // Animation delays
  ANIMATION_DELAYS: {
    SOCIAL: 0.5,
    BOTTOM: 0.7
  },

  // CSS classes
  CLASSES: {
    GRADIENT_LINE: 'background-animate',
    GRADIENT_ANIMATION: `
      .background-animate {
        background-size: 200%;
        animation: gradient 8s ease infinite;
      }

      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `
  }
};