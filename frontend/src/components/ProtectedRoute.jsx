import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Notification from './Notification';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return <p className="text-center">Перевірка доступу...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <main className="container page">
        <h1 className="text-center">Доступ заборонено</h1>
        <p className="text-center">У вас немає дозволу на перегляд цієї сторінки.</p>
        <Notification
          message="У вас немає дозволу на перегляд цієї сторінки."
          type="danger"
        />
      </main>
    );
  }

  return children;
};

export default ProtectedRoute;
