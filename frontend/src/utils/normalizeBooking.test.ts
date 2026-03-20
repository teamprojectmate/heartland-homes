import { describe, expect, it } from 'vitest';
import { normalizeBooking } from './normalizeBooking';

describe('normalizeBooking', () => {
	it('returns booking with existing status', () => {
		const booking = { status: 'CONFIRMED' };
		const result = normalizeBooking(booking);
		expect(result.status).toBe('CONFIRMED');
	});

	it('auto-confirms PENDING booking with PAID payment', () => {
		const booking = { status: 'PENDING', payment: { status: 'PAID' } };
		const result = normalizeBooking(booking);
		expect(result.status).toBe('CONFIRMED');
	});

	it('keeps PENDING if payment not PAID', () => {
		const booking = { status: 'PENDING', payment: { status: 'PENDING' } };
		const result = normalizeBooking(booking);
		expect(result.status).toBe('PENDING');
	});

	it('handles booking without payment', () => {
		const booking = { status: 'PENDING' };
		const result = normalizeBooking(booking);
		expect(result.status).toBe('PENDING');
	});
});
