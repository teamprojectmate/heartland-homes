// src/api/accommodations/accommodationService.js
import api from '../axios';

// 🔹 Пошук житла з фільтрами
export const fetchAccommodations = async (filters) => {
  const params = {};

  if (filters.city?.length) {
    params.city = filters.city;
  }
  if (filters.type?.length) {
    params.type = filters.type;
  }
  if (filters.accommodationSize?.length) {
    params.accommodationSize = filters.accommodationSize;
  }
  if (filters.minDailyRate != null) {
    params.minDailyRate = filters.minDailyRate;
  }
  if (filters.maxDailyRate != null) {
    params.maxDailyRate = filters.maxDailyRate;
  }

  params.page = filters.page ?? 0;
  params.size = filters.size ?? 10;

  console.log('📤 Відправляю на бекенд (query params):', params);

  try {
    const response = await api.get('/accommodations/search', {
      params,
      paramsSerializer: (p) =>
        Object.entries(p)
          .map(([key, value]) =>
            Array.isArray(value)
              ? value.map((v) => `${key}=${encodeURIComponent(v)}`).join('&')
              : `${key}=${encodeURIComponent(value)}`
          )
          .join('&')
    });

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
