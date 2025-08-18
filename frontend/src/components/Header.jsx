import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Перенаправляємо на сторінку помешкань з параметром запиту
    if (searchQuery.trim()) {
      navigate(`/accommodations?query=${searchQuery}`);
    } else {
      navigate(`/accommodations`);
    }
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">
          Оренда Помешкань
        </Link>

        {/* Форма пошуку */}
        <form className="form-inline mx-auto" onSubmit={handleSearch}>
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Пошук..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <ul className="nav navbar-nav d-flex flex-row align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <i className="ion-home"></i> Головна
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              {/* Додаємо посилання на адмін-панель, якщо користувач є адміном */}
              {user && user.role === 'ADMIN' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    <i className="ion-gear-a"></i> Адмін-панель
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/my-bookings">
                  <i className="ion-calendar"></i> Мої бронювання
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  <i className="ion-person"></i> Профіль ({user.username})
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <i className="ion-power"></i> Вийти
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <i className="ion-log-in"></i> Увійти
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  <i className="ion-person-add"></i> Зареєструватися
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
