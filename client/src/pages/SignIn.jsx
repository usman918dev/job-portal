import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, UserCheck, Shield, ArrowLeft, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import { AppContext } from "../context/AppContext";
import bgimage from "../assets/bg-image-main.jpg";
import {
  DEFAULT_FORM_STATE,
  ANIMATION_VARIANTS,
  USER_ROLES,
  ROUTES,
  STYLING
} from "../constants/signInPageConstants";
import {
  validateSignInPageForm,
  handleSignInPageInputChange,
  navigateAfterSignIn,
  isUserAuthenticated,
  getRoleButtonClasses,
  getInputClasses
} from "../utils/signInPageUtils";

const SignIn = () => {
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useContext(AppContext);
  
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (isUserAuthenticated(currentUser)) {
      navigate(ROUTES.HOME);
    }
  }, [currentUser, navigate]);

  const handleInputChange = (field, value) => {
    const { formData: updatedFormData, errors: updatedErrors } = handleSignInPageInputChange(
      field,
      value,
      formData,
      errors
    );

    setFormData(updatedFormData);
    setErrors(updatedErrors);
  };

  const validateForm = () => {
    const validation = validateSignInPageForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const userData = await login(formData);
      
      // Set user in context
      setCurrentUser({
        ...userData.user,
        token: userData.token,
        role: formData.role
      });
      
      toast.success("Login successful! Welcome back.");
      
      // Navigate based on role
      navigateAfterSignIn(navigate, formData.role);
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient overlay - same as Hero */}
      <div className="absolute inset-0">
        <img
          src={bgimage}
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-cyan-700/95 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <motion.div
            initial={ANIMATION_VARIANTS.backButton.initial}
            animate={ANIMATION_VARIANTS.backButton.animate}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          {/* Sign In Card */}
          <motion.div
            initial={ANIMATION_VARIANTS.card.initial}
            animate={ANIMATION_VARIANTS.card.animate}
            transition={ANIMATION_VARIANTS.card.transition}
            className="relative"
          >
            {/* Glow effect - same as Hero search form */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-3xl blur-lg opacity-25"
              animate={ANIMATION_VARIANTS.glowEffect.animate}
              transition={ANIMATION_VARIANTS.glowEffect.transition}
            />
            
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              {/* Header with logo */}
              <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                {/* Decorative circles */}
                <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-indigo-300 opacity-20 blur-xl"></div>
                
                {/* Logo */}
                <div className="flex items-center gap-2 text-white z-10">
                  <div className="bg-white/20 p-2 rounded-lg shadow-lg">
                    <Zap size={28} className="text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Jobly</span>
                </div>
              </div>

              {/* Welcome text */}
              <div className="px-8 pt-12 pb-4">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                  Welcome Back
                </h1>
                <p className="text-center text-gray-600 mb-8">
                  Sign in to access your account and find your dream job
                </p>

                {/* Sign In Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Role Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <UserCheck size={16} className="text-gray-500" />
                      Select Role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        type="button"
                        onClick={() => handleInputChange("role", USER_ROLES.USER)}
                        whileHover={ANIMATION_VARIANTS.roleButton.hover}
                        whileTap={ANIMATION_VARIANTS.roleButton.tap}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${getRoleButtonClasses(USER_ROLES.USER, formData.role)}`}
                      >
                        <User size={16} />
                        <span className="font-medium">User</span>
                        {formData.role === USER_ROLES.USER && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => handleInputChange("role", USER_ROLES.ADMIN)}
                        whileHover={ANIMATION_VARIANTS.roleButton.hover}
                        whileTap={ANIMATION_VARIANTS.roleButton.tap}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${getRoleButtonClasses(USER_ROLES.ADMIN, formData.role)}`}
                      >
                        <Shield size={16} />
                        <span className="font-medium">Admin</span>
                        {formData.role === USER_ROLES.ADMIN && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      Email Address
                    </label>
                    <input
                      id="email"
                      className={getInputClasses(!!errors.email)}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      type="email"
                      placeholder="Enter your email address"
                      required
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock size={16} className="text-gray-500" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        className={`${getInputClasses(!!errors.password)} pr-12`}
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
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={isLoading ? ANIMATION_VARIANTS.submitButton.disabled : ANIMATION_VARIANTS.submitButton.hover}
                    whileTap={isLoading ? ANIMATION_VARIANTS.submitButton.disabled : ANIMATION_VARIANTS.submitButton.tap}
                    className={STYLING.button.primary}
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
                            initial={ANIMATION_VARIANTS.arrow.initial}
                            whileHover={ANIMATION_VARIANTS.arrow.whileHover}
                            transition={ANIMATION_VARIANTS.arrow.transition}
                          >
                            →
                          </motion.div>
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              </div>

              {/* Sign Up Link */}
              <div className="py-6 bg-gray-50 border-t border-gray-100 rounded-b-3xl">
                <div className="flex justify-center px-8">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.HOME)} // Navigate to home where they can open sign up modal
                      className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Sign up now
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;