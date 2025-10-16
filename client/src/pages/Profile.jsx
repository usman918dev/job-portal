import React, { useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Camera,
  Save,
  Upload,
  CheckCircle,
  AlertCircle,
  Edit3,
  Home,
  Settings,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  Award,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SkillsInput from "../components/SkillsInput";

// Import extracted services, utils, and constants
import {
  updateUserProfile,
  saveProfileImageToStorage,
  getProfileImageFromStorage,
  updateNotificationPreferences
} from "../services/profileService";
import {
  getStatusColor,
  getRoleIcon,
  validateImageFile,
  processImageFile,
  saveUserToLocalStorage,
  initializeFormData,
  handleFormInputChange,
  triggerProfileImageUpdate
} from "../utils/profileUtils";
import {
  PROFILE_TABS,
  FORM_FIELDS,
  NOTIFICATION_PREFERENCES,
  DEFAULT_NOTIFICATIONS,
  ANIMATION_VARIANTS
} from "../constants/profileConstants";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const fileInputRef = useRef(null);
  
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState(() => initializeFormData(currentUser));

  // Load profile image from localStorage on component mount
  useEffect(() => {
    if (currentUser?.email) {
      const savedImage = getProfileImageFromStorage(currentUser.email);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [currentUser?.email]);

  // Handle profile image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate image file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    try {
      // Process image file
      const imageDataUrl = await processImageFile(file);
      setProfileImage(imageDataUrl);

      // Save to localStorage with user-specific key
      const saved = saveProfileImageToStorage(currentUser?.email, imageDataUrl);
      if (saved) {
        toast.success('Profile picture updated successfully!');

        // Trigger profile image update event
        triggerProfileImageUpdate(currentUser?.email, imageDataUrl);
      } else {
        toast.error('Failed to save profile picture');
      }
    } catch (error) {
      toast.error('Failed to process image file');
      console.error('Image processing error:', error);
    }
  };  // Handle form data change
  const handleInputChange = (e) => {
    const updatedFormData = handleFormInputChange(e, formData);
    setFormData(updatedFormData);
  };

  // Handle skills change
  const handleSkillsChange = (updatedSkills) => {
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Prepare update data
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        company: formData.company,
        position: formData.position,
        website: formData.website,
        bio: formData.bio,
        skills: formData.skills
      };

      // Call API to update profile (if user has _id)
      if (currentUser?._id) {
        await updateUserProfile(currentUser._id, updateData);
      }

      const updatedUser = {
        ...currentUser,
        ...formData
      };

      setCurrentUser(updatedUser);

      // Save to localStorage
      saveUserToLocalStorage(updatedUser);

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle notification preferences save
  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await updateNotificationPreferences(currentUser?.email, {
        applicationAlerts: formData.notifications.applicationAlerts
      });

      // Update the context with new notification settings
      const updatedUser = {
        ...currentUser,
        notifications: {
          ...currentUser.notifications,
          applicationAlerts: formData.notifications.applicationAlerts
        }
      };

      setCurrentUser(updatedUser);

      // Save to localStorage
      saveUserToLocalStorage(updatedUser);

      toast.success('Notification preferences saved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save notification preferences');
      console.error('Notification preferences save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = PROFILE_TABS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Navbar />
      
      <div className="pt-24 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
                Profile Settings
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Customize your experience and manage your professional presence
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              variants={ANIMATION_VARIANTS.tab}
              initial="hidden"
              animate="visible"
              className="lg:col-span-1"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
                  {/* Premium background pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  </div>
                  <div className="relative group">
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover border-4 border-white/30 shadow-2xl ring-4 ring-white/20"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center border-4 border-white/30 shadow-2xl ring-4 ring-white/20">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:scale-105"
                      >
                        <Camera className="w-6 h-6 text-white drop-shadow-lg" />
                      </button>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold text-center text-white drop-shadow-lg">{currentUser?.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div className="p-1 bg-white/20 rounded-full">
                        {React.createElement(getRoleIcon(currentUser?.role), { className: "w-5 h-5 text-white" })}
                      </div>
                      <span className="text-sm font-medium capitalize text-white/90 tracking-wide">{currentUser?.role}</span>
                    </div>
                  </div>
                </div>

                {/* User Status */}
                <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 tracking-wide">Account Status</span>
                    <span className={`px-4 py-2 text-xs font-bold rounded-full border shadow-sm ${getStatusColor(currentUser?.status || 'active')}`}>
                      {currentUser?.status || 'Active'}
                    </span>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="p-6 space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 mb-1 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600 hover:shadow-md'
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-white/20'
                            : 'bg-gray-100 group-hover:bg-blue-100'
                        }`}>
                          <Icon className={`w-4 h-4 transition-all duration-300 ${
                            activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                          }`} />
                        </div>
                        <span className="font-semibold tracking-wide">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              variants={ANIMATION_VARIANTS.content}
              initial="hidden"
              animate="visible"
              className="lg:col-span-3"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-8"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                        <button
                          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                          disabled={isLoading}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            isEditing
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : isEditing ? (
                            <Save className="w-4 h-4" />
                          ) : (
                            <Edit3 className="w-4 h-4" />
                          )}
                          {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Basic Information
                          </h3>
                          
                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={true} // Email should not be editable
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50/70 text-gray-500 backdrop-blur-sm font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Phone Number</label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your phone number"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Location</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your location"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Professional Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Professional Information
                          </h3>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Company</label>
                            <div className="relative">
                              <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your company"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Position</label>
                            <input
                              type="text"
                              name="position"
                              value={formData.position}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Enter your position"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Website</label>
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="https://yourwebsite.com"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Bio</label>
                            <textarea
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              rows={4}
                              placeholder="Tell us about yourself..."
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg resize-none font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Skills Section - Only for users, not admins */}
                      {currentUser?.role !== 'admin' && currentUser?.role !== 'Admin' && currentUser?.role !== 'Recruiter' && (
                        <div className="mt-8 pt-8 border-t-2 border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6">
                            Professional Skills
                          </h3>
                          <SkillsInput
                            skills={formData.skills}
                            onChange={handleSkillsChange}
                            disabled={!isEditing}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'notifications' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-8"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                      <div className="space-y-8">
                        <div className="border-2 border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-xl transition-all duration-300">
                          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                              <Bell className="w-5 h-5 text-white" />
                            </div>
                            Communication Preferences
                          </h3>
                          
                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                              <div>
                                <h4 className="font-bold text-gray-800">Application Status Alerts</h4>
                                <p className="text-sm text-gray-600 mt-1">Receive emails when your job applications are accepted or rejected</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="notifications.applicationAlerts"
                                  checked={formData.notifications.applicationAlerts}
                                  onChange={handleInputChange}
                                  className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 shadow-lg"></div>
                              </label>
                            </div>
                          </div>

                          {/* Save button for notification preferences */}
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                              onClick={handleSaveNotifications}
                              disabled={isLoading}
                              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <Save className="w-5 h-5" />
                              {isLoading ? 'Saving...' : 'Save Notification Preferences'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'preferences' && (
                    <motion.div
                      key="preferences"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-8"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                      
                      <div className="space-y-6">
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Preferences</h3>
                          <p className="text-gray-600">These preferences will be available in a future update.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;