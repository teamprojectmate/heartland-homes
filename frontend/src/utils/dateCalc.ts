import i18n from '../i18n';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const LOCALE_MAP: Record<string, string> = { en: 'en-GB', uk: 'uk-UA' };

export const calcNights = (checkIn: string, checkOut: string): number => {
	const start = new Date(checkIn);
	const end = new Date(checkOut);
	return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY));
};

export const formatDate = (date: string | Date | null | undefined): string => {
	if (!date) return '—';
	const d = typeof date === 'string' ? new Date(date) : date;
	if (Number.isNaN(d.getTime())) return '—';

	const locale = LOCALE_MAP[i18n.language] || 'en-GB';
	return d.toLocaleDateString(locale, {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};

/** Compact date for tables: "10.07.2026" */
export const formatDateCompact = (date: string | Date | null | undefined): string => {
	if (!date) return '—';
	const d = typeof date === 'string' ? new Date(date) : date;
	if (Number.isNaN(d.getTime())) return '—';
	const dd = String(d.getDate()).padStart(2, '0');
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	return `${dd}.${mm}.${d.getFullYear()}`;
};
