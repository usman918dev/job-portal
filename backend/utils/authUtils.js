import jwt from 'jsonwebtoken';

/**
 * Generate JWT authentication token for a user
 * @param {Object} user - User object with _id, email, role, and name
 * @returns {string} - JWT token
 * @throws {Error} - If token generation fails
 */
export const generateAuthToken = (user) => {
  try {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
    return token;
  } catch (error) {
    throw new Error('Error generating authentication token');
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
export const verifyAuthToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};