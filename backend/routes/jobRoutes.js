// routes/jobRoutes.js
import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob, getAdminJobs } from '../controllers/jobController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import auditMiddleware from '../middleware/auditMiddleware.js';

const router = express.Router();

// Public routes
// GET /api/jobs → get all jobs (for job seekers)
router.get('/', getJobs);

// GET /api/jobs/:id → get a single job by ID
router.get('/:id', getJobById);

// Protected admin routes
// POST /api/jobs → create new job (admin only)
router.post('/', verifyToken, isAdmin, auditMiddleware, createJob);

// GET /api/jobs/admin/my-jobs → get admin's own jobs
router.get('/admin/my-jobs', verifyToken, isAdmin, getAdminJobs);

// PUT /api/jobs/:id → update a job by ID (admin only, own jobs)
router.put('/:id', verifyToken, isAdmin, auditMiddleware, updateJob);

// DELETE /api/jobs/:id → delete a job by ID (admin only, own jobs)
router.delete('/:id', verifyToken, isAdmin, auditMiddleware, deleteJob);

export default router;
