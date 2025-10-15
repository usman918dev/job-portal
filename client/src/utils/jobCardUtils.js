import { JOB_CARD_CONSTANTS } from '../constants/jobCardConstants.js';

/**
 * Strips HTML tags from a string
 * @param {string} html - The HTML string to strip
 * @returns {string} - The plain text string
 */
export const stripHtmlTags = (html) => {
  return html ? html.replace(/<[^>]*>?/gm, "") : JOB_CARD_CONSTANTS.CONTENT.NO_DESCRIPTION;
};

/**
 * Calculates and formats the time passed since a given date
 * @param {string|Date} date - The date to calculate from
 * @returns {string} - Formatted time string
 */
export const getTimePassed = (date) => {
  if (!date) return JOB_CARD_CONSTANTS.CONTENT.RECENTLY_POSTED;

  const diff = Date.now() - new Date(date);
  const mins = Math.floor(diff / JOB_CARD_CONSTANTS.TIME_UNITS.MINUTE_MS);
  const hrs = Math.floor(mins / JOB_CARD_CONSTANTS.TIME_UNITS.HOUR_MINUTES);
  const days = Math.floor(hrs / JOB_CARD_CONSTANTS.TIME_UNITS.DAY_HOURS);

  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return JOB_CARD_CONSTANTS.CONTENT.JUST_NOW;
};

/**
 * Formats salary information for display
 * @param {string|object} salary - The salary data to format
 * @returns {string} - Formatted salary string
 */
export const formatSalary = (salary) => {
  if (!salary) return JOB_CARD_CONSTANTS.CONTENT.SALARY_AVAILABLE;

  if (typeof salary === "string") return salary;

  if (salary.min && salary.max) return `$${salary.min} - $${salary.max}`;

  return salary.amount ? `$${salary.amount}` : JOB_CARD_CONSTANTS.CONTENT.SALARY_AVAILABLE;
};

/**
 * Checks if a job is newly posted (for ribbon display)
 * @param {string|Date} postedAt - The job posting date
 * @returns {boolean} - Whether to show the new ribbon
 */
export const isNewJob = (postedAt) => {
  return getTimePassed(postedAt) === JOB_CARD_CONSTANTS.CONTENT.JUST_NOW;
};

/**
 * Gets the display skills with limit
 * @param {Array} skills - Array of skills
 * @returns {object} - Object with displayed skills and remaining count
 */
export const getDisplaySkills = (skills) => {
  if (!skills || !Array.isArray(skills)) return { displayed: [], remaining: 0 };

  const limit = JOB_CARD_CONSTANTS.SKILLS_DISPLAY_LIMIT;
  const displayed = skills.slice(0, limit);
  const remaining = Math.max(0, skills.length - limit);

  return { displayed, remaining };
};

/**
 * Gets CSS classes for the component
 * @returns {object} - Object containing all CSS classes
 */
export const getCssClasses = () => {
  return JOB_CARD_CONSTANTS.CLASSES;
};

/**
 * Gets animation configurations
 * @returns {object} - Animation configuration object
 */
export const getAnimations = () => {
  return JOB_CARD_CONSTANTS.ANIMATIONS;
};

/**
 * Gets content strings
 * @returns {object} - Content strings object
 */
export const getContent = () => {
  return JOB_CARD_CONSTANTS.CONTENT;
};