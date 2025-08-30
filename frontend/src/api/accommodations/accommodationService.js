// src/api/accommodations/accommodationService.js
import api from '../axios';

// 🔹 Пошук житла з фільтрами (GET)
export const fetchAccommodations = async (filters = {}, pageable = {}) => {
  const params = {
    ...filters,
    page: pageable.page ?? 0,
    size: pageable.size ?? 10
  };

  if (pageable.sort) {
    params.sort = pageable.sort;
  }

  // 🔹 Видаляємо пусті значення
  Object.keys(params).forEach((key) => {
    if (params[key] == null || params[key] === '') {
      delete params[key];
    }
  });

  try {
    const response = await api.get('/accommodations/search', { params });
    return response.data;
  } catch (err) {
    console.error(
      '❌ Помилка при GET /accommodations/search:',
      err.response?.data || err.message
    );
    throw err;
  }
};

// 🔹 Отримати деталі житла
export const getAccommodationById = async (id) => {
  const response = await api.get(`/accommodations/${id}`);
  return response.data;
};

// 🔹 Створити житло
export const createAccommodation = async (formData) => {
  const response = await api.post('/accommodations', formData);
  return response.data;
};

// 🔹 Оновити житло
export const updateAccommodation = async (id, formData) => {
  const response = await api.put(`/accommodations/${id}`, formData);
  return response.data;
};

// 🔹 Для адміна (список без фільтрів, пагінація)
export const fetchAdminAccommodations = async (page = 0, size = 10) => {
  const response = await api.get('/accommodations', {
    params: { page, size }
  });
  return response.data;
};

// 🔹 Видалити житло (admin only)
export const deleteAccommodation = async (id) => {
  const response = await api.delete(`/accommodations/${id}`);
  return response.data;
};
