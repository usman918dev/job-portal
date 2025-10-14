import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, UserCheck, Shield, Building2 } from "lucide-react";
import { toast } from "react-toastify";

const SignUpForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    companyName: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length > 6) score += 1;
    if (pass.length > 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Debug log for role changes
    if (field === "role") {
      console.log("Role changed to:", value);
    }
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    if (field === "password") {
      setPasswordStrength(checkPasswordStrength(value));
      // Clear confirm password error if passwords now match
      if (formData.confirmPassword && value === formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
    
    if (field === "confirmPassword") {
      // Real-time password match validation
      if (value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Validate company name for admin/recruiter
    if (formData.role === "admin" && !formData.companyName.trim()) {
      newErrors.companyName = "Company name is required for recruiters";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (passwordStrength < 3) {
      newErrors.password = "Please use a stronger password";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Ensure role is included in the submission data
      const submissionData = {
        ...formData,
        role: formData.role || "user" // Default to user if somehow role is empty
      };
      console.log("Submitting sign up data:", submissionData); // Debug log
      onSubmit(submissionData);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      {/* Role Selection - moved to top and enhanced */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1.5">
          <UserCheck size={14} className="text-gray-500" />
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            onClick={() => handleInputChange("role", "user")}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
              formData.role === "user"
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
            }`}
          >
            <User size={14} />
            <span className="font-medium text-sm">Job Seeker</span>
            {formData.role === "user" && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            )}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleInputChange("role", "admin")}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
              formData.role === "admin"
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
            }`}
          >
            <Shield size={14} />
            <span className="font-medium text-sm">Recruiter</span>
            {formData.role === "admin" && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Company Name Field - shown only for admin/recruiter */}
      {formData.role === "admin" && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-1"
        >
          <label htmlFor="companyName" className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1.5">
            <Building2 size={14} className="text-gray-500" />
            Company Name
          </label>
          <input
            id="companyName"
            className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
              errors.companyName 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
                : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
            }`}
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            type="text"
            placeholder="Enter your company name"
            required
          />
          {errors.companyName && (
            <p className="text-xs text-red-600 ml-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.companyName}
            </p>
          )}
        </motion.div>
      )}

      {/* Name Field */}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1.5">
          <User size={14} className="text-gray-500" />
          Full Name
        </label>
        <input
          id="name"
          className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
            errors.name 
              ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
              : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
          }`}
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          type="text"
          placeholder="Enter your full name"
          required
        />
        {errors.name && (
          <p className="text-xs text-red-600 ml-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1.5">
          <Mail size={14} className="text-gray-500" />
          Email Address
        </label>
        <input
          id="email"
          className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
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
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1.5">
          <Lock size={14} className="text-gray-500" />
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 pr-12 ${
              errors.password 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
                : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
            }`}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            required
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-600 ml-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {errors.password}
          </p>
        )}
        
        {/* Password strength indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center gap-1 h-1.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div 
                  key={level}
                  className={`h-full rounded-full flex-1 transition-all ${
                    passwordStrength >= level 
                      ? passwordStrength <= 2 
                        ? "bg-red-400" 
                        : passwordStrength <= 3 
                          ? "bg-yellow-400" 
                          : "bg-green-400"
                      : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-xs mt-1 text-gray-500">
              {passwordStrength === 0 && "Enter a password"}
              {passwordStrength === 1 && "Password is too weak"}
              {passwordStrength === 2 && "Password is weak"}
              {passwordStrength === 3 && "Password is good"}
              {passwordStrength === 4 && "Password is strong"}
              {passwordStrength === 5 && "Password is very strong"}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1.5">
          <Lock size={14} className="text-gray-500" />
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 pr-12 ${
              errors.confirmPassword 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
                : formData.confirmPassword && formData.password === formData.confirmPassword
                  ? "border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50"
                  : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
            }`}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            required
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {/* Password match indicator */}
        {formData.confirmPassword && (
          <div className="flex items-center gap-1 ml-1">
            {formData.password === formData.confirmPassword ? (
              <>
                <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                <p className="text-xs text-green-600">Passwords match</p>
              </>
            ) : (
              <>
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                <p className="text-xs text-red-600">Passwords do not match</p>
              </>
            )}
          </div>
        )}
        {errors.confirmPassword && (
          <p className="text-xs text-red-600 ml-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.01 }}
        whileTap={{ scale: isLoading ? 1 : 0.99 }}
        className="relative w-full py-3 mt-4 font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
      >
        {/* Button background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        
        <span className="relative flex items-center justify-center">
          {isLoading ? (
            <>
              <div className="w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="animate-pulse">Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
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

export default SignUpForm;