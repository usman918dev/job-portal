import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  FormGroup,
  Input,
  Select,
  Textarea,
} from "../../components/common/FormComponents";
import {
  Table,
  SearchBar,
  Pagination,
} from "../../components/common/TableComponents";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";
import adminData from "../../data/adminData";
import api from "../../services/api";
import SkillsInput from "../../components/SkillsInput";

const JobForm = ({ onClose, editingJob = null }) => {
  const [title, setTitle] = useState(editingJob?.title || "");
  const [company, setCompany] = useState(editingJob?.company || "");
  const [location, setLocation] = useState(editingJob?.location || "");
  const [jobType, setJobType] = useState(editingJob?.type || "full-time"); // full-time, part-time, contract
  const [salaryFrom, setSalaryFrom] = useState(editingJob?.salaryFrom || "");
  const [salaryTo, setSalaryTo] = useState(editingJob?.salaryTo || "");
  const [experience, setExperience] = useState(editingJob?.experience || "");
  const [deadline, setDeadline] = useState(
    editingJob?.deadline
      ? new Date(editingJob.deadline).toISOString().split("T")[0]
      : ""
  );
  const [description, setDescription] = useState(editingJob?.description || "");
  const [requirements, setRequirements] = useState(
    editingJob?.requirements || ""
  );
  const [skills, setSkills] = useState(editingJob?.skills || []);
  const [errors, setErrors] = useState({});

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = "Job title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Job title must be at least 3 characters";
    } else if (title.trim().length > 100) {
      newErrors.title = "Job title cannot exceed 100 characters";
    } else if (!/[a-zA-Z]/.test(title.trim())) {
      newErrors.title = "Job title must contain at least one letter";
    }

    // Company validation
    if (!company.trim()) {
      newErrors.company = "Company name is required";
    } else if (company.trim().length < 2) {
      newErrors.company = "Company name must be at least 2 characters";
    } else if (company.trim().length > 100) {
      newErrors.company = "Company name cannot exceed 100 characters";
    } else if (!/[a-zA-Z]/.test(company.trim())) {
      newErrors.company = "Company name must contain at least one letter";
    }

    // Location validation
    if (!location.trim()) {
      newErrors.location = "Location is required";
    } else if (location.trim().length < 2) {
      newErrors.location = "Location must be at least 2 characters";
    } else if (location.trim().length > 100) {
      newErrors.location = "Location cannot exceed 100 characters";
    } else if (!/[a-zA-Z]/.test(location.trim())) {
      newErrors.location = "Location must contain at least one letter";
    }

    // Job Type validation
    if (!jobType.trim()) {
      newErrors.jobType = "Job type is required";
    }

    // Salary validation
    if (salaryFrom.trim() && isNaN(parseFloat(salaryFrom.trim()))) {
      newErrors.salaryFrom = "Salary from must be a valid number";
    } else if (salaryFrom.trim() && parseFloat(salaryFrom.trim()) < 0) {
      newErrors.salaryFrom = "Salary from cannot be negative";
    }

    if (salaryTo.trim() && isNaN(parseFloat(salaryTo.trim()))) {
      newErrors.salaryTo = "Salary to must be a valid number";
    } else if (salaryTo.trim() && parseFloat(salaryTo.trim()) < 0) {
      newErrors.salaryTo = "Salary to cannot be negative";
    }

    if (
      salaryFrom.trim() &&
      salaryTo.trim() &&
      parseFloat(salaryFrom.trim()) >= parseFloat(salaryTo.trim())
    ) {
      newErrors.salaryTo = "Salary to must be greater than salary from";
    }

    // Experience validation (numbers only)
    if (!experience.trim()) {
      newErrors.experience = "Experience is required";
    } else {
      const expNum = parseInt(experience.trim());
      if (isNaN(expNum)) {
        newErrors.experience = "Experience must be a number (e.g., 2, 3, 5)";
      } else if (expNum < 0) {
        newErrors.experience = "Experience cannot be negative";
      } else if (expNum > 50) {
        newErrors.experience = "Experience cannot exceed 50 years";
      }
    }

    // Deadline validation
    if (!deadline) {
      newErrors.deadline = "Application deadline is required";
    } else if (deadline < today) {
      newErrors.deadline = "Deadline cannot be in the past";
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = "Job description is required";
    } else if (description.trim().length < 50) {
      newErrors.description = "Job description must be at least 50 characters";
    } else if (description.trim().length > 5000) {
      newErrors.description = "Job description cannot exceed 5000 characters";
    }

    // Requirements validation
    if (!requirements.trim()) {
      newErrors.requirements = "Job requirements are required";
    } else if (requirements.trim().length < 50) {
      newErrors.requirements =
        "Job requirements must be at least 50 characters";
    } else if (requirements.trim().length > 3000) {
      newErrors.requirements = "Job requirements cannot exceed 3000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes and clear errors
  const handleInputChange = (field, value) => {
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  // new job submit logic
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    const jobData = {
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      jobType,
      salaryRange:
        salaryFrom.trim() && salaryTo.trim()
          ? `${salaryFrom.trim()} - ${salaryTo.trim()}`
          : salaryFrom.trim() || salaryTo.trim() || "",
      experience: experience.trim(),
      deadline,
      description: description.trim(),
      requirements: requirements.trim(),
      skills: skills, // Add skills to the job data
    };

    try {
      const isEditing = editingJob !== null;
      const url = isEditing ? `/api/jobs/${editingJob.id}` : "/api/jobs";

      const response = isEditing
        ? await api.put(url, jobData)
        : await api.post(url, jobData);

      console.log(
        `Job ${isEditing ? "updated" : "saved"} successfully:`,
        response.data
      );
      alert(`Job ${isEditing ? "updated" : "saved"} successfully!`);
      // Refresh the jobs list
      window.dispatchEvent(new CustomEvent("jobsUpdated"));
      onClose();
    } catch (error) {
      console.error(`Error ${editingJob ? "updating" : "saving"} job:`, error);
      alert(
        error.response?.data?.message ||
          `Error ${editingJob ? "updating" : "saving"} job`
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {editingJob ? "Edit Job" : "Add New Job"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup label="Job Title">
          <Input
            placeholder="e.g., Senior React Developer"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleInputChange("title", e.target.value);
            }}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </FormGroup>

        <FormGroup label="Company">
          <Input
            placeholder="e.g., Tech Corp"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              handleInputChange("company", e.target.value);
            }}
          />
          {errors.company && (
            <p className="text-xs text-red-500 mt-1">{errors.company}</p>
          )}
        </FormGroup>

        <FormGroup label="Location">
          <Input
            placeholder="e.g., Remote, New York"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              handleInputChange("location", e.target.value);
            }}
          />
          {errors.location && (
            <p className="text-xs text-red-500 mt-1">{errors.location}</p>
          )}
        </FormGroup>

        <FormGroup label="Job Type">
          <Select
            options={[
              { value: "full-time", label: "Full-time" },
              { value: "part-time", label: "Part-time" },
              { value: "contract", label: "Contract" },
            ]}
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
              handleInputChange("jobType", e.target.value);
            }}
          />
          {errors.jobType && (
            <p className="text-xs text-red-500 mt-1">{errors.jobType}</p>
          )}
        </FormGroup>

        <FormGroup label="Salary Range (From)">
          <Input
            type="number"
            placeholder="e.g., 100000"
            value={salaryFrom}
            onChange={(e) => {
              setSalaryFrom(e.target.value);
              handleInputChange("salaryFrom", e.target.value);
            }}
            min="0"
          />
          {errors.salaryFrom && (
            <p className="text-xs text-red-500 mt-1">{errors.salaryFrom}</p>
          )}
        </FormGroup>

        <FormGroup label="Salary Range (To)">
          <Input
            type="number"
            placeholder="e.g., 130000"
            value={salaryTo}
            onChange={(e) => {
              setSalaryTo(e.target.value);
              handleInputChange("salaryTo", e.target.value);
            }}
            min="0"
          />
          {errors.salaryTo && (
            <p className="text-xs text-red-500 mt-1">{errors.salaryTo}</p>
          )}
        </FormGroup>

        <FormGroup label="Experience (Years)">
          <Input
            type="number"
            placeholder="e.g., 3"
            value={experience}
            onChange={(e) => {
              setExperience(e.target.value);
              handleInputChange("experience", e.target.value);
            }}
            min="0"
            max="50"
          />
          {errors.experience && (
            <p className="text-xs text-red-500 mt-1">{errors.experience}</p>
          )}
        </FormGroup>

        <FormGroup label="Application Deadline" className="md:col-span-2">
          <Input
            type="date"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
              handleInputChange("deadline", e.target.value);
            }}
            min={today}
          />
          {errors.deadline && (
            <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>
          )}
        </FormGroup>

        <FormGroup label="Job Description" className="md:col-span-2">
          <Textarea
            rows={4}
            placeholder="Enter detailed job description..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              handleInputChange("description", e.target.value);
            }}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {description.length}/5000 characters (minimum 50)
          </p>
        </FormGroup>

        <FormGroup label="Requirements" className="md:col-span-2">
          <Textarea
            rows={4}
            placeholder="Enter job requirements..."
            value={requirements}
            onChange={(e) => {
              setRequirements(e.target.value);
              handleInputChange("requirements", e.target.value);
            }}
          />
          {errors.requirements && (
            <p className="text-xs text-red-500 mt-1">{errors.requirements}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {requirements.length}/3000 characters (minimum 50)
          </p>
        </FormGroup>

        {/* Skills Input */}
        <FormGroup label="Required Skills" className="md:col-span-2">
          <SkillsInput
            skills={skills}
            onChange={setSkills}
            maxSkills={20}
          />
          {errors.skills && (
            <p className="text-xs text-red-500 mt-1">{errors.skills}</p>
          )}
        </FormGroup>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {editingJob ? "Update Job" : "Save Job"}
        </Button>
      </div>
    </div>
  );
};

