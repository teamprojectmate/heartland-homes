//src/api/user/userService.js
import axios from './axios';

// 🔹 Отримати свій профіль
export const getCurrentUser = async (token) => {
  const response = await axios.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 🔹 Оновити свій профіль
export const updateProfile = async (data, token) => {
  const response = await axios.put('/users/me', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 🔹 Оновити роль юзера (для адмінки)
export const updateUserRole = async (id, role, token) => {
  const response = await axios.put(
    `/users/${id}/role`,
    { role },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};
