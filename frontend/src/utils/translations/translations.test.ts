import type { TFunction } from 'i18next';
import { localized, mapAmenity, mapCity, mapStatus, mapType } from './index';

const mockT = ((key: string) => key) as TFunction;

describe('localized', () => {
	it('should return Ukrainian when lang is uk and uk value exists', () => {
		expect(localized('Hotel', 'Готель', 'uk')).toBe('Готель');
	});

	it('should return English when lang is en', () => {
		expect(localized('Hotel', 'Готель', 'en')).toBe('Hotel');
	});

	it('should return English when uk value is undefined', () => {
		expect(localized('Hotel', undefined, 'uk')).toBe('Hotel');
	});

	it('should return empty string when both are undefined', () => {
		expect(localized(undefined, undefined, 'en')).toBe('');
	});
});

describe('mapCity', () => {
	it('should return i18n key for known city', () => {
		expect(mapCity('Kyiv', mockT)).toBe('cities.kyiv');
	});

	it('should be case-insensitive', () => {
		expect(mapCity('LVIV', mockT)).toBe('cities.lviv');
	});

	it('should return original string for unknown city', () => {
		expect(mapCity('Unknown City', mockT)).toBe('Unknown City');
	});

	it('should return empty string for undefined', () => {
		expect(mapCity(undefined, mockT)).toBe('');
	});

	it('should return original when no t function', () => {
		expect(mapCity('Kyiv')).toBe('Kyiv');
	});
});

describe('mapType', () => {
	it('should return i18n key for HOTEL', () => {
		const result = mapType('HOTEL', mockT);
		expect(result.label).toBe('accommodationType.hotel');
		expect(result.icon).toBe('🏨');
	});

	it('should return i18n key for APARTMENT', () => {
		const result = mapType('APARTMENT', mockT);
		expect(result.label).toBe('accommodationType.apartment');
	});

	it('should handle unknown type', () => {
		const result = mapType('UNKNOWN', mockT);
		expect(result.icon).toBe('❓');
	});

	it('should handle empty type', () => {
		const result = mapType('', mockT);
		expect(result.icon).toBe('❓');
	});
});

describe('mapAmenity', () => {
	it('should match WiFi', () => {
		const result = mapAmenity('WiFi', mockT);
		expect(result.icon).toBe('📶');
		expect(result.slug).toBe('wifi');
	});

	it('should match Kitchen', () => {
		const result = mapAmenity('Kitchen', mockT);
		expect(result.icon).toBe('🍳');
	});

	it('should match Air Conditioning', () => {
		const result = mapAmenity('Air Conditioning', mockT);
		expect(result.icon).toBe('❄️');
	});

	it('should match case-insensitively', () => {
		const result = mapAmenity('wifi', mockT);
		expect(result.slug).toBe('wifi');
	});

	it('should return fallback for unknown amenity', () => {
		const result = mapAmenity('Unknown Thing', mockT);
		expect(result.icon).toBe('❔');
		expect(result.slug).toBe('other');
	});
});

describe('mapStatus', () => {
	it('should return i18n key for PENDING', () => {
		const result = mapStatus('PENDING', mockT);
		expect(result.label).toBe('status.pending');
	});

	it('should return i18n key for CONFIRMED', () => {
		const result = mapStatus('CONFIRMED', mockT);
		expect(result.label).toBe('status.confirmed');
	});

	it('should handle unknown status', () => {
		const result = mapStatus('UNKNOWN', mockT);
		expect(result.label).toBe('status.unknown');
	});

	it('should handle empty status', () => {
		const result = mapStatus('', mockT);
		expect(result.slug).toBe('unknown');
	});
});
