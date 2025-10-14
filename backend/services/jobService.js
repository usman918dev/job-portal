import Job from '../models/newJobs.js';
import mongoose from 'mongoose';

export const createJob = async (jobData, userId) => {
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
  } = jobData;

  // Basic validation
  if (!title || !company || !location || !jobType) {
    throw new Error('Please fill all required fields');
  }

  // Validate salary range if provided
  if (salaryRange && salaryRange.trim()) {
    const salaryParts = salaryRange.split(' - ');
    if (salaryParts.length === 2) {
      const fromSalary = parseFloat(salaryParts[0].trim());
      const toSalary = parseFloat(salaryParts[1].trim());

      if (isNaN(fromSalary) || isNaN(toSalary)) {
        throw new Error('Salary range must contain valid numbers');
      }

      if (fromSalary < 0 || toSalary < 0) {
        throw new Error('Salary values cannot be negative');
      }

      if (fromSalary >= toSalary) {
        throw new Error('Salary "to" must be greater than salary "from"');
      }
    } else if (salaryParts.length === 1) {
      const singleSalary = parseFloat(salaryParts[0].trim());
      if (isNaN(singleSalary)) {
        throw new Error('Salary must be a valid number');
      }
      if (singleSalary < 0) {
        throw new Error('Salary cannot be negative');
      }
    }
  }

  const newJob = new Job({
    title,
    company,
    location,
    jobType,
    salaryRange,
    experience,
    deadline,
    description,
    requirements,
    createdBy: userId // Link job to admin who created it
  });

  const savedJob = await newJob.save();
  return savedJob;
};

export const getJobs = async (page = 1, limit = 10, searchQuery = '') => {
  const skip = (page - 1) * limit;

  // Build search filter
  const searchFilter = {};
  if (searchQuery) {
    // Search across multiple fields using regex (case-insensitive)
    const regex = new RegExp(searchQuery, 'i');
    searchFilter.$or = [
      { title: regex },
      { company: regex },
      { location: regex },
      { description: regex },
      { requirements: regex },
      { jobType: regex }
    ];
  }

  // Get jobs with pagination and search
  const jobs = await Job.find(searchFilter)
    .populate('createdBy', 'name email companyName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination metadata (with search filter)
  const totalJobs = await Job.countDocuments(searchFilter);
  const totalPages = Math.ceil(totalJobs / limit);

  return {
    jobs,
    pagination: {
      currentPage: page,
      totalPages,
      totalJobs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

export const getAdminJobs = async (adminId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  // Use aggregation to get jobs with application counts
  const jobsWithApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(adminId) } },
    {
      $lookup: {
        from: 'applications',
        localField: '_id',
        foreignField: 'jobId',
        as: 'applications'
      }
    },
    {
      $addFields: {
        applicationCount: { $size: '$applications' }
      }
    },
    {
      $project: {
        applications: 0 // Remove the full applications array, keep only count
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ]);

  // Get total count for pagination metadata
  const totalJobs = await Job.countDocuments({ createdBy: adminId });
  const totalPages = Math.ceil(totalJobs / limit);

  return {
    jobs: jobsWithApplications,
    pagination: {
      currentPage: page,
      totalPages,
      totalJobs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

export const getJobById = async (jobId) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error('Job not found');
  }

  return job;
};

export const updateJob = async (jobId, jobData, userId) => {
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
  } = jobData;

  // Basic validation
  if (!title || !company || !location || !jobType) {
    throw new Error('Please fill all required fields');
  }

  // Validate salary range if provided
  if (salaryRange && salaryRange.trim()) {
    const salaryParts = salaryRange.split(' - ');
    if (salaryParts.length === 2) {
      const fromSalary = parseFloat(salaryParts[0].trim());
      const toSalary = parseFloat(salaryParts[1].trim());

      if (isNaN(fromSalary) || isNaN(toSalary)) {
        throw new Error('Salary range must contain valid numbers');
      }

      if (fromSalary < 0 || toSalary < 0) {
        throw new Error('Salary values cannot be negative');
      }

      if (fromSalary >= toSalary) {
        throw new Error('Salary "to" must be greater than salary "from"');
      }
    } else if (salaryParts.length === 1) {
      const singleSalary = parseFloat(salaryParts[0].trim());
      if (isNaN(singleSalary)) {
        throw new Error('Salary must be a valid number');
      }
      if (singleSalary < 0) {
        throw new Error('Salary cannot be negative');
      }
    }
  }

  // Check if job exists and belongs to this admin
  const existingJob = await Job.findById(jobId);
  if (!existingJob) {
    throw new Error('Job not found');
  }

  // Verify the job belongs to this admin
  if (existingJob.createdBy.toString() !== userId.toString()) {
    throw new Error('You can only update jobs you created');
  }

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    {
      title,
      company,
      location,
      jobType,
      salaryRange,
      experience,
      deadline,
      description,
      requirements
    },
    { new: true, runValidators: true }
  );

  return updatedJob;
};

export const deleteJob = async (jobId, userId) => {
  // Check if job exists and belongs to this admin
  const existingJob = await Job.findById(jobId);
  if (!existingJob) {
    throw new Error('Job not found');
  }

  // Verify the job belongs to this admin
  if (existingJob.createdBy.toString() !== userId.toString()) {
    throw new Error('You can only delete jobs you created');
  }

  const deletedJob = await Job.findByIdAndDelete(jobId);
  return deletedJob;
};