import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Поки дані завантажуються, можна показати порожню сторінку або завантажувач
  if (loading) {
    return null; // або <p>Завантаження...</p>
  }

  // Перевіряємо, чи користувач аутентифікований
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Якщо потрібна роль вказана, перевіряємо, чи користувач її має
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Якщо всі перевірки пройдені, відображаємо дочірні маршрути
  return <Outlet />;
};

export default ProtectedRoute;
