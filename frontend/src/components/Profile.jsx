// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";

import "../styles/layout/_main-layout.scss";
import "../styles/components/_forms.scss";
import "../styles/components/_buttons.scss";
import "../styles/components/_profile.scss";

const BASE_URL = "http://localhost:8080";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = user.token;
        const { data } = await axios.get(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(data.email);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
      } catch {
        setMessage("Не вдалося завантажити профіль.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = user.token;
      await axios.put(
        `${BASE_URL}/users/me`,
        { email, firstName, lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Профіль успішно оновлено!");
      setIsEditMode(false);
    } catch {
      setMessage("Не вдалося оновити профіль.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <h1 className="text-center">Завантаження...</h1>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="profile-card">
            <h1 className="text-center auth-title">Профіль</h1>

            {message && (
              <Notification
                message={message}
                type={message.includes("успішно") ? "success" : "danger"}
              />
            )}

            <form className="profile-form" onSubmit={handleUpdate}>
              {/* fieldset без рамки — стилі нижче */}
              <fieldset disabled={!isEditMode}>
                <div className="form-group">
                  <label className="form-label">Електронна пошта</label>
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
                  <label className="form-label">Ім'я</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Ім'я"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Прізвище</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Прізвище"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </fieldset>

              <div className="button-group">
                {isEditMode ? (
                  <>
                    <button className="btn-primary" type="submit" disabled={loading}>
                      Зберегти зміни
                    </button>
                    <button
                      className="btn-secondary"
                      type="button"
                      onClick={() => setIsEditMode(false)}
                    >
                      Відмінити
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => setIsEditMode(true)}
                  >
                    Редагувати профіль
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
