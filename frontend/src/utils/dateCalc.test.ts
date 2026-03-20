import { describe, expect, it } from 'vitest';
import { calcNights } from './dateCalc';

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
