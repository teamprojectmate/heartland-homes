import api from '../axios';

// ----- Create booking -----
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

// ----- Get my bookings (current user, with pagination) -----
export const fetchMyBookings = async (page = 0, size = 5) => {
  const response = await api.get('/bookings/my', {
    params: { page, size }
  });
  return response.data;
};

// ----- Get all bookings (admin) -----
export const fetchBookings = async (page = 0, size = 10, userId, status) => {
  const params = { page, size };
  if (userId) params.userId = userId;
  if (status) params.status = status;

  const response = await api.get('/bookings', { params });
  return response.data;
};

// ----- Get booking by ID -----
export const fetchBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// ----- Update booking -----
export const updateBooking = async (id, bookingData) => {
  const response = await api.put(`/bookings/${id}`, bookingData);
  return response.data;
};

// ----- Cancel booking (правильний DELETE) -----
export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// ----- Delete booking (admin only, теж DELETE) -----
export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

const bookingsService = {
  createBooking,
  fetchMyBookings,
  fetchBookings,
  fetchBookingById,
  updateBooking,
  cancelBooking,
  deleteBooking
};

export default bookingsService;
