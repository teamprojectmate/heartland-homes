import type { Booking, CreateBookingPayload, PaginatedResponse } from '../../types';
import api from '../axios';

export const createBooking = async (bookingData: CreateBookingPayload): Promise<Booking> => {
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

export const updateBookingStatus = async (id: number, status: string): Promise<Booking> => {
	const response = await api.put<Booking>(`/bookings/${id}`, { status });
	return response.data;
};

/** Cancel = status CANCELED (the record and its payment history stay); delete is a separate admin action. */
export const cancelBooking = async (id: number): Promise<Booking> => {
	const response = await api.put<Booking>(`/bookings/${id}`, { status: 'CANCELED' });
	return response.data;
};

export const deleteBooking = async (id: number): Promise<void> => {
	await api.delete(`/bookings/${id}`);
};

const bookingsService = {
	createBooking,
	fetchMyBookings,
	fetchBookings,
	fetchBookingById,
	updateBookingStatus,
	cancelBooking,
	deleteBooking,
};

export default bookingsService;
