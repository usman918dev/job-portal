import api from './api';
import { getCurrentUser } from './authService';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Fetch all jobs (public - for job seekers)
export async function fetchJobs(params = {}) {
  const { page, limit, search } = params;
  const res = await api.get(`/api/jobs`, {
    params: { page, limit, search }
  });
  
  return res.data; // Return jobs array directly based on the API response
}

// Fetch admin's own jobs only
export async function fetchAdminJobs(page = 1, limit = 10) {
  const res = await api.get('/api/jobs/admin/my-jobs', {
    params: { page, limit }
  });
  return res.data;
}

export async function fetchJobStats() {
  try {
    // For admins, get their own jobs
    const user = getCurrentUser();
    const adminRoles = ['admin', 'Admin', 'Recruiter'];
    
    let jobs = [];
    if (user?.user?.role && adminRoles.includes(user.user.role)) {
      jobs = await fetchAdminJobs();
    } else {
      jobs = await fetchJobs();
    }
  
    // Calculate job stats
    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => {
        // Check if job deadline hasn't passed
        const deadlineDate = job.deadline ? new Date(job.deadline) : null;
        return !deadlineDate || deadlineDate > new Date();
      }).length
    };
  } catch (error) {
    console.error('Error fetching job stats:', error);
    return { totalJobs: 0, activeJobs: 0 };
  }
}