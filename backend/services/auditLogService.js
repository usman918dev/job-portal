import AuditLog from '../models/AuditLog.js';

/**
 * Audit Log Service
 * Business logic for managing audit logs
 */

/**
 * Get all audit logs with pagination and filtering
 * @param {Object} options - Query options
 * @param {Number} options.page - Page number (default: 1)
 * @param {Number} options.limit - Items per page (default: 10)
 * @param {String} options.action - Filter by action
 * @param {String} options.adminId - Filter by admin ID
 * @param {Date} options.startDate - Filter by start date
 * @param {Date} options.endDate - Filter by end date
 * @returns {Object} - Paginated audit logs
 */
export const getAuditLogs = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      action,
      adminId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    console.log('📊 getAuditLogs called with:', {
      page: parseInt(page),
      limit: parseInt(limit),
      action,
      adminId,
      startDate,
      endDate
    });

    // Build filter query
    const filter = {};

    if (action) {
      filter.action = action;
    }

    if (adminId) {
      filter.admin = adminId;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const [logs, totalCount] = await Promise.all([
      AuditLog.find(filter)
        .populate('admin', 'name email role companyName')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      AuditLog.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    console.log('📊 getAuditLogs results:', {
      logsReturned: logs.length,
      totalCount,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit)
    });

    return {
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw new Error('Failed to fetch audit logs');
  }
};

/**
 * Get audit log statistics
 * @returns {Object} - Statistics about audit logs
 */
export const getAuditLogStats = async () => {
  try {
    const stats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalLogs = await AuditLog.countDocuments();

    // Get logs from last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = await AuditLog.countDocuments({
      createdAt: { $gte: last24Hours }
    });

    // Get most active admins
    const activeAdmins = await AuditLog.aggregate([
      {
        $group: {
          _id: '$admin',
          actionCount: { $sum: 1 }
        }
      },
      {
        $sort: { actionCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'adminInfo'
        }
      },
      {
        $unwind: '$adminInfo'
      },
      {
        $project: {
          adminId: '$_id',
          name: '$adminInfo.name',
          email: '$adminInfo.email',
          actionCount: 1
        }
      }
    ]);

    return {
      success: true,
      data: {
        totalLogs,
        recentLogs,
        actionBreakdown: stats,
        activeAdmins
      }
    };
  } catch (error) {
    console.error('Error fetching audit log stats:', error);
    throw new Error('Failed to fetch audit log statistics');
  }
};

/**
 * Get unique actions from audit logs
 * @returns {Array} - List of unique actions
 */
export const getUniqueActions = async () => {
  try {
    const actions = await AuditLog.distinct('action');
    return {
      success: true,
      data: actions.sort()
    };
  } catch (error) {
    console.error('Error fetching unique actions:', error);
    throw new Error('Failed to fetch unique actions');
  }
};

/**
 * Delete old audit logs (cleanup)
 * @param {Number} daysOld - Delete logs older than this many days
 * @returns {Object} - Deletion result
 */
export const deleteOldLogs = async (daysOld = 90) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await AuditLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    return {
      success: true,
      message: `Successfully deleted ${result.deletedCount} audit logs older than ${daysOld} days`,
      deletedCount: result.deletedCount
    };
  } catch (error) {
    console.error('Error deleting old audit logs:', error);
    throw new Error('Failed to delete old audit logs');
  }
};

/**
 * Create a new audit log entry
 * @param {Object} auditData - Audit log data
 * @param {ObjectId} auditData.admin - Admin user ID
 * @param {String} auditData.action - Action performed
 * @param {String} auditData.method - HTTP method
 * @param {String} auditData.endpoint - API endpoint
 * @param {String} auditData.ip - Client IP address
 * @param {String} auditData.userAgent - User agent string
 * @param {Object} auditData.requestBody - Sanitized request body
 * @param {Number} auditData.statusCode - Response status code
 * @param {String} auditData.errorMessage - Error message if any
 * @returns {Object} - Created audit log
 */
export const createAuditLog = async (auditData) => {
  try {
    const auditLog = await AuditLog.create(auditData);
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    throw new Error('Failed to create audit log');
  }
};

/**
 * Determine the action based on HTTP method and endpoint
 * @param {String} method - HTTP method
 * @param {String} path - Request path
 * @returns {String|null} - Action description or null
 */
export const determineAuditAction = (method, path) => {
  // Normalize path
  const normalizedPath = path.toLowerCase();

  // Job-related actions
  if (normalizedPath.includes('/jobs')) {
    if (method === 'POST' && !normalizedPath.includes('/seed')) {
      return 'Create Job';
    }
    if (method === 'PUT' || method === 'PATCH') {
      return 'Update Job';
    }
    if (method === 'DELETE') {
      return 'Delete Job';
    }
  }

  // Seed jobs
  if (normalizedPath.includes('/seed/jobs')) {
    if (method === 'POST') {
      return 'Seed Jobs';
    }
    if (method === 'DELETE') {
      return 'Clear Seeded Jobs';
    }
  }

  // Application-related actions
  if (normalizedPath.includes('/application')) {
    if (normalizedPath.includes('/accept')) {
      return 'Accept Application';
    }
    if (normalizedPath.includes('/reject')) {
      return 'Reject Application';
    }
    if (method === 'PUT' || method === 'PATCH') {
      return 'Update Application';
    }
    if (method === 'DELETE') {
      return 'Delete Application';
    }
  }

  // User management actions
  if (normalizedPath.includes('/user')) {
    if (method === 'POST') {
      return 'Create User';
    }
    if (method === 'PUT' || method === 'PATCH') {
      if (normalizedPath.includes('/suspend')) {
        return 'Suspend User';
      }
      if (normalizedPath.includes('/activate')) {
        return 'Activate User';
      }
      return 'Update User';
    }
    if (method === 'DELETE') {
      return 'Delete User';
    }
  }

  // Return null for GET requests and other non-action routes
  return null;
};

/**
 * Sanitize request body to remove sensitive information
 * @param {Object} body - Request body
 * @returns {Object} - Sanitized body
 */
export const sanitizeAuditRequestBody = (body) => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };

  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'api_key'];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

export default {
  getAuditLogs,
  getAuditLogStats,
  getUniqueActions,
  deleteOldLogs,
  createAuditLog,
  determineAuditAction,
  sanitizeAuditRequestBody
};
