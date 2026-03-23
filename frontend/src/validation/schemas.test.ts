import { describe, expect, it } from 'vitest';
import {
	accommodationSchema,
	bookingSchema,
	loginSchema,
	profileSchema,
	registerSchema,
} from './schemas';

describe('loginSchema', () => {
	it('passes with valid data', () => {
		const result = loginSchema.safeParse({ email: 'test@test.com', password: '123456' });
		expect(result.success).toBe(true);
	});

	it('fails with empty email', () => {
		const result = loginSchema.safeParse({ email: '', password: '123456' });
		expect(result.success).toBe(false);
	});

	it('fails with invalid email', () => {
		const result = loginSchema.safeParse({ email: 'not-email', password: '123456' });
		expect(result.success).toBe(false);
	});

	it('fails with short password', () => {
		const result = loginSchema.safeParse({ email: 'test@test.com', password: '123' });
		expect(result.success).toBe(false);
	});
});

describe('registerSchema', () => {
	const validData = {
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@test.com',
		password: '123456',
		confirmPassword: '123456',
	};

	it('passes with valid data', () => {
		const result = registerSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('fails when passwords do not match', () => {
		const result = registerSchema.safeParse({ ...validData, confirmPassword: 'different' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('validation.passwordsNoMatch');
		}
	});

	it('fails with short first name', () => {
		const result = registerSchema.safeParse({ ...validData, firstName: 'A' });
		expect(result.success).toBe(false);
	});
});

describe('bookingSchema', () => {
	it('passes with valid dates', () => {
		const result = bookingSchema.safeParse({
			checkInDate: '2026-04-01',
			checkOutDate: '2026-04-05',
		});
		expect(result.success).toBe(true);
	});

	it('fails when checkout is before checkin', () => {
		const result = bookingSchema.safeParse({
			checkInDate: '2026-04-05',
			checkOutDate: '2026-04-01',
		});
		expect(result.success).toBe(false);
	});

	it('fails with empty dates', () => {
		const result = bookingSchema.safeParse({ checkInDate: '', checkOutDate: '' });
		expect(result.success).toBe(false);
	});
});

describe('accommodationSchema', () => {
	const validData = {
		name: 'Cozy Apartment',
		type: 'APARTMENT',
		region: '',
		city: 'Kyiv',
		street: '',
		houseNumber: '',
		apartment: '',
		size: '',
		latitude: '',
		longitude: '',
		amenities: 'WiFi, Parking',
		dailyRate: '100',
		image: '',
	};

	it('passes with valid data', () => {
		const result = accommodationSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('fails without name', () => {
		const result = accommodationSchema.safeParse({ ...validData, name: '' });
		expect(result.success).toBe(false);
	});

	it('fails without amenities', () => {
		const result = accommodationSchema.safeParse({ ...validData, amenities: '' });
		expect(result.success).toBe(false);
	});

	it('fails with zero daily rate', () => {
		const result = accommodationSchema.safeParse({ ...validData, dailyRate: '0' });
		expect(result.success).toBe(false);
	});

	it('fails with negative daily rate', () => {
		const result = accommodationSchema.safeParse({ ...validData, dailyRate: '-50' });
		expect(result.success).toBe(false);
	});
});

describe('profileSchema', () => {
	it('passes with valid data', () => {
		const result = profileSchema.safeParse({
			email: 'test@test.com',
			firstName: 'John',
			lastName: 'Doe',
		});
		expect(result.success).toBe(true);
	});

	it('fails with invalid email', () => {
		const result = profileSchema.safeParse({
			email: 'bad',
			firstName: 'John',
			lastName: 'Doe',
		});
		expect(result.success).toBe(false);
	});
});
