import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { expandBookedNights, firstBookedNightAfter, fromDateKey, toDateKey } from './bookingDates';

describe('bookingDates', () => {
	const originalTz = process.env.TZ;

	beforeAll(() => {
		// Kyiv is UTC+2/+3 — the time zone where the old toISOString() approach shifted dates
		process.env.TZ = 'Europe/Kyiv';
	});

	afterAll(() => {
		process.env.TZ = originalTz;
	});

	describe('toDateKey', () => {
		it('keeps the selected calendar day in a UTC+ time zone', () => {
			const selected = new Date(2026, 9, 6); // 6 Oct 2026, local midnight

			// the old code returned the previous day here
			expect(selected.toISOString().split('T')[0]).toBe('2026-10-05');
			expect(toDateKey(selected)).toBe('2026-10-06');
		});
	});

	describe('fromDateKey', () => {
		it('returns local midnight of the same calendar day', () => {
			const date = fromDateKey('2026-10-06');
			expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([
				2026, 9, 6, 0,
			]);
		});

		it('ignores the time part of an ISO datetime from the API', () => {
			expect(toDateKey(fromDateKey('2026-10-06T00:00:00.000Z'))).toBe('2026-10-06');
		});

		it('round-trips with toDateKey', () => {
			expect(toDateKey(fromDateKey('2026-12-31'))).toBe('2026-12-31');
		});
	});

	describe('expandBookedNights', () => {
		it('lists nights from check-in up to, not including, check-out', () => {
			const nights = expandBookedNights([
				{ checkInDate: '2026-11-01', checkOutDate: '2026-11-04' },
			]);
			expect(nights.map(toDateKey)).toEqual(['2026-11-01', '2026-11-02', '2026-11-03']);
		});

		it('returns an empty list when there are no bookings', () => {
			expect(expandBookedNights([])).toEqual([]);
		});
	});

	describe('firstBookedNightAfter', () => {
		const nights = expandBookedNights([
			{ checkInDate: '2026-11-20', checkOutDate: '2026-11-22' },
			{ checkInDate: '2026-11-10', checkOutDate: '2026-11-12' },
		]);

		it('returns the earliest booked night after check-in', () => {
			const result = firstBookedNightAfter(fromDateKey('2026-11-05'), nights);
			expect(result && toDateKey(result)).toBe('2026-11-10');
		});

		it('returns undefined when nothing is booked after check-in', () => {
			expect(firstBookedNightAfter(fromDateKey('2026-11-25'), nights)).toBeUndefined();
		});
	});
});
