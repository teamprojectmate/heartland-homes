// src/components/Notification.jsx
import React, { useEffect, useState } from 'react';
import '../styles/components/_notifications.scss';

const Notification = ({ message, type = 'success', duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible || !message) return null;

  const notificationClass = `notification notification-${type}`;

  return (
    <div
      className={`${notificationClass} fixed-bottom-right`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span>{message}</span>
      <button className="close-btn" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
};

export default Notification;
