import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = (breakpoint = MOBILE_BREAKPOINT): boolean => {
	const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [breakpoint]);

	return isMobile;
};
