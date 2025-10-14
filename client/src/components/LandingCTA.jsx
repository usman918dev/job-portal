import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Zap, Shield, CheckCircle, Rocket } from 'lucide-react';

const LandingCTA = ({ setShowAuthModal, setAuthMode }) => {
  const handleGetStarted = () => {
    setAuthMode('Sign Up');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('Login');
    setShowAuthModal(true);
  };

  const benefits = [
    "Access to 50,000+ job opportunities",
    "AI-powered job matching",
    "Direct employer connections",
    "Career guidance and insights",
    "Mobile app for on-the-go job hunting",
    "Priority customer support"
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            repeatType: "reverse"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl will-change-transform"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            delay: 2,
            repeatType: "reverse"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl will-change-transform"
        />
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 will-change-auto">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-2 h-2 bg-white rounded-full top-1/4 left-1/4"
          />
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full top-1/2 left-1/2"
          />
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute w-1.5 h-1.5 bg-purple-300 rounded-full top-3/4 left-3/4"
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 lg:mb-16 will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium mb-6 border border-white/20 will-change-transform"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Launch Your Career
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight will-change-transform"
            >
              Your Dream Job is{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Just One Click Away
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.3
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed will-change-transform"
            >
              Join over 1 million professionals who have already found their perfect career match. 
              Start your journey today and unlock limitless opportunities.
            </motion.p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.1
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-12 lg:mb-16 will-change-transform"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.05 * index
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.02, 
                  x: 5,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 group will-change-transform cursor-pointer"
              >
                <div className="flex-shrink-0 p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors duration-200">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-white/90 font-medium group-hover:text-white transition-colors duration-200">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 will-change-transform"
          >
            <motion.button
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.25)",
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              onClick={handleGetStarted}
              className="group px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-2xl hover:shadow-white/25 transition-all duration-200 flex items-center space-x-3 relative overflow-hidden will-change-transform"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                initial={{ x: "-100%" }}
                whileHover={{ 
                  x: "100%",
                  transition: { duration: 0.6, ease: "easeInOut" }
                }}
              />
              <Users className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              onClick={handleSignIn}
              className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200 flex items-center space-x-3 will-change-transform"
            >
              <span>Already a member? Sign In</span>
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 will-change-transform"
          >
            <div className="flex items-center space-x-2 text-white/80">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="font-medium">100% Secure & Private</span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            
            <div className="flex items-center space-x-2 text-white/80">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">Instant Access</span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            
            <div className="flex items-center space-x-2 text-white/80">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-medium">1M+ Happy Users</span>
            </div>
          </motion.div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.4
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="mt-12 text-center will-change-auto"
          >
            <p className="text-white/70 text-sm">
              No credit card required • Join in under 30 seconds • Cancel anytime
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;