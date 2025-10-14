import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const EmailVerificationPrompt = ({ email, onBack, onClose }) => {
  const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const resendVerification = async () => {
    try {
      setIsResending(true);
      
      const response = await axios.post(`${backendUrl}/api/auth/resend-verification`, {
        email
      });

      if (response.data.success) {
        setEmailSent(true);
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full mx-4"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
        >
          <Mail className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
        <p className="text-blue-100">We've sent you a verification link</p>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Created Successfully!</h3>
          <p className="text-gray-600 mb-4">
            We've sent a verification email to:
          </p>
          <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
            <p className="font-semibold text-gray-800">{email}</p>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p>Please check your inbox and click the verification link to activate your account.</p>
            <p className="text-xs">
              <span className="font-medium">Don't see it?</span> Check your spam/junk folder.
            </p>
          </div>
        </div>

        {emailSent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">New verification email sent!</span>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          <motion.button
            onClick={resendVerification}
            disabled={isResending}
            whileHover={{ scale: isResending ? 1 : 1.02 }}
            whileTap={{ scale: isResending ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isResending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend Verification Email
              </>
            )}
          </motion.button>

          <motion.button
            onClick={onBack || onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </motion.button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Already verified? 
            <button 
              onClick={onBack || onClose}
              className="text-blue-600 hover:text-blue-700 font-medium ml-1"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailVerificationPrompt;