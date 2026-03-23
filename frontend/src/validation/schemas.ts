import { z } from 'zod';

// Validation messages use i18n keys — translated via t() in form components
const V = {
	emailRequired: 'validation.emailRequired',
	emailInvalid: 'validation.emailInvalid',
	passwordMin: 'validation.passwordMin',
	firstNameMin: 'validation.firstNameMin',
	lastNameMin: 'validation.lastNameMin',
	confirmPassword: 'validation.confirmPassword',
	passwordsNoMatch: 'validation.passwordsNoMatch',
	nameRequired: 'validation.nameRequired',
	typeRequired: 'validation.typeRequired',
	cityRequired: 'validation.cityRequired',
	dailyRateRequired: 'validation.dailyRateRequired',
	dailyRatePositive: 'validation.dailyRatePositive',
	checkInRequired: 'validation.checkInRequired',
	checkOutRequired: 'validation.checkOutRequired',
	checkOutAfterCheckIn: 'validation.checkOutAfterCheckIn',
	firstNameRequired: 'validation.firstNameRequired',
	lastNameRequired: 'validation.lastNameRequired',
	amenitiesRequired: 'validation.amenitiesRequired',
} as const;

// ── Login ──
export const loginSchema = z.object({
	email: z.string().min(1, V.emailRequired).email(V.emailInvalid),
	password: z.string().min(6, V.passwordMin),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ── Register ──
export const registerSchema = z
	.object({
		firstName: z.string().min(2, V.firstNameMin),
		lastName: z.string().min(2, V.lastNameMin),
		email: z.string().min(1, V.emailRequired).email(V.emailInvalid),
		password: z.string().min(6, V.passwordMin),
		confirmPassword: z.string().min(1, V.confirmPassword),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: V.passwordsNoMatch,
		path: ['confirmPassword'],
	});

export type RegisterFormData = z.infer<typeof registerSchema>;

// ── Create Accommodation ──
export const accommodationSchema = z.object({
	name: z.string().min(1, V.nameRequired),
	type: z.string().min(1, V.typeRequired),
	region: z.string(),
	city: z.string().min(1, V.cityRequired),
	street: z.string(),
	houseNumber: z.string(),
	apartment: z.string(),
	size: z.string(),
	latitude: z.string(),
	longitude: z.string(),
	amenities: z.string().min(1, V.amenitiesRequired),
	dailyRate: z
		.string()
		.min(1, V.dailyRateRequired)
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
			message: V.dailyRatePositive,
		}),
	image: z.string(),
});

export type AccommodationFormData = z.infer<typeof accommodationSchema>;

// ── Admin Edit Accommodation ──
export const adminAccommodationSchema = z.object({
	name: z.string().min(1, V.nameRequired),
	type: z.string().min(1, V.typeRequired),
	location: z.string(),
	city: z.string().min(1, V.cityRequired),
	latitude: z.string(),
	longitude: z.string(),
	size: z.string(),
	amenities: z.string().min(1, V.amenitiesRequired),
	dailyRate: z
		.string()
		.min(1, V.dailyRateRequired)
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
			message: V.dailyRatePositive,
		}),
	image: z.string(),
});

export type AdminAccommodationFormData = z.infer<typeof adminAccommodationSchema>;

// ── Edit My Accommodation ──
export const editMyAccommodationSchema = z.object({
	name: z.string().min(1, V.nameRequired),
	type: z.string().min(1, V.typeRequired),
	region: z.string(),
	city: z.string().min(1, V.cityRequired),
	location: z.string(),
	size: z.string(),
	latitude: z.string(),
	longitude: z.string(),
	amenities: z.string().min(1, V.amenitiesRequired),
	dailyRate: z
		.string()
		.min(1, V.dailyRateRequired)
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
			message: V.dailyRatePositive,
		}),
	image: z.string(),
});

export type EditMyAccommodationFormData = z.infer<typeof editMyAccommodationSchema>;

// ── Booking ──
export const bookingSchema = z
	.object({
		checkInDate: z.string().min(1, V.checkInRequired),
		checkOutDate: z.string().min(1, V.checkOutRequired),
	})
	.refine((data) => new Date(data.checkOutDate) > new Date(data.checkInDate), {
		message: V.checkOutAfterCheckIn,
		path: ['checkOutDate'],
	});

export type BookingFormData = z.infer<typeof bookingSchema>;

// ── Profile ──
export const profileSchema = z.object({
	email: z.string().min(1, V.emailRequired).email(V.emailInvalid),
	firstName: z.string().min(1, V.firstNameRequired),
	lastName: z.string().min(1, V.lastNameRequired),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
