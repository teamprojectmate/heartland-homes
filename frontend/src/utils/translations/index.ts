import type { TFunction } from 'i18next';
import { colors } from '../colors';

// Pick localized field based on current language
export const localized = (en: string | undefined, uk: string | undefined, lang: string): string => {
	if (lang === 'uk' && uk) return uk;
	return en ?? '';
};

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

// City config with i18n keys
const cityKeys: Record<string, { i18nKey: string }> = {
	kyiv: { i18nKey: 'cities.kyiv' },
	lviv: { i18nKey: 'cities.lviv' },
	odesa: { i18nKey: 'cities.odesa' },
	bukovel: { i18nKey: 'cities.bukovel' },
	dnipro: { i18nKey: 'cities.dnipro' },
	kharkiv: { i18nKey: 'cities.kharkiv' },
};

// Map city name with i18n
export const mapCity = (city: string | undefined, t?: TFunction): string => {
	if (!city) return '';
	const config = cityKeys[city.toLowerCase()];
	if (config && t) return t(config.i18nKey);
	return city;
};

// Amenities config with i18n keys
type AmenityConfig = {
	i18nKey: string;
	icon: string;
	slug: string;
	color: string;
	aliases: string[];
};

const amenityKeys: Record<string, AmenityConfig> = {
	wifi: {
		i18nKey: 'amenity.wifi',
		icon: '📶',
		slug: 'wifi',
		color: colors.badge.wifi,
		aliases: ['wi-fi', 'wifi', 'вайфай'],
	},
	kitchen: {
		i18nKey: 'amenity.kitchen',
		icon: '🍳',
		slug: 'kitchen',
		color: colors.badge.kitchen,
		aliases: ['кухня', 'kitchen'],
	},
	ac: {
		i18nKey: 'amenity.airConditioning',
		icon: '❄️',
		slug: 'ac',
		color: colors.badge.ac,
		aliases: ['кондиціонер', 'air conditioning', 'air conditioner', 'ac'],
	},
	parking: {
		i18nKey: 'amenity.parking',
		icon: '🅿️',
		slug: 'parking',
		color: colors.badge.parking,
		aliases: ['парковка', 'parking'],
	},
	washer: {
		i18nKey: 'amenity.washingMachine',
		icon: '🧺',
		slug: 'washer',
		color: colors.badge.washer,
		aliases: ['пральна машина', 'washing machine', 'washer'],
	},
	pool: {
		i18nKey: 'amenity.pool',
		icon: '🏊',
		slug: 'pool',
		color: colors.badge.other,
		aliases: ['басейн', 'pool'],
	},
	spa: {
		i18nKey: 'amenity.spa',
		icon: '💆',
		slug: 'spa',
		color: colors.badge.other,
		aliases: ['спа', 'spa'],
	},
	restaurant: {
		i18nKey: 'amenity.restaurant',
		icon: '🍽️',
		slug: 'restaurant',
		color: colors.badge.other,
		aliases: ['ресторан', 'restaurant'],
	},
	roomService: {
		i18nKey: 'amenity.roomService',
		icon: '🛎️',
		slug: 'room-service',
		color: colors.badge.other,
		aliases: ['обслуговування номерів', 'room service'],
	},
	gym: {
		i18nKey: 'amenity.gym',
		icon: '💪',
		slug: 'gym',
		color: colors.badge.other,
		aliases: ['спортзал', 'gym'],
	},
	garden: {
		i18nKey: 'amenity.garden',
		icon: '🌿',
		slug: 'garden',
		color: colors.badge.other,
		aliases: ['сад', 'garden'],
	},
	bbq: {
		i18nKey: 'amenity.bbq',
		icon: '🔥',
		slug: 'bbq',
		color: colors.badge.other,
		aliases: ['мангал', 'bbq'],
	},
	sharedKitchen: {
		i18nKey: 'amenity.sharedKitchen',
		icon: '🍳',
		slug: 'shared-kitchen',
		color: colors.badge.kitchen,
		aliases: ['спільна кухня', 'shared kitchen'],
	},
	laundry: {
		i18nKey: 'amenity.laundry',
		icon: '🧺',
		slug: 'laundry',
		color: colors.badge.washer,
		aliases: ['пральня', 'laundry'],
	},
	balcony: {
		i18nKey: 'amenity.balcony',
		icon: '🌅',
		slug: 'balcony',
		color: colors.badge.other,
		aliases: ['балкон', 'balcony'],
	},
	riverView: {
		i18nKey: 'amenity.riverView',
		icon: '🏞️',
		slug: 'river-view',
		color: colors.badge.other,
		aliases: ['вид на річку', 'river view'],
	},
	cityCenter: {
		i18nKey: 'amenity.cityCenter',
		icon: '🏙️',
		slug: 'city-center',
		color: colors.badge.other,
		aliases: ['центр міста', 'city center'],
	},
	terrace: {
		i18nKey: 'amenity.terrace',
		icon: '🪴',
		slug: 'terrace',
		color: colors.badge.other,
		aliases: ['тераса', 'terrace'],
	},
	panoramicView: {
		i18nKey: 'amenity.panoramicView',
		icon: '🌄',
		slug: 'panoramic-view',
		color: colors.badge.other,
		aliases: ['панорамний вид', 'panoramic view'],
	},
	historicCenter: {
		i18nKey: 'amenity.historicCenter',
		icon: '🏛️',
		slug: 'historic-center',
		color: colors.badge.other,
		aliases: ['історичний центр', 'historic center'],
	},
	fireplace: {
		i18nKey: 'amenity.fireplace',
		icon: '🔥',
		slug: 'fireplace',
		color: colors.badge.other,
		aliases: ['камін', 'fireplace'],
	},
	forestView: {
		i18nKey: 'amenity.forestView',
		icon: '🌲',
		slug: 'forest-view',
		color: colors.badge.other,
		aliases: ['вид на ліс', 'forest view'],
	},
	concierge: {
		i18nKey: 'amenity.concierge',
		icon: '🧑‍💼',
		slug: 'concierge',
		color: colors.badge.other,
		aliases: ['консьєрж', 'concierge'],
	},
	lounge: {
		i18nKey: 'amenity.lounge',
		icon: '🛋️',
		slug: 'lounge',
		color: colors.badge.other,
		aliases: ['лаунж', 'lounge'],
	},
	sauna: {
		i18nKey: 'amenity.sauna',
		icon: '🧖',
		slug: 'sauna',
		color: colors.badge.other,
		aliases: ['сауна', 'sauna'],
	},
	seaView: {
		i18nKey: 'amenity.seaView',
		icon: '🌊',
		slug: 'sea-view',
		color: colors.badge.other,
		aliases: ['вид на море', 'sea view'],
	},
	beachAccess: {
		i18nKey: 'amenity.beachAccess',
		icon: '🏖️',
		slug: 'beach-access',
		color: colors.badge.other,
		aliases: ['доступ до пляжу', 'beach access'],
	},
	skiStorage: {
		i18nKey: 'amenity.skiStorage',
		icon: '🎿',
		slug: 'ski-storage',
		color: colors.badge.other,
		aliases: ['лижне сховище', 'ski storage'],
	},
	mountainView: {
		i18nKey: 'amenity.mountainView',
		icon: '🏔️',
		slug: 'mountain-view',
		color: colors.badge.other,
		aliases: ['вид на гори', 'mountain view'],
	},
	hikingTrails: {
		i18nKey: 'amenity.hikingTrails',
		icon: '🥾',
		slug: 'hiking-trails',
		color: colors.badge.other,
		aliases: ['туристичні маршрути', 'hiking trails'],
	},
	shuttle: {
		i18nKey: 'amenity.shuttle',
		icon: '🚐',
		slug: 'shuttle',
		color: colors.badge.other,
		aliases: ['трансфер', 'shuttle'],
	},
	smartTv: {
		i18nKey: 'amenity.smartTv',
		icon: '📺',
		slug: 'smart-tv',
		color: colors.badge.other,
		aliases: ['smart tv'],
	},
};

// Keep amenityTranslations for backward compat
export const amenityTranslations = amenityKeys;

// Map amenity with i18n
export const mapAmenity = (slug = '', t?: TFunction) => {
	const lower = slug.toLowerCase();
	for (const key in amenityKeys) {
		const config = amenityKeys[key];
		const wordBoundary = (text: string, term: string) => {
			const i = text.indexOf(term);
			if (i === -1) return false;
			const before = i === 0 || /\W/.test(text[i - 1]);
			const after = i + term.length >= text.length || /\W/.test(text[i + term.length]);
			return before && after;
		};
		if (
			config.aliases.some((alias) =>
				alias.length <= 2 ? lower === alias : wordBoundary(lower, alias),
			)
		) {
			return {
				label: t ? t(config.i18nKey) : slug,
				icon: config.icon,
				slug: config.slug,
				color: config.color,
			};
		}
	}
	return { label: slug, icon: '❔', slug: 'other', color: colors.badge.other };
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
