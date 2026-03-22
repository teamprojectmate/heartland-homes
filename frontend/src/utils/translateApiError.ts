import type { TFunction } from 'i18next';

export const translateApiError = (message: string, t: TFunction): string => {
	const translated = t(`apiErrors.${message}`, { defaultValue: '' });
	return translated || message;
};