const ManageJobs = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobsPerPage = 5;

  // fetch single job for editing
  const fetchJobForEdit = async (jobId) => {
    try {
      const response = await api.get(`/api/jobs/${jobId}`);
      const jobToEdit = response.data;

      if (jobToEdit) {
        // Parse salary range into separate from/to values
        let salaryFrom = "";
        let salaryTo = "";
        if (jobToEdit.salaryRange) {
          const salaryParts = jobToEdit.salaryRange.split(" - ");
          salaryFrom = salaryParts[0]?.trim() || "";
          salaryTo = salaryParts[1]?.trim() || "";
        }

        // Transform the job data to match the form structure
        const transformedJob = {
          id: jobToEdit._id,
          title: jobToEdit.title,
          company: jobToEdit.company,
          location: jobToEdit.location,
          type: jobToEdit.jobType,
          salaryFrom: salaryFrom,
          salaryTo: salaryTo,
          experience: jobToEdit.experience,
          deadline: jobToEdit.deadline,
          description: jobToEdit.description,
          requirements: jobToEdit.requirements,
          skills: jobToEdit.skills || [], // Include skills
        };
        setEditingJob(transformedJob);
        setShowForm(true);
      }
    } catch (err) {
      console.error("Error fetching job for edit:", err);
      alert(
        err.response?.data?.message || "Failed to load job details for editing"
      );
    }
  };

  // delete job function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.delete(`/api/jobs/${id}`);
      alert("Job deleted successfully!");
      // Update frontend state after deletion
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert(error.response?.data?.message || "Error deleting job");
    }
  };
  // <----------delete job function ends here------->

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch admin's own jobs only
      const response = await api.get("/api/jobs/admin/my-jobs");
      const data = response.data;

      // Handle both paginated and non-paginated response structures
      const jobsArray = Array.isArray(data) ? data : data.jobs || [];

      // Transform the data to match the table structure
      const transformedJobs = jobsArray.map((job) => ({
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.jobType,
        salary: job.salaryRange,
        status: job.status || "Active",
        deadline: job.deadline
          ? new Date(job.deadline).toLocaleDateString()
          : "N/A",
        applications: job.applicationCount || 0,
      }));

      setJobs(transformedJobs);
      setError(null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || err.message);
      // Fallback to empty array if API fails
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const columns = [
    {
      key: "title",
      header: "Job Title",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.title}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {row.company}
          </div>
        </div>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (row) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <FiMapPin className="h-4 w-4 mr-1" />
            {row.location}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <FiBriefcase className="h-4 w-4 mr-1" />
            {row.type}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <FiDollarSign className="h-4 w-4 mr-1" />
            {row.salary}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div className="flex flex-col items-start">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mb-2">
            {row.status}
          </span>
          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FiCalendar className="h-4 w-4 mr-1" />
            {row.deadline}
          </span>
        </div>
      ),
    },
    {
      key: "applications",
      header: "Applications",
      render: (row) => (
        <div className="text-center">
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            {row.applications}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              fetchJobForEdit(row.id);
            }}
          >
            <FiEdit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id); // pass the job id
            }}
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Calculate pagination
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // Add event listener for job updates
  useEffect(() => {
    const handleJobsUpdated = () => {
      fetchJobs();
    };

    window.addEventListener("jobsUpdated", handleJobsUpdated);
    return () => window.removeEventListener("jobsUpdated", handleJobsUpdated);
  }, [fetchJobs]);

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Manage Jobs
        </h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingJob(null);
            setShowForm(true);
          }}
        >
          <FiPlus className="h-5 w-5 mr-2" />
          Add New Job
        </Button>
      </div>

      {showForm ? (
        <JobForm
          onClose={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
          editingJob={editingJob}
        />
      ) : (
        <Card>
          <div className="mb-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search jobs..."
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading jobs...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-600">
              Error: {error}. Showing mock data instead.
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={currentJobs}
                onRowClick={(job) => console.log("Job clicked:", job)}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default ManageJobs;
