import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { 
    submitApplication, 
    getAllApplications, 
    getUserApplications,
    acceptApplication,
    rejectApplication,
    getJobApplications
} from '../controllers/jobApplicationController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import auditMiddleware from '../middleware/auditMiddleware.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only PDF and common document formats
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
    }
  }
});

// Public routes
// Check if file upload is configured
router.get('/upload-status', (req, res) => {
  // Check if we have all required individual credentials
  const hasValidConfig = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  console.log('Cloudinary Config Status:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
    api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
  });
  
  res.json({
    success: true,
    uploadEnabled: hasValidConfig,
    message: hasValidConfig ? 'File upload is available' : 'File upload service not configured - please set up Cloudinary credentials'
  });
});

// Upload resume to Cloudinary
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    // Check if Cloudinary is properly configured
    const hasValidConfig = (
      (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL !== 'cloudinary://your-api-key:your-api-secret@your-cloud-name') ||
      (process.env.CLOUDINARY_CLOUD_NAME && 
       process.env.CLOUDINARY_CLOUD_NAME !== 'your-actual-cloud-name' && 
       process.env.CLOUDINARY_API_KEY && 
       process.env.CLOUDINARY_API_KEY !== 'your-actual-api-key' &&
       process.env.CLOUDINARY_API_SECRET && 
       process.env.CLOUDINARY_API_SECRET !== 'your-actual-api-secret')
    );

    if (!hasValidConfig) {
      return res.status(500).json({
        success: false,
        message: 'File upload service is not configured. Please contact administrator.'
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Configure Cloudinary with individual credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    console.log('Cloudinary Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + '...' // Log partial secret for debugging
    });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'job-portal-resumes',
          resource_type: 'auto',
          public_id: `resume_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      stream.end(req.file.buffer);
    });

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload resume';
    if (error.message && error.message.includes('cloudinary')) {
      errorMessage = 'File upload service configuration error. Please contact administrator.';
    } else if (error.http_code === 401) {
      errorMessage = 'File upload service authentication failed. Please contact administrator.';
    } else if (error.http_code === 400) {
      errorMessage = 'Invalid file format or corrupted file.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});

// Submit application
router.post('/submit', submitApplication);

// Get user-specific applications
router.get('/user/:userId', getUserApplications);

// Protected admin routes
// Get all applications for admin's jobs
router.get('/', verifyToken, isAdmin, getAllApplications);

// Get applications for a specific job
router.get('/job/:jobId', verifyToken, isAdmin, getJobApplications);

// Accept application
router.put('/accept/:id', verifyToken, isAdmin, auditMiddleware, acceptApplication);

// Reject and delete application
router.delete('/reject/:id', verifyToken, isAdmin, auditMiddleware, rejectApplication);

export default router;