import type { TFunction } from 'i18next';

// Booking status config (className only, text via i18n)
const bookingStatusKeys = {
	PENDING: { i18nKey: 'status.pendingConfirmation', className: 'badge-status-pending' },
	CONFIRMED: { i18nKey: 'status.confirmed', className: 'badge-status-confirmed' },
	CANCELED: { i18nKey: 'status.cancelled', className: 'badge-status-canceled' },
	EXPIRED: { i18nKey: 'status.expired', className: 'badge-status-expired' },
};

// Accommodation status config
const accommodationStatusKeys = {
	REQUIRES_VERIFICATION: {
		i18nKey: 'status.requiresVerification',
		className: 'badge-status-requires-verification',
	},
	PERMITTED: { i18nKey: 'status.permitted', className: 'badge-status-permitted' },
	REJECTED: { i18nKey: 'status.rejected', className: 'badge-status-rejected' },
};

// Payment status config
const paymentStatusKeys = {
	PENDING: { i18nKey: 'status.awaitingPayment', className: 'badge-status-pending' },
	PAID: { i18nKey: 'status.paid', className: 'badge-status-paid' },
	FAILED: { i18nKey: 'status.failed', className: 'badge-status-failed' },
};

// Combined config
const allStatusKeys = {
	...bookingStatusKeys,
	...accommodationStatusKeys,
	...paymentStatusKeys,
};

// Admin booking status config
const adminBookingStatusKeys = {
	PENDING: { i18nKey: 'status.pendingConfirmation', className: 'badge-status-pending' },
	CONFIRMED: { i18nKey: 'status.confirmed', className: 'badge-status-confirmed' },
};

// Resolved label helpers that accept t function
export const getBookingStatusLabels = (t: TFunction) =>
	Object.fromEntries(
		Object.entries(bookingStatusKeys).map(([key, val]) => [
			key,
			{ text: t(val.i18nKey), className: val.className },
		]),
	);

export const getAccommodationStatusLabels = (t: TFunction) =>
	Object.fromEntries(
		Object.entries(accommodationStatusKeys).map(([key, val]) => [
			key,
			{ text: t(val.i18nKey), className: val.className },
		]),
	);

export const getPaymentStatusLabels = (t: TFunction) =>
	Object.fromEntries(
		Object.entries(paymentStatusKeys).map(([key, val]) => [
			key,
			{ text: t(val.i18nKey), className: val.className },
		]),
	);

export const getAdminBookingStatusLabels = (t: TFunction) =>
	Object.fromEntries(
		Object.entries(adminBookingStatusKeys).map(([key, val]) => [
			key,
			{ text: t(val.i18nKey), className: val.className },
		]),
	);

export const getStatusLabel = (status: string, t: TFunction) => {
	const config = (allStatusKeys as Record<string, { i18nKey: string; className: string }>)[status];
	if (!config) return { text: status, className: 'badge-status-unknown' };
	return { text: t(config.i18nKey), className: config.className };
};
