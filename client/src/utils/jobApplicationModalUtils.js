// JobApplicationModal component utilities
import { JOB_APPLICATION_MODAL_CONSTANTS } from '../constants/jobApplicationModalConstants.js';

/**
 * Validates if a string is a valid URL
 * @param {string} string - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Validates file type against allowed types
 * @param {File} file - File to validate
 * @returns {boolean} - Whether file type is allowed
 */
export const isValidFileType = (file) => {
  return JOB_APPLICATION_MODAL_CONSTANTS.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type);
};

/**
 * Validates file size against maximum allowed size
 * @param {File} file - File to validate
 * @returns {boolean} - Whether file size is valid
 */
export const isValidFileSize = (file) => {
  return file.size <= JOB_APPLICATION_MODAL_CONSTANTS.FILE_UPLOAD.MAX_SIZE;
};

/**
 * Validates salary format
 * @param {string} salary - Salary string to validate
 * @returns {boolean} - Whether salary format is valid
 */
export const isValidSalaryRange = (salary) => {
  if (!salary || typeof salary !== 'string') return false;
  return JOB_APPLICATION_MODAL_CONSTANTS.SALARY_PATTERNS.VALID_FORMAT.test(salary.trim());
};

/**
 * Validates resume URL format and length
 * @param {string} url - Resume URL to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateResumeUrl = (url) => {
  if (!url || !url.trim()) {
    return { isValid: false, error: null }; // No error for empty URL if file is uploaded
  }

  if (!isValidUrl(url)) {
    return { isValid: false, error: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.RESUME_URL_INVALID };
  }

  if (url.length < JOB_APPLICATION_MODAL_CONSTANTS.VALIDATION.RESUME_URL.MIN_LENGTH) {
    return { isValid: false, error: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.RESUME_URL_TOO_SHORT };
  }

  if (url.length > JOB_APPLICATION_MODAL_CONSTANTS.VALIDATION.RESUME_URL.MAX_LENGTH) {
    return { isValid: false, error: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.RESUME_URL_TOO_LONG };
  }

  return { isValid: true, error: null };
};

/**
 * Validates cover letter length
 * @param {string} coverLetter - Cover letter text
 * @returns {object} - Validation result with isValid and error message
 */
export const validateCoverLetter = (coverLetter) => {
  if (coverLetter.length > JOB_APPLICATION_MODAL_CONSTANTS.VALIDATION.COVER_LETTER.MAX_LENGTH) {
    return { isValid: false, error: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.COVER_LETTER_TOO_LONG };
  }

  if (coverLetter.length > 0 && coverLetter.length < JOB_APPLICATION_MODAL_CONSTANTS.VALIDATION.COVER_LETTER.MIN_LENGTH) {
    return { isValid: false, error: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.COVER_LETTER_TOO_SHORT };
  }

  return { isValid: true, error: null };
};

/**
 * Validates available from date
 * @param {string} dateString - Date string to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateAvailableFromDate = (dateString) => {
  if (!dateString) {
    return { isValid: false, error: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.AVAILABLE_FROM_REQUIRED };
  }

  const selectedDate = new Date(dateString);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0); // Reset time to start of day

  if (selectedDate < todayDate) {
    return { isValid: false, error: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.AVAILABLE_FROM_PAST };
  }

  // Check if date is not more than specified years in the future
  const maxFutureDate = new Date();
  maxFutureDate.setFullYear(maxFutureDate.getFullYear() + JOB_APPLICATION_MODAL_CONSTANTS.VALIDATION.DATE_RANGE.MAX_YEARS_FUTURE);

  if (selectedDate > maxFutureDate) {
    return { isValid: false, error: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.AVAILABLE_FROM_TOO_FAR };
  }

  return { isValid: true, error: null };
};

/**
 * Validates the entire form
 * @param {object} formData - Form data object
 * @param {object} uploadedFile - Uploaded file object
 * @returns {object} - Validation result with isValid and errors object
 */
export const validateForm = (formData, uploadedFile) => {
  const errors = {};

  // Resume validation - either uploaded file or URL
  if (!uploadedFile && !formData.resumeUrl.trim()) {
    errors.resume = JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.RESUME_REQUIRED;
  } else if (!uploadedFile && formData.resumeUrl.trim()) {
    const urlValidation = validateResumeUrl(formData.resumeUrl);
    if (!urlValidation.isValid) {
      errors.resumeUrl = urlValidation.error;
    }
  }

  // Cover letter validation
  const coverLetterValidation = validateCoverLetter(formData.coverLetter);
  if (!coverLetterValidation.isValid) {
    errors.coverLetter = coverLetterValidation.error;
  }

  // Available from date validation
  const dateValidation = validateAvailableFromDate(formData.availableFrom);
  if (!dateValidation.isValid) {
    errors.availableFrom = dateValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns {string} - Today's date string
 */
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Gets maximum allowed date (1 year from today)
 * @returns {string} - Maximum date string
 */
export const getMaxDate = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + JOB_APPLICATION_MODAL_CONSTANTS.VALIDATION.DATE_RANGE.MAX_YEARS_FUTURE);
  return maxDate.toISOString().split('T')[0];
};

/**
 * Formats file size in MB
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
  return (bytes / 1024 / 1024).toFixed(2);
};

/**
 * Gets CSS classes for form elements
 * @param {string} element - Element type
 * @param {object} options - Additional options for conditional classes
 * @returns {string} - CSS classes string
 */
export const getCssClasses = (element, options = {}) => {
  let classes = JOB_APPLICATION_MODAL_CONSTANTS.CLASSES[element] || '';

  // Add conditional classes
  if (element === 'UPLOAD_AREA') {
    classes += options.uploadEnabled
      ? ` ${JOB_APPLICATION_MODAL_CONSTANTS.CLASSES.UPLOAD_AREA_ENABLED}`
      : ` ${JOB_APPLICATION_MODAL_CONSTANTS.CLASSES.UPLOAD_AREA_DISABLED}`;
  }

  if (element === 'URL_INPUT') {
    if (options.error) classes += ` ${JOB_APPLICATION_MODAL_CONSTANTS.CLASSES.URL_INPUT_ERROR}`;
    if (options.disabled) classes += ` ${JOB_APPLICATION_MODAL_CONSTANTS.CLASSES.URL_INPUT_DISABLED}`;
  }

  if (element === 'DATE_INPUT' && options.error) {
    classes += ` ${JOB_APPLICATION_MODAL_CONSTANTS.CLASSES.DATE_INPUT_ERROR}`;
  }

  if (element === 'TEXTAREA' && options.error) {
    classes += ` ${JOB_APPLICATION_MODAL_CONSTANTS.CLASSES.TEXTAREA_ERROR}`;
  }

  if (element === 'JOB_FIELD_INPUT' && options.salaryInvalid) {
    classes += ` ${JOB_APPLICATION_MODAL_CONSTANTS.CLASSES.SALARY_INPUT_INVALID}`;
  }

  return classes;
};

/**
 * Gets upload progress text
 * @param {number} progress - Upload progress percentage
 * @returns {string} - Progress text
 */
export const getUploadProgressText = (progress) => {
  return `${JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.UPLOADING_TEXT} ${progress}%`;
};

/**
 * Gets cover letter hint text
 * @param {number} length - Current text length
 * @returns {string} - Hint text
 */
export const getCoverLetterHint = (length) => {
  return JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.COVER_LETTER_HINT(length);
};