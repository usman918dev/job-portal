// controllers/jobController.js
import {
  createJob as createJobService,
  getJobs as getJobsService,
  getAdminJobs as getAdminJobsService,
  getJobById as getJobByIdService,
  updateJob as updateJobService,
  deleteJob as deleteJobService
} from '../services/jobService.js';

// Create a new job (Admin only)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      salaryRange,
      experience,
      deadline,
      description,
      requirements
    } = req.body;

    // Get admin user from request (set by auth middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const savedJob = await createJobService({
      title,
      company,
      location,
      jobType,
      salaryRange,
      experience,
      deadline,
      description,
      requirements
    }, req.user._id);

    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);

    if (error.message === 'Please fill all required fields') {
      return res.status(400).json({ message: error.message });
    }

    // Handle salary range validation errors
    if (error.message.includes('Salary')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Get all jobs (Public - for job seekers)
export const getJobs = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Get search parameter from query
    const searchQuery = req.query.search ? req.query.search.trim() : '';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    const result = await getJobsService(page, limit, searchQuery);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin's own jobs (Admin only)
export const getAdminJobs = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    const result = await getAdminJobsService(req.user._id, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await getJobByIdService(jobId);
    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job by ID:', error);

    if (error.message === 'Job not found') {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error' });
  }
};


// Update a job by ID (Admin only - can only update their own jobs)
export const updateJob = async (req, res) => {
  const jobId = req.params.id;
  const {
    title,
    company,
    location,
    jobType,
    salaryRange,
    experience,
    deadline,
    description,
    requirements
  } = req.body;

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const updatedJob = await updateJobService(jobId, {
      title,
      company,
      location,
      jobType,
      salaryRange,
      experience,
      deadline,
      description,
      requirements
    }, req.user._id);

    return res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);

    if (error.message === 'Please fill all required fields') {
      return res.status(400).json({ message: error.message });
    }

    // Handle salary range validation errors
    if (error.message.includes('Salary')) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === 'Job not found') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === 'You can only update jobs you created') {
      return res.status(403).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Server error while updating job' });
  }
};

// Delete a job by ID (Admin only - can only delete their own jobs)
export const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const deletedJob = await deleteJobService(jobId, req.user._id);

    return res.status(200).json({ message: 'Job deleted successfully', job: deletedJob });
  } catch (error) {
    console.error('Error deleting job:', error);

    if (error.message === 'Job not found') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === 'You can only delete jobs you created') {
      return res.status(403).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Server error while deleting job' });
  }
};
