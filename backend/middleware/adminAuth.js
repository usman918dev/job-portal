// Simple admin middleware to check if user is admin
const isAdmin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Check against hardcoded admin credentials from .env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (email === adminEmail && password === adminPassword) {
    req.isAdmin = true;
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin credentials required.'
    });
  }
};

export default isAdmin;