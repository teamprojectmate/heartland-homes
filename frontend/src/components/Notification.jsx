// src/components/Notification.jsx

import React, { useEffect, useState } from "react";
import "../styles/components/_notification.scss";

const Notification = ({ message, type, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const notificationClass = type === 'success' ? 'notification-success' : 'notification-danger';

  return (
    <div className={`notification ${notificationClass} fixed-bottom-right`}>
      {message}
    </div>
  );
};

export default Notification;
