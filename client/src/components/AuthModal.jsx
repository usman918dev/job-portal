import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X } from "lucide-react";
import { toast } from "react-toastify";
import { login, register } from "../services/authService";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import EmailVerificationPrompt from "./EmailVerificationPrompt";
import ForgotPasswordForm from "./ForgotPasswordForm";
import {
  MODAL_STATES,
  ANIMATION_VARIANTS,
  MODAL_CONFIG,
  AUTH_MESSAGES
} from "../constants/authModalConstants";
import {
  handleLoginSubmission,
  handleSignUpSubmission,
  getModalHeaderContent,
  shouldShowToggleSection,
  getToggleSectionText,
  handleModalEscape,
  handleModalOverlayClick
} from "../utils/authModalUtils";

const AuthModal = ({ isOpen, onClose, onLogin, initialMode = MODAL_CONFIG.DEFAULT_INITIAL_MODE, canClose = MODAL_CONFIG.CAN_CLOSE_DEFAULT }) => {
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
      if (state === MODAL_STATES.LOGIN) {
        await handleLoginSubmission(formData, login, onLogin, onClose);
        toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      } else {
        const message = await handleSignUpSubmission(formData, register, setVerificationEmail, setState);
        if (message) {
          toast.success(message);
        }
      }

    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.message || AUTH_MESSAGES.ERROR_GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newState) => {
    setState(newState);
  };

  // Animation variants
  const overlayVariants = ANIMATION_VARIANTS.overlay;
  const modalVariants = ANIMATION_VARIANTS.modal;



  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEscape = (e) => handleModalEscape(e, isOpen, onClose);

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside to close modal
  const handleOverlayClick = (e) => {
    handleModalOverlayClick(e, onClose);
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
        className={`relative w-full max-w-md mx-4 ${MODAL_CONFIG.MAX_HEIGHT} overflow-hidden`}
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
                {getModalHeaderContent(state).title}
              </h1>
              <p className="text-sm text-center text-gray-500">
                {getModalHeaderContent(state).subtitle}
              </p>
            </div>

            {/* Form container with proper spacing */}
            <div className="px-8 pb-4">
              <AnimatePresence mode="wait">
                {state === MODAL_STATES.SIGN_UP ? (
                  <SignUpForm 
                    key="signup"
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                  />
                ) : state === MODAL_STATES.EMAIL_VERIFICATION ? (
                  <EmailVerificationPrompt
                    key="email-verification"
                    email={verificationEmail}
                    onBack={() => setState(MODAL_STATES.LOGIN)}
                    onClose={onClose}
                  />
                ) : state === MODAL_STATES.FORGOT_PASSWORD ? (
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
          {shouldShowToggleSection(state) && (
            <div className="bg-gray-50 border-t border-gray-100 rounded-b-3xl py-4 flex-shrink-0">
              <div className="flex justify-center px-8">
                <p className="text-sm text-gray-600">
                  {getToggleSectionText(state).text}
                  <button
                    type="button"
                    onClick={() => switchMode(state === MODAL_STATES.LOGIN ? MODAL_STATES.SIGN_UP : MODAL_STATES.LOGIN)}
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {getToggleSectionText(state).linkText}
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
              whileHover={ANIMATION_VARIANTS.closeButton.hover}
              whileTap={ANIMATION_VARIANTS.closeButton.tap}
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