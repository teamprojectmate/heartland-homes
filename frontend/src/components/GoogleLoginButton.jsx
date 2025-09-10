// src/components/GoogleLoginButton.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        const { token } = event.data;
        localStorage.setItem('auth', JSON.stringify({ token }));
        dispatch(loginSuccess({ token }));
        window.location.href = '/my-bookings';
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch]);

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      'http://localhost:8080/oauth2/authorization/google',
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <button type="button" className="btn-google w-100" onClick={handleGoogleLogin}>
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        width="20"
        height="20"
        style={{ marginRight: '8px' }}
      />
      Увійти через Google
    </button>
  );
};

export default GoogleLoginButton;