// Middleware to protect admin routes
import { verifyAuthToken } from '../utils/authUtils.js';

const protectAdminRoutes = async (req, res, next) => {
  try {
    // Check for JWT token in Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication token required.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyAuthToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }

    // Check if user has admin or recruiter role
    const userRole = decoded.role;
    if (userRole !== 'admin' && userRole !== 'Admin' && userRole !== 'Recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or Recruiter privileges required.'
      });
    }

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication failed.'
    });
  }
};

export default protectAdminRoutes;