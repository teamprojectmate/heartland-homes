import type { Accommodation, PaginatedResponse } from '../../types';
import api from '../axios';

const pick = (obj: Record<string, unknown>, keys: string[]) =>
	Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

const ALLOWED_KEYS = [
	'name',
	'nameUk',
	'type',
	'location',
	'locationUk',
	'city',
	'latitude',
	'longitude',
	'size',
	'amenities',
	'dailyRate',
	'image',
];

export const fetchAccommodations = async (
	params: Record<string, unknown> = {},
): Promise<PaginatedResponse<Accommodation>> => {
	const cleanedParams = Object.fromEntries(
		Object.entries(params).filter(
			([, value]) =>
				value != null &&
				value !== '' &&
				!(typeof value === 'object' && Object.keys(value as object).length === 0),
		),
	);
	const response = await api.get<PaginatedResponse<Accommodation>>('/accommodations/search', {
		params: cleanedParams,
	});
	return response.data;
};

export const getAccommodationById = async (id: number | string): Promise<Accommodation> => {
	const response = await api.get<Accommodation>(`/accommodations/${id}`);
	return response.data;
};

export const createAccommodation = async (
	data: Record<string, unknown>,
): Promise<Accommodation> => {
	const clean = pick(data, ALLOWED_KEYS);
	const response = await api.post<Accommodation>('/accommodations', clean);
	return response.data;
};

export const updateAccommodation = async (
	id: number | string,
	data: Record<string, unknown>,
): Promise<Accommodation> => {
	const clean = pick(data, ALLOWED_KEYS);
	const response = await api.put<Accommodation>(`/accommodations/${id}`, clean);
	return response.data;
};

export const updateMyAccommodation = async (
	id: number | string,
	formData: Record<string, unknown>,
): Promise<Accommodation> => {
	const response = await api.put<Accommodation>(`/accommodations/${id}`, formData);
	return response.data;
};

export const fetchAdminAccommodations = async (
	page = 0,
	size = 10,
): Promise<PaginatedResponse<Accommodation>> => {
	const response = await api.get<PaginatedResponse<Accommodation>>('/accommodations', {
		params: { page, size },
	});
	return response.data;
};

export const fetchMyAccommodations = async (
	page = 0,
	size = 10,
): Promise<PaginatedResponse<Accommodation>> => {
	const response = await api.get<PaginatedResponse<Accommodation>>('/accommodations/me', {
		params: { page, size },
	});
	return response.data;
};

export const deleteAccommodation = async (id: number): Promise<void> => {
	await api.delete(`/accommodations/${id}`);
};

export const updateAccommodationStatus = async (
	id: number,
	status: string,
): Promise<Accommodation> => {
	const response = await api.patch<Accommodation>(`/accommodations/${id}/status`, { status });
	return response.data;
};

export const getBookedDates = async (
	accommodationId: number,
): Promise<{ checkInDate: string; checkOutDate: string }[]> => {
	const response = await api.get<{ checkInDate: string; checkOutDate: string }[]>(
		`/accommodations/${accommodationId}/booked-dates`,
	);
	return response.data;
};
