import { getRedisClient, isRedisAvailable } from '../config/redis.js';

/**
 * Default cache TTL (Time To Live) in seconds
 */
const DEFAULT_TTL = 300; // 5 minutes
const JOBS_LIST_TTL = 180; // 3 minutes for job listings
const JOB_DETAIL_TTL = 600; // 10 minutes for individual job details

/**
 * Generate cache key for jobs list
 * @param {Object} params - Query parameters
 * @returns {string} Cache key
 */
export const getJobsListCacheKey = (params) => {
  const { page = 1, limit = 10, search = '' } = params;
  return `jobs:list:page:${page}:limit:${limit}:search:${search}`;
};

/**
 * Generate cache key for single job
 * @param {string} jobId - Job ID
 * @returns {string} Cache key
 */
export const getJobCacheKey = (jobId) => {
  return `job:${jobId}`;
};

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached data or null
 */
export const getCache = async (key) => {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const redis = getRedisClient();
    const data = await redis.get(key);
    
    if (data) {
      return JSON.parse(data);
    }
    
    return null;
  } catch (error) {
    console.error('Cache GET error:', error.message);
    return null;
  }
};

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {Promise<boolean>} Success status
 */
export const setCache = async (key, data, ttl = DEFAULT_TTL) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    await redis.setex(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Cache SET error:', error.message);
    return false;
  }
};

/**
 * Delete data from cache
 * @param {string} key - Cache key or pattern
 * @returns {Promise<boolean>} Success status
 */
export const deleteCache = async (key) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache DELETE error:', error.message);
    return false;
  }
};

/**
 * Delete multiple cache keys matching a pattern
 * @param {string} pattern - Pattern to match (e.g., 'jobs:*')
 * @returns {Promise<boolean>} Success status
 */
export const deleteCachePattern = async (pattern) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    
    return true;
  } catch (error) {
    console.error('Cache DELETE PATTERN error:', error.message);
    return false;
  }
};

/**
 * Invalidate all job-related caches
 * @returns {Promise<boolean>} Success status
 */
export const invalidateJobsCache = async () => {
  return await deleteCachePattern('jobs:*');
};

/**
 * Cache middleware for Express routes
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} Express middleware
 */
export const cacheMiddleware = (ttl = DEFAULT_TTL) => {
  return async (req, res, next) => {
    if (!isRedisAvailable()) {
      return next();
    }

    try {
      // Generate cache key from request
      const cacheKey = `${req.method}:${req.originalUrl}`;
      
      // Try to get cached response
      const cachedData = await getCache(cacheKey);
      
      if (cachedData) {
        console.log(`✅ Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }
      
      console.log(`⚠️  Cache MISS: ${cacheKey}`);
      
      // Store original res.json
      const originalJson = res.json.bind(res);
      
      // Override res.json to cache the response
      res.json = (data) => {
        // Cache the response
        setCache(cacheKey, data, ttl);
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      next();
    }
  };
};

export default {
  getJobsListCacheKey,
  getJobCacheKey,
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  invalidateJobsCache,
  cacheMiddleware,
  JOBS_LIST_TTL,
  JOB_DETAIL_TTL,
};
