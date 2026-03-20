import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = (breakpoint = MOBILE_BREAKPOINT): boolean => {
	const query = `(max-width: ${breakpoint - 1}px)`;
	const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);

	useEffect(() => {
		const mql = window.matchMedia(query);
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	}, [query]);

	return isMobile;
};
