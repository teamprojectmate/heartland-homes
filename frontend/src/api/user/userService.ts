import type { Booking, User } from '../../types';
import api from '../axios';

export const getCurrentUser = async (): Promise<User> => {
	const { data } = await api.get<User>('/users/me');
	return data;
};

export const updateProfile = async (userData: Record<string, unknown>): Promise<User> => {
	const { data } = await api.put<User>('/users/me', userData);
	return data;
};

export const getAllUsers = async (): Promise<User[]> => {
	const response = await api.get<User[] | { content: User[] }>('/users');
	return Array.isArray(response.data) ? response.data : response.data?.content || [];
};

export const updateUserRole = async ({
	id,
	role,
}: { id: number; role: string }): Promise<User> => {
	const { data } = await api.put<User>(`/users/${id}/role`, { role });
	return data;
};

export const deleteUser = async (id: number): Promise<void> => {
	await api.delete(`/users/${id}`);
};

export const updateBooking = async (
	id: number,
	bookingData: Record<string, unknown>,
): Promise<Booking> => {
	const response = await api.put<Booking>(`/bookings/${id}`, bookingData);
	return response.data;
};
