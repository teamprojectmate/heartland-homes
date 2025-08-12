import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080/api/v1';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Якщо користувач не аутентифікований, перенаправляємо на сторінку входу
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Завантажуємо дані профілю з бекенду
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
        setEmail(response.data.email);
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setLoading(false);
      } catch (err) {
        setMessage('Не вдалося завантажити профіль.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isAuthenticated, token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedUser = { username, email, firstName, lastName };
      await axios.put(`${BASE_URL}/users/me`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Профіль успішно оновлено!');
      setLoading(false);
      setIsEditMode(false);
    } catch (err) {
      setMessage('Не вдалося оновити профіль.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <h1 className="text-xs-center">Завантаження...</h1>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Профіль</h1>
          {message && (
            <div className={`alert ${message.includes('успішно') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleUpdate}>
            <fieldset disabled={!isEditMode}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Ім'я користувача"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </fieldset>
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
            {isEditMode ? (
              <div>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={loading}
                >
                  Зберегти зміни
                </button>
                <button
                  className="btn btn-lg btn-secondary"
                  type="button"
                  onClick={() => setIsEditMode(false)}
                >
                  Відмінити
                </button>
              </div>
            ) : (
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="button"
                onClick={() => setIsEditMode(true)}
              >
                Редагувати профіль
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
