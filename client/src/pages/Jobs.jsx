import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, DollarSign, Briefcase, Building2, Search, X } from "lucide-react";
import brandLogo from "../assets/logo.svg";
import { AppContext } from "../context/AppContext";
import { JOB_LISTING_CONSTANTS } from "../constants/jobListingConstants.js";
import {
  getPostedDate,
  calculatePaginationButtons,
  getEmptyStateMessage,
  getCssClasses,
  getAnimations,
  getContent,
} from "../utils/jobListingUtils.js";
import { fetchJobsWithFallback } from "../services/jobListingService.js";
import JobApplicationModal from "../components/JobApplicationModal.jsx";
import JobDetailsPanel from "../components/JobDetailsPanel.jsx";
import MobileJobDetailsModal from "../components/MobileJobDetailsModal.jsx";
import Navbar from "../components/Navbar.jsx";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMobileJobDetails, setShowMobileJobDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(
    JOB_LISTING_CONSTANTS.LOADING_STATES.INITIAL
  );
  const [fade, setFade] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [skillMatchEnabled, setSkillMatchEnabled] = useState(false);
  const [sortedJobs, setSortedJobs] = useState([]);

  const {
    searchFilter,
    isSearched,
    backendUrl,
    setSearchFilter,
    setIsSearched,
    currentUser,
  } = useContext(AppContext);

  // Get utility functions and constants
  const classes = getCssClasses();
  const animations = getAnimations();
  const content = getContent();

  // Calculate skill match percentage
  const calculateSkillMatch = (jobSkills, userSkills) => {
    if (
      !jobSkills ||
      !userSkills ||
      jobSkills.length === 0 ||
      userSkills.length === 0
    ) {
      return 0;
    }

    // Convert all skills to lowercase for case-insensitive matching
    const normalizedJobSkills = jobSkills.map((skill) =>
      skill.toLowerCase().trim()
    );
    const normalizedUserSkills = userSkills.map((skill) =>
      skill.toLowerCase().trim()
    );

    // Count matching skills
    const matchingSkills = normalizedJobSkills.filter((skill) =>
      normalizedUserSkills.includes(skill)
    );

    // Calculate percentage
    const matchPercentage =
      (matchingSkills.length / normalizedJobSkills.length) * 100;
    return Math.round(matchPercentage);
  };

  // Get user skills
  const userSkills = currentUser?.skills || [];
  const hasUserSkills = userSkills.length > 0;

  // Sort jobs by skill match when toggle is enabled
  useEffect(() => {
    if (skillMatchEnabled && hasUserSkills && jobs.length > 0) {
      const jobsWithMatch = jobs.map((job) => ({
        ...job,
        matchPercentage: calculateSkillMatch(job.skills, userSkills),
      }));

      // Sort by match percentage (highest first)
      const sorted = [...jobsWithMatch].sort(
        (a, b) => b.matchPercentage - a.matchPercentage
      );
      setSortedJobs(sorted);
    } else {
      setSortedJobs(jobs);
    }
  }, [skillMatchEnabled, jobs, userSkills, hasUserSkills]);

  // Use sortedJobs for display
  const displayJobs = skillMatchEnabled ? sortedJobs : jobs;

  useEffect(() => {
    // Reset to page 1 when search is performed
    if (isSearched) {
      setCurrentPage(1);
    }
  }, [isSearched, searchFilter.query]);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(JOB_LISTING_CONSTANTS.LOADING_STATES.INITIAL);

      const result = await fetchJobsWithFallback({
        backendUrl,
        page: currentPage,
        limit: JOB_LISTING_CONSTANTS.PAGINATION.JOBS_PER_PAGE,
        search: isSearched && searchFilter.query ? searchFilter.query : null,
      });

      setJobs(result.jobs);
      setPagination(result.pagination);
      setIsLoading(JOB_LISTING_CONSTANTS.LOADING_STATES.LOADED);

      // Auto-select first job when jobs load
      if (result.jobs.length > 0 && !selectedJob) {
        setSelectedJob(result.jobs[0]);
      }
    };

    fetchJobs();
  }, [currentPage, isSearched, searchFilter, backendUrl]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="h-20"></div>

      {/* Search Bar - Integrated with navbar styling */}
      <div className=" border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 bg-white">
          {/* Search Results Header */}
          {isSearched && searchFilter.query && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Search Results
                  </h2>
                  <p className="text-gray-600">
                    Jobs matching "{searchFilter.query}"
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchFilter({ query: "" });
                    setIsSearched(false);
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium text-gray-700"
                >
                  <X className="w-4 h-4" />
                  Clear search
                </button>
              </div>
            </motion.div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for jobs by title, company, or location..."
              value={searchFilter.query || ""}
              onChange={(e) => {
                setSearchFilter({ query: e.target.value });
                setIsSearched(e.target.value.trim() !== "");
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white transition-colors duration-200 shadow-sm"
            />
            {searchFilter.query && (
              <button
                onClick={() => {
                  setSearchFilter({ query: "" });
                  setIsSearched(false);
                  setCurrentPage(1);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Skills Match Toggle */}
          {hasUserSkills && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl border border-purple-200/50 shadow-sm"
            >
              <div className="flex-1">
                <label
                  htmlFor="skills-match-toggle"
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-base">
                      Find Best Jobs That Match Your Skills
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {userSkills.length} skill{userSkills.length !== 1 ? "s" : ""} in your profile • Sorted by match percentage
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  skillMatchEnabled 
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {skillMatchEnabled ? "Enabled" : "Disabled"}
                </span>
                <button
                  id="skills-match-toggle"
                  onClick={() => setSkillMatchEnabled(!skillMatchEnabled)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    skillMatchEnabled ? "bg-purple-600 shadow-lg" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={skillMatchEnabled}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                      skillMatchEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-12">
        <div className="flex gap-6 items-start">
          {/* Left Sidebar - Job List */}
          <div
            className="w-full lg:w-[450px] flex flex-col bg-white rounded-lg shadow-sm sticky top-[120px]"
            style={{ maxHeight: "calc(100vh - 140px)" }}
          >
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && displayJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {isSearched ? "No jobs found" : "No jobs available"}
                </h3>
                <p className="text-gray-500">
                  {isSearched
                    ? `No jobs found matching "${searchFilter.query}". Try adjusting your search terms.`
                    : "No jobs available at the moment."}
                </p>
              </div>
            )}

            {/* Job List */}
            {!isLoading && displayJobs.length > 0 && (
              <>
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <AnimatePresence>
                    {displayJobs.map((job) => (
                      <motion.div
                        key={job._id || job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                          setSelectedJob(job);
                          setShowMobileJobDetails(true);
                        }}
                        className={`p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedJob?._id === job._id
                            ? "bg-blue-50 border-l-4 border-l-blue-600"
                            : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <img
                            src={job.logo || brandLogo}
                            alt={job.company || "Company"}
                            className="w-12 h-12 rounded-lg object-contain border border-gray-200 p-1 flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = brandLogo;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            {/* Match Percentage Badge */}
                            {skillMatchEnabled &&
                              job.matchPercentage !== undefined && (
                                <div className="mb-2">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                      job.matchPercentage >= 70
                                        ? "bg-green-100 text-green-700"
                                        : job.matchPercentage >= 40
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {job.matchPercentage}% Match
                                  </span>
                                </div>
                              )}
                            <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <Building2 className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{job.company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </div>
                            {(job.salaryRange || job.salary) && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <DollarSign className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">
                                  {job.salaryRange || job.salary}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                              <span className="px-2 py-1 bg-gray-100 rounded capitalize">
                                {job.jobType || job.type || "N/A"}
                              </span>
                              <span>Posted: {getPostedDate(job) || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={!pagination.hasPrevPage}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <div className="flex gap-2">
                        {calculatePaginationButtons(pagination).map(
                          (pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 text-sm font-medium rounded-md ${
                                pageNum === pagination.currentPage
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(pagination.totalPages, prev + 1)
                          )
                        }
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="text-center text-xs text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages} (
                      {pagination.totalJobs} total jobs)
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Panel - Job Details */}
          <JobDetailsPanel
            job={selectedJob}
            onApplyClick={() => setShowModal(true)}
          />
        </div>
      </div>

      {/* Mobile Job Details Modal */}
      <MobileJobDetailsModal
        isOpen={showMobileJobDetails}
        onClose={() => setShowMobileJobDetails(false)}
        job={selectedJob}
        onApplyClick={() => {
          setShowModal(true);
          setShowMobileJobDetails(false);
        }}
      />

      {/* Application Modal */}
      <JobApplicationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        jobDetails={{
          jobId: selectedJob?._id || "",
          title: selectedJob?.title || "",
          salary:
            selectedJob?.salaryRange || selectedJob?.salary || "Salary: N/A",
          location: selectedJob?.location || "",
          company: selectedJob?.company || "",
        }}
      />
    </div>
  );
};

export default Jobs;
