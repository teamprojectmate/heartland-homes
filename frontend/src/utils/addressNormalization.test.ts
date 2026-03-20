import { describe, expect, it } from 'vitest';
import {
	buildLocation,
	hasStreetPrefix,
	normalizeRegion,
	normalizeStreetOnly,
	stripCityFromLocation,
	stripRegionFromLocation,
} from './addressNormalization';

describe('hasStreetPrefix', () => {
	it('detects вул.', () => expect(hasStreetPrefix('вул. Центральна')).toBe(true));
	it('detects просп.', () => expect(hasStreetPrefix('просп. Перемоги')).toBe(true));
	it('detects street', () => expect(hasStreetPrefix('Main street')).toBe(true));
	it('returns false for plain text', () => expect(hasStreetPrefix('Центральна')).toBe(false));
	it('returns false for empty', () => expect(hasStreetPrefix('')).toBe(false));
});

describe('normalizeRegion', () => {
	it('adds область suffix', () => expect(normalizeRegion('Київська')).toBe('Київська область'));
	it('keeps full form', () => expect(normalizeRegion('Київська область')).toBe('Київська область'));
	it('expands обл.', () => expect(normalizeRegion('Київська обл.')).toBe('Київська область'));
	it('returns empty for empty input', () => expect(normalizeRegion('')).toBe(''));
});

describe('stripRegionFromLocation', () => {
	it('extracts region', () => {
		const result = stripRegionFromLocation('Київська область, м. Київ, вул. Центральна');
		expect(result.region).toBe('Київська область');
		expect(result.rest).toBe('м. Київ, вул. Центральна');
	});

	it('returns empty region if none', () => {
		const result = stripRegionFromLocation('м. Київ');
		expect(result.region).toBe('');
		expect(result.rest).toBe('м. Київ');
	});
});

describe('stripCityFromLocation', () => {
	it('removes city prefix', () => {
		expect(stripCityFromLocation('м. Київ, вул. Центральна', 'Київ')).toBe('вул. Центральна');
	});

	it('returns original without city', () => {
		expect(stripCityFromLocation('вул. Центральна', '')).toBe('вул. Центральна');
	});
});

describe('normalizeStreetOnly', () => {
	it('adds вул. prefix when missing', () => {
		expect(normalizeStreetOnly('Центральна', 'Київ')).toBe('вул. Центральна');
	});

	it('keeps existing prefix', () => {
		expect(normalizeStreetOnly('вул. Центральна', 'Київ')).toBe('вул. Центральна');
	});
});

describe('buildLocation', () => {
	it('builds full address', () => {
		const result = buildLocation({
			region: 'Київська',
			city: 'Київ',
			street: 'Центральна',
			houseNumber: '15',
			apartment: '3',
		});
		expect(result).toContain('Київська область');
		expect(result).toContain('м. Київ');
		expect(result).toContain('вул. Центральна 15');
		expect(result).toContain('кв. 3');
	});

	it('skips empty parts', () => {
		const result = buildLocation({ city: 'Київ', street: 'Центральна' });
		expect(result).toBe('м. Київ, вул. Центральна');
	});

	it('returns empty for no input', () => {
		expect(buildLocation({})).toBe('');
	});
});
