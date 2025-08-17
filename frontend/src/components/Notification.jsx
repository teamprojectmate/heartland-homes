import React, { useEffect, useState } from "react";

const Notification = ({ message, type, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';

  return (
    <div className={`alert ${alertClass} fixed-bottom-right`}>
      {message}
    </div>
  );
};

export default Notification;
