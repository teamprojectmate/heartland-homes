import { fixDropboxUrl } from './fixDropboxUrl';

export const getSafeImageUrl = (url: string | undefined) => {
	if (!url) return '/no-image.png'; // fallback if url is empty
	try {
		const fixed = fixDropboxUrl(url);
		return fixed || '/no-image.png';
	} catch (_err) {
		/* error handled silently */
		return '/no-image.png';
	}
};
