/**
 * Address normalization utilities for Ukrainian addresses.
 * Used by CreateAccommodation and EditMyAccommodation forms.
 */

const STREET_PREFIX_RE = /(вул\.|вулиця|просп\.|проспект|бульвар|пров\.|провулок|street|str\.)/i;

export const hasStreetPrefix = (s = ''): boolean => STREET_PREFIX_RE.test(s);

export const normalizeRegion = (r = ''): string => {
	const s = r.trim();
	if (!s) return '';
	if (/область$/i.test(s)) return s;
	if (/обл\.$/i.test(s)) return s.replace(/обл\.$/i, 'область');
	return `${s} область`;
};

export const stripRegionFromLocation = (loc = ''): { region: string; rest: string } => {
	if (!loc) return { region: '', rest: '' };
	let s = loc.trim();

	const re = /^(.+?(?:область|обл\.))\s*,\s*/i;
	const m = s.match(re);
	if (m) {
		const regionNorm = m[1].trim().replace(/обл\./i, 'область');
		s = s.replace(re, '').trim();
		return { region: regionNorm, rest: s };
	}
	return { region: '', rest: s };
};

export const stripCityFromLocation = (loc = '', city = ''): string => {
	const c = city.trim();
	if (!loc) return '';
	let s = loc.trim();
	if (!c) return s;

	const patterns = [
		new RegExp(`^м\\.?\\s*${c}\\s*,\\s*`, 'i'),
		new RegExp(`^місто\\s*${c}\\s*,\\s*`, 'i'),
		new RegExp(`^${c}\\s*,\\s*`, 'i'),
	];
	for (const re of patterns) {
		s = s.replace(re, '');
	}
	return s.trim();
};

export const normalizeStreetOnly = (raw: string, city: string): string => {
	const s = (raw || '').trim();
	const afterRegion = stripRegionFromLocation(s).rest;
	const afterCity = stripCityFromLocation(afterRegion, city);
	if (afterCity && !hasStreetPrefix(afterCity)) return `вул. ${afterCity}`;
	return afterCity;
};

interface BuildLocationParams {
	region?: string;
	city?: string;
	street?: string;
	houseNumber?: string;
	apartment?: string;
}

export const buildLocation = ({
	region,
	city,
	street,
	houseNumber,
	apartment,
}: BuildLocationParams): string => {
	const regionPart = normalizeRegion(region || '');
	const cityPart = city?.trim() ? `м. ${city.trim()}` : '';

	let streetPart = (street || '').trim();
	if (streetPart && !hasStreetPrefix(streetPart)) streetPart = `вул. ${streetPart}`;

	const housePart = (houseNumber || '').trim();
	const aptPart = (apartment || '').trim() ? `кв. ${(apartment || '').trim()}` : '';

	return [regionPart, cityPart, [streetPart, housePart].filter(Boolean).join(' '), aptPart]
		.filter(Boolean)
		.join(', ')
		.replace(/\s+,/g, ',')
		.replace(/,\s*,/g, ', ')
		.trim();
};
