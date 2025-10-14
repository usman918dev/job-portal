import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Briefcase, TrendingUp, Search, MapPin, Star } from 'lucide-react';
import bgImage from '../assets/bg-image-main.jpg';

const LandingHero = ({ setShowAuthModal, setAuthMode }) => {
  const handleGetStarted = () => {
    setAuthMode('Sign Up');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('Login');
    setShowAuthModal(true);
  };

  const stats = [
    { icon: Briefcase, number: "50K+", label: "Active Jobs" },
    { icon: Users, number: "1M+", label: "Job Seekers" },
    { icon: TrendingUp, number: "95%", label: "Success Rate" },
    { icon: Star, number: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Professional workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/95"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative pt-8 lg:pt-16 pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                Find Your{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Dream Job
                </span>
                <br />
                Today
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-lg lg:text-xl xl:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              >
                Connect with top employers, discover amazing opportunities, and take the next step in your career journey. Your future starts here.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-3 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignIn}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center space-x-3"
              >
                <span>Sign In</span>
              </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-white/80 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Search Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                    <Search className="text-gray-400 w-5 h-5 mr-3" />
                    <span className="text-gray-500">Job title, keywords, or company</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                    <MapPin className="text-gray-400 w-5 h-5 mr-3" />
                    <span className="text-gray-500">Location or remote</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGetStarted}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    Search Jobs
                  </motion.button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">50,000+</span> jobs waiting for you
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;