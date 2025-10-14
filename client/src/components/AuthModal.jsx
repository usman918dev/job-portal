import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X } from "lucide-react";
import { toast } from "react-toastify";
import { login, register } from "../services/authService";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import EmailVerificationPrompt from "./EmailVerificationPrompt";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthModal = ({ isOpen, onClose, onLogin, initialMode = "Sign Up", canClose = true }) => {
  const [state, setState] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState(null);

  // Only sync with initialMode when modal opens (not on every initialMode change)
  React.useEffect(() => {
    if (isOpen) {
      setState(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleEmailVerificationNeeded = (email) => {
    setVerificationEmail(email);
    setState("EmailVerification");
  };

  const handleForgotPassword = () => {
    setState("ForgotPassword");
  };

  const handleBackToLogin = () => {
    setState("Login");
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);

    try {
      if (state === "Login") {
        // Use the actual login service that stores to localStorage
        const result = await login(formData);
        console.log("Login result received:", result); // Debug log
        toast.success("Login successful!");
        
        // Handle different API response structures
        let userData = null;
        if (result.user) {
          // If API returns { user: {...} }
          userData = result.user;
        } else if (result.data && result.data.user) {
          // If API returns { data: { user: {...} } }
          userData = result.data.user;
        } else if (result.name || result.email) {
          // If API returns user data directly
          userData = result;
        } else {
          console.error("Unknown API response structure:", result);
          throw new Error("Invalid response structure from server");
        }
        
        console.log("Extracted user data:", userData); // Debug log
        
        // Call onLogin with the user data
        onLogin(userData);
        onClose();
      } else {
        // For Sign Up, call the register service
        const result = await register(formData);
        console.log("Sign up completed:", result); // Debug log
        
        // Check if email verification is required
        if (result.success && result.data?.user?.isEmailVerified === false) {
          // Show email verification prompt
          setVerificationEmail(formData.email);
          setState("EmailVerification");
          toast.success("Account created! Please check your email to verify your account.");
        } else {
          // Old flow for backward compatibility
          toast.success(`Account created successfully as ${formData.role === 'admin' ? 'Recruiter' : 'Job Seeker'}! Please sign in to continue.`);
          setState("Login"); // Switch to Sign In UI component
        }
      }
      
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newState) => {
    setState(newState);
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 350, damping: 25 } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95, 
      transition: { duration: 0.2 } 
    }
  };



  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside to close modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-4"
      initial="hidden"
      animate="visible"
      variants={overlayVariants}
      onClick={handleOverlayClick}
    >
      <motion.div 
        className="relative w-full max-w-md mx-4 max-h-[95vh] overflow-hidden"
        variants={modalVariants}
      >
        <div className="relative bg-white rounded-3xl shadow-2xl flex flex-col max-h-[95vh]">
          
          {/* Glass effect top area - reduced height */}
          <div className="relative h-24 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center flex-shrink-0">
            {/* Blurred circles for decoration */}
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-indigo-300 opacity-20 blur-xl"></div>
            
            {/* Floating avatar container - smaller */}
            <div className="absolute -bottom-8 flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg p-1">
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                <User size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            {/* Header text */}
            <div className="px-8 pt-12 pb-4">
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
                {state === "Login" ? "Welcome Back" : 
                 state === "ForgotPassword" ? "Reset Password" : 
                 "Join Our Platform"}
              </h1>
              <p className="text-sm text-center text-gray-500">
                {state === "Login" 
                  ? "Sign in to access your account" 
                  : state === "ForgotPassword"
                  ? "Enter your email to receive a reset link"
                  : "Create an account to get started"
                }
              </p>
            </div>

            {/* Form container with proper spacing */}
            <div className="px-8 pb-4">
              <AnimatePresence mode="wait">
                {state === "Sign Up" ? (
                  <SignUpForm 
                    key="signup"
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                  />
                ) : state === "EmailVerification" ? (
                  <EmailVerificationPrompt
                    key="email-verification"
                    email={verificationEmail}
                    onBack={() => setState("Login")}
                    onClose={onClose}
                  />
                ) : state === "ForgotPassword" ? (
                  <ForgotPasswordForm
                    key="forgot-password"
                    onBack={handleBackToLogin}
                  />
                ) : (
                  <SignInForm 
                    key="signin"
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    onEmailVerificationNeeded={handleEmailVerificationNeeded}
                    onForgotPassword={handleForgotPassword}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Fixed toggle section at bottom - hide during email verification and forgot password */}
          {state !== "EmailVerification" && state !== "ForgotPassword" && (
            <div className="bg-gray-50 border-t border-gray-100 rounded-b-3xl py-4 flex-shrink-0">
              <div className="flex justify-center px-8">
                <p className="text-sm text-gray-600">
                  {state === "Login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => switchMode(state === "Login" ? "Sign Up" : "Login")}
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {state === "Login" ? "Sign up now" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Close button - only show if canClose is true */}
          {canClose && (
            <motion.button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 transition-all duration-200 rounded-full hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 group"
              aria-label="Close modal"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;