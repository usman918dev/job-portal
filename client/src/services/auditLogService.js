import api from './api';

/**
 * Audit Logs Service
 * API calls for audit logging functionality
 */

/**
 * Fetch all audit logs with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise} - API response with logs and pagination
 */
export const fetchAuditLogs = async (params = {}) => {
  try {
    const response = await api.get('/api/audit/logs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

/**
 * Fetch audit log statistics
 * @returns {Promise} - API response with stats
 */
export const fetchAuditLogStats = async () => {
  try {
    const response = await api.get('/api/audit/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching audit log stats:', error);
    throw error;
  }
};

/**
 * Fetch unique actions list
 * @returns {Promise} - API response with actions array
 */
export const fetchUniqueActions = async () => {
  try {
    const response = await api.get('/api/audit/actions');
    return response.data;
  } catch (error) {
    console.error('Error fetching unique actions:', error);
    throw error;
  }
};

/**
 * Cleanup old audit logs
 * @param {Number} daysOld - Delete logs older than this many days
 * @returns {Promise} - API response
 */
export const cleanupOldAuditLogs = async (daysOld = 90) => {
  try {
    const response = await api.delete('/api/audit/cleanup', {
      params: { daysOld }
    });
    return response.data;
  } catch (error) {
    console.error('Error cleaning up old logs:', error);
    throw error;
  }
};

export default {
  fetchAuditLogs,
  fetchAuditLogStats,
  fetchUniqueActions,
  cleanupOldAuditLogs
};
