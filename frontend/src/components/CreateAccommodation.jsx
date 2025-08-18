import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080/api/v1';

const CreateAccommodation = () => {
  const navigate = useNavigate();
  // Отримуємо об'єкт користувача, включаючи токен та роль, з Redux-стану
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    pricePerNight: '',
    rating: 0,
    imageUrl: '' // Цей URL може бути опціональним
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Перевірка, чи користувач є адміністратором
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

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
      await axios.post(
        `${BASE_URL}/accommodations`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess(true);
      setLoading(false);
      // Перенаправляємо назад на адмін-панель після успішного створення
      navigate('/admin/accommodations');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка створення помешкання');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-xs-center">Створити нове помешкання</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Помешкання успішно створено!</div>}
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
            <button
              className="btn btn-lg btn-success pull-xs-right"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Завантаження...' : 'Створити'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccommodation;
