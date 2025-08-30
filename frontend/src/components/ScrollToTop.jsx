import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокручуємо вікно догори при кожній зміні маршруту
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Цей компонент нічого не рендерить
}

export default ScrollToTop;
