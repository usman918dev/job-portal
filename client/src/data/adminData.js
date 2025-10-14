const adminData = {
  stats: {
    totalJobs: 156,
    activeJobs: 89,
    totalApplications: 432,
    totalUsers: 245,
    jobCategories: {
      "Full-time": 45,
      "Part-time": 23,
      "Contract": 12,
      "Remote": 34
    }
  },
  recentJobs: [
    {
      id: 1,
      title: "Senior React Developer",
      company: "Tech Corp",
      location: "Remote",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      experience: "5+ years",
      postedDate: "2025-09-10",
      deadline: "2025-10-10",
      status: "Active",
      applications: 24,
      description: "Looking for an experienced React developer...",
      requirements: ["5+ years React", "TypeScript", "Team leadership"]
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "New York",
      type: "Full-time",
      salary: "$130,000 - $160,000",
      experience: "6+ years",
      postedDate: "2025-09-09",
      deadline: "2025-10-05",
      status: "Active",
      applications: 18
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Design Studio",
      location: "San Francisco",
      type: "Contract",
      salary: "$90,000 - $120,000",
      experience: "3+ years",
      postedDate: "2025-09-08",
      deadline: "2025-09-30",
      status: "Active",
      applications: 15
    }
  ],
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Job Seeker",
      joinDate: "2025-08-15",
      applications: 8,
      status: "Active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Recruiter",
      joinDate: "2025-08-20",
      company: "Tech Corp",
      postedJobs: 12,
      status: "Active"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Job Seeker",
      joinDate: "2025-09-01",
      applications: 3,
      status: "Active"
    }
  ]
};

export default adminData;