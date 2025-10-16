import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { JOB_APPLICATION_MODAL_CONSTANTS } from "../constants/jobApplicationModalConstants.js";
import {
  validateForm,
  isValidUrl,
  isValidFileType,
  isValidFileSize,
  isValidSalaryRange,
  getTodayDate,
  getMaxDate,
  formatFileSize,
  getCssClasses,
  getUploadProgressText,
  getCoverLetterHint,
} from "../utils/jobApplicationModalUtils.js";
import {
  checkUploadStatus,
  uploadResume,
  submitApplication,
} from "../services/jobApplicationModalService.js";

const JobApplicationModal = ({ isOpen, onClose, jobDetails }) => {
  const [formData, setFormData] = useState({
    coverLetter: "",
    resumeUrl: "",
    availableFrom: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadEnabled, setUploadEnabled] = useState(true);
  const fileInputRef = useRef(null);
  const { currentUser } = useContext(AppContext);

  // Check upload service status when modal opens
  useEffect(() => {
    if (isOpen) {
      checkUploadStatus();
    }
  }, [isOpen]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!isValidFileType(file)) {
      setErrors((prev) => ({
        ...prev,
        resume: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.FILE_TYPE_INVALID,
      }));
      return;
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      setErrors((prev) => ({
        ...prev,
        resume: JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.FILE_SIZE_TOO_LARGE,
      }));
      return;
    }

    // Clear any previous errors
    setErrors((prev) => ({
      ...prev,
      resume: undefined,
    }));

    // Upload the file
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });

      console.log("Upload result:", result); // Debug log

      // Extract URL from response - handle different response structures
      const uploadedUrl =
        result.data?.data?.url || result.data?.url || result.url;

      if (!uploadedUrl) {
        throw new Error("No URL returned from upload");
      }

      setUploadedFile({
        name: file.name,
        size: file.size,
        url: uploadedUrl,
      });

      toast.success(JOB_APPLICATION_MODAL_CONSTANTS.SUCCESS.UPLOAD_SUCCESS);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.UPLOAD_FAILED);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!currentUser) {
      toast.error(JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.LOGIN_REQUIRED);
      return;
    }

    // Validate form
    const validation = validateForm(formData, uploadedFile);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate jobDetails and extract job ID
      const jobId = jobDetails?._id || jobDetails?.id || jobDetails?.jobId;

      if (!jobId) {
        toast.error("Invalid job details. Please try again.");
        console.error("Missing job ID. Job details:", jobDetails);
        return;
      }

      const applicationData = {
        jobId: jobId,
        coverLetter: formData.coverLetter,
        resumeUrl: uploadedFile ? uploadedFile.url : formData.resumeUrl,
        availableFrom: formData.availableFrom,
      };

      console.log("Submitting application data:", applicationData);
      console.log("Job details:", jobDetails);
      console.log("Current user:", currentUser);

      const response = await submitApplication(applicationData);

      console.log("Application submitted successfully:", response);

      toast.success(JOB_APPLICATION_MODAL_CONSTANTS.SUCCESS.SUBMIT_SUCCESS);

      // Fetch updated applications list
      if (window.location.pathname === "/applications") {
        window.location.reload(); // Reload to fetch updated applications
      }

      onClose();

      // Reset form
      setFormData({
        coverLetter: "",
        resumeUrl: "",
        availableFrom: "",
      });
      setUploadedFile(null);
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      const errorMessage =
        error.response?.data?.message ||
        JOB_APPLICATION_MODAL_CONSTANTS.ERRORS.SUBMIT_FAILED;

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove uploaded file
  const removeUploadedFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get CSS classes using utility function
  const getClasses = (element, options = {}) => getCssClasses(element, options);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={JOB_APPLICATION_MODAL_CONSTANTS.ANIMATIONS.OVERLAY_INITIAL}
          animate={JOB_APPLICATION_MODAL_CONSTANTS.ANIMATIONS.OVERLAY_ANIMATE}
          exit={JOB_APPLICATION_MODAL_CONSTANTS.ANIMATIONS.OVERLAY_EXIT}
          className={getClasses("MODAL_OVERLAY")}
          onClick={onClose}
        >
          <motion.div
            initial={JOB_APPLICATION_MODAL_CONSTANTS.ANIMATIONS.MODAL_INITIAL}
            animate={
              JOB_APPLICATION_MODAL_CONSTANTS.ANIMATIONS.MODAL_CONTENT.animate
            }
            exit={JOB_APPLICATION_MODAL_CONSTANTS.ANIMATIONS.MODAL_CONTENT.exit}
            className={getClasses("MODAL_CONTENT")}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={getClasses("MODAL_HEADER")}>
              <h2 className={getClasses("MODAL_TITLE")}>
                {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.TITLE}
              </h2>
              <button
                onClick={onClose}
                className={getClasses("CLOSE_BUTTON")}
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            {/* Job Details */}
            <div className={getClasses("JOB_DETAILS_SECTION")}>
              <h3 className={getClasses("JOB_DETAILS_HEADING")}>
                {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.JOB_DETAILS_HEADING}
              </h3>
              <div className={getClasses("JOB_DETAILS_GRID")}>
                <div>
                  <p className={getClasses("JOB_FIELD_LABEL")}>
                    {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.POSITION_LABEL}
                  </p>
                  <p className={getClasses("JOB_FIELD")}>{jobDetails.title}</p>
                </div>
                <div>
                  <p className={getClasses("JOB_FIELD_LABEL")}>
                    {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.COMPANY_LABEL}
                  </p>
                  <p className={getClasses("JOB_FIELD")}>
                    {jobDetails.company}
                  </p>
                </div>
                <div>
                  <p className={getClasses("JOB_FIELD_LABEL")}>
                    {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.LOCATION_LABEL}
                  </p>
                  <p className={getClasses("JOB_FIELD")}>
                    {jobDetails.location}
                  </p>
                </div>
                {isValidSalaryRange(jobDetails.salary) && (
                  <div>
                    <p className={getClasses("JOB_FIELD_LABEL")}>
                      {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.SALARY_LABEL}
                    </p>
                    <p className={getClasses("JOB_FIELD")}>
                      {jobDetails.salary}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={getClasses("FORM")}>
              <div>
                <label className={getClasses("RESUME_LABEL")}>
                  Resume{" "}
                  <span className={getClasses("RESUME_REQUIRED_STAR")}>*</span>
                </label>

                {/* File Upload Area */}
                {!uploadedFile ? (
                  <div
                    className={`${getClasses("UPLOAD_AREA")} ${
                      uploadEnabled
                        ? getClasses("UPLOAD_AREA_ENABLED")
                        : getClasses("UPLOAD_AREA_DISABLED")
                    }`}
                  >
                    {uploadEnabled ? (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileSelect}
                          className={getClasses("FILE_INPUT")}
                          disabled={isUploading}
                        />

                        {isUploading ? (
                          <div className={getClasses("UPLOADING_CONTAINER")}>
                            <div className={getClasses("SPINNER")}></div>
                            <p className={getClasses("UPLOAD_PROGRESS_TEXT")}>
                              Uploading... {uploadProgress}%
                            </p>
                            <div className={getClasses("PROGRESS_BAR")}>
                              <div
                                className={getClasses("PROGRESS_FILL")}
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={getClasses("UPLOAD_CLICKABLE")}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className={getClasses("UPLOAD_ICON")} />
                            <p className={getClasses("UPLOAD_TITLE")}>
                              Click to upload your resume
                            </p>
                            <p className={getClasses("UPLOAD_SUBTITLE")}>
                              PDF, DOC, DOCX, TXT up to 5MB
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={getClasses("UPLOADING_CONTAINER")}>
                        <AlertCircle
                          className={getClasses("UNAVAILABLE_ICON")}
                        />
                        <p className={getClasses("UNAVAILABLE_TITLE")}>
                          File upload temporarily unavailable
                        </p>
                        <p className={getClasses("UNAVAILABLE_SUBTITLE")}>
                          Please provide a resume URL below
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Uploaded File Display */
                  <div className={getClasses("UPLOADED_FILE_CONTAINER")}>
                    <div className={getClasses("UPLOADED_FILE_FLEX")}>
                      <div className={getClasses("UPLOADED_FILE_INFO")}>
                        <div className={getClasses("UPLOADED_FILE_ICON")}>
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className={getClasses("UPLOADED_FILE_DETAILS")}>
                          <p className={getClasses("UPLOADED_FILE_NAME")}>
                            {uploadedFile.name}
                          </p>
                          <p className={getClasses("UPLOADED_FILE_SIZE")}>
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {uploadedFile.type}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeUploadedFile}
                        className={getClasses("REMOVE_BUTTON")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Alternative: Manual URL Input */}
                <div className={getClasses("URL_INPUT_CONTAINER")}>
                  <p
                    className={`${getClasses("URL_LABEL")} ${
                      uploadEnabled
                        ? getClasses("URL_LABEL_ENABLED")
                        : getClasses("URL_LABEL_DISABLED")
                    }`}
                  >
                    {uploadEnabled
                      ? "Or provide a resume URL:"
                      : "Please provide a resume URL:"}
                  </p>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={uploadedFile ? "" : formData.resumeUrl}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/your-resume-link"
                    disabled={!!uploadedFile}
                    className={`${getClasses("URL_INPUT")} ${
                      errors.resumeUrl ? getClasses("URL_INPUT_ERROR") : ""
                    } ${uploadedFile ? getClasses("URL_INPUT_DISABLED") : ""}`}
                  />
                  {uploadedFile && (
                    <p className={getClasses("SUCCESS_MESSAGE")}>
                      ✓ File uploaded successfully. URL input disabled.
                    </p>
                  )}
                </div>

                {errors.resume && (
                  <p className={getClasses("ERROR_MESSAGE")}>{errors.resume}</p>
                )}
                {errors.resumeUrl && (
                  <p className={getClasses("ERROR_MESSAGE")}>
                    {errors.resumeUrl}
                  </p>
                )}
                <p className={getClasses("HINT_MESSAGE")}>
                  Upload a file or provide a URL (10-500 characters)
                </p>
              </div>

              {/* Available From Date */}
              <div className={getClasses("FORM_GROUP")}>
                <label className={getClasses("LABEL")}>
                  {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.AVAILABLE_FROM_LABEL}
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleInputChange}
                  className={`${getClasses("DATE_INPUT")} ${
                    errors.availableFrom ? getClasses("DATE_INPUT_ERROR") : ""
                  }`}
                  min={getTodayDate()}
                  max={getMaxDate()}
                />
                {errors.availableFrom && (
                  <p className={getClasses("ERROR_MESSAGE")}>
                    {errors.availableFrom}
                  </p>
                )}
              </div>

              {/* Cover Letter */}
              <div className={getClasses("FORM_GROUP")}>
                <label className={getClasses("LABEL")}>
                  {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.COVER_LETTER_LABEL}
                  <span className={getClasses("OPTIONAL")}>
                    ({JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.OPTIONAL})
                  </span>
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className={`${getClasses("TEXTAREA")} ${
                    errors.coverLetter ? getClasses("TEXTAREA_ERROR") : ""
                  }`}
                  placeholder={
                    JOB_APPLICATION_MODAL_CONSTANTS.CONTENT
                      .COVER_LETTER_PLACEHOLDER
                  }
                  rows={4}
                  maxLength={
                    JOB_APPLICATION_MODAL_CONSTANTS.VALIDATION
                      .COVER_LETTER_MAX_LENGTH
                  }
                />
                <div className={getClasses("HINT_MESSAGE")}>
                  {getCoverLetterHint(formData.coverLetter.length)}
                </div>
                {errors.coverLetter && (
                  <p className={getClasses("ERROR_MESSAGE")}>
                    {errors.coverLetter}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className={getClasses("ACTION_BUTTONS")}>
                <button
                  type="button"
                  onClick={onClose}
                  className={getClasses("CANCEL_BUTTON")}
                  disabled={isSubmitting}
                >
                  {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.CANCEL_BUTTON}
                </button>
                <button
                  type="submit"
                  className={getClasses("SUBMIT_BUTTON")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className={getClasses("LOADING_CONTAINER")}>
                      <div className={getClasses("LOADING_SPINNER")}></div>
                      {JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.SUBMITTING_TEXT}
                    </div>
                  ) : (
                    <>{JOB_APPLICATION_MODAL_CONSTANTS.CONTENT.SUBMIT_BUTTON}</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobApplicationModal;
