// src/components/Header.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import "../styles/components/_header.scss";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/accommodations?query=${searchQuery}`);
    } else {
      navigate(`/accommodations`);
    }
  };

  return (
    <header className="main-header">
      <div className="container header-container">
        <Link className="navbar-brand" to="/">
          Оренда Помешкань
        </Link>

        {/* Форма пошуку */}
        <form className="search-form-header" onSubmit={handleSearch}>
          <input
            className="form-control"
            type="search"
            placeholder="Пошук..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <nav>
          <ul className="nav-list">
            <li>
              <Link className="nav-link" to="/">
                <i className="ion-home"></i> Головна
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                {user && user.role === "MANAGER" && (
                  <li>
                    <Link className="nav-link" to="/admin">
                      <i className="ion-gear-a"></i> Адмін-панель
                    </Link>
                  </li>
                )}
                <li>
                  <Link className="nav-link" to="/my-bookings">
                    <i className="ion-calendar"></i> Мої бронювання
                  </Link>
                </li>
                <li>
                  {user && (
                    <Link className="nav-link" to="/profile">
                      <i className="ion-person"></i> Профіль ({user.username})
                    </Link>
                  )}
                </li>
                <li>
                  <a
                    className="nav-link"
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="ion-power"></i> Вийти
                  </a>
                </li>
              </>
            ) : (
              <>
  <li style={{ marginRight: '1rem' }}>
    <Link className="nav-button nav-button-secondary" to="/login">
      Увійти
    </Link>
  </li>
  <li>
    <Link className="nav-button nav-button-primary" to="/register">
      Зареєструватися
    </Link>
  </li>
</>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
