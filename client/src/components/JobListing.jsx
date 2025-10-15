import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import brandLogo from "../assets/logo.svg";
import JobApplicationModal from "./JobApplicationModal";
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

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(
    JOB_LISTING_CONSTANTS.LOADING_STATES.INITIAL
  );
  const [fade, setFade] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const {
    searchFilter,
    isSearched,
    backendUrl,
    setSearchFilter,
    setIsSearched,
  } = useContext(AppContext);

  // Get utility functions and constants
  const classes = getCssClasses();
  const animations = getAnimations();
  const content = getContent();

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
    };

    fetchJobs();
  }, [currentPage, isSearched, searchFilter, backendUrl]);

  return (
    <div id="job-listings" className={classes.container}>
      {/* Search Results Header */}
      {isSearched && searchFilter.query && (
        <motion.div
          initial={animations.SEARCH_HEADER_INITIAL}
          animate={animations.SEARCH_HEADER_ANIMATE}
          className={classes.searchHeader}
        >
          <h2 className={classes.searchTitle}>
            {content.SEARCH_RESULTS_TITLE}
          </h2>
          <p className={classes.searchSubtitle}>
            {content.SEARCH_RESULTS_SUBTITLE} "{searchFilter.query}"
          </p>
          <button
            onClick={() => {
              setSearchFilter({ query: "" });
              setIsSearched(false);
              setCurrentPage(1);
            }}
            className={classes.clearSearchButton}
          >
            {content.CLEAR_SEARCH}
          </button>
        </motion.div>
      )}

      {/* Search Input */}
      <div className={classes.searchInputContainer}>
        <input
          type="text"
          placeholder={content.SEARCH_PLACEHOLDER}
          value={searchFilter.query || ""}
          onChange={(e) => {
            setSearchFilter({ query: e.target.value });
            setIsSearched(e.target.value.trim() !== "");
            setCurrentPage(1); // Reset to first page when searching
          }}
          className={classes.searchInput}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className={classes.loadingContainer}>
          <div className={classes.loadingSpinner}></div>
        </div>
      )}

      {/* Job Cards Grid */}
      <motion.div
        className={classes.jobGrid}
        initial={animations.GRID_INITIAL}
        animate={animations.GRID_ANIMATE}
        transition={animations.GRID_TRANSITION}
      >
        {!isLoading && jobs.length === 0 && (
          <div className={classes.emptyState}>
            {getEmptyStateMessage(isSearched, searchFilter.query)}
          </div>
        )}
        <AnimatePresence>
          {jobs.map((job) => (
            <motion.div
              key={job._id || job.id}
              layout
              initial={animations.CARD_INITIAL}
              animate={animations.CARD_ANIMATE}
              exit={animations.CARD_EXIT}
              transition={animations.CARD_TRANSITION}
              whileHover={animations.CARD_HOVER}
              whileTap={animations.CARD_TAP}
              className={classes.jobCard}
            >
              {/* border-reveal: animated 4-side brand stroke */}
              <span
                aria-hidden
                className={`${classes.borderReveal} ${classes.borderTop}`}
              ></span>
              <span
                aria-hidden
                className={`${classes.borderReveal} ${classes.borderRight}`}
              ></span>
              <span
                aria-hidden
                className={`${classes.borderReveal} ${classes.borderBottom}`}
              ></span>
              <span
                aria-hidden
                className={`${classes.borderReveal} ${classes.borderLeft}`}
              ></span>
              <div className={classes.cardContent}>
                <div className={classes.cardHeader}>
                  <motion.img
                    src={job.logo || brandLogo}
                    alt={job.company || "Company"}
                    className={classes.companyLogo}
                    whileHover={animations.LOGO_HOVER}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = brandLogo;
                    }}
                  />
                  <span className={classes.jobTypeBadge}>
                    {job.jobType || job.type || content.JOB_TYPE_FALLBACK}
                  </span>
                </div>
                <h3 className={classes.jobTitle}>{job.title}</h3>
                <p className={classes.jobCompany}>{job.company}</p>
                <p className={classes.jobLocation}>{job.location}</p>
                <p className={classes.jobSalary}>
                  {job.salaryRange || job.salary || content.SALARY_FALLBACK}
                </p>
                <div className={classes.jobPosted}>
                  <span>
                    {content.POSTED_LABEL}{" "}
                    {getPostedDate(job) || content.DATE_FALLBACK}
                  </span>
                </div>
                <motion.button
                  whileHover={animations.APPLY_BUTTON_HOVER}
                  whileTap={animations.APPLY_BUTTON_TAP}
                  className={classes.applyButton}
                  onClick={() => {
                    setSelectedJob(job);
                    setShowModal(true);
                  }}
                >
                  {content.APPLY_NOW}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Controls */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className={classes.paginationContainer}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrevPage}
            className={classes.paginationButton}
          >
            {content.PREVIOUS}
          </button>

          <div className={classes.paginationNumbers}>
            {calculatePaginationButtons(pagination).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`${classes.paginationNumber} ${
                  pageNum === pagination.currentPage
                    ? classes.paginationNumberActive
                    : classes.paginationNumberInactive
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(pagination.totalPages, prev + 1)
              )
            }
            disabled={!pagination.hasNextPage}
            className={classes.paginationButton}
          >
            {content.NEXT}
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {!isLoading && pagination && (
        <div className={classes.paginationInfo}>
          {content.SHOWING_PAGE} {pagination.currentPage} {content.OF}{" "}
          {pagination.totalPages} ({pagination.totalJobs} {content.TOTAL_JOBS})
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
