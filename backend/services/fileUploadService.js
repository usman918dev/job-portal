import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
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

/**
 * Check if file upload is configured
 */
export const checkUploadStatus = () => {
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

  return {
    success: true,
    uploadEnabled: hasValidConfig,
    message: hasValidConfig ? 'File upload is available' : 'File upload service not configured - please set up Cloudinary credentials'
  };
};

/**
 * Upload resume to Cloudinary
 */
export const uploadResumeToCloudinary = async (fileBuffer) => {
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
    throw new Error('File upload service is not configured. Please contact administrator.');
  }

  if (!fileBuffer) {
    throw new Error('No file provided');
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

    stream.end(fileBuffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    size: result.bytes
  };
};