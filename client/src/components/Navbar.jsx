import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Zap, Briefcase, User, LogOut, Shield } from "lucide-react";
import { logout } from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const { setShowRecruiterLogin, showAuthModal, setShowAuthModal, currentUser, setCurrentUser } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const openAuthModal = (mode = "Sign Up") => {
    // We can pass the mode through a custom event or context
    setShowAuthModal(true);
  };

  // Load profile image from localStorage
  useEffect(() => {
    if (currentUser?.email) {
      const savedImage = localStorage.getItem(`profileImage_${currentUser.email}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [currentUser?.email]);

  // Listen for profile image updates
  useEffect(() => {
    const handleProfileImageUpdate = (event) => {
      if (event.detail.userEmail === currentUser?.email) {
        setProfileImage(event.detail.imageUrl);
      }
    };

    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);
    return () => window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
  }, [currentUser?.email]);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  return (
    <>
      {/* Spacer div to prevent content jump when navbar becomes fixed */}
      <div className="h-2"></div>
      
      <div className={`${scrolled ? "fixed animate-slideDown" : "relative"} top-0 left-0 right-0 z-20 w-full transition-all duration-300`}>
        <nav className={`transition-all duration-500 ${
          scrolled 
            ? "mx-4 my-3 max-w-6xl md:mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100/50 py-4 px-6" 
            : " mx-8 rounded-xl bg-white shadow-sm border-b border-gray-100 py-6 px-8"
        } flex justify-between items-center`}>
          {/* Jobly Logo */}
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className={`bg-gradient-to-br from-emerald-600 to-blue-800 p-2 rounded-lg ${scrolled ? 'shadow-lg' : ''} group-hover:shadow-emerald-500/30 transition-all duration-300`}>
              <Briefcase size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Jobly
            </span>
          </div>

          {/* User section with premium styling */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                {/* My Jobs - only show for non-admin users */}
                {!(currentUser?.role === 'admin' || currentUser?.role === 'Admin') && (
                  <Link 
                    to="/applications" 
                    className="hidden md:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <Briefcase size={18} />
                    <span className="font-medium">My Jobs</span>
                  </Link>
                )}
                
                {/* Admin Dashboard - only show for admin users */}
                {(currentUser?.role === 'admin' || currentUser?.role === 'Admin') && (
                  <Link
                    to="/admin"
                    className="hidden md:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <Shield size={18} />
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                )}
                
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    Role: {currentUser?.role || 'undefined'}
                  </div>
                )}
                
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="hidden md:block">
                      <span className="text-sm font-medium text-gray-600">
                        Hi, {currentUser?.name || 'User'}
                      </span>
                      <p className="text-xs text-gray-400 capitalize">{currentUser?.role || 'user'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium border-2 border-blue-100 shadow-md overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        currentUser?.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-800">{currentUser?.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{currentUser?.email || ''}</p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                          {currentUser?.role || 'user'}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} />
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout(); // Clear localStorage
                          setCurrentUser(null); // Clear context
                          setShowUserMenu(false);
                          navigate("/"); // Redirect to home
                        }}
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
                  onClick={() => navigate("/admin")}
                  className="hidden md:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Recruiter Portal
                </button>
                <button
                  onClick={() => openAuthModal("Sign Up")}
                  className="hidden md:block text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Sign Up
                </button>
                {/* Sign In handled via Auth Modal; button intentionally removed to avoid broken route */}
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Add this to your tailwind.config.js or CSS file */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Navbar;