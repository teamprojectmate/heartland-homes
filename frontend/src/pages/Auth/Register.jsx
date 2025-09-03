// src/pages/Auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../../store/slices/authSlice';
import Notification from '../../components/Notification';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const { email, password, confirmPassword, firstName, lastName } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // 🔹 Якщо реєстрація пройшла успішно → редірект на /login
  useEffect(() => {
    if (isSuccess) {
      navigate('/login');
    }
    dispatch(reset());
  }, [isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Паролі не співпадають');
      return;
    }

    dispatch(register({ email, password, firstName, lastName }));
  };

  return (
    <div className="container page mt-4">
      <h1 className="auth-title text-center">Реєстрація</h1>

      {isError && <Notification message={message} type="error" />}
      {isSuccess && (
        <Notification
          message="Реєстрація успішна! Тепер ви можете увійти."
          type="success"
        />
      )}

      <form onSubmit={onSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="firstName">Ім’я</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Прізвище</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Електронна пошта</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Підтвердіть пароль</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
        </button>
      </form>

      <p className="text-center mt-3">
        Вже маєте акаунт? <Link to="/login">Увійти</Link>
      </p>
    </div>
  );
};

export default Register;
