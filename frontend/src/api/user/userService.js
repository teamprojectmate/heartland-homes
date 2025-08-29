import api from '../axios';

// 🔹 Отримати свій профіль
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// 🔹 Оновити свій профіль
export const updateProfile = async (data) => {
  const response = await api.put('/users/me', data);
  return response.data;
};

// 🔹 Оновити роль юзера (для адмінки)
export const updateUserRole = async (id, role) => {
  const response = await api.put(
    `/users/${id}/role`,
    { role }
  );
  return response.data;
};
