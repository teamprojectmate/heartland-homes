/**
 * Нормалізація бронювання:
 * - якщо бекенд віддає booking.status → мапимо у статус
 * - якщо бронювання ще PENDING, але є оплата (PAID) → CONFIRMED
 */
export const normalizeBooking = (booking: Record<string, unknown> | null) => {
	if (!booking) return null;

	//  Нормалізуємо статус
	let fixedStatus = ((booking.status as string) || '').toUpperCase() || 'UNKNOWN';

	//  Автопідтвердження, якщо вже оплачено
	if (
		(booking.payment as Record<string, unknown>)?.status === 'PAID' &&
		fixedStatus === 'PENDING'
	) {
		fixedStatus = 'CONFIRMED';
	}

	return { ...booking, status: fixedStatus } as Record<string, unknown> & { status: string };
};
