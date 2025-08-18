// src/components/Register.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/slices/authSlice";
import Notification from "./Notification";
import "../styles/layout/_main-layout.scss";
import "../styles/components/_forms.scss";
import "../styles/components/_buttons.scss";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

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

    if (password !== repeatPassword) {
      alert("Паролі не збігаються!");
      return;
    }

    const resultAction = await dispatch(
      register({ firstName, lastName, email, password, repeatPassword }),
    );
    if (register.fulfilled.match(resultAction)) {
      navigate("/login");
    }
  };

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 auth-form-container"> {/* ✅ Виправлено */}
          <h1 className="auth-title">Реєстрація</h1>
          <p className="text-center">
            <Link to="/login">Вже маєте акаунт?</Link> 
          </p>
          {error && <Notification message={error} type="danger" />}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                placeholder="Ім'я"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                placeholder="Прізвище"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                placeholder="Електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                placeholder="Повторіть пароль"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Завантаження..." : "Зареєструватися"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
