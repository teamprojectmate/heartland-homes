import api from '../axios';

// 🔹 Отримати список помешкань (з фільтрами + пагінацією)
export const fetchAccommodations = async ({
  city = [],
  types = [],
  sizes = [],
  minDailyRate = null,
  maxDailyRate = null,
  page = 0,
  size = 10,
  sort = ['dailyRate,asc']
}) => {
  const requestBody = {
    searchParameters: {
      city,
      type: types,
      size: sizes,
      minDailyRate,
      maxDailyRate
    },
    pageable: {
      page,
      size,
      sort
    }
  };

  const response = await api.post('/accommodations/search', requestBody);
  return response.data;
};

// 🔹 Отримати деталі помешкання
export const getAccommodationById = async (id) => {
  const response = await api.get(`/accommodations/${id}`);
  return response.data;
};

// 🔹 Створити нове помешкання
export const createAccommodation = async (formData, token) => {
  const response = await api.post('/accommodations', formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 🔹 Оновити помешкання
export const updateAccommodation = async (id, formData, token) => {
  const response = await api.put(`/accommodations/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 🔹 Отримати список для адміна (без фільтрів, із пагінацією)
export const fetchAdminAccommodations = async (token, page = 0, size = 10) => {
  const response = await api.get('/accommodations', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, size }
  });
  return response.data;
};
