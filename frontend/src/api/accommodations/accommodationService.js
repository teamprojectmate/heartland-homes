import axios from '../axios';

// 🔹 Отримати список помешкань (з фільтрами + пагінацією)
export const fetchAccommodations = async ({
  city,
  types,
  sizes,
  minDailyRate,
  maxDailyRate,
  page = 0,
  size = 10,
  sort = ['dailyRate,asc']
}) => {
  const requestBody = {
    searchParameters: {
      city: city ? [city] : [],
      type: types || [],
      size: sizes || [],
      minDailyRate: minDailyRate ? Number(minDailyRate) : null,
      maxDailyRate: maxDailyRate ? Number(maxDailyRate) : null
    },
    pageable: {
      page,
      size,
      sort
    }
  };

  const response = await axios.post('/accommodations/search', requestBody);
  return response.data;
};

// 🔹 Отримати деталі помешкання
export const getAccommodationById = async (id) => {
  const response = await axios.get(`/accommodations/${id}`);
  return response.data;
};

// 🔹 Створити нове помешкання
export const createAccommodation = async (formData, token) => {
  const response = await axios.post('/accommodations', formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 🔹 Оновити помешкання
export const updateAccommodation = async (id, formData, token) => {
  const response = await axios.put(`/accommodations/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 🔹 Отримати список для адміна (без фільтрів, із пагінацією)
export const fetchAdminAccommodations = async (token, page = 0, size = 10) => {
  const response = await axios.get('/accommodations', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, size }
  });
  return response.data;
};
