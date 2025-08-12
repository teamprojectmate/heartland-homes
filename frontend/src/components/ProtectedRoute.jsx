import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Використовуємо useSelector, щоб отримати стан авторизації з Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Якщо користувач авторизований, показуємо дочірні маршрути
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Якщо не авторизований, перенаправляємо на сторінку входу
  return <Navigate to="/login" />;
};

export default ProtectedRoute;