import type { Booking, PaginatedResponse } from '../../types';
import api from '../axios';

export const createBooking = async (bookingData: Record<string, unknown>): Promise<Booking> => {
	const response = await api.post<Booking>('/bookings', bookingData);
	return response.data;
};

export const fetchMyBookings = async (page = 0, size = 5): Promise<PaginatedResponse<Booking>> => {
	const response = await api.get<PaginatedResponse<Booking>>('/bookings/my', {
		params: { page, size },
	});
	return response.data;
};

export const fetchBookings = async (
	page = 0,
	size = 10,
	userId?: number,
	status?: string,
): Promise<PaginatedResponse<Booking>> => {
	const params: Record<string, string | number> = { page, size };
	if (userId) params.userId = userId;
	if (status) params.status = status;
	const response = await api.get<PaginatedResponse<Booking>>('/bookings', { params });
	return response.data;
};

export const fetchBookingById = async (id: number | string): Promise<Booking> => {
	const response = await api.get<Booking>(`/bookings/${id}`);
	return response.data;
};

export const updateBooking = async (
	id: number,
	booking: Record<string, unknown>,
): Promise<Booking> => {
	const payload = {
		checkInDate: booking.checkInDate,
		checkOutDate: booking.checkOutDate,
		accommodationId: booking.accommodationId,
		userId: booking.userId,
		status: booking.status,
	};
	const response = await api.put<Booking>(`/bookings/${id}`, payload);
	return response.data;
};

export const cancelBooking = async (id: number): Promise<void> => {
	await api.delete(`/bookings/${id}`);
};

export const deleteBooking = async (id: number): Promise<void> => {
	await api.delete(`/bookings/${id}`);
};

export const processPayment = async (bookingId: number): Promise<{ sessionUrl: string }> => {
	const response = await api.post<{ sessionUrl: string }>(`/bookings/${bookingId}/payment`);
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
