import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop(): null {
	const { pathname } = useLocation();
	const prevPath = useRef(pathname);

	useEffect(() => {
		if (prevPath.current !== pathname) {
			prevPath.current = pathname;
			requestAnimationFrame(() => {
				window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
			});
		}
	});

	return null;
}

export default ScrollToTop;
