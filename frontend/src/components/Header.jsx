import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaClipboardList,
  FaUserPlus,
  FaCreditCard
} from 'react-icons/fa';

import '../styles/components/_header.scss';
import '../styles/components/_buttons.scss';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
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
        <div className="header-inner">
          <div className="header-container">
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
              <ul>
                <li>
                  <NavLink to="/" end className="nav-link">
                    <FaHome className="nav-icon" /> Головна
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-bookings" className="nav-link">
                    <FaClipboardList className="nav-icon" /> Мої бронювання
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-payments" className="nav-link">
                    <FaCreditCard className="nav-icon" /> Мої платежі
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" className="nav-link">
                    <FaUser className="nav-icon" /> Профіль
                  </NavLink>
                </li>
              </ul>

              {isAuthenticated ? (
                <div className="nav-actions">
                  <button className="btn-chip logout" onClick={handleLogout}>
                    <FaSignOutAlt className="nav-icon" /> Вийти
                  </button>
                </div>
              ) : (
                <div className="nav-actions">
                  <NavLink to="/login" className="btn-chip primary">
                    <FaSignInAlt className="nav-icon" /> Увійти
                  </NavLink>
                  <NavLink to="/register" className="btn-chip secondary">
                    <FaUserPlus className="nav-icon" /> Реєстрація
                  </NavLink>
                </div>
              )}
            </nav>

            {/* Burger */}
            <button
              className={`burger ${open ? 'open' : ''}`}
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
        </div>
      </header>
    </>
  );
};

export default Header;
