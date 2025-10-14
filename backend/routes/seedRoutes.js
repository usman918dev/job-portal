import express from 'express';
import { seedJobs, clearJobs } from '../seeders/jobSeeder.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/seed/jobs
 * Seed fake jobs into database
 * Protected: Admin only
 */
router.post('/jobs', verifyToken, isAdmin, async (req, res) => {
  try {
    const { count = 5 } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    // Validate count
    if (count < 1 || count > 50) {
      return res.status(400).json({
        success: false,
        message: 'Count must be between 1 and 50'
      });
    }

    const jobs = await seedJobs(req.user._id, count);

    res.status(201).json({
      success: true,
      message: `Successfully created ${jobs.length} fake jobs`,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Error seeding jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed jobs',
      error: error.message
    });
  }
});

/**
 * DELETE /api/seed/jobs
 * Clear all jobs from database
 * Protected: Admin only
 * Use with CAUTION!
 */
router.delete('/jobs', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await clearJobs();

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} jobs`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear jobs',
      error: error.message
    });
  }
});

export default router;
