import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBookmark,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";
import JobApplicationModal from "./JobApplicationModal";
import brandLogo from "../assets/logo.svg";
import { JOB_CARD_CONSTANTS } from '../constants/jobCardConstants.js';
import {
  stripHtmlTags,
  getTimePassed,
  formatSalary,
  isNewJob,
  getDisplaySkills,
  getCssClasses,
  getAnimations,
  getContent
} from '../utils/jobCardUtils.js';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get utility functions and constants
  const classes = getCssClasses();
  const animations = getAnimations();
  const content = getContent();
  const { displayed: displayedSkills, remaining: remainingSkills } = getDisplaySkills(job.skills);

  return (
    <motion.div
      initial={animations.CARD_INITIAL}
      whileInView={animations.CARD_ANIMATE}
      transition={animations.CARD_TRANSITION}
      viewport={JOB_CARD_CONSTANTS.VIEWPORT}
    >
      <motion.div
        whileHover={{ scale: animations.HOVER_SCALE }}
        transition={animations.HOVER_TRANSITION}
        className={classes.container}
      >
        <div className={classes.card}>
          {/* Ribbon */}
          {isNewJob(job.postedAt) && (
            <span className={classes.ribbon}>
              {content.NEW_RIBBON}
            </span>
          )}

          {/* Header */}
          <div className={classes.header}>
            <div className="flex items-center gap-4">
              <div className={classes.logoContainer}>
                <img
                  src={job.companyId?.image || brandLogo}
                  alt="logo"
                  className={classes.logo}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = brandLogo;
                  }}
                />
              </div>
              <div>
                <h3 className={classes.title}>
                  {job.title || content.JOB_TITLE_FALLBACK}
                </h3>
                <p className={classes.company}>
                  {job.companyId?.name || content.COMPANY_FALLBACK}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={animations.BUTTON_TAP}
              onClick={() => setIsSaved(!isSaved)}
              className={`${classes.bookmarkButton} ${isSaved ? classes.bookmarkSaved : classes.bookmarkUnsaved}`}
              title={isSaved ? content.SAVED_TITLE : content.SAVE_JOB_TITLE}
            >
              <FiBookmark />
            </motion.button>
          </div>

          {/* Tags */}
          <div className={classes.tagsContainer}>
            <span className={classes.locationTag}>
              <FiMapPin className="text-sm" /> {job.location || content.REMOTE_LOCATION}
            </span>
            <span className={classes.levelTag}>
              <FiBriefcase className="text-sm" /> {job.level || content.INTERMEDIATE_LEVEL}
            </span>
            <span className={classes.salaryTag}>
              <FiDollarSign className="text-sm" /> {formatSalary(job.salary)}
            </span>
            {job.type && (
              <span className={classes.typeTag}>
                <FiClock className="text-sm" /> {job.type}
              </span>
            )}
          </div>

          {/* Description */}
          <div className={classes.descriptionContainer}>
            <p
              className={`${classes.description} ${isExpanded ? classes.descriptionExpanded : classes.descriptionCollapsed}`}
              onClick={() => setIsExpanded(!isExpanded)}
              title="Click to expand"
            >
              {stripHtmlTags(job.description)}
            </p>
          </div>

          {/* Skills */}
          {displayedSkills.length > 0 && (
            <div className={classes.skillsContainer}>
              <div className={classes.skillsList}>
                {displayedSkills.map((skill, index) => (
                  <motion.span
                    key={index}
                    whileHover={animations.SKILL_HOVER}
                    className={classes.skillTag}
                  >
                    {skill}
                  </motion.span>
                ))}
                {remainingSkills > 0 && (
                  <span className={classes.moreSkillsTag}>
                    +{remainingSkills}{content.SKILLS_MORE_SUFFIX}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className={classes.footer}>
            <span className={classes.postedTime}>
              {content.POSTED_PREFIX}{getTimePassed(job.postedAt)}
            </span>
            <div className={classes.footerButtons}>
              <motion.button
                whileHover={animations.FOOTER_BUTTON_HOVER}
                whileTap={animations.FOOTER_BUTTON_TAP}
                onClick={() => {
                  navigate(`/apply-job/${job._id}`);
                  window.scrollTo(0, 0);
                }}
                className={classes.learnMoreButton}
              >
                {content.LEARN_MORE}
              </motion.button>
              <motion.button
                whileHover={animations.FOOTER_BUTTON_HOVER}
                whileTap={animations.FOOTER_BUTTON_TAP}
                onClick={() => setShowModal(true)}
                className={classes.applyNowButton}
              >
                {content.APPLY_NOW}
              </motion.button>
            </div>
          </div>

          {/* Application Modal */}
          <JobApplicationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            jobDetails={{
              _id: job._id || job.id || job.jobId,
              title: job.title,
              company: job.company,
              salary: formatSalary(job.salary),
              location: job.location,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

JobCard.defaultProps = JOB_CARD_CONSTANTS.DEFAULT_PROPS;

export default JobCard;
