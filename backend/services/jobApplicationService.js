import Application from '../models/Application.js';
import { sendApplicationNotificationToAdmin, sendApplicationAcceptedEmail, sendApplicationRejectedEmail } from '../services/emailService.js';
import User from '../models/User.js';
import Job from '../models/newJobs.js';

export const acceptApplication = async (id, userId) => {
  const application = await Application.findById(id).populate('jobId');
  if (!application) {
    throw new Error('Application not found');
  }

  // Verify the job belongs to this admin
  if (application.jobId.createdBy.toString() !== userId.toString()) {
    throw new Error('You can only manage applications for jobs you created');
  }

  application.status = 'accepted';
  await application.save();

  // Send email notification to applicant if they have enabled notifications
  try {
    // Find applicant by email (userId contains email)
    const applicant = await User.findOne({ email: application.userId });

    if (applicant && applicant.notifications?.applicationAlerts) {
      const jobDetails = {
        jobTitle: application.jobId.title,
        companyName: application.jobId.company,
        salaryRange: application.jobId.salary || 'Not specified'
      };

      await sendApplicationAcceptedEmail(
        applicant.email,
        applicant.name,
        jobDetails
      );

      console.log('✅ Application accepted email sent to:', applicant.email);
    } else {
      console.log('ℹ️ Applicant has disabled application notifications or user not found');
    }
  } catch (emailError) {
    console.error('Error sending acceptance email:', emailError);
    // Don't fail the request if email fails
  }

  return application;
};

export const rejectApplication = async (id, userId) => {
  const application = await Application.findById(id).populate('jobId');
  if (!application) {
    throw new Error('Application not found');
  }

  // Verify the job belongs to this admin
  if (application.jobId.createdBy.toString() !== userId.toString()) {
    throw new Error('You can only manage applications for jobs you created');
  }

  // Send email notification to applicant if they have enabled notifications (before deletion)
  try {
    // Find applicant by email (userId contains email)
    const applicant = await User.findOne({ email: application.userId });

    if (applicant && applicant.notifications?.applicationAlerts) {
      const jobDetails = {
        jobTitle: application.jobId.title,
        companyName: application.jobId.company
      };

      await sendApplicationRejectedEmail(
        applicant.email,
        applicant.name,
        jobDetails
      );

      console.log('✅ Application rejected email sent to:', applicant.email);
    } else {
      console.log('ℹ️ Applicant has disabled application notifications or user not found');
    }
  } catch (emailError) {
    console.error('Error sending rejection email:', emailError);
    // Don't fail the request if email fails
  }

  await Application.findByIdAndDelete(id);
};

export const submitApplication = async (jobId, coverLetter, resumeUrl, userId, availableFrom) => {
  // Check if user has already applied to this job
  const existingApplication = await Application.findOne({
    userId: userId,
    jobId: jobId
  });

  if (existingApplication) {
    throw new Error('You have already applied to this job');
  }

  const application = new Application({
    jobId,
    userId,
    coverLetter,
    resumeUrl,
    availableFrom: new Date(availableFrom)
  });

  await application.save();

  // Get job details and admin information for email notification
  try {
    const job = await Job.findById(jobId).populate('createdBy');
    // Find applicant by email (userId is email)
    const applicant = await User.findOne({ email: userId });

    console.log('📧 Email Notification Debug:');
    console.log('- Job found:', !!job);
    console.log('- Job creator found:', !!job?.createdBy);
    console.log('- Applicant found:', !!applicant);
    console.log('- Applicant details:', applicant ? { name: applicant.name, email: applicant.email } : 'N/A');

    if (job && job.createdBy && applicant) {
      const admin = job.createdBy;

      console.log('- Admin email:', admin.email);
      console.log('- Admin notifications object:', admin.notifications);
      console.log('- Application alerts enabled:', admin.notifications?.applicationAlerts);

      // Check if admin has application notifications enabled
      // If notifications field doesn't exist or applicationAlerts is undefined, default to true
      const shouldSendEmail = admin.notifications?.applicationAlerts !== false;

      console.log('- Should send email:', shouldSendEmail);

      if (shouldSendEmail) {
        // Prepare job details
        const jobDetails = {
          jobTitle: job.title,
          companyName: job.company,
          salaryRange: job.salaryRange || 'Not specified'
        };

        // Prepare applicant details
        const applicantDetails = {
          applicantName: applicant.name,
          applicantEmail: applicant.email,
          resumeUrl: resumeUrl
        };

        console.log('- Sending email to:', admin.email);

        // Send notification email to admin
        const emailResult = await sendApplicationNotificationToAdmin(
          admin.email,
          jobDetails,
          applicantDetails
        );

        console.log('- Email send result:', emailResult);
      } else {
        console.log('- Email notifications disabled for this admin');
      }
    } else {
      console.log('- Missing required data for email notification');
    }
  } catch (emailError) {
    // Log email error but don't fail the application
    console.error('❌ Error sending notification email:', emailError);
    console.error('Stack trace:', emailError.stack);
  }

  return application;
};

export const getUserApplications = async (userId, page = 1, limit = 5) => {
  const skip = (page - 1) * limit;

  // Get applications with pagination
  const applications = await Application.find({ userId })
    .populate('jobId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination metadata
  const totalApplications = await Application.countDocuments({ userId });
  const totalPages = Math.ceil(totalApplications / limit);

  return {
    applications,
    pagination: {
      currentPage: page,
      totalPages,
      totalApplications,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

export const getAllApplications = async (adminId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;


  // Get all jobs created by this admin
  const adminJobs = await Job.find({ createdBy: adminId }).select('_id');
  const adminJobIds = adminJobs.map(job => job._id);


  // If no jobs found, also check all jobs to see if they have createdBy field
  if (adminJobs.length === 0) {
    const allJobs = await Job.find({}).select('_id title createdBy').limit(5);
    console.log('getAllApplications - Sample of all jobs:', JSON.stringify(allJobs, null, 2));
  }

  // Get applications only for this admin's jobs with pagination
  const applications = await Application.find({
    jobId: { $in: adminJobIds }
  })
  .populate('jobId')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

  console.log('getAllApplications - Found applications:', applications.length);

  // Get total count for pagination metadata
  const totalApplications = await Application.countDocuments({
    jobId: { $in: adminJobIds }
  });
  const totalPages = Math.ceil(totalApplications / limit);

  return {
    applications,
    pagination: {
      currentPage: page,
      totalPages,
      totalApplications,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

export const getJobApplications = async (jobId, adminId) => {
  // Verify the job belongs to this admin
  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error('Job not found');
  }

  if (job.createdBy.toString() !== adminId.toString()) {
    throw new Error('You can only view applications for jobs you created');
  }

  const applications = await Application.find({ jobId }).populate('jobId');
  return applications;
};