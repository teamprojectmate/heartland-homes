import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Notification from '../../components/Notification';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <p className="text-center">⏳ Перевірка доступу...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user?.role)) {
      return (
        <main className="container page">
          <h1 className="text-center">🚫 Доступ заборонено</h1>
          <p className="text-center">У вас немає дозволу на перегляд цієї сторінки.</p>
          <Notification
            message="У вас немає дозволу на перегляд цієї сторінки."
            type="danger"
          />
        </main>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
