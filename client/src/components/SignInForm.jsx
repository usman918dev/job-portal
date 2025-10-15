import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, UserCheck, Shield } from "lucide-react";
import {
  DEFAULT_FORM_STATE,
  ANIMATION_VARIANTS,
  USER_ROLES,
} from "../constants/signInConstants";
import {
  validateSignInForm,
  handleSignInInputChange,
} from "../utils/signInUtils";

const SignInForm = ({
  onSubmit,
  isLoading,
  onEmailVerificationNeeded,
  onForgotPassword,
}) => {
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailVerificationError, setEmailVerificationError] = useState(null);

  const handleInputChange = (field, value) => {
    const { formData: updatedFormData, errors: updatedErrors } =
      handleSignInInputChange(field, value, formData, errors);

    setFormData(updatedFormData);
    setErrors(updatedErrors);

    // Debug log for role changes
    if (field === "role") {
      console.log("Sign in role changed to:", value);
    }

    // Clear email verification error when user changes email
    if (field === "email" && emailVerificationError) {
      setEmailVerificationError(null);
    }
  };

  const validateForm = () => {
    const validation = validateSignInForm(formData.email, formData.password);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setEmailVerificationError(null);
        // Ensure role is included in the submission data
        const submissionData = {
          ...formData,
          role: formData.role || USER_ROLES.USER, // Default to user if somehow role is empty
        };
        console.log("Submitting sign in data:", submissionData); // Debug log
        await onSubmit(submissionData);
      } catch (error) {
        // Handle email verification error
        if (error.emailVerificationRequired) {
          setEmailVerificationError({
            message: error.message,
            email: error.email,
          });
          if (onEmailVerificationNeeded) {
            onEmailVerificationNeeded(error.email);
          }
        }
        throw error; // Re-throw to let parent handle other errors
      }
    }
  };

  return (
    <motion.form
      initial={ANIMATION_VARIANTS.form.initial}
      animate={ANIMATION_VARIANTS.form.animate}
      exit={ANIMATION_VARIANTS.form.exit}
      transition={ANIMATION_VARIANTS.form.transition}
      onSubmit={handleSubmit}
      className="px-8 pb-6 space-y-4"
    >
      {/* Email Verification Error */}
      {emailVerificationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">
                Email Verification Required
              </h4>
              <p className="text-sm text-yellow-700 mb-2">
                {emailVerificationError.message}
              </p>
              <button
                type="button"
                onClick={() =>
                  onEmailVerificationNeeded &&
                  onEmailVerificationNeeded(emailVerificationError.email)
                }
                className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
              >
                Resend verification email
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Role Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1.5">
          <UserCheck size={16} className="text-gray-500" />
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={() => handleInputChange("role", USER_ROLES.USER)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              formData.role === USER_ROLES.USER
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
            }`}
          >
            <User size={16} />
            <span className="font-medium">Job Seeker</span>
            {formData.role === USER_ROLES.USER && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleInputChange("role", USER_ROLES.ADMIN)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              formData.role === USER_ROLES.ADMIN
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
            }`}
          >
            <Shield size={16} />
            <span className="font-medium">Recruiter</span>
            {formData.role === USER_ROLES.ADMIN && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1.5"
        >
          <Mail size={16} className="text-gray-500" />
          Email Address
        </label>
        <input
          id="email"
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
            errors.email
              ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
              : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
          }`}
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          type="email"
          placeholder="Enter your email address"
          required
        />
        {errors.email && (
          <p className="text-xs text-red-600 ml-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1.5"
        >
          <Lock size={16} className="text-gray-500" />
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 pr-12 ${
              errors.password
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
            }`}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-600 ml-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {errors.password}
          </p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="relative w-full py-4 mt-6 font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
      >
        {/* Button background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

        <span className="relative flex items-center justify-center">
          {isLoading ? (
            <>
              <div className="w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="animate-pulse">Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <motion.div
                className="ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                →
              </motion.div>
            </>
          )}
        </span>
      </motion.button>
    </motion.form>
  );
};

export default SignInForm;
