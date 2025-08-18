// src/components/ProtectedRoute.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Notification from "./Notification";

// Компонент, що захищає маршрути
// Він перевіряє, чи користувач автентифікований і має потрібну роль
// Якщо не автентифікований, перенаправляє на сторінку входу
// Якщо немає потрібної ролі, показує повідомлення
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Показуємо індикатор завантаження, поки перевіряється стан автентифікації
  if (loading) {
    return null; 
  }

  // Якщо користувач не автентифікований, перенаправляємо його на сторінку входу
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Якщо потрібна конкретна роль, перевіряємо, чи користувач її має
  if (requiredRole && user.role !== requiredRole) {
    // Якщо роль не відповідає, показуємо повідомлення про помилку і не відображаємо дочірні елементи
    return (
      <div className="container page">
        <h1 className="text-center">Доступ заборонено</h1>
        <p className="text-center">У вас немає дозволу на перегляд цієї сторінки.</p>
        <Notification message="У вас немає дозволу на перегляд цієї сторінки." type="danger" />
      </div>
    );
  }

  // Якщо всі перевірки пройдені, відображаємо дочірні елементи (маршрут)
  return children;
};

export default ProtectedRoute;
