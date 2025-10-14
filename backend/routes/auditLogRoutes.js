import express from 'express';
import { 
  getAllAuditLogs, 
  getStats, 
  getActions,
  cleanupOldLogs 
} from '../controllers/auditLogController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * All routes are protected and require admin authentication
 */

// GET /api/audit/logs - Get all audit logs with pagination
router.get('/logs', verifyToken, isAdmin, getAllAuditLogs);

// GET /api/audit/stats - Get audit log statistics
router.get('/stats', verifyToken, isAdmin, getStats);

// GET /api/audit/actions - Get unique actions list
router.get('/actions', verifyToken, isAdmin, getActions);

// DELETE /api/audit/cleanup - Delete old logs (cleanup)
router.delete('/cleanup', verifyToken, isAdmin, cleanupOldLogs);

export default router;
