import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { forgotPassword } from '../services/authService';
import { FORGOT_PASSWORD_CONSTANTS } from '../constants/forgotPasswordConstants.js';
import {
  handleForgotPasswordSubmit,
  resetFormForRetry,
  getSuccessMessage,
  getAnimationVariant,
  getCssClasses
} from '../utils/forgotPasswordUtils.js';

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  if (emailSent) {
    return (
      <motion.div
        {...getAnimationVariant('successContainer')}
        className="text-center space-y-6"
      >
        <div className={`inline-flex items-center justify-center ${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.SIZES.iconContainer} ${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.COLORS.success} rounded-full mb-4`}>
          <CheckCircle className={`${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.ICON_SIZE.main} ${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.COLORS.successIcon}`} />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{FORGOT_PASSWORD_CONSTANTS.MESSAGES.SUCCESS_TITLE}</h3>
          <p className="text-gray-600 mb-4">
            {getSuccessMessage(email)}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {FORGOT_PASSWORD_CONSTANTS.MESSAGES.SUCCESS_EXPIRY}
          </p>
        </div>

        <div className="space-y-3">
          <motion.button
            onClick={() => resetFormForRetry(setEmailSent, setEmail)}
            whileHover={getAnimationVariant('buttonHover')}
            whileTap={getAnimationVariant('buttonTap')}
            className={`w-full bg-gradient-to-r ${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.COLORS.primary} text-white font-semibold ${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.SIZES.button} rounded-lg hover:${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.COLORS.primaryHover} transition-all duration-200 shadow-md hover:shadow-lg`}
          >
            {FORGOT_PASSWORD_CONSTANTS.MESSAGES.SEND_ANOTHER}
          </motion.button>

          <motion.button
            onClick={onBack}
            whileHover={getAnimationVariant('buttonHover')}
            whileTap={getAnimationVariant('buttonTap')}
            className={`${FORGOT_PASSWORD_CONSTANTS.CLASSES.buttonSecondary}`}
          >
            <ArrowLeft className={FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.ICON_SIZE.small} />
            {FORGOT_PASSWORD_CONSTANTS.FORM_CONFIG.BACK_BUTTON_TEXT}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...getAnimationVariant('container')}
    >
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center ${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.SIZES.iconContainer} bg-blue-100 rounded-full mb-4`}>
          <Mail className={`${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.ICON_SIZE.main} ${FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.COLORS.primaryIcon}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Forgot Password?</h3>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={(e) => handleForgotPasswordSubmit(e, email, setIsLoading, setEmailSent)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {FORGOT_PASSWORD_CONSTANTS.FORM_CONFIG.EMAIL_LABEL}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={FORGOT_PASSWORD_CONSTANTS.FORM_CONFIG.EMAIL_PLACEHOLDER}
            className={getCssClasses('input', { disabled: isLoading })}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-3">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={isLoading ? getAnimationVariant('loadingButtonHover') : getAnimationVariant('buttonHover')}
            whileTap={isLoading ? getAnimationVariant('loadingButtonTap') : getAnimationVariant('buttonTap')}
            className={FORGOT_PASSWORD_CONSTANTS.CLASSES.buttonPrimary}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className={FORGOT_PASSWORD_CONSTANTS.CLASSES.spinner}
                />
                {FORGOT_PASSWORD_CONSTANTS.FORM_CONFIG.LOADING_TEXT}
              </>
            ) : (
              FORGOT_PASSWORD_CONSTANTS.FORM_CONFIG.SUBMIT_BUTTON_TEXT
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={onBack}
            whileHover={getAnimationVariant('buttonHover')}
            whileTap={getAnimationVariant('buttonTap')}
            className={FORGOT_PASSWORD_CONSTANTS.CLASSES.buttonSecondary}
          >
            <ArrowLeft className={FORGOT_PASSWORD_CONSTANTS.UI_CONFIG.ICON_SIZE.small} />
            {FORGOT_PASSWORD_CONSTANTS.FORM_CONFIG.BACK_BUTTON_TEXT}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordForm;