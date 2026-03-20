/**
 * Нормалізація бронювання:
 * - якщо бекенд віддає booking.status → мапимо у статус
 * - якщо бронювання ще PENDING, але є оплата (PAID) → CONFIRMED
 */
export const normalizeBooking = (booking: Record<string, unknown> | null) => {
	if (!booking) return null;

	let fixedStatus = ((booking.status as string) || '').toUpperCase() || 'UNKNOWN';

	if (
		(booking.payment as Record<string, unknown>)?.status === 'PAID' &&
		fixedStatus === 'PENDING'
	) {
		fixedStatus = 'CONFIRMED';
	}

	return { ...booking, status: fixedStatus } as Record<string, unknown> & { status: string };
};
