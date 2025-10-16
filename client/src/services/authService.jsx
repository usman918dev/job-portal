import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/auth`;

export const register = async (userData) => {
  try {
    console.log("Registering user with data:", userData); // Debug log
    
    const requestData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "user"
    };

    // Add company name for admin/recruiter roles
    if (userData.companyName && (userData.role === 'admin' || userData.role === 'Admin' || userData.role === 'Recruiter')) {
      requestData.companyName = userData.companyName;
    }

    const response = await axios.post(`${API_URL}/signup`, requestData);
    
    console.log("Registration API response:", response.data); // Debug log
    
    // Store token if provided
    if (response.data.data?.token || response.data.token) {
      const token = response.data.data?.token || response.data.token;
      localStorage.setItem('authToken', token);
      // Set default axios header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    return response.data;
    
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Something went wrong during registration' };
  }
};

export const login = async (credentials) => {
  try {
    console.log("Attempting login with:", { email: credentials.email, role: credentials.role }); // Debug log
    
    const response = await axios.post(`${API_URL}/signin`, {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role
    });
    
    console.log("Login API response:", response.data); // Debug log
    
    // Handle different response structures and normalize the data
    let normalizedResponse = {
      success: true,
      token: null,
      user: null
    };
    
    if (response.data) {
      // Extract token
      normalizedResponse.token = response.data.data?.token || response.data.token || response.data.accessToken || 'temp-token-' + Date.now();
      
      // Store token in localStorage and set axios default header
      if (normalizedResponse.token && !normalizedResponse.token.startsWith('temp-token-')) {
        localStorage.setItem('authToken', normalizedResponse.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${normalizedResponse.token}`;
      }
      
      // Extract user data - handle different structures
      if (response.data.user) {
        normalizedResponse.user = response.data.user;
      } else if (response.data.data && response.data.data.user) {
        normalizedResponse.user = response.data.data.user;
      } else if (response.data.name || response.data.email) {
        // User data is directly in response.data
        normalizedResponse.user = {
          id: response.data.id || response.data._id || Date.now(),
          name: response.data.name,
          email: response.data.email,
          role: response.data.role || credentials.role || 'user',
          companyName: response.data.companyName
        };
      } else {
        // Fallback - create user from credentials if no user data in response
        normalizedResponse.user = {
          id: Date.now(),
          name: response.data.username || credentials.email?.split('@')[0] || 'User',
          email: credentials.email,
          role: credentials.role || 'user'
        };
      }
      
      // Ensure user has required fields
      normalizedResponse.user = {
        ...normalizedResponse.user,
        _id: normalizedResponse.user._id || normalizedResponse.user.id,
        id: normalizedResponse.user.id || normalizedResponse.user._id,
        name: normalizedResponse.user.name || normalizedResponse.user.username || credentials.email?.split('@')[0] || 'User',
        email: normalizedResponse.user.email || credentials.email,
        role: normalizedResponse.user.role || credentials.role || 'user',
        companyName: normalizedResponse.user.companyName
      };
      
      console.log("Final normalized user object:", normalizedResponse.user); // Debug log
    }
    
    console.log("Normalized response:", normalizedResponse); // Debug log
    console.log("Storing user data:", normalizedResponse); // Debug log
    localStorage.setItem('user', JSON.stringify(normalizedResponse));
    
    return normalizedResponse;
    
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Login failed. Please check your credentials.' };
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  // Clear axios default header
  delete axios.defaults.headers.common['Authorization'];
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user');
    const parsed = userData ? JSON.parse(userData) : null;
    console.log("getCurrentUser returning:", parsed); // Debug log
    return parsed;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem('user'); // Clear corrupted data
    return null;
  }
};

// Helper function to get all registered users (for debugging)
export const getAllRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  } catch (error) {
    console.error("Error parsing registered users:", error);
    return [];
  }
};

// Helper function to check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.user && user.user.role === 'admin';
};

// Password reset functions
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, {
      email
    });
    
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Failed to send password reset email' };
  }
};

export const verifyResetToken = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/verify-reset-token`, {
      token
    });
    
    return response.data;
  } catch (error) {
    console.error("Verify reset token error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Invalid or expired reset token' };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      token,
      newPassword
    });
    
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Failed to reset password' };
  }
};

/**
 * Verify user email with token
 * @param {string} token - Email verification token
 * @param {string} email - User email address
 * @returns {Promise<Object>} - Verification response
 */
export const verifyEmail = async (token, email) => {
  try {
    const response = await axios.post(`${API_URL}/verify-email`, {
      token,
      email: decodeURIComponent(email),
    });

    return response.data;
  } catch (error) {
    console.error("Email verification error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Email verification failed' };
  }
};

/**
 * Resend email verification
 * @param {string} email - User email address
 * @returns {Promise<Object>} - Resend response
 */
export const resendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/resend-verification`, {
      email: decodeURIComponent(email),
    });

    return response.data;
  } catch (error) {
    console.error("Resend verification error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Failed to resend verification email' };
  }
};
