// utils/auth.js

// Отримати токен з localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Очистити токен (наприклад, при logout)
export const clearAuthToken = () => {
  localStorage.removeItem('token');
};
