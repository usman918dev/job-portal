import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { handleResendVerification, getBackCallback, shouldShowSuccessMessage, getResendButtonText, shouldDisableResendButton } from '../utils/emailVerificationPromptUtils';
import {
  ANIMATION_VARIANTS,
  MESSAGES,
  STYLING
} from '../constants/emailVerificationPromptConstants';

const EmailVerificationPrompt = ({ email, onBack, onClose }) => {
  const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const resendVerification = async () => {
    await handleResendVerification(email, setIsResending, setEmailSent);
  };

  return (
    <motion.div
      initial={ANIMATION_VARIANTS.container.initial}
      animate={ANIMATION_VARIANTS.container.animate}
      exit={ANIMATION_VARIANTS.container.exit}
      transition={ANIMATION_VARIANTS.container.transition}
      className={STYLING.container}
    >
      {/* Header */}
      <div className={STYLING.header}>
        <motion.div
          initial={ANIMATION_VARIANTS.icon.initial}
          animate={ANIMATION_VARIANTS.icon.animate}
          transition={ANIMATION_VARIANTS.icon.transition}
          className={STYLING.iconContainer}
        >
          <Mail className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">{MESSAGES.TITLE}</h2>
        <p className="text-blue-100">{MESSAGES.SUBTITLE}</p>
      </div>

      {/* Content */}
      <div className={STYLING.content}>
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{MESSAGES.SUCCESS_TITLE}</h3>
          <p className="text-gray-600 mb-4">
            {MESSAGES.EMAIL_SENT_TO}
          </p>
          <div className={STYLING.emailBox}>
            <p className="font-semibold text-gray-800">{email}</p>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p>{MESSAGES.CHECK_INBOX}</p>
            <p className="text-xs">
              <span className="font-medium">{MESSAGES.CHECK_SPAM}</span>
            </p>
          </div>
        </div>

        {shouldShowSuccessMessage(emailSent) && (
          <motion.div
            initial={ANIMATION_VARIANTS.successMessage.initial}
            animate={ANIMATION_VARIANTS.successMessage.animate}
            className={STYLING.successBox}
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
            disabled={shouldDisableResendButton(isResending)}
            whileHover={ANIMATION_VARIANTS.button.hover}
            whileTap={ANIMATION_VARIANTS.button.tap}
            className={STYLING.buttonPrimary}
          >
            {isResending ? (
              <>
                <motion.div
                  animate={ANIMATION_VARIANTS.spinner.animate}
                  transition={ANIMATION_VARIANTS.spinner.transition}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                {MESSAGES.SENDING}
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                {MESSAGES.RESEND_BUTTON}
              </>
            )}
          </motion.button>

          <motion.button
            onClick={getBackCallback(onBack, onClose)}
            whileHover={ANIMATION_VARIANTS.button.hover}
            whileTap={ANIMATION_VARIANTS.button.tap}
            className={STYLING.buttonSecondary}
          >
            <ArrowLeft className="w-4 h-4" />
            {MESSAGES.BACK_BUTTON}
          </motion.button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {MESSAGES.ALREADY_VERIFIED}
            <button 
              onClick={getBackCallback(onBack, onClose)}
              className={STYLING.link}
            >
              {MESSAGES.SIGN_IN_HERE}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailVerificationPrompt;