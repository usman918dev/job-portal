import AuditLog from '../models/AuditLog.js';

/**
 * Audit Middleware - Automatically logs admin actions
 * 
 * This middleware should be placed AFTER authentication middleware
 * It will only log actions if the user is an admin
 */
const auditMiddleware = async (req, res, next) => {
  // DEBUG: Log every request
  const fullPath = req.originalUrl || req.url || req.path;
  console.log('🔵 Middleware hit:', req.method, fullPath, 'User:', req.user ? req.user.email : 'NO USER');
  
  // Skip if user is not authenticated or not an admin
  if (!req.user) {
    // User not authenticated yet, skip audit logging
    console.log('⚠️  Skipping audit: No user');
    return next();
  }
  
  if (!isAdminRole(req.user.role)) {
    // User is not an admin, skip audit logging
    console.log('⚠️  Skipping audit: Not admin role:', req.user.role);
    return next();
  }

  // Debug: Log that we're tracking this request
  console.log(`🔍 Audit tracking: ${req.method} ${fullPath} by ${req.user.email || req.user.name}`);

  // Store the original res.json and res.send methods
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  // Variable to store response status code and track if logged
  let statusCode = 200;
  let errorMessage = null;
  let hasLogged = false;

  // Function to log the audit entry
  const logAuditEntry = async () => {
    // Prevent multiple calls
    if (hasLogged) {
      return;
    }
    hasLogged = true;

    try {
      // Use originalUrl to get the full path including /api/...
      const fullPath = req.originalUrl || req.url || req.path;
      
      // Determine action based on method and endpoint
      const action = determineAction(req.method, fullPath);
      
      // Skip if no meaningful action (e.g., GET requests to list data)
      if (!action) {
        console.log('⚠️  No action determined for:', req.method, fullPath);
        return;
      }

      // Get client IP address
      const ip = req.ip || 
                 req.headers['x-forwarded-for']?.split(',')[0] || 
                 req.connection?.remoteAddress || 
                 req.socket?.remoteAddress ||
                 'Unknown';

      // Sanitize request body (remove sensitive data like passwords)
      const sanitizedBody = sanitizeRequestBody(req.body);

      // Create audit log entry asynchronously (don't wait)
      setImmediate(async () => {
        try {
          await AuditLog.create({
            admin: req.user._id,
            action,
            method: req.method,
            endpoint: req.originalUrl || req.path,
            ip,
            userAgent: req.headers['user-agent'] || 'Unknown',
            requestBody: sanitizedBody,
            statusCode,
            errorMessage
          });
          console.log(`✅ Audit log created: ${action} by ${req.user.email || req.user.name}`);
        } catch (error) {
          console.error('❌ Audit logging error:', error.message);
        }
      });
    } catch (error) {
      // Log error but don't break the request flow
      console.error('❌ Audit logging error:', error.message);
    }
  };

  // Override res.json to capture status code
  res.json = function (body) {
    statusCode = res.statusCode;
    if (statusCode >= 400) {
      errorMessage = body?.message || body?.error || 'Error occurred';
    }
    logAuditEntry();
    return originalJson(body);
  };

  // Override res.send to capture status code
  res.send = function (body) {
    statusCode = res.statusCode;
    if (statusCode >= 400) {
      errorMessage = typeof body === 'string' ? body : body?.message || 'Error occurred';
    }
    logAuditEntry();
    return originalSend(body);
  };

  next();
};

/**
 * Check if the role is an admin role
 */
function isAdminRole(role) {
  const adminRoles = ['admin', 'Admin', 'Recruiter'];
  return adminRoles.includes(role);
}

/**
 * Determine the action based on HTTP method and endpoint
 */
function determineAction(method, path) {
  // Normalize path
  const normalizedPath = path.toLowerCase();

  // Job-related actions
  if (normalizedPath.includes('/jobs')) {
    if (method === 'POST' && !normalizedPath.includes('/seed')) {
      return 'Create Job';
    }
    if (method === 'PUT' || method === 'PATCH') {
      return 'Update Job';
    }
    if (method === 'DELETE') {
      return 'Delete Job';
    }
  }

  // Seed jobs
  if (normalizedPath.includes('/seed/jobs')) {
    if (method === 'POST') {
      return 'Seed Jobs';
    }
    if (method === 'DELETE') {
      return 'Clear Seeded Jobs';
    }
  }

  // Application-related actions
  if (normalizedPath.includes('/application')) {
    if (normalizedPath.includes('/accept')) {
      return 'Accept Application';
    }
    if (normalizedPath.includes('/reject')) {
      return 'Reject Application';
    }
    if (method === 'PUT' || method === 'PATCH') {
      return 'Update Application';
    }
    if (method === 'DELETE') {
      return 'Delete Application';
    }
  }

  // User management actions
  if (normalizedPath.includes('/user')) {
    if (method === 'POST') {
      return 'Create User';
    }
    if (method === 'PUT' || method === 'PATCH') {
      if (normalizedPath.includes('/suspend')) {
        return 'Suspend User';
      }
      if (normalizedPath.includes('/activate')) {
        return 'Activate User';
      }
      return 'Update User';
    }
    if (method === 'DELETE') {
      return 'Delete User';
    }
  }

  // Return null for GET requests and other non-action routes
  return null;
}

/**
 * Sanitize request body to remove sensitive information
 */
function sanitizeRequestBody(body) {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'api_key'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
}

export default auditMiddleware;
