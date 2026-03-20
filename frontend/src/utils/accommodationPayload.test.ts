import { describe, expect, it } from 'vitest';
import { getApiErrorMessage, parseAmenities } from './accommodationPayload';

describe('parseAmenities', () => {
	it('parses comma-separated string', () => {
		expect(parseAmenities('wifi, kitchen, parking')).toEqual(['wifi', 'kitchen', 'parking']);
	});

	it('trims whitespace', () => {
		expect(parseAmenities('  wifi ,  kitchen  ')).toEqual(['wifi', 'kitchen']);
	});

	it('filters empty values', () => {
		expect(parseAmenities('wifi,,kitchen,')).toEqual(['wifi', 'kitchen']);
	});

	it('returns empty array for empty string', () => {
		expect(parseAmenities('')).toEqual([]);
	});
});

describe('getApiErrorMessage', () => {
	it('extracts message from axios-style error', () => {
		const err = { response: { data: { message: 'Not found' } } };
		expect(getApiErrorMessage(err, 'fallback')).toBe('Not found');
	});

	it('returns fallback for unknown error', () => {
		expect(getApiErrorMessage(new Error('boom'), 'fallback')).toBe('fallback');
	});

	it('returns fallback for null', () => {
		expect(getApiErrorMessage(null, 'fallback')).toBe('fallback');
	});

	it('returns fallback for undefined', () => {
		expect(getApiErrorMessage(undefined, 'fallback')).toBe('fallback');
	});
});
