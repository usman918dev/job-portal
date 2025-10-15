import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { getUserStatus } from "../services/profileService";
import {
  ANIMATION_VARIANTS,
  POSITIONING,
  POLLING_CONFIG,
} from "../constants/statusNotificationConstants";
import {
  getNotificationConfig,
  getNotificationColors,
  getIconColor,
  getIconBackgroundColor,
  shouldShowNotification,
  hasValidUserId,
  hasStatusChanged,
  createNotificationWithIcon,
} from "../utils/statusNotificationUtils";

const StatusNotification = () => {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const [notification, setNotification] = useState(null);
  const [previousStatus, setPreviousStatus] = useState(currentUser?.status);

  useEffect(() => {
    if (!hasValidUserId(currentUser)) return;

    const checkUserStatus = async () => {
      try {
        const statusData = await getUserStatus(
          currentUser.id || currentUser._id
        );
        const newStatus = statusData.status;

        if (
          hasStatusChanged(newStatus, previousStatus) &&
          previousStatus !== undefined
        ) {
          // Status changed, show notification
          const notificationConfig = getNotificationConfig(
            newStatus,
            previousStatus
          );

          if (notificationConfig) {
            const notificationWithIcon = createNotificationWithIcon(
              notificationConfig,
              {
                XCircle,
                CheckCircle,
                AlertCircle,
                Info,
              }
            );

            setNotification(notificationWithIcon);

            // Update user status in context
            setCurrentUser((prev) => ({
              ...prev,
              status: newStatus,
            }));
          }
        }

        setPreviousStatus(newStatus);
      } catch (error) {
        console.error("Failed to check user status:", error);
      }
    };

    // Check immediately, then every 30 seconds
    if (POLLING_CONFIG.IMMEDIATE_CHECK) {
      checkUserStatus();
    }
    const interval = setInterval(checkUserStatus, POLLING_CONFIG.INTERVAL);

    return () => clearInterval(interval);
  }, [currentUser?.id, currentUser?._id, previousStatus, setCurrentUser]);

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
          initial={ANIMATION_VARIANTS.container.initial}
          animate={ANIMATION_VARIANTS.container.animate}
          exit={ANIMATION_VARIANTS.container.exit}
          className={POSITIONING.container}
        >
          <div
            className={`border-2 rounded-2xl shadow-2xl p-6 backdrop-blur-xl ${getNotificationColors(
              notification.type
            )}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div
                  className={`p-2 rounded-xl ${getIconColor(
                    notification.type
                  )} ${getIconBackgroundColor(notification.type)}`}
                >
                  <notification.icon
                    className={`w-6 h-6 ${getIconColor(notification.type)}`}
                  />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold mb-1">{notification.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {notification.message}
                </p>
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
