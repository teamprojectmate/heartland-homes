import { fixDropboxUrl } from './fixDropboxUrl';

export const getSafeImageUrl = (url: string) => {
	if (!url) return '/no-image.png'; // fallback якщо url немає
	try {
		const fixed = fixDropboxUrl(url);
		return fixed || '/no-image.png';
	} catch (_err) {
		/* error handled silently */
		return '/no-image.png';
	}
};
