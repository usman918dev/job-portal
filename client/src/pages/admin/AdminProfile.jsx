import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Settings, 
  Camera, 
  Save, 
  Edit3, 
  Bell, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BarChart3,
  Users,
  Briefcase
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Check authentication and redirect if not admin/recruiter
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast.error('Please log in to access this page');
      navigate('/signin');
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      const user = parsed.user;
      if (!user || (user.role !== 'admin' && user.role !== 'Admin' && user.role !== 'Recruiter')) {
        toast.error('Access denied. Admin or Recruiter privileges required.');
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Authentication error. Please log in again.');
      navigate('/signin');
    }
  }, [navigate]);

  // Get admin user from localStorage (same as regular users)
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const userData = localStorage.getItem('user');
      const parsed = userData ? JSON.parse(userData) : null;
      // Check if user is admin or recruiter
      if (parsed && parsed.user && (parsed.user.role === 'admin' || parsed.user.role === 'Admin' || parsed.user.role === 'Recruiter')) {
        return parsed.user;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState({
    name: adminUser?.name || 'Admin User',
    email: adminUser?.email || 'admin@jobly.com',
    phone: adminUser?.phone || '',
    department: adminUser?.department || 'Human Resources',
    position: adminUser?.position || 'System Administrator',
    bio: adminUser?.bio || '',
    permissions: adminUser?.permissions || [],
    notifications: {
      applicationAlerts: true
    }
  });

  // Update formData when adminUser changes
  useEffect(() => {
    if (adminUser) {
      setFormData({
        name: adminUser.name || 'Admin User',
        email: adminUser.email || 'admin@jobly.com',
        phone: adminUser.phone || '',
        department: adminUser.department || 'Human Resources',
        position: adminUser.position || 'System Administrator',
        bio: adminUser.bio || '',
        permissions: adminUser.permissions || [],
        notifications: {
          applicationAlerts: true
        }
      });
    }
  }, [adminUser]);

  const [adminStats, setAdminStats] = useState({
    totalUsers: 1248,
    totalJobs: 89,
    pendingApplications: 156,
    activeRecruiters: 23,
    lastLogin: new Date().toISOString(),
    accountCreated: '2024-01-15'
  });

  // Load profile image from localStorage
  useEffect(() => {
    if (adminUser?.email) {
      const savedImage = localStorage.getItem(`adminProfileImage_${adminUser.email}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [adminUser?.email]);

  // Handle profile image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setProfileImage(imageDataUrl);
      localStorage.setItem(`adminProfileImage_${adminUser?.email}`, imageDataUrl);
      toast.success('Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('notifications.')) {
      const notificationKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Get current user data from localStorage
      const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
      const adminId = currentUserData.user?.id || adminUser?.id || adminUser?._id;
      
      if (!adminId) {
        toast.error('Unable to identify admin user. Please log in again.');
        return;
      }
      
      const { updateUser } = await import('../../services/adminService');
      await updateUser(adminId, formData);
      
      const updatedAdmin = {
        ...(adminUser || {}),
        ...formData,
        id: adminId, // Ensure we have the ID
        _id: adminId // Also store as _id for compatibility
      };
      
      setAdminUser(updatedAdmin);
      
      // Update localStorage with the new user data
      const updatedUserData = {
        ...currentUserData,
        user: updatedAdmin
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const permissions = [
    { id: 'manage_users', label: 'Manage Users', description: 'Create, edit, and delete user accounts' },
    { id: 'manage_jobs', label: 'Manage Jobs', description: 'Oversee job postings and applications' },
    { id: 'view_analytics', label: 'View Analytics', description: 'Access platform analytics and reports' },
    { id: 'system_settings', label: 'System Settings', description: 'Modify platform configuration' },
    { id: 'manage_admins', label: 'Manage Admins', description: 'Add and remove admin privileges' }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{adminUser?.role === 'Recruiter' ? 'Recruiter' : 'Admin'} Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your {adminUser?.role === 'Recruiter' ? 'recruiter' : 'admin'} account and system preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="relative group">
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Admin Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                    )}
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-center">{formData.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">{adminUser?.role === 'Recruiter' ? 'Recruiter' : 'Administrator'}</span>
                  </div>
                </div>
              </div>

              {/* Admin Status */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                    Active
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="p-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-2 ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                      <button
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isEditing
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
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
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Personal Information
                        </h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={true}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Enter your phone number"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Administrative Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Administrative Information
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                          <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                          <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows={4}
                            placeholder="Administrative notes..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'permissions' && (
                  <motion.div
                    key="permissions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Permissions</h2>
                    
                    <div className="space-y-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800 dark:text-gray-200">{permission.label}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{permission.description}</p>
                            </div>
                            <div className="flex items-center">
                              <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">Granted</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>

                    <div className="space-y-6">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Admin Notifications</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300">Job Application Alerts</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Receive email notifications when candidates apply to your job postings</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notifications.applicationAlerts"
                                checked={formData.notifications.applicationAlerts}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        </div>
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
  );
};

export default AdminProfile;