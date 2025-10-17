import Redis from 'ioredis';

let redisClient = null;

/**
 * Initialize Redis connection
 * @returns {Redis|null} Redis client instance or null if connection fails
 */
export const initRedis = () => {
  try {
    // Only initialize if REDIS_URL is provided
    if (!process.env.REDIS_URL) {
      console.log('⚠️  Redis URL not configured - caching disabled');
      return null;
    }

    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis is ready to use');
    });

    return redisClient;
  } catch (error) {
    console.error('❌ Failed to initialize Redis:', error.message);
    return null;
  }
};

/**
 * Get Redis client instance
 * @returns {Redis|null} Redis client or null if not initialized
 */
export const getRedisClient = () => {
  return redisClient;
};

/**
 * Close Redis connection
 */
export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('✅ Redis connection closed');
  }
};

/**
 * Check if Redis is available
 * @returns {boolean} True if Redis is connected and ready
 */
export const isRedisAvailable = () => {
  return redisClient && redisClient.status === 'ready';
};

export default {
  initRedis,
  getRedisClient,
  closeRedis,
  isRedisAvailable,
};
