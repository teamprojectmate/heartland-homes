import type { RootState } from '../store';

export const selectPaymentByBookingId = (state: RootState, bookingId: number) => {
	return state.payments.payments.find((p: Record<string, unknown>) => p.bookingId === bookingId);
};
