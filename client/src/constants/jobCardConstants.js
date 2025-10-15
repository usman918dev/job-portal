export const JOB_CARD_CONSTANTS = {
  // Animation configurations
  ANIMATIONS: {
    CARD_INITIAL: { opacity: 0, y: 30 },
    CARD_ANIMATE: { opacity: 1, y: 0 },
    CARD_TRANSITION: { duration: 0.6, ease: "easeOut" },
    HOVER_SCALE: 1.02,
    HOVER_TRANSITION: { type: "spring", stiffness: 300 },
    BUTTON_TAP: { scale: 0.9 },
    SKILL_HOVER: { scale: 1.05 },
    FOOTER_BUTTON_HOVER: { scale: 1.03 },
    FOOTER_BUTTON_TAP: { scale: 0.97 },
  },

  // Viewport settings
  VIEWPORT: { once: true },

  // Content strings
  CONTENT: {
    NEW_RIBBON: "NEW",
    SAVE_JOB_TITLE: "Save job",
    SAVED_TITLE: "Saved",
    REMOTE_LOCATION: "Remote",
    INTERMEDIATE_LEVEL: "Intermediate",
    SALARY_AVAILABLE: "Salary available",
    NO_DESCRIPTION: "No description provided",
    RECENTLY_POSTED: "Recently posted",
    JUST_NOW: "Just now",
    LEARN_MORE: "Learn More",
    APPLY_NOW: "Apply Now",
    POSTED_PREFIX: "Posted ",
    SKILLS_MORE_SUFFIX: " more",
    JOB_TITLE_FALLBACK: "Job Title",
    COMPANY_FALLBACK: "Company",
  },

  // Time formatting
  TIME_UNITS: {
    MINUTE_MS: 60000,
    HOUR_MINUTES: 60,
    DAY_HOURS: 24,
  },

  // Skills display
  SKILLS_DISPLAY_LIMIT: 4,

  // CSS Classes
  CLASSES: {
    // Main container
    container: "relative group p-1 rounded-2xl bg-gradient-to-tr from-white to-[#f9f9f9] border border-gray-200 hover:border-indigo-400 shadow-xl hover:shadow-2xl backdrop-blur-md transition-all duration-300",
    card: "bg-white rounded-2xl overflow-hidden",

    // Ribbon
    ribbon: "absolute top-4 right-4 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold shadow-md z-10 animate-pulse",

    // Header
    header: "p-6 pb-3 flex justify-between items-start",
    logoContainer: "w-14 h-14 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm",
    logo: "w-full h-full object-contain p-1",
    title: "text-lg font-bold text-zinc-800",
    company: "text-sm text-gray-500",
    bookmarkButton: "p-2 rounded-full text-xl transition",
    bookmarkSaved: "text-indigo-500",
    bookmarkUnsaved: "text-gray-400 hover:text-indigo-600",

    // Tags
    tagsContainer: "px-6 pb-4 flex flex-wrap gap-2 text-xs font-medium",
    locationTag: "flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700",
    levelTag: "flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-pink-600",
    salaryTag: "flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600",
    typeTag: "flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-600",

    // Description
    descriptionContainer: "px-6 pb-4",
    description: "text-sm text-gray-600 leading-relaxed cursor-pointer hover:text-black",
    descriptionExpanded: "",
    descriptionCollapsed: "line-clamp-3",

    // Skills
    skillsContainer: "px-6 pb-4",
    skillsList: "flex flex-wrap gap-2",
    skillTag: "px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium",
    moreSkillsTag: "text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500",

    // Footer
    footer: "px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center",
    postedTime: "text-xs text-gray-500",
    footerButtons: "flex gap-2",
    learnMoreButton: "px-4 py-2 text-xs font-semibold text-indigo-600 border border-indigo-500 rounded-md hover:bg-indigo-50 transition",
    applyNowButton: "px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 rounded-md hover:shadow-md",
  },

  // Default props
  DEFAULT_PROPS: {
    job: {
      title: "",
      companyId: { name: "", image: "" },
      location: "",
      level: "",
      salary: null,
      type: "",
      description: "",
      skills: [],
      postedAt: null,
      _id: "",
    },
  },
};