import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import "../styles/components/_header.scss";
import "../styles/components/_buttons.scss";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/login");
  };

  const closeOnNavigate = () => setOpen(false);

  return (
    <header className="main-header" role="banner">
      <div className="container header-container">
        <Link className="brand" to="/" aria-label="Heartland Homes">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 2.4c-3.9 0-7 3-7 6.7 0 5.5 7 12.3 7 12.3s7-6.8 7-12.3c0-3.7-3.1-6.7-7-6.7Zm0 9.1a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z"/>
          </svg>
          <span>Heartland Homes</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop" aria-label="Головна навігація">
          <ul className="nav-list">
            <li><NavLink className="nav-link" to="/" end>Головна</NavLink></li>
            <li><NavLink className="nav-link" to="/my-bookings">Мої бронювання</NavLink></li>
            <li>
              <NavLink className="nav-link" to="/profile">
                Профіль {user ? `(${user.username ?? ""})` : ""}
              </NavLink>
            </li>
          </ul>
          {isAuthenticated ? (
            <button className="btn-chip" onClick={handleLogout}>Вийти</button>
          ) : (
            <div className="auth-actions">
              <Link className="btn-sm btn-primary" to="/login">Увійти</Link>
              <Link className="btn-sm btn-secondary" to="/register">Реєстрація</Link>
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
          <span/><span/><span/>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={`drawer ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="drawer-content container">
          <ul className="drawer-nav">
            <li><NavLink onClick={closeOnNavigate} to="/" end>Головна</NavLink></li>
            <li><NavLink onClick={closeOnNavigate} to="/my-bookings">Мої бронювання</NavLink></li>
            <li><NavLink onClick={closeOnNavigate} to="/profile">Профіль</NavLink></li>
          </ul>
          {isAuthenticated ? (
            <button className="btn-outline block" onClick={handleLogout}>Вийти</button>
          ) : (
            <div className="drawer-actions">
              <Link onClick={closeOnNavigate} className="btn-primary block" to="/login">Увійти</Link>
              <Link onClick={closeOnNavigate} className="btn-secondary block" to="/register">Реєстрація</Link>
            </div>
          )}
        </div>
        <button className="drawer-backdrop" onClick={() => setOpen(false)} aria-label="Закрити меню"/>
      </div>
    </header>
  );
};

export default Header;
