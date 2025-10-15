import { JOB_LISTING_CONSTANTS } from '../constants/jobListingConstants.js';

/**
 * Safely resolves and formats a job's posted date from various possible fields
 * @param {object} job - The job object
 * @returns {string|null} - Formatted date string or null
 */
export const getPostedDate = (job) => {
  if (!job) return null;

  // Try different date fields in priority order
  for (const field of JOB_LISTING_CONSTANTS.DATE_FIELDS) {
    const raw = job[field];
    if (raw) {
      const date = new Date(raw);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }
  }

  return null;
};

/**
 * Converts a job to a timestamp for sorting purposes
 * @param {object} job - The job object
 * @returns {number} - Timestamp for sorting (0 if invalid)
 */
export const getJobTimestamp = (job) => {
  if (!job) return 0;

  // Try different date fields in priority order
  for (const field of JOB_LISTING_CONSTANTS.DATE_FIELDS) {
    const raw = job[field];
    if (raw) {
      const date = new Date(raw);
      if (!isNaN(date.getTime())) {
        return date.getTime();
      }
    }
  }

  return 0;
};

/**
 * Sorts jobs by date (most recent first)
 * @param {Array} jobs - Array of job objects
 * @returns {Array} - Sorted array of jobs
 */
export const sortJobsByDate = (jobs) => {
  if (!Array.isArray(jobs)) return [];

  return [...jobs].sort((a, b) => getJobTimestamp(b) - getJobTimestamp(a));
};

/**
 * Builds URL search parameters for the jobs API
 * @param {object} params - Parameters object
 * @param {number} params.page - Current page number
 * @param {number} params.limit - Jobs per page
 * @param {string} params.search - Search query (optional)
 * @returns {URLSearchParams} - URL search parameters
 */
export const buildJobSearchParams = ({ page, limit, search }) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search.trim()) {
    params.append('search', search.trim());
  }

  return params;
};

/**
 * Builds the complete API URL for fetching jobs
 * @param {string} backendUrl - Base backend URL
 * @param {URLSearchParams} params - Search parameters
 * @returns {string} - Complete API URL
 */
export const buildJobsApiUrl = (backendUrl, params) => {
  return `${backendUrl}${JOB_LISTING_CONSTANTS.API.JOBS_ENDPOINT}?${params.toString()}`;
};

/**
 * Calculates pagination button numbers to display
 * @param {object} pagination - Pagination data from API
 * @returns {Array<number>} - Array of page numbers to display
 */
export const calculatePaginationButtons = (pagination) => {
  const { currentPage, totalPages } = pagination;
  const maxButtons = JOB_LISTING_CONSTANTS.PAGINATION.MAX_PAGE_BUTTONS;

  const startPage = Math.max(
    1,
    Math.min(
      totalPages - maxButtons + 1,
      currentPage - Math.floor(maxButtons / 2)
    )
  );

  const endPage = Math.min(totalPages, startPage + maxButtons - 1);

  const buttons = [];
  for (let i = startPage; i <= endPage; i++) {
    buttons.push(i);
  }

  return buttons;
};

/**
 * Gets the appropriate empty state message
 * @param {boolean} isSearched - Whether a search was performed
 * @param {string} searchQuery - The search query
 * @returns {string} - Empty state message
 */
export const getEmptyStateMessage = (isSearched, searchQuery) => {
  if (isSearched && searchQuery) {
    return `${JOB_LISTING_CONSTANTS.CONTENT.NO_JOBS_SEARCH} "${searchQuery}". ${JOB_LISTING_CONSTANTS.CONTENT.TRY_ADJUSTING_SEARCH}`;
  }
  return JOB_LISTING_CONSTANTS.CONTENT.NO_JOBS_AVAILABLE;
};

/**
 * Gets CSS classes for the component
 * @returns {object} - Object containing all CSS classes
 */
export const getCssClasses = () => {
  return JOB_LISTING_CONSTANTS.CLASSES;
};

/**
 * Gets animation configurations
 * @returns {object} - Animation configuration object
 */
export const getAnimations = () => {
  return JOB_LISTING_CONSTANTS.ANIMATIONS;
};

/**
 * Gets content strings
 * @returns {object} - Content strings object
 */
export const getContent = () => {
  return JOB_LISTING_CONSTANTS.CONTENT;
};