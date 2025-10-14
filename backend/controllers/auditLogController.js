import { 
  getAuditLogs, 
  getAuditLogStats, 
  getUniqueActions,
  deleteOldLogs 
} from '../services/auditLogService.js';

/**
 * Get all audit logs with pagination and filtering
 * GET /api/audit/logs
 */
export const getAllAuditLogs = async (req, res) => {
  try {
    console.log('🔍 getAllAuditLogs called with query:', req.query);
    
    const {
      page,
      limit,
      action,
      adminId,
      startDate,
      endDate,
      sortBy,
      sortOrder
    } = req.query;

    const result = await getAuditLogs({
      page,
      limit,
      action,
      adminId,
      startDate,
      endDate,
      sortBy,
      sortOrder
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getAllAuditLogs controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch audit logs'
    });
  }
};

/**
 * Get audit log statistics
 * GET /api/audit/stats
 */
export const getStats = async (req, res) => {
  try {
    const result = await getAuditLogStats();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getStats controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch audit log statistics'
    });
  }
};

/**
 * Get list of unique actions
 * GET /api/audit/actions
 */
export const getActions = async (req, res) => {
  try {
    const result = await getUniqueActions();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getActions controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch actions'
    });
  }
};

/**
 * Delete old audit logs (admin cleanup)
 * DELETE /api/audit/cleanup
 */
export const cleanupOldLogs = async (req, res) => {
  try {
    const { daysOld = 90 } = req.query;
    
    const result = await deleteOldLogs(parseInt(daysOld));
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in cleanupOldLogs controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cleanup old logs'
    });
  }
};

export default {
  getAllAuditLogs,
  getStats,
  getActions,
  cleanupOldLogs
};
