import api from '../axios';

const pick = (obj: Record<string, unknown>, keys: string[]) =>
	Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

const ALLOWED_KEYS = [
	'name',
	'type',
	'location',
	'city',
	'latitude',
	'longitude',
	'size',
	'amenities',
	'dailyRate',
	'image',
];

export const fetchAccommodations = async (params: Record<string, unknown> = {}) => {
	const cleanedParams = Object.fromEntries(
		Object.entries(params).filter(
			([, value]) =>
				value != null &&
				value !== '' &&
				!(typeof value === 'object' && Object.keys(value as object).length === 0),
		),
	);
	const response = await api.get('/accommodations/search', { params: cleanedParams });
	return response.data;
};

export const getAccommodationById = async (id: number | string) => {
	const response = await api.get(`/accommodations/${id}`);
	return response.data;
};

export const createAccommodation = async (data: Record<string, unknown>) => {
	const clean = pick(data, ALLOWED_KEYS);
	const response = await api.post('/accommodations', clean);
	return response.data;
};

export const updateAccommodation = async (id: number | string, data: Record<string, unknown>) => {
	const clean = pick(data, ALLOWED_KEYS);
	const response = await api.put(`/accommodations/${id}`, clean);
	return response.data;
};

export const updateMyAccommodation = async (
	id: number | string,
	formData: Record<string, unknown>,
) => {
	return api.put(`/accommodations/${id}`, formData);
};

export const fetchAdminAccommodations = async (page = 0, size = 10) => {
	const response = await api.get('/accommodations', { params: { page, size } });
	return response.data;
};

export const fetchMyAccommodations = async (page = 0, size = 10) => {
	const response = await api.get('/accommodations/me', { params: { page, size } });
	return response.data;
};

export const deleteAccommodation = async (id: number) => {
	const response = await api.delete(`/accommodations/${id}`);
	return response.data;
};

export const updateAccommodationStatus = async (id: number, status: string) => {
	const response = await api.patch(`/accommodations/${id}/status`, { status });
	return response.data;
};
