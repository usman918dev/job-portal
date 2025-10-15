import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Menu, X, LogIn, UserPlus, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LANDING_NAVBAR_CONSTANTS } from '../constants/landingNavbarConstants.js';
import { handleSignUp, handleSignIn, handleRecruiterPortal, createScrollHandler } from '../utils/landingNavbarUtils.js';

const LandingNavbar = ({ setShowAuthModal, setAuthMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = createScrollHandler(setIsScrolled);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.NAV_INITIAL}
      animate={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.NAV_ANIMATE}
      transition={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.NAV_TRANSITION}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-slate-900 to-blue-900 shadow-2xl border-b border-blue-500/30' 
          : 'bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.LOGO_INITIAL}
            animate={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.LOGO_ANIMATE}
            transition={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.LOGO_TRANSITION}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className={`p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg ${
              isScrolled ? 'shadow-md' : 'shadow-xl'
            }`}>
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className={`text-xl lg:text-2xl font-bold transition-all duration-300 ${
                isScrolled 
                  ? 'text-white drop-shadow-lg'
                  : 'text-white drop-shadow-lg'
              }`}>
                {LANDING_NAVBAR_CONSTANTS.CONTENT.BRAND_NAME}
              </span>
              <div className={`text-xs font-medium transition-colors duration-300 ${
                isScrolled ? 'text-blue-200 drop-shadow-md' : 'text-white/90 drop-shadow-md'
              }`}>
                {LANDING_NAVBAR_CONSTANTS.CONTENT.BRAND_TAGLINE}
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.DESKTOP_NAV_INITIAL}
            animate={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.DESKTOP_NAV_ANIMATE}
            transition={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.DESKTOP_NAV_TRANSITION}
            className="hidden md:flex items-center space-x-1"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRecruiterPortal(navigate, setIsMobileMenuOpen)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                isScrolled 
                  ? 'text-white hover:text-blue-200 hover:bg-blue-600/30 drop-shadow-md' 
                  : 'text-white hover:text-blue-200 hover:bg-white/20 drop-shadow-md'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{LANDING_NAVBAR_CONSTANTS.CONTENT.RECRUITER_PORTAL}</span>
            </motion.button>
          </motion.div>

          {/* Desktop Auth Buttons */}
          <motion.div
            initial={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.DESKTOP_AUTH_INITIAL}
            animate={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.DESKTOP_AUTH_ANIMATE}
            transition={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.DESKTOP_AUTH_TRANSITION}
            className="hidden md:flex items-center space-x-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSignIn(setAuthMode, setShowAuthModal, setIsMobileMenuOpen)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                isScrolled 
                  ? 'text-white hover:text-blue-200 hover:bg-blue-600/30 drop-shadow-md' 
                  : 'text-white hover:text-blue-200 hover:bg-white/20 drop-shadow-md'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{LANDING_NAVBAR_CONSTANTS.CONTENT.SIGN_IN}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSignUp(setAuthMode, setShowAuthModal, setIsMobileMenuOpen)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{LANDING_NAVBAR_CONSTANTS.CONTENT.GET_STARTED}</span>
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.MOBILE_BUTTON_INITIAL}
            animate={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.MOBILE_BUTTON_ANIMATE}
            transition={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.MOBILE_BUTTON_TRANSITION}
            className="md:hidden p-2 rounded-lg transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-white'}`} />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.MOBILE_MENU_INITIAL}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={LANDING_NAVBAR_CONSTANTS.ANIMATIONS.MOBILE_MENU_TRANSITION}
          className="md:hidden overflow-hidden bg-gradient-to-r from-slate-900 to-blue-900 backdrop-blur-md rounded-xl mt-2 shadow-2xl border border-blue-500/30"
        >
          <div className="p-4 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRecruiterPortal(navigate, setIsMobileMenuOpen)}
              className="w-full text-left px-4 py-3 rounded-lg text-white hover:text-blue-200 font-semibold transition-all duration-200 flex items-center space-x-3 drop-shadow-md"
            >
              <Shield className="w-5 h-5" />
              <span>{LANDING_NAVBAR_CONSTANTS.CONTENT.RECRUITER_PORTAL}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSignIn(setAuthMode, setShowAuthModal, setIsMobileMenuOpen)}
              className="w-full text-left px-4 py-3 rounded-lg text-white hover:text-blue-200 font-semibold transition-all duration-200 flex items-center space-x-3 drop-shadow-md"
            >
              <LogIn className="w-5 h-5" />
              <span>{LANDING_NAVBAR_CONSTANTS.CONTENT.SIGN_IN}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSignUp(setAuthMode, setShowAuthModal, setIsMobileMenuOpen)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <UserPlus className="w-5 h-5" />
              <span>{LANDING_NAVBAR_CONSTANTS.CONTENT.GET_STARTED}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;