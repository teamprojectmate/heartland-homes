import api from '../axios';

export const createBooking = async (bookingData: Record<string, unknown>) => {
	const response = await api.post('/bookings', bookingData);
	return response.data;
};

export const fetchMyBookings = async (page = 0, size = 5) => {
	const response = await api.get('/bookings/my', { params: { page, size } });
	return response.data;
};

export const fetchBookings = async (page = 0, size = 10, userId?: number, status?: string) => {
	const params: Record<string, string | number> = { page, size };
	if (userId) params.userId = userId;
	if (status) params.status = status;
	const response = await api.get('/bookings', { params });
	return response.data;
};

export const fetchBookingById = async (id: number | string) => {
	const response = await api.get(`/bookings/${id}`);
	return response.data;
};

export const updateBooking = async (id: number, booking: Record<string, unknown>) => {
	const payload = {
		checkInDate: booking.checkInDate,
		checkOutDate: booking.checkOutDate,
		accommodationId: booking.accommodationId,
		userId: booking.userId,
		status: booking.status,
	};
	const response = await api.put(`/bookings/${id}`, payload);
	return response.data;
};

export const cancelBooking = async (id: number) => {
	const response = await api.delete(`/bookings/${id}`);
	return response.data;
};

export const deleteBooking = async (id: number) => {
	const response = await api.delete(`/bookings/${id}`);
	return response.data;
};

export const processPayment = async (bookingId: number) => {
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
	processPayment,
};

export default bookingsService;
