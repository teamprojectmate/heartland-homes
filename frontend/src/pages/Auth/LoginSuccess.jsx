import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // зберігаємо токен у localStorage
      localStorage.setItem('auth', JSON.stringify({ token }));

      // редірект на головну
      navigate('/', { replace: true });
    } else {
      // якщо токена немає → назад на логін
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Обробка входу...</h2>
      <p>Зачекайте, будь ласка ⏳</p>
    </div>
  );
};

export default LoginSuccess;
