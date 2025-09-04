// src/components/GoogleLoginButton.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // ✅ для v4
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  const handleSuccess = (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token); // ✅ декодуємо токен

      console.log('✅ Google user:', decoded);

      // Зберігаємо в Redux
      dispatch(
        loginSuccess({
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          avatar: decoded.picture,
          token
        })
      );

      // Зберігаємо в localStorage
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token,
          user: {
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            avatar: decoded.picture
          }
        })
      );
    } catch (err) {
      console.error('❌ Помилка при обробці токена:', err);
    }
  };

  const handleError = () => {
    console.log('❌ Помилка входу через Google');
  };

  return (
    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleLoginButton;
