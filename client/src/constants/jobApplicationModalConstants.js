// JobApplicationModal component constants
export const JOB_APPLICATION_MODAL_CONSTANTS = {
    // API endpoints
    API_ENDPOINTS: {
        UPLOAD_STATUS: 'http://localhost:5000/api/applications/upload-status',
        UPLOAD_RESUME: 'http://localhost:5000/api/applications/upload-resume',
        SUBMIT_APPLICATION: 'http://localhost:5000/api/applications/submit'
    },

    // File upload configuration
    FILE_UPLOAD: {
        ALLOWED_TYPES: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ],
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt']
    },

    // Form validation rules
    VALIDATION: {
        RESUME_URL: {
            MIN_LENGTH: 10,
            MAX_LENGTH: 500
        },
        COVER_LETTER: {
            MIN_LENGTH: 50,
            MAX_LENGTH: 1000
        },
        DATE_RANGE: {
            MAX_YEARS_FUTURE: 1
        }
    },

    // Content
    CONTENT: {
        TITLE: 'Confirm Application',
        SUBTITLE: 'Please review the job details below',
        JOB_DETAILS_HEADING: 'Job Details',
        APPLICATION_HEADING: 'Your Application',
        RESUME_LABEL: 'Resume',
        RESUME_REQUIRED: '*',
        AVAILABLE_FROM_LABEL: 'Available From',
        AVAILABLE_FROM_REQUIRED: '*',
        COVER_LETTER_LABEL: 'Cover Letter (Optional)',
        COVER_LETTER_PLACEHOLDER: 'Tell us why you\'re interested in this position and what makes you a great fit...',
        SUBMIT_BUTTON: 'Submit Application',
        CANCEL_BUTTON: 'Cancel',
        UPLOADING_TEXT: 'Uploading...',
        SUBMITTING_TEXT: 'Submitting...',
        OR_PROVIDE_URL: 'Or provide a resume URL:',
        PLEASE_PROVIDE_URL: 'Please provide a resume URL:',
        UPLOAD_SUCCESS: '✓ File uploaded successfully. URL input disabled.',
        UPLOAD_HINT: 'Upload a file or provide a URL (10-500 characters)',
        DATE_HINT: 'Select when you can start (up to 1 year from today)',
        COVER_LETTER_HINT: (length) => `${length}/1000 characters (minimum 50 if provided)`,
        COMPANY_LABEL: 'Company',
        POSITION_LABEL: 'Position',
        LOCATION_LABEL: 'Location',
        SALARY_LABEL: 'Salary Range',
        INVALID_SALARY: 'Invalid salary format',
        UPLOAD_PLACEHOLDER: 'Click to upload your resume',
        UPLOAD_TYPES: 'PDF, DOC, DOCX, TXT up to 5MB',
        UPLOAD_UNAVAILABLE: 'File upload temporarily unavailable',
        URL_PLACEHOLDER: 'https://drive.google.com/your-resume-link'
    },

    // Error messages
    ERRORS: {
        RESUME_REQUIRED: 'Please upload a resume file or provide a resume URL',
        RESUME_URL_INVALID: 'Please enter a valid URL (e.g., https://drive.google.com/...)',
        RESUME_URL_TOO_SHORT: 'Resume URL must be at least 10 characters long',
        RESUME_URL_TOO_LONG: 'Resume URL must be less than 500 characters',
        COVER_LETTER_TOO_LONG: 'Cover letter must be less than 1000 characters',
        COVER_LETTER_TOO_SHORT: 'Cover letter must be at least 50 characters if provided',
        AVAILABLE_FROM_REQUIRED: 'Please select when you can start',
        AVAILABLE_FROM_PAST: 'Available date cannot be in the past',
        AVAILABLE_FROM_TOO_FAR: 'Available date cannot be more than 1 year from today',
        FILE_TYPE_INVALID: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.',
        FILE_SIZE_TOO_LARGE: 'File size must be less than 5MB.',
        UPLOAD_FAILED: 'Failed to upload resume',
        SUBMIT_FAILED: 'Error submitting application',
        FORM_VALIDATION: 'Please fix the errors in the form',
        LOGIN_REQUIRED: 'Please login to apply for jobs'
    },

    // Success messages
    SUCCESS: {
        UPLOAD_SUCCESS: 'Resume uploaded successfully!',
        SUBMIT_SUCCESS: 'Application submitted successfully!'
    },

    // Animation variants
    ANIMATIONS: {
        MODAL_OVERLAY: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        },
        MODAL_CONTENT: {
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.95, opacity: 0 }
        }
    },

    // CSS Classes
    CLASSES: {
        MODAL_OVERLAY: 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm',
        MODAL_CONTENT: 'relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto',
        CLOSE_BUTTON: 'absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors',
        MODAL_HEADER: 'mb-6',
        MODAL_TITLE: 'text-2xl font-bold text-gray-800',
        MODAL_SUBTITLE: 'text-gray-500 mt-1',
        FORM: 'space-y-4 overflow-x-hidden',
        FORM_GROUP: 'space-y-1.5',
        LABEL: 'block text-sm font-medium text-gray-700',
        OPTIONAL: 'text-gray-500',
        INPUT: 'w-full px-4 py-2.5 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        INPUT_ERROR: 'border-red-500',
        ERROR_TEXT: 'text-xs text-red-500 mt-1',
        HINT: 'text-xs text-gray-500 mt-1',
        BUTTON_GROUP: 'flex flex-col sm:flex-row gap-3 pt-2',
        JOB_DETAILS_SECTION: 'bg-gray-50 p-4 rounded-lg border border-gray-200',
        JOB_DETAILS_HEADING: 'text-sm font-medium text-gray-700 mb-3',
        JOB_DETAILS_GRID: 'grid grid-cols-1 gap-3',
        JOB_FIELD: 'text-sm text-gray-600',
        JOB_FIELD_LABEL: 'block text-xs font-medium text-gray-500 mb-1',
        JOB_FIELD_INPUT: 'w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none cursor-not-allowed',
        SALARY_INPUT_INVALID: 'border-red-500',
        SALARY_ERROR: 'text-xs text-red-500 mt-1',
        APPLICATION_SECTION: 'bg-white border border-gray-200 rounded-lg p-4',
        APPLICATION_HEADING: 'text-sm font-medium text-gray-700 mb-3',
        RESUME_LABEL: 'block text-sm font-medium text-gray-700 mb-1',
        RESUME_REQUIRED_STAR: 'text-red-500',
        UPLOAD_AREA: 'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
        UPLOAD_AREA_ENABLED: 'border-gray-300 hover:border-blue-400',
        UPLOAD_AREA_DISABLED: 'border-gray-200 bg-gray-50',
        FILE_INPUT: 'hidden',
        UPLOADING_CONTAINER: 'space-y-3',
        SPINNER: 'w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin',
        UPLOAD_PROGRESS_TEXT: 'text-sm text-gray-600',
        PROGRESS_BAR: 'w-full bg-gray-200 rounded-full h-2',
        PROGRESS_FILL: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
        UPLOAD_CLICKABLE: 'cursor-pointer',
        UPLOAD_ICON: 'w-12 h-12 mx-auto text-gray-400 mb-3',
        UPLOAD_TITLE: 'text-sm font-medium text-gray-700 mb-1',
        UPLOAD_SUBTITLE: 'text-xs text-gray-500',
        UNAVAILABLE_ICON: 'w-12 h-12 mx-auto text-amber-400',
        UNAVAILABLE_TITLE: 'text-sm font-medium text-gray-700',
        UNAVAILABLE_SUBTITLE: 'text-xs text-gray-500',
        UPLOADED_FILE_CONTAINER: 'border border-green-200 bg-green-50 rounded-lg p-4',
        UPLOADED_FILE_FLEX: 'flex items-center justify-between',
        UPLOADED_FILE_INFO: 'flex items-center space-x-3',
        UPLOADED_FILE_ICON: 'flex-shrink-0',
        SUCCESS_ICON: 'w-8 h-8 text-green-600',
        UPLOADED_FILE_DETAILS: '',
        UPLOADED_FILE_NAME: 'text-sm font-medium text-gray-900',
        UPLOADED_FILE_SIZE: 'text-xs text-gray-500',
        REMOVE_BUTTON: 'text-red-500 hover:text-red-700 p-1',
        URL_INPUT_CONTAINER: 'mt-3',
        URL_LABEL: 'text-xs mb-2',
        URL_LABEL_ENABLED: 'text-gray-500',
        URL_LABEL_DISABLED: 'text-gray-700 font-medium',
        URL_INPUT: 'w-full px-4 py-2.5 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        URL_INPUT_ERROR: 'border-red-500',
        URL_INPUT_DISABLED: 'bg-gray-100 cursor-not-allowed',
        SUCCESS_MESSAGE: 'text-xs text-green-600 mt-1',
        ERROR_MESSAGE: 'text-xs text-red-500 mt-1',
        HINT_MESSAGE: 'text-xs text-gray-500 mt-1',
        DATE_INPUT: 'w-full px-4 py-2.5 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        DATE_INPUT_ERROR: 'border-red-500',
        TEXTAREA: 'w-full px-4 py-2.5 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
        TEXTAREA_ERROR: 'border-red-500',
        ACTION_BUTTONS: 'flex flex-col sm:flex-row gap-3 pt-2',
        SUBMIT_BUTTON: 'flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors',
        CANCEL_BUTTON: 'flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors',
        LOADING_CONTAINER: 'flex items-center justify-center',
        LOADING_SPINNER: 'w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2'
    },

    // Salary validation patterns
    SALARY_PATTERNS: {
        VALID_FORMAT: /^[\$]?[\d,]+(\s*-\s*[\$]?[\d,]+)?$|^Competitive$|^Negotiable$/i
    }
};