// src/components/PageWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PageWrapper = ({ title, children }) => {
  const errors = [
    useSelector((s) => s.auth.error),
    useSelector((s) => s.user.error),
    useSelector((s) => s.bookings.error),
    useSelector((s) => s.accommodations.error),
    useSelector((s) => s.payments.error)
  ].filter(Boolean);

  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let interval;
    if (errors.length > 0) {
      interval = setInterval(() => setBlink((p) => !p), 1500);
    }
    return () => clearInterval(interval);
  }, [errors]);

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");

    if (errors.length > 0) {
      // змінюємо заголовок
      document.title = blink
        ? `⚠️ Помилка: ${errors[0]}`
        : title
          ? `${title} | Heartland Homes`
          : 'Heartland Homes';

      // змінюємо favicon
      if (favicon) {
        favicon.href = blink ? '/favicon-error.ico' : '/favicon.ico';
      }
    } else {
      document.title = title ? `${title} | Heartland Homes` : 'Heartland Homes';
      if (favicon) favicon.href = '/favicon.ico';
    }
  }, [blink, errors, title]);

  return <>{children}</>;
};

export default PageWrapper;
