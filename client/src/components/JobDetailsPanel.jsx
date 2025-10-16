import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  Building2,
  FileText,
  CheckCircle,
} from "lucide-react";
import brandLogo from "../assets/logo.svg";
import { getPostedDate } from "../utils/jobListingUtils.js";

const JobDetailsPanel = ({ job, onApplyClick }) => {
  if (!job) {
    return (
      <div className="hidden lg:flex lg:flex-1 bg-gray-50 items-center justify-center p-8 rounded-lg shadow-sm sticky top-[120px]" style={{ maxHeight: 'calc(100vh - 140px)' }}>
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Select a Job
          </h3>
          <p className="text-gray-500">
            Click on a job from the list to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:flex lg:flex-1 bg-white rounded-lg shadow-sm flex-col sticky top-[120px]"
      style={{ maxHeight: 'calc(100vh - 140px)' }}
    >
      {/* Sticky Header Section */}
      <div className="sticky top-0 bg-white z-10 p-8 pb-4 border-b border-gray-200">
        <div className="flex items-start gap-6">
          <motion.img
            src={job.logo || brandLogo}
            alt={job.company || "Company"}
            className="w-20 h-20 rounded-lg object-contain border border-gray-200 p-2"
            whileHover={{ scale: 1.05 }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = brandLogo;
            }}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Building2 className="w-5 h-5" />
              <span className="text-lg font-medium">{job.company}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          </div>
          {/* Apply Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onApplyClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Apply Now
          </motion.button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 pt-6">
        {/* Job Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-gray-200">
          {/* Salary */}
          {(job.salaryRange || job.salary) && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
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
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
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
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
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
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
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
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-red-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-red-600" />
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-purple-600" />
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        {job.description && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Requirements
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.requirements}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default JobDetailsPanel;
