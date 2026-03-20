import api from '../axios';

// Поточний користувач
export const getCurrentUser = async () => {
	const { data } = await api.get('/users/me');
	return data;
};

// Оновлення профілю
export const updateProfile = async (userData: Record<string, unknown>) => {
	const { data } = await api.put('/users/me', userData);
	return data;
};

// Список користувачів (пагінація підтримується)
export const getAllUsers = async () => {
	const response = await api.get('/users');
	return Array.isArray(response.data) ? response.data : response.data?.content || [];
};

// Оновлення ролі
export const updateUserRole = async ({ id, role }: { id: number; role: string }) => {
	const { data } = await api.put(`/users/${id}/role`, { role });
	return data;
};

// Видалення користувача
export const deleteUser = async (id: number) => {
	await api.delete(`/users/${id}`);
};
// Оновити бронювання
export const updateBooking = async (id: number, bookingData: Record<string, unknown>) => {
	const response = await api.put(`/bookings/${id}`, bookingData);
	return response.data;
};
