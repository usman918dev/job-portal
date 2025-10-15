import { buildJobSearchParams, buildJobsApiUrl, sortJobsByDate } from '../utils/jobListingUtils.js';
import { JOB_LISTING_CONSTANTS } from '../constants/jobListingConstants.js';

/**
 * Fetches jobs from the API with pagination and search support
 * @param {object} params - Parameters for the API call
 * @param {string} params.backendUrl - Base backend URL
 * @param {number} params.page - Current page number
 * @param {number} params.limit - Jobs per page
 * @param {string} params.search - Search query (optional)
 * @returns {Promise<object>} - Object containing jobs array and pagination data
 */
export const fetchJobs = async ({ backendUrl, page, limit, search }) => {
  try {
    // Build query parameters
    const params = buildJobSearchParams({ page, limit, search });

    // Build final API URL
    const finalUrl = buildJobsApiUrl(backendUrl, params);

    console.log("Final API URL:", finalUrl);

    const response = await fetch(finalUrl);
    if (!response.ok) {
      throw new Error(JOB_LISTING_CONSTANTS.ERRORS.FETCH_FAILED);
    }

    const data = await response.json();

    // Handle paginated response
    const jobsArray = data.jobs || [];
    const paginationData = data.pagination || null;

    // Sort jobs by date (most recent first)
    const sortedJobs = sortJobsByDate(jobsArray);

    return {
      jobs: sortedJobs,
      pagination: paginationData,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

/**
 * Fetches jobs with error handling and fallback
 * @param {object} params - Parameters for the API call
 * @returns {Promise<object>} - Object containing jobs array and pagination data, or empty on error
 */
export const fetchJobsWithFallback = async (params) => {
  try {
    return await fetchJobs(params);
  } catch (error) {
    // Return empty state instead of throwing
    return {
      jobs: [],
      pagination: null,
    };
  }
};