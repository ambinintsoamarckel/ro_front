import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, CheckCircle, WifiOff } from "lucide-react";
import { colors } from "../colors";

const NotificationSystem = ({ notification, onClose }) => {
  if (!notification) return null;

  const getNotificationStyles = (type) => {
    const iconMap = {
      success: CheckCircle2,
      error: AlertCircle,
      warning: AlertCircle,
      network: WifiOff,
      info: CheckCircle
    };

    const notificationColors = colors.notifications[type] || colors.notifications.info;

    return {
      ...notificationColors,
      icon: iconMap[type] || CheckCircle
    };
  };

  const styles = getNotificationStyles(notification.type);
  const IconComponent = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-4 right-4 z-[60] max-w-md"
    >
      <div className={`
        ${styles.bg} ${styles.border} ${styles.text}
        rounded-xl shadow-2xl border backdrop-blur-md p-4 
        flex items-center space-x-3 relative overflow-hidden
      `}>
        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
        
        <div className={`p-2 rounded-full ${styles.iconBg} relative z-10`}>
          <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
        
        <div className="flex-1 relative z-10">
          <p className="font-medium text-sm">{notification.message}</p>
          {notification.details && (
            <p className="text-xs opacity-80 mt-1">{notification.details}</p>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className={`
            p-1 rounded-full hover:bg-white/30 transition-colors relative z-10
            ${styles.iconColor}
          `}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NotificationSystem;
