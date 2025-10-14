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
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    const result = await AuditLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    return {
      success: true,
      data: {
        deletedCount: result.deletedCount,
        message: `Deleted ${result.deletedCount} logs older than ${daysOld} days`
      }
    };
  } catch (error) {
    console.error('Error deleting old logs:', error);
    throw new Error('Failed to delete old logs');
  }
};

export default {
  getAuditLogs,
  getAuditLogStats,
  getUniqueActions,
  deleteOldLogs
};
