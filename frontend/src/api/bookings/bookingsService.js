import api from '../axios';

const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

const fetchMyBookings = async (page, size) => {
  const response = await api.get('/bookings/my', { params: { page, size } });
  return response.data;
};

const fetchBookings = async (page, size, userId, status) => {
  const response = await api.get('/bookings', {
    params: { page, size, user_id: userId, status },
  });
  return response.data;
};

const fetchBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

const updateBooking = async (id, bookingData) => {
  const response = await api.put(`/bookings/${id}`, bookingData);
  return response.data;
};

const cancelBooking = async (id) => {
  await api.delete(`/bookings/${id}`);
  return id;
};

const bookingsService = {
  createBooking,
  fetchMyBookings,
  fetchBookings,
  fetchBookingById,
  updateBooking,
  cancelBooking,
};

export default bookingsService;
