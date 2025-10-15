import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import auditMiddleware from '../middleware/auditMiddleware.js';
import { seedJobsHandler, clearJobsHandler } from '../controllers/seedController.js';

const router = express.Router();

/**
 * POST /api/seed/jobs
 * Seed fake jobs into database
 * Protected: Admin only
 */
router.post('/jobs', verifyToken, isAdmin, auditMiddleware, seedJobsHandler);

/**
 * DELETE /api/seed/jobs
 * Clear all jobs from database
 * Protected: Admin only
 * Use with CAUTION!
 */
router.delete('/jobs', verifyToken, isAdmin, auditMiddleware, clearJobsHandler);

export default router;
