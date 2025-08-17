import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";

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
        const token = user.token; // Отримуємо токен з user
        const response = await axios.get(`${BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmail(response.data.email);
        setFirstName(response.data.firstName || "");
        setLastName(response.data.lastName || "");
        setLoading(false);
      } catch (err) {
        setMessage("Не вдалося завантажити профіль.");
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
      const updatedUser = { email, firstName, lastName };
      await axios.put(`${BASE_URL}/users/me`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Профіль успішно оновлено!");
      setLoading(false);
      setIsEditMode(false);
    } catch (err) {
      setMessage("Не вдалося оновити профіль.");
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
        <div className="col-md-6 offset-md-3 col-xs-12 profile-card">
          <h1 className="text-center auth-title">Профіль</h1>
          {message && (
            <Notification message={message} type={message.includes("успішно") ? "success" : "error"} />
          )}
          <form onSubmit={handleUpdate}>
            <fieldset disabled={!isEditMode}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Електронна пошта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Ім'я"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Прізвище"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>
            </fieldset>
            <div className="mt-4 d-flex justify-content-end">
              {isEditMode ? (
                <>
                  <button
                    className="btn btn-lg btn-primary"
                    type="submit"
                    disabled={loading}
                  >
                    Зберегти зміни
                  </button>
                  <button
                    className="btn btn-lg btn-secondary ml-2"
                    type="button"
                    onClick={() => setIsEditMode(false)}
                  >
                    Відмінити
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-lg btn-primary"
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
  );
};

export default Profile;
