import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaHome } from 'react-icons/fa';
import { login } from '../store/slices/authSlice';
import '../styles/components/_auth.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((s) => s.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('👉 Відправляю логін:', { email, password }); // DEBUG
    dispatch(login({ email, password }));
  };

  // Якщо залогінився → редірект
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-layout">
      {/* Ліва частина — форма */}
      <div className="auth-card">
        <h2 className="auth-title">Вхід</h2>
        <p className="form-subtitle">
          Немає акаунта? <Link to="/register">Зареєструватися</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group with-icon">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              className="form-control"
              placeholder="Електронна пошта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group with-icon">
            <FaLock className="input-icon" />
            <input
              type="password"
              className="form-control"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Зачекайте...' : 'Увійти'}
          </button>
        </form>
      </div>

      {/* Права частина */}
      <div className="auth-side">
        <FaHome className="auth-icon" />
        <h2 className="auth-title">Ласкаво просимо назад 👋</h2>
        <p className="auth-subtitle">
          Увійдіть, щоб забронювати свій наступний будинок мрії з{' '}
          <strong>Heartland Homes</strong>.
        </p>
      </div>
    </div>
  );
};

export default Login;
