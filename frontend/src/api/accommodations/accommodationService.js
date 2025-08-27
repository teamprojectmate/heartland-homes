// src/api/accommodations/accommodationService.js
import api from '../axios';

// 🔹 Пошук житла (користувач, з фільтрами та пагінацією)
export const fetchAccommodations = async (filters) => {
  const body = {
    searchParameters: {
      city: Array.isArray(filters.city)
        ? filters.city
        : filters.city
          ? [filters.city]
          : [],
      type: Array.isArray(filters.type)
        ? filters.type
        : filters.type
          ? [filters.type]
          : [],
      size: Array.isArray(filters.size)
        ? filters.size
        : filters.size
          ? [filters.size]
          : [],
      minDailyRate: Number.isFinite(filters.minDailyRate) ? filters.minDailyRate : 0,
      maxDailyRate: Number.isFinite(filters.maxDailyRate) ? filters.maxDailyRate : 10000
    },
    pageable: {
      page: filters.page ?? 0,
      size: filters.sizePage ?? 10,
      sort: filters.sort || [] // бекенд сам відсортує, якщо пусто
    }
  };

  const response = await api.post('/accommodations/search', body);
  return response.data;
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
