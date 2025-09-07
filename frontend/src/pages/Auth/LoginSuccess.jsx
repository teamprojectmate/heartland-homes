// src/pages/Auth/LoginSuccess.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';

const LoginSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 🔹 зберігаємо токен у localStorage
      localStorage.setItem('auth', JSON.stringify({ token }));

      // 🔹 оновлюємо Redux
      dispatch(loginSuccess({ token }));

      // 🔹 редіректимо користувача (наприклад, на профіль)
      navigate('/profile', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [dispatch, navigate, location]);

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Авторизація...</h2>
        <p className="form-subtitle">Будь ласка, зачекайте, виконується вхід через Google.</p>
      </div>
    </div>
  );
};

export default LoginSuccess;