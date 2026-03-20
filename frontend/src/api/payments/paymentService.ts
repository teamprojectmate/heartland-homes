import type { PaginatedResponse, Payment } from '../../types';
import api from '../axios';

export const createPayment = async (
	bookingId: number,
	paymentType = 'PAYMENT',
): Promise<Payment> => {
	const response = await api.post<Payment>('/payments', { bookingId, paymentType });
	return response.data;
};

export const fetchPaymentsByUser = async (
	userId: number,
	pageable: Record<string, unknown>,
): Promise<PaginatedResponse<Payment>> => {
	const response = await api.get<PaginatedResponse<Payment>>('/payments', {
		params: { userId, ...pageable },
	});
	return response.data;
};

// Backend uses GET for cancel — REST anti-pattern, not fixable on FE side
export const cancelPayment = async (paymentId: number): Promise<Payment> => {
	const response = await api.get<Payment>('/payments/cancel', { params: { id: paymentId } });
	return response.data;
};

export const getAllPaymentsService = async (
	pageable: Record<string, unknown>,
): Promise<PaginatedResponse<Payment>> => {
	const response = await api.get<PaginatedResponse<Payment>>('/payments', { params: pageable });
	return response.data;
};

export default {
	createPayment,
	fetchPaymentsByUser,
	cancelPayment,
	getAllPaymentsService,
};
