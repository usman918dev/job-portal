import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, UserCheck, Shield, ArrowLeft, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import { AppContext } from "../context/AppContext";
import bgimage from "../assets/bg-image-main.jpg";

const SignIn = () => {
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      if (formData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", damping: 20 }}
            className="relative"
          >
            {/* Glow effect - same as Hero search form */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-3xl blur-lg opacity-25"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
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
                        onClick={() => handleInputChange("role", "user")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          formData.role === "user"
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <User size={16} />
                        <span className="font-medium">User</span>
                        {formData.role === "user" && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => handleInputChange("role", "admin")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          formData.role === "admin"
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <Shield size={16} />
                        <span className="font-medium">Admin</span>
                        {formData.role === "admin" && (
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
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="relative w-full py-4 font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
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
                </form>
              </div>

              {/* Sign Up Link */}
              <div className="py-6 bg-gray-50 border-t border-gray-100 rounded-b-3xl">
                <div className="flex justify-center px-8">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/")} // Navigate to home where they can open sign up modal
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