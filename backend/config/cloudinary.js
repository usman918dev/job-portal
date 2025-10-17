import cloudinary from 'cloudinary';

/**
 * Initialize Cloudinary configuration
 * Supports both CLOUDINARY_URL and individual credentials
 */
export const initCloudinary = () => {
  try {
    if (process.env.CLOUDINARY_URL) {
      // Use CLOUDINARY_URL if provided (recommended)
      cloudinary.v2.config({ CLOUDINARY_URL: process.env.CLOUDINARY_URL });
      console.log('✅ Cloudinary configured with CLOUDINARY_URL');
    } else if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      // Use individual credentials as fallback
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      console.log('✅ Cloudinary configured with individual credentials');
    } else {
      console.warn('⚠️  Cloudinary not configured - file uploads may not work');
      console.warn('Please set CLOUDINARY_URL or individual credentials in .env');
    }

    return cloudinary.v2;
  } catch (error) {
    console.error('❌ Failed to initialize Cloudinary:', error.message);
    throw error;
  }
};

/**
 * Get Cloudinary instance
 * @returns {Object} Cloudinary v2 instance
 */
export const getCloudinary = () => {
  return cloudinary.v2;
};

export default {
  initCloudinary,
  getCloudinary,
};
