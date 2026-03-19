import { z } from 'zod';

// ── Login ──
export const loginSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ── Register ──
export const registerSchema = z
	.object({
		firstName: z.string().min(2, 'First name must be at least 2 characters'),
		lastName: z.string().min(2, 'Last name must be at least 2 characters'),
		email: z.string().min(1, 'Email is required').email('Invalid email'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type RegisterFormData = z.infer<typeof registerSchema>;

// ── Create Accommodation ──
export const accommodationSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	type: z.string().min(1, 'Type is required'),
	region: z.string(),
	city: z.string().min(1, 'City is required'),
	street: z.string(),
	houseNumber: z.string(),
	apartment: z.string(),
	size: z.string(),
	latitude: z.string(),
	longitude: z.string(),
	amenities: z.string(),
	dailyRate: z
		.string()
		.min(1, 'Daily rate is required')
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
			message: 'Daily rate must be greater than 0',
		}),
	image: z.string(),
});

export type AccommodationFormData = z.infer<typeof accommodationSchema>;

// ── Admin Edit Accommodation ──
export const adminAccommodationSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	type: z.string().min(1, 'Type is required'),
	location: z.string(),
	city: z.string().min(1, 'City is required'),
	latitude: z.string(),
	longitude: z.string(),
	size: z.string(),
	amenities: z.string(),
	dailyRate: z
		.string()
		.min(1, 'Daily rate is required')
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
			message: 'Daily rate must be greater than 0',
		}),
	image: z.string(),
});

export type AdminAccommodationFormData = z.infer<typeof adminAccommodationSchema>;

// ── Edit My Accommodation ──
export const editMyAccommodationSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	type: z.string().min(1, 'Type is required'),
	region: z.string(),
	city: z.string().min(1, 'City is required'),
	location: z.string(),
	size: z.string(),
	latitude: z.string(),
	longitude: z.string(),
	amenities: z.string(),
	dailyRate: z
		.string()
		.min(1, 'Daily rate is required')
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
			message: 'Daily rate must be greater than 0',
		}),
	image: z.string(),
});

export type EditMyAccommodationFormData = z.infer<typeof editMyAccommodationSchema>;

// ── Booking ──
export const bookingSchema = z
	.object({
		checkInDate: z.string().min(1, 'Check-in date is required'),
		checkOutDate: z.string().min(1, 'Check-out date is required'),
	})
	.refine((data) => new Date(data.checkOutDate) > new Date(data.checkInDate), {
		message: 'Check-out date must be after check-in date',
		path: ['checkOutDate'],
	});

export type BookingFormData = z.infer<typeof bookingSchema>;

// ── Profile ──
export const profileSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email'),
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
