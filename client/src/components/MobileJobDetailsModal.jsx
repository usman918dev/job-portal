import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  CheckCircle,
} from "lucide-react";
import brandLogo from "../assets/logo.svg";
import { getPostedDate } from "../utils/jobListingUtils.js";

const MobileJobDetailsModal = ({
  isOpen,
  onClose,
  job,
  onApplyClick,
}) => {
  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full bg-white z-50 overflow-y-auto lg:hidden"
          >
            {/* Close Button */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">
                Job Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Job Details Content */}
            <div className="p-4">
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <motion.img
                    src={job.logo || brandLogo}
                    alt={job.company || "Company"}
                    className="w-16 h-16 rounded-lg object-contain border border-gray-200 p-2"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = brandLogo;
                    }}
                  />
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onApplyClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md"
                >
                  Apply Now
                </motion.button>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 gap-3 mb-6 pb-6 border-b border-gray-200">
                {/* Salary */}
                {(job.salaryRange || job.salary) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Salary</p>
                      <p className="text-gray-900 font-semibold">
                        {job.salaryRange || job.salary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Job Type */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Job Type</p>
                    <p className="text-gray-900 font-semibold capitalize">
                      {job.jobType || job.type || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                {job.experience && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Experience</p>
                      <p className="text-gray-900 font-semibold">{job.experience}</p>
                    </div>
                  </div>
                )}

                {/* Posted Date */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Posted</p>
                    <p className="text-gray-900 font-semibold">
                      {getPostedDate(job) || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                {job.deadline && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Deadline</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Required Skills Section */}
              {job.skills && job.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium text-sm shadow-md"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description Section */}
              {job.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Job Description
                  </h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements Section */}
              {job.requirements && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Requirements
                  </h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {job.requirements}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Apply Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onApplyClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md"
              >
                Apply Now
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileJobDetailsModal;