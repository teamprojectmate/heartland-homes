import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
	const _location = useLocation();

	useEffect(() => {
		// Прокручуємо догори плавно при зміні сторінки
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
	}, []);

	return null;
}

export default ScrollToTop;
