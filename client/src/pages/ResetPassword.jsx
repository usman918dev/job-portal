import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, CheckCircle, XCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { verifyResetToken, resetPassword } from '../services/authService';

// Import extracted utils and constants
import {
  validatePasswordResetForm,
  handlePasswordResetInputChange,
  navigateToSigninAfterReset,
  getPasswordRequirementsText,
  validateResetTokenParams
} from '../utils/resetPasswordUtils';
import {
  RESET_STATUS,
  RESET_REDIRECT_DELAY,
  ANIMATION_VARIANTS,
  VALIDATION_MESSAGES
} from '../constants/resetPasswordConstants';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(RESET_STATUS.VERIFYING); // 'verifying', 'valid', 'invalid', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const tokenValidation = validateResetTokenParams(searchParams);

    if (!tokenValidation.isValid) {
      setStatus(RESET_STATUS.INVALID);
      setMessage(tokenValidation.error);
      return;
    }

    verifyToken(tokenValidation.token);
  }, []);

  const verifyToken = async (token) => {
    try {
      setStatus(RESET_STATUS.VERIFYING);

      const response = await verifyResetToken(token);

      if (response.success) {
        setStatus(RESET_STATUS.VALID);
        setUserEmail(response.data?.email || email || '');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setStatus(RESET_STATUS.INVALID);
      setMessage(error.message || VALIDATION_MESSAGES.INVALID_TOKEN);
      toast.error(error.message || VALIDATION_MESSAGES.INVALID_TOKEN);
    }
  };

  const handleInputChange = (e) => {
    const updatedFormData = handlePasswordResetInputChange(e, formData);
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validation = validatePasswordResetForm(formData.newPassword, formData.confirmPassword);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    try {
      setIsLoading(true);
      const response = await resetPassword(token, formData.newPassword);

      if (response.success) {
        setStatus(RESET_STATUS.SUCCESS);
        setMessage(response.message);
        toast.success('Password reset successfully!');

        // Redirect to sign in after specified delay
        navigateToSigninAfterReset(navigate, userEmail, RESET_REDIRECT_DELAY);
      }
    } catch (error) {
      toast.error(error.message || VALIDATION_MESSAGES.RESET_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <motion.div
            variants={ANIMATION_VARIANTS.headerIcon}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
          >
            <Key className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-blue-100">Create a new password for your account</p>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {status === RESET_STATUS.VERIFYING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <motion.div
                  variants={ANIMATION_VARIANTS.loadingSpinner}
                  animate="animate"
                  className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying...</h2>
              <p className="text-gray-600">Please wait while we verify your reset token.</p>
            </motion.div>
          )}

          {status === RESET_STATUS.VALID && (
            <motion.div
              variants={ANIMATION_VARIANTS.content}
              initial="hidden"
              animate="visible"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Create New Password</h2>
                {userEmail && (
                  <p className="text-sm text-gray-600">For account: {userEmail}</p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p>{getPasswordRequirementsText()}</p>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        variants={ANIMATION_VARIANTS.buttonSpinner}
                        animate="animate"
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {status === RESET_STATUS.SUCCESS && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Password Reset Successful!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              
              <div className="space-y-3">
                <motion.button
                  onClick={() => navigate('/signin')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Continue to Sign In
                </motion.button>
                
                <p className="text-sm text-gray-500">
                  Redirecting automatically in {RESET_REDIRECT_DELAY / 1000} seconds...
                </p>
              </div>
            </motion.div>
          )}

          {status === RESET_STATUS.SUCCESS && (
            <motion.div
              variants={ANIMATION_VARIANTS.content}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Password Reset Successful!</h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                <motion.button
                  onClick={() => navigate('/signin')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Continue to Sign In
                </motion.button>

                <p className="text-sm text-gray-500">
                  Redirecting automatically in {RESET_REDIRECT_DELAY / 1000} seconds...
                </p>
              </div>
            </motion.div>
          )}

          {status === RESET_STATUS.INVALID && (
            <motion.div
              variants={ANIMATION_VARIANTS.content}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                <motion.button
                  onClick={() => navigate('/signin')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Request New Reset Link
                </motion.button>

                <motion.button
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;