import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaHome } from 'react-icons/fa';
import '../styles/components/_auth.scss';

const Register = () => {
  return (
    <div className="auth-layout">
      {/* Ліва частина — форма */}
      <div className="auth-card">
        <h2 className="auth-title">Реєстрація</h2>
        <p className="form-subtitle">
          Вже маєте акаунт? <Link to="/login">Увійти</Link>
        </p>

        <form>
          <div className="form-group with-icon">
            <FaUser className="input-icon" />
            <input type="text" className="form-control" placeholder="Ім'я" />
          </div>

          <div className="form-group with-icon">
            <FaUser className="input-icon" />
            <input type="text" className="form-control" placeholder="Прізвище" />
          </div>

          <div className="form-group with-icon">
            <FaEnvelope className="input-icon" />
            <input type="email" className="form-control" placeholder="Електронна пошта" />
          </div>

          <div className="form-group with-icon">
            <FaLock className="input-icon" />
            <input type="password" className="form-control" placeholder="Пароль" />
          </div>

          <div className="form-group with-icon">
            <FaLock className="input-icon" />
            <input
              type="password"
              className="form-control"
              placeholder="Повторіть пароль"
            />
          </div>

          <button type="submit">Зареєструватися</button>
        </form>
      </div>

      {/* Права частина */}
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
