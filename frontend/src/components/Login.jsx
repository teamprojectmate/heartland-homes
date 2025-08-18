import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Якщо користувач вже аутентифікований, перенаправляємо його на головну сторінку
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Відправляємо дані на бекенд для аутентифікації
    const resultAction = await dispatch(login({ email, password }));
    // Якщо вхід успішний, перенаправляємо
    if (login.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Вхід</h1>
          <p className="text-xs-center">
            <a href="/register">Потрібен акаунт?</a>
          </p>

          <form onSubmit={handleSubmit}>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="email"
                placeholder="Електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </fieldset>
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            <button
              className="btn btn-lg btn-primary pull-xs-right"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Завантаження...' : 'Увійти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
