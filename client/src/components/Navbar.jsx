import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { Zap, Briefcase, User, LogOut, Shield, Search, Menu, X } from "lucide-react";
import { logout } from "../services/authService";
import { NAVBAR_CONSTANTS } from "../constants/navbarConstants.js";
import {
  openAuthModal,
  createScrollHandler,
  loadProfileImage,
  createProfileImageUpdateHandler,
  createClickOutsideHandler,
  handleLogout,
  isAdmin,
  isDevelopment,
} from "../utils/navbarUtils.js";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    setShowRecruiterLogin,
    showAuthModal,
    setShowAuthModal,
    currentUser,
    setCurrentUser,
  } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Load profile image from localStorage
  useEffect(() => {
    const savedImage = loadProfileImage(currentUser);
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, [currentUser?.email]);

  // Listen for profile image updates
  useEffect(() => {
    const handleProfileImageUpdate = createProfileImageUpdateHandler(
      currentUser,
      setProfileImage
    );
    window.addEventListener(
      NAVBAR_CONSTANTS.CUSTOM_EVENTS.PROFILE_IMAGE_UPDATED,
      handleProfileImageUpdate
    );
    return () =>
      window.removeEventListener(
        NAVBAR_CONSTANTS.CUSTOM_EVENTS.PROFILE_IMAGE_UPDATED,
        handleProfileImageUpdate
      );
  }, [currentUser?.email]);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = createScrollHandler(setScrolled);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close user menu and mobile menu
  useEffect(() => {
    const handleClickOutside = createClickOutsideHandler(
      showUserMenu || showMobileMenu,
      () => {
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    );
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu, showMobileMenu]);

  return (
    <>

      <div
        className={`${
          scrolled ? "fixed animate-slideDown" : "relative"
        } top-0 left-0 right-0 z-20 w-full transition-all duration-300`}
      >
        <nav
          className={`transition-all duration-500 ${
            scrolled
              ? "mx-4 my-3 max-w-6xl lg:mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100/50 py-4 px-6"
              : " mx-4 md:mx-8 rounded-xl bg-white shadow-sm border-b border-gray-100 py-6 px-8"
          } flex justify-between items-center`}
        >
          {/* Jobly Logo */}
          <div
            onClick={() => navigate(NAVBAR_CONSTANTS.ROUTES.HOME)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div
              className={`bg-gradient-to-br from-emerald-600 to-blue-800 p-2 rounded-lg ${
                scrolled ? "shadow-lg" : ""
              } group-hover:shadow-emerald-500/30 transition-all duration-300`}
            >
              <Briefcase size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Jobly
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {showMobileMenu ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>

          {/* User section with premium styling */}
          <div className="hidden lg:flex items-center gap-4">
            {currentUser ? (
              <>
                {/* My Jobs - only show for non-admin users */}
                {!isAdmin(currentUser) && (
                  <Link
                    to={NAVBAR_CONSTANTS.ROUTES.APPLICATIONS}
                    className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <Briefcase size={18} />
                    <span className="font-medium">My Jobs</span>
                  </Link>
                )}

                {/* Latest Jobs - only show for non-admin users */}
                {!isAdmin(currentUser) && (
                  <Link
                    to={NAVBAR_CONSTANTS.ROUTES.LATEST_JOBS}
                    className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <Search size={18} />
                    <span className="font-medium">Latest Jobs</span>
                  </Link>
                )}

                {/* Admin Dashboard - only show for admin users */}
                {isAdmin(currentUser) && (
                  <Link
                    to={NAVBAR_CONSTANTS.ROUTES.ADMIN}
                    className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <Shield size={18} />
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                )}

                {/* Debug info - remove in production */}
                {isDevelopment() && (
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    Role: {currentUser?.role || "undefined"}
                  </div>
                )}

                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="hidden lg:block">
                      <span className="text-sm font-medium text-gray-600">
                        Hi, {currentUser?.name || "User"}
                      </span>
                      <p className="text-xs text-gray-400 capitalize">
                        {currentUser?.role || "user"}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium border-2 border-blue-100 shadow-md overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        currentUser?.name?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-800">
                          {currentUser?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentUser?.email || ""}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                          {currentUser?.role || "user"}
                        </span>
                      </div>
                      <Link
                        to={NAVBAR_CONSTANTS.ROUTES.PROFILE}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} />
                        Profile Settings
                      </Link>
                      <button
                        onClick={() =>
                          handleLogout(
                            logout,
                            setCurrentUser,
                            setShowUserMenu,
                            navigate
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(NAVBAR_CONSTANTS.ROUTES.ADMIN)}
                  className="hidden lg:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Recruiter Portal
                </button>
                <button
                  onClick={() => openAuthModal("Sign Up")}
                  className="hidden lg:block text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Sign Up
                </button>
                {/* Sign In handled via Auth Modal; button intentionally removed to avoid broken route */}
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-lg overflow-hidden"
            >
            <div className="px-6 py-4 space-y-4">
              {currentUser ? (
                <>
                  {/* Mobile User Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium border-2 border-blue-100 shadow-md overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        currentUser?.name?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {currentUser?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {currentUser?.email || ""}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    {!isAdmin(currentUser) && (
                      <>
                        <Link
                          to={NAVBAR_CONSTANTS.ROUTES.APPLICATIONS}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <Briefcase size={20} />
                          <span className="font-medium">My Jobs</span>
                        </Link>
                        <Link
                          to={NAVBAR_CONSTANTS.ROUTES.LATEST_JOBS}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <Search size={20} />
                          <span className="font-medium">Latest Jobs</span>
                        </Link>
                      </>
                    )}

                    {isAdmin(currentUser) && (
                      <Link
                        to={NAVBAR_CONSTANTS.ROUTES.ADMIN}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Shield size={20} />
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to={NAVBAR_CONSTANTS.ROUTES.PROFILE}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User size={20} />
                      <span className="font-medium">Profile Settings</span>
                    </Link>
                  </div>

                  {/* Mobile Sign Out */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() =>
                        handleLogout(
                          logout,
                          setCurrentUser,
                          () => {
                            setShowUserMenu(false);
                            setShowMobileMenu(false);
                          },
                          navigate
                        )
                      }
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile Auth Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate(NAVBAR_CONSTANTS.ROUTES.ADMIN);
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                    >
                      <Shield size={20} />
                      <span className="font-medium">Recruiter Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal("Sign Up");
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                    >
                      <User size={20} />
                      <span className="font-medium">Sign Up</span>
                    </button>
                  </div>
                </>
              )}
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;
