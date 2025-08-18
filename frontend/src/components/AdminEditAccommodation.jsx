import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080/api/v1';

const AdminEditAccommodation = () => {
  const navigate = useNavigate();
  // Отримуємо ID помешкання з URL
  const { id } = useParams();
  // Отримуємо об'єкт користувача, включаючи токен та роль, з Redux-стану
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    pricePerNight: '',
    rating: 0,
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // Додаємо стан для підтвердження видалення
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    // Перевірка, чи користувач є адміністратором
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    // Функція для отримання даних помешкання для редагування
    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/accommodations/${id}`);
        // Заповнюємо форму отриманими даними
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [user, navigate, id]);

  const { name, description, address, pricePerNight, rating, imageUrl } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = user.token;
      await axios.put(
        `${BASE_URL}/accommodations/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess(true);
      setLoading(false);
      // Перенаправляємо назад на адмін-панель після успішного оновлення
      navigate('/admin/accommodations');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка оновлення помешкання');
      setLoading(false);
    }
  };

  // Функція для видалення помешкання
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = user.token;
      await axios.delete(
        `${BASE_URL}/accommodations/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess(true);
      setLoading(false);
      // Перенаправляємо назад на адмін-панель після успішного видалення
      navigate('/admin/accommodations');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка видалення помешкання');
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-xs-center mt-5">Завантаження...</p>;
  }

  if (error) {
    return <p className="text-xs-center text-danger mt-5">Помилка: {error}</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-xs-center">Редагувати помешкання</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Помешкання успішно оновлено!</div>}
          
          <form onSubmit={handleSubmit}>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Назва"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </fieldset>
            <fieldset className="form-group">
              <textarea
                className="form-control form-control-lg"
                rows="5"
                placeholder="Опис"
                name="description"
                value={description}
                onChange={onChange}
                required
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Адреса"
                name="address"
                value={address}
                onChange={onChange}
                required
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="number"
                placeholder="Ціна за ніч"
                name="pricePerNight"
                value={pricePerNight}
                onChange={onChange}
                required
                min="0"
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="number"
                placeholder="Рейтинг (від 0 до 5)"
                name="rating"
                value={rating}
                onChange={onChange}
                min="0"
                max="5"
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="URL зображення"
                name="imageUrl"
                value={imageUrl}
                onChange={onChange}
              />
            </fieldset>
            
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-lg btn-danger"
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={loading}
              >
                Видалити
              </button>
              <button
                className="btn btn-lg btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Завантаження...' : 'Оновити'}
              </button>
            </div>
          </form>

          {/* Модальне вікно для підтвердження видалення */}
          {confirmDelete && (
            <div className="modal d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Підтвердження видалення</h5>
                  </div>
                  <div className="modal-body">
                    <p>Ви впевнені, що хочете видалити це помешкання?</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>
                      Скасувати
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditAccommodation;
