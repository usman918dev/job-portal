export const JOB_LISTING_CONSTANTS = {
  // Pagination settings
  PAGINATION: {
    JOBS_PER_PAGE: 9,
    MAX_PAGE_BUTTONS: 3,
  },

  // Animation configurations
  ANIMATIONS: {
    SEARCH_HEADER_INITIAL: { opacity: 0, y: -20 },
    SEARCH_HEADER_ANIMATE: { opacity: 1, y: 0 },
    GRID_INITIAL: { opacity: 0 },
    GRID_ANIMATE: { opacity: 1 },
    GRID_TRANSITION: { duration: 0.5 },
    CARD_INITIAL: { opacity: 0, y: 20 },
    CARD_ANIMATE: { opacity: 1, y: 0 },
    CARD_EXIT: { opacity: 0, y: -20 },
    CARD_TRANSITION: { duration: 0.25 },
    CARD_HOVER: { y: -6, scale: 1.01 },
    CARD_TAP: { scale: 0.99 },
    LOGO_HOVER: { rotate: 2, scale: 1.03 },
    APPLY_BUTTON_HOVER: { scale: 1.02 },
    APPLY_BUTTON_TAP: { scale: 0.98 },
  },

  // API endpoints
  API: {
    JOBS_ENDPOINT: '/api/jobs',
  },

  // Content strings
  CONTENT: {
    SEARCH_RESULTS_TITLE: "Search Results",
    SEARCH_RESULTS_SUBTITLE: "Jobs matching",
    CLEAR_SEARCH: "Clear search",
    SEARCH_PLACEHOLDER: "Search for jobs...",
    NO_JOBS_SEARCH: "No jobs found matching",
    NO_JOBS_AVAILABLE: "No jobs available at the moment.",
    TRY_ADJUSTING_SEARCH: "Try adjusting your search terms.",
    POSTED_LABEL: "Posted:",
    APPLY_NOW: "Apply Now",
    PREVIOUS: "Previous",
    NEXT: "Next",
    SHOWING_PAGE: "Showing page",
    OF: "of",
    TOTAL_JOBS: "total jobs",
    JOB_TYPE_FALLBACK: "N/A",
    SALARY_FALLBACK: "Salary: N/A",
    DATE_FALLBACK: "N/A",
  },

  // CSS Classes
  CLASSES: {
    // Main container
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",

    // Search header
    searchHeader: "mb-6 text-center",
    searchTitle: "text-2xl font-bold text-gray-800 mb-2",
    searchSubtitle: "text-gray-600",
    clearSearchButton: "mt-2 text-blue-600 hover:text-blue-800 underline text-sm",

    // Search input
    searchInputContainer: "mb-6",
    searchInput: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent",

    // Loading state
    loadingContainer: "flex justify-center items-center py-12",
    loadingSpinner: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500",

    // Job grid
    jobGrid: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",

    // Empty state
    emptyState: "col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-600",

    // Job card
    jobCard: "group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-transparent",
    borderReveal: "pointer-events-none absolute",
    borderTop: "top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-200",
    borderRight: "top-0 right-0 w-[2px] h-0 bg-gradient-to-b from-indigo-600 to-blue-600 group-hover:h-full transition-all duration-200 delay-100",
    borderBottom: "bottom-0 right-0 h-[2px] w-0 bg-gradient-to-l from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-200 delay-200",
    borderLeft: "bottom-0 left-0 w-[2px] h-0 bg-gradient-to-t from-indigo-600 to-blue-600 group-hover:h-full transition-all duration-200 delay-300",
    cardContent: "p-6",

    // Job card header
    cardHeader: "flex items-center justify-between mb-4",
    companyLogo: "w-12 h-12 rounded-full object-cover bg-gray-100 ring-0 group-hover:ring-2 group-hover:ring-indigo-100 transition-all",
    jobTypeBadge: "px-3 py-1 text-sm text-indigo-600 bg-indigo-100 rounded-full",

    // Job card content
    jobTitle: "text-xl font-semibold text-gray-800 mb-2",
    jobCompany: "text-gray-600 mb-2",
    jobLocation: "text-gray-500 mb-2",
    jobSalary: "text-gray-500 mb-4",
    jobPosted: "flex items-center justify-end text-sm text-gray-500",
    applyButton: "mt-4 w-full text-white py-2 px-4 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all duration-300",

    // Pagination
    paginationContainer: "flex justify-center items-center mt-8 space-x-2",
    paginationButton: "px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
    paginationNumbers: "flex space-x-1",
    paginationNumber: "px-3 py-2 text-sm font-medium rounded-md",
    paginationNumberActive: "text-white bg-indigo-600 border border-indigo-600",
    paginationNumberInactive: "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50",

    // Pagination info
    paginationInfo: "text-center mt-4 text-sm text-gray-600",
  },

  // Date field priorities for job posting dates
  DATE_FIELDS: ['postedDate', 'postedAt', 'createdAt', 'date'],

  // Loading states
  LOADING_STATES: {
    INITIAL: true,
    LOADED: false,
  },

  // Error messages
  ERRORS: {
    FETCH_FAILED: "Failed to fetch jobs",
  },
};