// src/pages/Auth/Register.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaHome } from 'react-icons/fa';
import { register } from '../../store/slices/authSlice';
import PasswordStrengthBar from '../../components/PasswordStrengthBar';
import '../../styles/components/_auth.scss';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const [passwordError, setPasswordError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'password' || e.target.name === 'repeatPassword') {
      setPasswordError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setPasswordError('Пароль має містити мінімум 6 символів');
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      setPasswordError('Паролі не співпадають');
      return;
    }

    // 🔹 тільки викликаємо register — автологін зробить slice
    dispatch(register(formData));
  };

  // ✅ після логіну/реєстрації → редірект
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const passwordsDontMatch =
    formData.password &&
    formData.repeatPassword &&
    formData.password !== formData.repeatPassword;

  const disableSubmit = loading || formData.password.length < 6 || passwordsDontMatch;

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Реєстрація</h2>
        <p className="form-subtitle">
          Вже маєте акаунт? <Link to="/login">Увійти</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="Ім'я"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="Прізвище"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group with-icon">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Електронна пошта"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group with-icon">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Пароль (мін. 6 символів)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <PasswordStrengthBar password={formData.password} />

          <div className="form-group with-icon">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="repeatPassword"
              className="form-control"
              placeholder="Повторіть пароль"
              value={formData.repeatPassword}
              onChange={handleChange}
              required
            />
          </div>

          {passwordError && <p className="form-error">{passwordError}</p>}
          {error && <p className="form-error">{error}</p>}
          {passwordsDontMatch && <p className="form-error">Паролі не співпадають</p>}

          <button type="submit" disabled={disableSubmit}>
            {loading ? 'Зачекайте...' : 'Зареєструватися'}
          </button>
        </form>
      </div>

      <div className="auth-side">
        <FaHome className="auth-icon" />
        <h2 className="auth-title">Приєднуйтесь до Heartland Homes 🏡</h2>
        <p className="auth-subtitle">
          Знаходьте ідеальні будинки для відпочинку чи подорожей разом із{' '}
          <strong>Heartland Homes</strong>.
        </p>
      </div>
    </div>
  );
};

export default Register;
