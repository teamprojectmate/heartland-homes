import { describe, expect, it } from 'vitest';
import { calcNights, formatDate } from './dateCalc';

describe('calcNights', () => {
	it('calculates 1 night correctly', () => {
		expect(calcNights('2026-04-01', '2026-04-02')).toBe(1);
	});

	it('calculates 7 nights correctly', () => {
		expect(calcNights('2026-04-01', '2026-04-08')).toBe(7);
	});

	it('returns 0 for same day', () => {
		expect(calcNights('2026-04-01', '2026-04-01')).toBe(0);
	});

	it('returns 0 for checkout before checkin', () => {
		expect(calcNights('2026-04-05', '2026-04-01')).toBe(0);
	});

	it('rounds up partial days', () => {
		expect(calcNights('2026-04-01T10:00:00', '2026-04-02T08:00:00')).toBe(1);
	});
});

describe('formatDate', () => {
	it('formats ISO date string to dd/mm/yyyy', () => {
		expect(formatDate('2026-09-15T00:00:00.000Z')).toBe('15/09/2026');
	});

	it('formats simple date string', () => {
		expect(formatDate('2026-12-25')).toBe('25/12/2026');
	});

	it('formats Date object', () => {
		expect(formatDate(new Date('2026-01-01'))).toBe('01/01/2026');
	});

	it('returns dash for null', () => {
		expect(formatDate(null)).toBe('—');
	});

	it('returns dash for undefined', () => {
		expect(formatDate(undefined)).toBe('—');
	});

	it('returns dash for empty string', () => {
		expect(formatDate('')).toBe('—');
	});

	it('returns dash for invalid date string', () => {
		expect(formatDate('not-a-date')).toBe('—');
	});
});
