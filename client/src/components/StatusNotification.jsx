import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { getUserStatus } from '../services/profileService';

const StatusNotification = () => {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const [notification, setNotification] = useState(null);
  const [previousStatus, setPreviousStatus] = useState(currentUser?.status);

  useEffect(() => {
    if (!currentUser?.id && !currentUser?._id) return;

    const checkUserStatus = async () => {
      try {
        const statusData = await getUserStatus(currentUser.id || currentUser._id);
        const newStatus = statusData.status;
        
        if (newStatus !== previousStatus && previousStatus !== undefined) {
          // Status changed, show notification
          let notificationConfig = {};
          
          switch (newStatus?.toLowerCase()) {
            case 'suspended':
              notificationConfig = {
                type: 'error',
                icon: XCircle,
                title: 'Account Suspended',
                message: 'Your account has been suspended. Please contact support for assistance.',
                duration: 0 // Don't auto-hide
              };
              break;
            case 'active':
              if (previousStatus?.toLowerCase() === 'suspended') {
                notificationConfig = {
                  type: 'success',
                  icon: CheckCircle,
                  title: 'Account Restored',
                  message: 'Your account has been reactivated. Welcome back!',
                  duration: 5000
                };
              }
              break;
            case 'pending':
              notificationConfig = {
                type: 'warning',
                icon: AlertCircle,
                title: 'Account Under Review',
                message: 'Your account is currently under review. You may experience limited access.',
                duration: 7000
              };
              break;
            default:
              notificationConfig = {
                type: 'info',
                icon: Info,
                title: 'Account Status Updated',
                message: `Your account status has been changed to ${newStatus}.`,
                duration: 5000
              };
          }
          
          setNotification(notificationConfig);
          
          // Update user status in context
          setCurrentUser(prev => ({
            ...prev,
            status: newStatus
          }));
        }
        
        setPreviousStatus(newStatus);
      } catch (error) {
        console.error('Failed to check user status:', error);
      }
    };

    // Check immediately, then every 30 seconds
    checkUserStatus();
    const interval = setInterval(checkUserStatus, 30000);

    return () => clearInterval(interval);
  }, [currentUser?.id, currentUser?._id, previousStatus, setCurrentUser]);

  const getNotificationColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-200 text-green-800 shadow-green-500/20';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-pink-100 border-red-200 text-red-800 shadow-red-500/20';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-200 text-yellow-800 shadow-yellow-500/20';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200 text-blue-800 shadow-blue-500/20';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
      default:
        return 'text-blue-600';
    }
  };

  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification && notification.duration > 0) {
      const timer = setTimeout(hideNotification, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.95 }}
          className="fixed top-6 right-6 z-50 max-w-md"
        >
          <div className={`border-2 rounded-2xl shadow-2xl p-6 backdrop-blur-xl ${getNotificationColors(notification.type)}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`p-2 rounded-xl ${getIconColor(notification.type)} bg-white/30`}>
                  <notification.icon className={`w-6 h-6 ${getIconColor(notification.type)}`} />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold mb-1">{notification.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={hideNotification}
                  className="inline-flex text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusNotification;