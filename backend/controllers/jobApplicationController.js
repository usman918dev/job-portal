import {
  acceptApplication as acceptApplicationService,
  rejectApplication as rejectApplicationService,
  submitApplication as submitApplicationService,
  getUserApplications as getUserApplicationsService,
  getAllApplications as getAllApplicationsService,
  getJobApplications as getJobApplicationsService
} from '../services/jobApplicationService.js';

// Accept application (admin only - only for their own jobs)
export const acceptApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const application = await acceptApplicationService(id, req.user._id);

        res.status(200).json({
            success: true,
            message: 'Application accepted successfully',
            application
        });
    } catch (error) {
        if (error.message === 'Application not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'You can only manage applications for jobs you created') {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error accepting application',
            error: error.message
        });
    }
};

// Reject and delete application (admin only - only for their own jobs)
export const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        await rejectApplicationService(id, req.user._id);

        res.status(200).json({
            success: true,
            message: 'Application rejected and deleted successfully'
        });
    } catch (error) {
        if (error.message === 'Application not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'You can only manage applications for jobs you created') {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error rejecting application',
            error: error.message
        });
    }
};

// Submit job application
export const submitApplication = async (req, res) => {
    try {
        const { jobId, coverLetter, resumeUrl, userId, availableFrom } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({
                success: false,
                message: 'Resume URL is required'
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        if (!availableFrom) {
            return res.status(400).json({
                success: false,
                message: 'Available from date is required'
            });
        }

        const application = await submitApplicationService(jobId, coverLetter, resumeUrl, userId, availableFrom);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });

    } catch (error) {
        // Handle duplicate key error specifically
        if (error.code === 11000 || error.message === 'You have already applied to this job') {
            return res.status(409).json({
                success: false,
                message: 'You have already applied to this job'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
};

// Get user-specific applications
export const getUserApplications = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 50) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pagination parameters'
            });
        }

        const result = await getUserApplicationsService(userId, page, limit);

        res.status(200).json({
            success: true,
            applications: result.applications,
            pagination: result.pagination
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// Get all applications (admin only - only for their own jobs)
export const getAllApplications = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pagination parameters'
            });
        }

        const result = await getAllApplicationsService(req.user._id, page, limit);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// Get applications for a specific job (admin only - only for their own jobs)
export const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const applications = await getJobApplicationsService(jobId, req.user._id);

        res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        if (error.message === 'Job not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'You can only view applications for jobs you created') {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};