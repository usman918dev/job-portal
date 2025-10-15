// JobApplicationModal component services
import api from './api';
import { JOB_APPLICATION_MODAL_CONSTANTS } from '../constants/jobApplicationModalConstants.js';

/**
 * Checks if file upload service is available
 * @returns {Promise<boolean>} - Whether upload is enabled
 */
export const checkUploadStatus = async () => {
  try {
    const response = await api.get(JOB_APPLICATION_MODAL_CONSTANTS.API_ENDPOINTS.UPLOAD_STATUS);
    return response.data.uploadEnabled;
  } catch (error) {
    console.warn('Could not check upload status:', error);
    return false;
  }
};

/**
 * Uploads a resume file to the server
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<object>} - Upload response
 */
export const uploadResume = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post(JOB_APPLICATION_MODAL_CONSTANTS.API_ENDPOINTS.UPLOAD_RESUME, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });

  return response;
};

/**
 * Submits a job application
 * @param {object} applicationData - Application data
 * @param {string} applicationData.jobId - Job ID
 * @param {string} applicationData.coverLetter - Cover letter text
 * @param {string} applicationData.resumeUrl - Resume URL
 * @param {string} applicationData.userId - User ID (email)
 * @param {string} applicationData.availableFrom - Available from date
 * @returns {Promise<object>} - Submission response
 */
export const submitApplication = async (applicationData) => {
  const response = await api.post(JOB_APPLICATION_MODAL_CONSTANTS.API_ENDPOINTS.SUBMIT_APPLICATION, {
    jobId: applicationData.jobId,
    coverLetter: applicationData.coverLetter,
    resumeUrl: applicationData.resumeUrl,
    availableFrom: applicationData.availableFrom
  });

  return response;
};