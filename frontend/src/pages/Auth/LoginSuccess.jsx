// src/pages/Auth/LoginSuccess.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import authService from '../../api/auth/authService';

const LoginSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const fetchProfile = async () => {
      try {
        // 🔹 тимчасово зберігаємо токен у localStorage
        localStorage.setItem('auth', JSON.stringify({ token }));

        // 🔹 отримуємо профіль користувача
        const profile = await authService.getProfile();

        let rawRole = profile.role || (profile.roles?.[0] ?? null);
        let cleanRole = rawRole?.startsWith('ROLE_')
          ? rawRole.replace('ROLE_', '')
          : rawRole;

        const userData = {
          token,
          ...profile,
          cleanRole,
          profile
        };

        // 🔹 оновлюємо Redux і localStorage
        dispatch(loginSuccess(userData));

        navigate('/profile', { replace: true });
      } catch (error) {
        console.error('Google login error:', error);
        localStorage.removeItem('auth');
        localStorage.removeItem('userProfile');
        navigate('/login', { replace: true });
      }
    };

    if (token) {
      fetchProfile();
    } else {
      navigate('/login', { replace: true });
    }
  }, [dispatch, navigate, location]);

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Авторизація...</h2>
        <p className="form-subtitle">
          Будь ласка, зачекайте, виконується вхід через Google.
        </p>
      </div>
    </div>
  );
};

export default LoginSuccess;
