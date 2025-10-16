import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

// Import extracted services, utils, and constants
import { verifyEmail as verifyEmailService, resendVerificationEmail } from "../services/authService";
import { decodeEmail, navigateToSigninAfterVerification, getBackendUrl } from "../utils/emailVerificationUtils";
import { VERIFICATION_STATUS, VERIFICATION_REDIRECT_DELAY } from "../constants/emailVerificationConstants";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState(VERIFICATION_STATUS.VERIFYING);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const backendUrl = getBackendUrl();

  useEffect(() => {
    if (token && email) {
      handleVerifyEmail();
    } else {
      setVerificationStatus(VERIFICATION_STATUS.ERROR);
      setMessage("Invalid verification link. Missing token or email.");
    }
  }, [token, email]);

  const handleVerifyEmail = async () => {
    try {
      setVerificationStatus(VERIFICATION_STATUS.VERIFYING);

      const response = await verifyEmailService(token, email);

      if (response.success) {
        setVerificationStatus(VERIFICATION_STATUS.SUCCESS);
        setMessage(response.message);
        toast.success("Email verified successfully! Welcome to Jobly!");

        // Redirect to login after specified delay
        navigateToSigninAfterVerification(navigate, email, VERIFICATION_REDIRECT_DELAY);
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setVerificationStatus(VERIFICATION_STATUS.ERROR);
      setMessage(error.message || "Email verification failed");
      toast.error(error.message || "Email verification failed");
    }
  };

  const resendVerification = async () => {
    if (!email) {
      toast.error("Email address not found");
      return;
    }

    try {
      setIsResending(true);

      const response = await resendVerificationEmail(email);

      if (response.success) {
        toast.success("Verification email sent! Please check your inbox.");
        setMessage(
          "New verification email sent! Please check your inbox and spam folder."
        );
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error(error.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
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
          <h1 className="text-2xl font-bold text-white mb-2">
            Email Verification
          </h1>
          <p className="text-blue-100">Verifying your email address...</p>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {verificationStatus === VERIFICATION_STATUS.VERIFYING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Verifying...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </motion.div>
          )}

          {verificationStatus === VERIFICATION_STATUS.SUCCESS && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Verification Successful!
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                <motion.button
                  onClick={() => navigate("/signin")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Continue to Sign In
                </motion.button>

                <p className="text-sm text-gray-500">
                  Redirecting automatically in {VERIFICATION_REDIRECT_DELAY / 1000} seconds...
                </p>
              </div>
            </motion.div>
          )}

          {verificationStatus === VERIFICATION_STATUS.ERROR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                {email && (
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
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
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
                )}

                <motion.button
                  onClick={() => navigate("/")}
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

export default EmailVerification;
