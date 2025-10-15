import express from 'express';
import {
    submitApplication,
    getAllApplications,
    getUserApplications,
    acceptApplication,
    rejectApplication,
    getJobApplications,
    getUploadStatus,
    uploadResume
} from '../controllers/jobApplicationController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import auditMiddleware from '../middleware/auditMiddleware.js';
import { upload } from '../services/fileUploadService.js';

const router = express.Router();

// Public routes
// Check if file upload is configured
router.get('/upload-status', getUploadStatus);

// Upload resume to Cloudinary
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Submit application
router.post('/submit', verifyToken, submitApplication);

// Get user-specific applications
router.get('/user/:userId', getUserApplications);

// Protected admin routes
// Get all applications for admin's jobs
router.get('/', verifyToken, isAdmin, getAllApplications);

// Get applications for a specific job
router.get('/job/:jobId', verifyToken, isAdmin, getJobApplications);

// Accept application
router.put('/accept/:id', verifyToken, isAdmin, auditMiddleware, acceptApplication);

// Reject and delete application
router.delete('/reject/:id', verifyToken, isAdmin, auditMiddleware, rejectApplication);

export default router;