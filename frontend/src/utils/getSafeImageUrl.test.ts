import { describe, expect, it } from 'vitest';
import { getSafeImageUrl } from './getSafeImageUrl';

describe('getSafeImageUrl', () => {
	it('returns URL with raw=1 param', () => {
		expect(getSafeImageUrl('https://example.com/photo.jpg')).toBe(
			'https://example.com/photo.jpg?raw=1',
		);
	});

	it('returns fallback for empty string', () => {
		expect(getSafeImageUrl('')).toBe('/no-image.png');
	});

	it('returns fallback for undefined', () => {
		expect(getSafeImageUrl(undefined as unknown as string)).toBe('/no-image.png');
	});
});
