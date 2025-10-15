// LandingStats component constants
export const LANDING_STATS_CONSTANTS = {
  // Stats data
  STATS: [
    {
      number: "50,000+",
      label: "Active Job Listings",
      sublabel: "Updated daily",
      icon: 'Briefcase',
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "1M+",
      label: "Registered Users",
      sublabel: "Growing community",
      icon: 'Users',
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "95%",
      label: "Success Rate",
      sublabel: "Job placement",
      icon: 'TrendingUp',
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "500+",
      label: "Partner Companies",
      sublabel: "Trusted employers",
      icon: 'Award',
      color: "from-orange-500 to-red-500"
    },
    {
      number: "50+",
      label: "Countries",
      sublabel: "Global reach",
      icon: 'Globe',
      color: "from-indigo-500 to-purple-500"
    },
    {
      number: "24/7",
      label: "Support",
      sublabel: "Always here to help",
      icon: 'Clock',
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
  }
};