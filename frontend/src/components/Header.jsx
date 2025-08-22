import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import '../styles/components/_header.scss';
import '../styles/components/_buttons.scss';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate('/login');
  };

  const closeOnNavigate = () => setOpen(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  return (
    <>
      <header className="main-header" role="banner">
        <div className="container header-container">
          <Link className="brand" to="/" aria-label="Heartland Homes">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2.4c-3.9 0-7 3-7 6.7 0 5.5 7 12.3 7 12.3s7-6.8 7-12.3c0-3.7-3.1-6.7-7-6.7Zm0 9.1a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z"
              />
            </svg>
            <span>Heartland Homes</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Головна навігація">
            <ul className="nav-list">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Головна
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Мої бронювання
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Профіль {user ? `(${user.username ?? ''})` : ''}
                </NavLink>
              </li>
            </ul>

            {isAuthenticated ? (
              <button className="btn-chip" onClick={handleLogout}>
                Вийти
              </button>
            ) : (
              <div className="auth-actions">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'btn-sm btn-primary active' : 'btn-sm btn-primary'
                  }
                >
                  Увійти
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? 'btn-sm btn-secondary active' : 'btn-sm btn-secondary'
                  }
                >
                  Реєстрація
                </NavLink>
              </div>
            )}
          </nav>

          {/* Burger */}
          <button
            className="burger"
            aria-label="Меню"
            aria-controls="mobile-drawer"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Drawer */}
      <div
        id="mobile-drawer"
        className={`drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Мобільне меню"
      >
        <div className="drawer-content">
          <ul className="drawer-nav" role="navigation">
            <li>
              <NavLink
                onClick={closeOnNavigate}
                to="/"
                end
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Головна
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={closeOnNavigate}
                to="/my-bookings"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Мої бронювання
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={closeOnNavigate}
                to="/profile"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Профіль
              </NavLink>
            </li>
          </ul>

          {isAuthenticated ? (
            <button className="btn-outline block" onClick={handleLogout}>
              Вийти
            </button>
          ) : (
            <div className="drawer-actions">
              <NavLink
                onClick={closeOnNavigate}
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'btn-primary block active' : 'btn-primary block'
                }
              >
                Увійти
              </NavLink>
              <NavLink
                onClick={closeOnNavigate}
                to="/register"
                className={({ isActive }) =>
                  isActive ? 'btn-secondary block active' : 'btn-secondary block'
                }
              >
                Реєстрація
              </NavLink>
            </div>
          )}
        </div>

        <button
          className="drawer-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Закрити меню"
        />
      </div>
    </>
  );
};

export default Header;
