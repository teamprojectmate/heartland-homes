// src/api/accommodations/accommodationService.js
import api from '../axios';

export const fetchAccommodations = async (filters) => {
  const params = {
    'searchParameters.city': filters.city?.length ? JSON.stringify(filters.city.map((c) => c.trim())) : undefined,
    'searchParameters.type': filters.type?.length ? JSON.stringify(filters.type.map((t) => t.trim().toUpperCase())) : undefined,
    'searchParameters.size': filters.size?.length ? JSON.stringify(filters.size.map((s) => s.trim().toUpperCase())) : undefined,
    'searchParameters.minDailyRate': filters.minDailyRate ?? undefined,
    'searchParameters.maxDailyRate': filters.maxDailyRate ?? undefined,

    'pageable.page': filters.page ?? 0,
    'pageable.size': filters.sizePage ?? 10,
    'pageable.sort': filters.sort?.length ? JSON.stringify(filters.sort) : undefined
  };

  // 🔹 Видаляємо пусті ключі
  Object.keys(params).forEach((key) => {
    if (
      params[key] === undefined ||
      params[key] === null ||
      (Array.isArray(params[key]) && params[key].length === 0)
    ) {
      delete params[key];
    }
  });

  console.log('📤 Відправляю на бекенд (query params):', params);

  try {
    const response = await api.get('/accommodations/search', { params });
    console.log('✅ Відповідь від бекенду:', response.data);
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
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 🔹 Оновити житло
export const updateAccommodation = async (id, formData, token) => {
  const response = await api.put(`/accommodations/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 🔹 Для адміна (список без фільтрів, пагінація)
export const fetchAdminAccommodations = async (token, page = 0, size = 10) => {
  const response = await api.get('/accommodations', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, size },
  });
  return response.data;
};