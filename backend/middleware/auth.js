import { verifyUserToken } from '../services/authService.js';

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    // Verify token and get user using service
    const user = await verifyUserToken(token);

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Authorization denied.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    // Handle custom errors from service
    if (error.message.includes('not found') || error.message.includes('suspended')) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  // Check if user role is admin, Admin, or Recruiter
  const adminRoles = ['admin', 'Admin', 'Recruiter'];
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

// Middleware to check if user is regular user
export const isUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  const userRoles = ['user', 'Job Seeker'];
  if (!userRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This route is for job seekers only.'
    });
  }

  next();
};
