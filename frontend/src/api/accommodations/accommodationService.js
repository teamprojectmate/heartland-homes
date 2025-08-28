// src/api/accommodations/accommodationService.js
import api from '../axios';

export const fetchAccommodations = async (filters) => {
  let params = {
    city: filters.city?.length ? filters.city.map((c) => c.trim()) : undefined,
    type: filters.type?.length
      ? filters.type.map((t) => t.trim().toUpperCase())
      : undefined,
    size: filters.size?.length
      ? filters.size.map((s) => s.trim().toUpperCase())
      : undefined,
    minDailyRate: filters.minDailyRate || undefined,
    maxDailyRate: filters.maxDailyRate || undefined,
    page: filters.page ?? 0,
    size: filters.sizePage ?? 10,
    sort: filters.sort || []
  };

  // 🔹 Видаляємо пусті ключі
  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === null) {
      delete params[key];
    }
  });

  console.log('📤 Відправляю на бекенд (query params):', params);

  try {
    const response = await api.get('/accommodations/search', { params });
    return response.data;
  } catch (err) {
    console.error(
      '❌ Помилка при запиті /accommodations/search:',
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
export const createAccommodation = async (formData, token) => {
  const response = await api.post('/accommodations', formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 🔹 Оновити житло
export const updateAccommodation = async (id, formData, token) => {
  const response = await api.put(`/accommodations/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 🔹 Для адміна (список без фільтрів, пагінація)
export const fetchAdminAccommodations = async (token, page = 0, size = 10) => {
  const response = await api.get('/accommodations', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, size }
  });
  return response.data;
};
