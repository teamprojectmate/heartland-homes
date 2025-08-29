// src/api/accommodations/accommodationService.js
import api from '../axios';

// 🔹 Пошук житла з фільтрами
export const fetchAccommodations = async (filters, pageable) => {
  const params = {
    searchParameters: {},
    pageable: {}
  };

  if (filters.city?.length) {
    params.searchParameters.city = filters.city;
  }
  if (filters.type?.length) {
    params.searchParameters.type = filters.type;
  }
  if (filters.accommodationSize?.length) {
    params.searchParameters.accommodationSize = filters.accommodationSize;
  }
  if (filters.minDailyRate != null) {
    params.searchParameters.minDailyRate = filters.minDailyRate;
  }
  if (filters.maxDailyRate != null) {
    params.searchParameters.maxDailyRate = filters.maxDailyRate;
  }

  // Передаємо параметри пагінації
  params.pageable.page = pageable.page ?? 0;
  params.pageable.size = pageable.size ?? 10;
  
  if (pageable.sort?.length) {
    params.pageable.sort = pageable.sort;
  }

  console.log('📤 Відправляю на бекенд (query params):', params);

  try {
    const response = await api.get('/accommodations/search', {
      params,
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
export const createAccommodation = async (formData) => {
  // ✅ Прибрали token і headers
  const response = await api.post('/accommodations', formData);
  return response.data;
};

// 🔹 Оновити житло
export const updateAccommodation = async (id, formData) => {
  // ✅ Прибрали token і headers
  const response = await api.put(`/accommodations/${id}`, formData);
  return response.data;
};

// 🔹 Для адміна (список без фільтрів, пагінація)
export const fetchAdminAccommodations = async (page = 0, size = 10) => {
  // ✅ Прибрали token і headers
  const response = await api.get('/accommodations', {
    params: { page, size }
  });
  return response.data;
};
