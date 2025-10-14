import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import brandLogo from "../assets/logo.svg";
import JobApplicationModal from "./JobApplicationModal";
import { AppContext } from "../context/AppContext";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fade, setFade] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const jobsPerPage = 9; // Show 9 jobs per page (3x3 grid)

  const { searchFilter, isSearched, backendUrl, setSearchFilter, setIsSearched } = useContext(AppContext);

  // Safely resolve and format a job's posted date from various possible fields
  const getPostedDate = (job) => {
    if (!job) return null;
    const raw =
      job.postedDate || job.postedAt || job.createdAt || job.date || null;
    if (!raw) return null;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString();
  };

  useEffect(() => {
    // Reset to page 1 when search is performed
    if (isSearched) {
      setCurrentPage(1);
    }
  }, [isSearched, searchFilter.query]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: jobsPerPage.toString(),
        });

        // Add search parameter if searching
        console.log("Search state:", { isSearched, searchFilter });
        if (isSearched && searchFilter.query) {
          params.append("search", searchFilter.query);
          console.log("Added search param:", searchFilter.query);
        }

        const finalUrl = `${backendUrl}/api/jobs?${params.toString()}`;
        console.log("Final API URL:", finalUrl);

        const response = await fetch(finalUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();

        // Handle paginated response
        const jobsArray = data.jobs || [];
        const paginationData = data.pagination || null;

        // Ensure a stable, most-recent-first order regardless of backend
        const toTime = (job) => {
          const raw =
            job.postedDate || job.postedAt || job.createdAt || job.date || null;
          const d = raw ? new Date(raw) : null;
          return d && !isNaN(d.getTime()) ? d.getTime() : 0;
        };
        const sorted = Array.isArray(jobsArray)
          ? [...jobsArray].sort((a, b) => toTime(b) - toTime(a))
          : [];

        setJobs(sorted);
        setPagination(paginationData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        // Do not use static mock data; show empty state instead
        setJobs([]);
        setPagination(null);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, jobsPerPage, isSearched, searchFilter, backendUrl]);

  return (
    <div
      id="job-listings"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Search Results Header */}
      {isSearched && searchFilter.query && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Search Results
          </h2>
          <p className="text-gray-600">
            Jobs matching "{searchFilter.query}"
          </p>
          <button
            onClick={() => {
              setSearchFilter({ query: "" });
              setIsSearched(false);
              setCurrentPage(1);
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Clear search
          </button>
        </motion.div>
      )}

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for jobs..."
          value={searchFilter.query || ""}
          onChange={(e) => {
            setSearchFilter({ query: e.target.value });
            setIsSearched(e.target.value.trim() !== "");
            setCurrentPage(1); // Reset to first page when searching
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Job Cards Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!isLoading && jobs.length === 0 && (
          <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-600">
            {isSearched && searchFilter.query
              ? `No jobs found matching "${searchFilter.query}". Try adjusting your search terms.`
              : "No jobs available at the moment."}
          </div>
        )}
        <AnimatePresence>
          {jobs.map((job) => (
            <motion.div
              key={job._id || job.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-transparent"
            >
              {/* border-reveal: animated 4-side brand stroke */}
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-200"
              ></span>
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 right-0 w-[2px] h-0 bg-gradient-to-b from-indigo-600 to-blue-600 group-hover:h-full transition-all duration-200 delay-100"
              ></span>
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 h-[2px] w-0 bg-gradient-to-l from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-200 delay-200"
              ></span>
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-0 w-[2px] h-0 bg-gradient-to-t from-indigo-600 to-blue-600 group-hover:h-full transition-all duration-200 delay-300"
              ></span>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.img
                    src={job.logo || brandLogo}
                    alt={job.company || "Company"}
                    className="w-12 h-12 rounded-full object-cover bg-gray-100 ring-0 group-hover:ring-2 group-hover:ring-indigo-100 transition-all"
                    whileHover={{ rotate: 2, scale: 1.03 }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = brandLogo;
                    }}
                  />
                  <span className="px-3 py-1 text-sm text-indigo-600 bg-indigo-100 rounded-full">
                    {job.jobType || job.type || "N/A"}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {job.title}
                </h3>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <p className="text-gray-500 mb-2">{job.location}</p>
                <p className="text-gray-500 mb-4">
                  {job.salaryRange || job.salary || "Salary: N/A"}
                </p>
                <div className="flex items-center justify-end text-sm">
                  <span className="text-gray-500">
                    Posted: {getPostedDate(job) || "N/A"}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full text-white py-2 px-4 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowModal(true);
                  }}
                >
                  Apply Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Controls */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                const pageNum =
                  Math.max(
                    1,
                    Math.min(
                      pagination.totalPages - 4,
                      pagination.currentPage - 2
                    )
                  ) + i;
                if (pageNum > pagination.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pageNum === pagination.currentPage
                        ? "text-white bg-indigo-600 border border-indigo-600"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(pagination.totalPages, prev + 1)
              )
            }
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {!isLoading && pagination && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Showing page {pagination.currentPage} of {pagination.totalPages} (
          {pagination.totalJobs} total jobs)
        </div>
      )}

      {/* Application Modal */}
      <JobApplicationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedJob(null);
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

export default JobListing;
