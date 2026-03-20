import type { TFunction } from 'i18next';
import { colors } from '../colors';

// Accommodation type config with i18n keys
const typeKeys = {
	HOUSE: { i18nKey: 'accommodationType.house', icon: '🏠', color: colors.badge.house },
	APARTMENT: {
		i18nKey: 'accommodationType.apartment',
		icon: '🏢',
		color: colors.badge.apartment,
	},
	HOTEL: { i18nKey: 'accommodationType.hotel', icon: '🏨', color: colors.badge.hotel },
	VACATION_HOME: {
		i18nKey: 'accommodationType.vacationHome',
		icon: '🌴',
		color: colors.badge.vacationHome,
	},
	HOSTEL: { i18nKey: 'accommodationType.hostel', icon: '🛏️', color: colors.badge.hostel },
	COTTAGE: { i18nKey: 'accommodationType.cottage', icon: '🏡', color: colors.badge.cottage },
};

// Get translated type translations
export const getTypeTranslations = (t: TFunction) =>
	Object.fromEntries(
		Object.entries(typeKeys).map(([key, val]) => [
			key,
			{ label: t(val.i18nKey), icon: val.icon, color: val.color },
		]),
	);

// Keep typeTranslations as a static config for non-hook contexts (returns i18n keys)
export const typeTranslations = typeKeys;

// Map type with i18n
export const mapType = (type: string, t: TFunction) => {
	if (!type) return { label: t('accommodationType.unknown'), icon: '❓', color: '#ccc' };
	const key = type.toUpperCase();
	const config = (typeKeys as Record<string, { i18nKey: string; icon: string; color: string }>)[
		key
	];
	if (!config) return { label: type, icon: '❓', color: '#ccc' };
	return { label: t(config.i18nKey), icon: config.icon, color: config.color };
};

// Amenities config
const amenityKeys = {
	wifi: {
		i18nKey: 'wifi',
		label: 'Wi-Fi',
		icon: '📶',
		slug: 'wifi',
		color: colors.badge.wifi,
		aliases: ['wi-fi', 'wifi', 'вайфай'],
	},
	kitchen: {
		i18nKey: 'kitchen',
		label: 'Кухня',
		icon: '🍳',
		slug: 'kitchen',
		color: colors.badge.kitchen,
		aliases: ['кухня', 'kitchen'],
	},
	ac: {
		i18nKey: 'ac',
		label: 'Кондиціонер',
		icon: '❄️',
		slug: 'ac',
		color: colors.badge.ac,
		aliases: ['кондиціонер', 'air conditioner', 'ac'],
	},
	parking: {
		i18nKey: 'parking',
		label: 'Парковка',
		icon: '🅿️',
		slug: 'parking',
		color: colors.badge.parking,
		aliases: ['парковка', 'parking'],
	},
	washer: {
		i18nKey: 'washer',
		label: 'Пральна машина',
		icon: '🧺',
		slug: 'washer',
		color: colors.badge.washer,
		aliases: ['пральна машина', 'washer', 'laundry'],
	},
};

// Keep amenityTranslations for backward compat
export const amenityTranslations = amenityKeys;

// Map amenity (amenities are data-driven labels, keep as-is for now)
export const mapAmenity = (slug = '') => {
	const lower = slug.toLowerCase();
	for (const key in amenityKeys) {
		const {
			aliases,
			i18nKey: _i18nKey,
			...rest
		} = (
			amenityKeys as Record<
				string,
				{
					label: string;
					icon: string;
					slug: string;
					color: string;
					aliases: string[];
					i18nKey: string;
				}
			>
		)[key];
		if (aliases.some((alias: string) => lower.includes(alias))) {
			return rest;
		}
	}
	return { label: slug || 'Other', icon: '❔', slug: 'other', color: colors.badge.other };
};

// Status config with i18n keys
const statusKeys = {
	PENDING: { i18nKey: 'status.pending', color: colors.warning, slug: 'pending' },
	PAID: { i18nKey: 'status.paid', color: colors.success, slug: 'paid' },
	CONFIRMED: { i18nKey: 'status.confirmed', color: colors.success, slug: 'confirmed' },
	CANCELED: { i18nKey: 'status.cancelled', color: colors.danger, slug: 'canceled' },
	EXPIRED: { i18nKey: 'status.expired', color: colors.gray400, slug: 'expired' },
	REQUIRES_VERIFICATION: {
		i18nKey: 'status.requiresVerification',
		color: colors.warning,
		slug: 'requires-verification',
	},
	PERMITTED: { i18nKey: 'status.permitted', color: colors.success, slug: 'permitted' },
	REJECTED: { i18nKey: 'status.rejected', color: colors.danger, slug: 'rejected' },
};

// Keep statusTranslations for backward compat
export const statusTranslations = statusKeys;

// Map status with i18n
export const mapStatus = (status = '', t?: TFunction) => {
	const key = status.toUpperCase();
	const config = (statusKeys as Record<string, { i18nKey: string; color: string; slug: string }>)[
		key
	];
	if (!config) {
		return {
			label: t ? t('status.unknown') : status || 'Unknown',
			color: colors.gray400,
			slug: 'unknown',
		};
	}
	return {
		label: t ? t(config.i18nKey) : config.i18nKey,
		color: config.color,
		slug: config.slug,
	};
};

// Payment type config with i18n keys
const paymentTypeKeys = {
	PAYMENT: { i18nKey: 'status.paymentLabel', slug: 'payment', icon: '💳' },
	REFUND: { i18nKey: 'status.refundLabel', slug: 'refund', icon: '↩️' },
};

// Keep paymentTypeTranslations for backward compat
export const paymentTypeTranslations = paymentTypeKeys;

// Map payment type with i18n
export const mapPaymentType = (type = '', t?: TFunction) => {
	const key = type.toUpperCase();
	const config = (
		paymentTypeKeys as Record<string, { i18nKey: string; slug: string; icon: string }>
	)[key];
	if (!config) {
		return {
			label: t ? t('status.unknown') : type || 'Unknown',
			slug: 'unknown',
			icon: '❔',
		};
	}
	return {
		label: t ? t(config.i18nKey) : config.i18nKey,
		slug: config.slug,
		icon: config.icon,
	};
};
