// src/api/user/userService.js
import api from '../axios';

// Поточний користувач
export const getCurrentUser = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

// Оновлення профілю
export const updateProfile = async (userData) => {
  const { data } = await api.put('/users/me', userData);
  return data;
};

// Список користувачів ✅
export const getAllUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

// Оновлення ролі
export const updateUserRole = async ({ id, role }) => {
  const { data } = await api.put(`/users/${id}/role`, { role });
  return data;
};

// Видалення користувача
export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};
