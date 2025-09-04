import api from '../axios';

// ----- Створити бронювання -----
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

// ----- Отримати мої бронювання (поточний користувач, з пагінацією) -----
export const fetchMyBookings = async (page = 0, size = 5) => {
  const response = await api.get('/bookings/my', {
    params: { page, size }
  });
  return response.data;
};

// ----- Отримати всі бронювання (адмін) -----
export const fetchBookings = async (page = 0, size = 10, userId, status) => {
  const params = { page, size };
  if (userId) params.userId = userId;
  if (status) params.status = status;

  const response = await api.get('/bookings', { params });
  return response.data;
};

// ----- Отримати бронювання за ID -----
export const fetchBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// ----- Оновити бронювання -----
export const updateBooking = async (id, booking) => {
  const payload = {
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    accommodationId: booking.accommodationId,
    userId: booking.userId,
    status: booking.status
  };

  console.log('📤 PUT /bookings payload:', payload);

  const response = await api.put(`/bookings/${id}`, payload);

  console.log('✅ PUT /bookings response:', response.data);

  return response.data;
};

// ----- Скасувати бронювання (правильний DELETE) -----
export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// ----- Видалити бронювання (тільки адмін, теж DELETE) -----
export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// ✅ НОВЕ: Обробка платежу за бронювання
export const processPayment = async (bookingId) => {
  const response = await api.post(`/bookings/${bookingId}/payment`);
  return response.data;
};

const bookingsService = {
  createBooking,
  fetchMyBookings,
  fetchBookings,
  fetchBookingById,
  updateBooking,
  cancelBooking,
  deleteBooking,
  processPayment
};

export default bookingsService;
