export const fixDropboxUrl = (url: string) => {
	if (!url) return '';

	if (url.includes('dl=0')) {
		return url.replace('dl=0', 'raw=1');
	}

	if (url.includes('dl=1')) {
		return url.replace('dl=1', 'raw=1');
	}

	if (url.includes('raw=1')) {
		return url;
	}

	if (!url.includes('?')) {
		return `${url}?raw=1`;
	}

	return url;
};
