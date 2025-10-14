import React, { useState, useEffect,useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const JobApplicationModal = ({ isOpen, onClose, jobDetails }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeUrl: '',
    availableFrom: ''
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

  // Check if file upload service is available
  const checkUploadStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/applications/upload-status');
      setUploadEnabled(response.data.uploadEnabled);
    } catch (error) {
      console.warn('Could not check upload status:', error);
      setUploadEnabled(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for date input min attribute
  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors = {};

    // Resume validation - either uploaded file or URL
    if (!uploadedFile && !formData.resumeUrl.trim()) {
      newErrors.resume = 'Please upload a resume file or provide a resume URL';
    } else if (!uploadedFile && formData.resumeUrl.trim()) {
      if (!isValidUrl(formData.resumeUrl)) {
        newErrors.resumeUrl = 'Please enter a valid URL (e.g., https://drive.google.com/...)';
      } else if (formData.resumeUrl.length < 10) {
        newErrors.resumeUrl = 'Resume URL must be at least 10 characters long';
      } else if (formData.resumeUrl.length > 500) {
        newErrors.resumeUrl = 'Resume URL must be less than 500 characters';
      }
    }

    // Cover letter validation (optional but with length limit)
    if (formData.coverLetter.length > 1000) {
      newErrors.coverLetter = 'Cover letter must be less than 1000 characters';
    } else if (formData.coverLetter.length > 0 && formData.coverLetter.length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters if provided';
    }

    // Available from date validation
    if (!formData.availableFrom) {
      newErrors.availableFrom = 'Please select when you can start';
    } else {
      const selectedDate = new Date(formData.availableFrom);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0); // Reset time to start of day

      if (selectedDate < todayDate) {
        newErrors.availableFrom = 'Available date cannot be in the past';
      } else {
        // Check if date is not more than 1 year in the future
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        if (selectedDate > oneYearFromNow) {
          newErrors.availableFrom = 'Available date cannot be more than 1 year from today';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      return;
    }

    // Start upload
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('resume', file);

      const response = await axios.post('http://localhost:5000/api/applications/upload-resume', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          url: response.data.data.url
        });
        setFormData(prev => ({
          ...prev,
          resumeUrl: response.data.data.url
        }));
        toast.success('Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Remove uploaded file
  const removeUploadedFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({
      ...prev,
      resumeUrl: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isValidSalaryRange = (salary) => {
    if (!salary || typeof salary !== 'string') return false;
    // Check if it's a valid salary format (e.g., "$50,000 - $70,000", "50000-70000", "Competitive")
    const salaryRegex = /^[\$]?[\d,]+(\s*-\s*[\$]?[\d,]+)?$|^Competitive$|^Negotiable$/i;
    return salaryRegex.test(salary.trim());
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.email) {
      toast.error('Please login to apply for jobs');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/applications/submit', {
        jobId: jobDetails.jobId,
        coverLetter: formData.coverLetter,
        resumeUrl: formData.resumeUrl,
        userId: currentUser.email,
        availableFrom: formData.availableFrom
      });

      if (response.data.success) {
        toast.success('Application submitted successfully!');
        setFormData({
          coverLetter: '',
          resumeUrl: '',
          availableFrom: ''
        });
        setErrors({});
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Confirm Application</h2>
            <p className="text-gray-500 mt-1">Please review the job details below</p>
          </div>

          {/* Job Details Form */}
          <form onSubmit={handleSubmit} className="space-y-4 overflow-x-hidden">
            {/* Job Information (Read-only) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Job Details</h3>
              <div className="grid grid-cols-1 gap-3">
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={jobDetails?.company || ''}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none cursor-not-allowed"
                  />
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={jobDetails?.title || ''}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none cursor-not-allowed"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={jobDetails?.location || ''}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none cursor-not-allowed"
                  />
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={`$${jobDetails?.salary}` || ''}
                    readOnly
                    className={`w-full px-3 py-2 bg-white border rounded text-sm text-gray-700 focus:outline-none cursor-not-allowed ${
                      !isValidSalaryRange(jobDetails?.salary) && jobDetails?.salary ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {!isValidSalaryRange(jobDetails?.salary) && jobDetails?.salary && (
                    <p className="text-xs text-red-500 mt-1">
                      Invalid salary format
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Application Information (Editable) */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your Application</h3>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume <span className="text-red-500">*</span>
              </label>
              
              {/* File Upload Area */}
              {!uploadedFile ? (
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  uploadEnabled 
                    ? 'border-gray-300 hover:border-blue-400' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  {uploadEnabled ? (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                      />
                      
                      {isUploading ? (
                        <div className="space-y-3">
                          <div className="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                          <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload your resume
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX, TXT up to 5MB
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-3">
                      <AlertCircle className="w-12 h-12 mx-auto text-amber-400" />
                      <p className="text-sm font-medium text-gray-700">
                        File upload temporarily unavailable
                      </p>
                      <p className="text-xs text-gray-500">
                        Please provide a resume URL below
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Uploaded File Display */
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeUploadedFile}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Alternative: Manual URL Input */}
              <div className="mt-3">
                <p className={`text-xs mb-2 ${uploadEnabled ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                  {uploadEnabled ? 'Or provide a resume URL:' : 'Please provide a resume URL:'}
                </p>
                <input
                  type="url"
                  value={uploadedFile ? '' : formData.resumeUrl}
                  onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
                  placeholder="https://drive.google.com/your-resume-link"
                  disabled={!!uploadedFile}
                  className={`w-full px-4 py-2.5 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.resumeUrl ? 'border-red-500' : 'border-gray-200'
                  } ${uploadedFile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {uploadedFile && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ File uploaded successfully. URL input disabled.
                  </p>
                )}
              </div>
              
              {errors.resume && (
                <p className="text-xs text-red-500 mt-1">{errors.resume}</p>
              )}
              {errors.resumeUrl && (
                <p className="text-xs text-red-500 mt-1">{errors.resumeUrl}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload a file or provide a URL (10-500 characters)
              </p>
            </div>

            {/* Available From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.availableFrom}
                onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                min={today}
                max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                required
                className={`w-full px-4 py-2.5 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.availableFrom ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.availableFrom && (
                <p className="text-xs text-red-500 mt-1">{errors.availableFrom}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Select when you can start (up to 1 year from today)
              </p>
            </div>

            {/* Message (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter (Optional)
              </label>
              <textarea
                rows="3"
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                placeholder="Add a brief message to your application..."
                minLength="50"
                maxLength="1000"
                className={`w-full px-4 py-2.5 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.coverLetter ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.coverLetter && (
                <p className="text-xs text-red-500 mt-1">{errors.coverLetter}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.coverLetter.length}/1000 characters (minimum 50 if provided)
              </p>
            </div>
          </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobApplicationModal;