// src/components/Login.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../store/slices/authSlice";
import Notification from "./Notification";
import "../styles/layout/_main-layout.scss";
import "../styles/components/_forms.scss";
import "../styles/components/_buttons.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(login({ email, password }));
  };

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 auth-form-container"> {/* ✅ Виправлено */}
          <h1 className="auth-title">Вхід</h1>
          <p className="text-center">
            <Link to="/register">Потрібен акаунт?</Link>
          </p>
          {error && <Notification message={error} type="danger" />}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                placeholder="Електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Завантаження..." : "Увійти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
