export const getAuthToken = () => {
	try {
		const auth = JSON.parse(sessionStorage.getItem('auth') || 'null');
		return auth?.token || null;
	} catch {
		return null;
	}
};

export const clearAuthToken = () => {
	sessionStorage.removeItem('auth');
};
