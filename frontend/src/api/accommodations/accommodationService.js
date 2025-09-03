import api from '../axios';

// 🔹 Пошук житла з фільтрами (GET)
// Тепер приймає один об'єкт з усіма параметрами для кращої читабельності
export const fetchAccommodations = async (params = {}) => {
  // Видаляємо пусті значення та об'єкти з params
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([key, value]) =>
        value != null &&
        value !== '' &&
        !(typeof value === 'object' && Object.keys(value).length === 0)
    )
  );

  try {
    // Відправляємо параметри як query-параметри
    const response = await api.get('/accommodations/search', {
      params: cleanedParams
    });
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
    params: {
      page,
      size
    }
  });
  return response.data;
};

// 🔹 Видалити житло (admin only)
export const deleteAccommodation = async (id) => {
  const response = await api.delete(`/accommodations/${id}`);
  return response.data;
};
