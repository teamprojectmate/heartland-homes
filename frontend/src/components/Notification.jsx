import React, { useEffect, useState } from 'react';
import '../styles/components/_notification.scss';

const Notification = ({ message, type = 'success', duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const notificationClass =
    type === 'success' ? 'notification-success' : 'notification-danger';

  return (
    <div
      className={`notification ${notificationClass} fixed-bottom-right`}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button className="close-btn" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
};

export default Notification;
