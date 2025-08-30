import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Notification from '../../components/Notification';
import {
  getAccommodationById,
  updateAccommodation
} from '../../api/accommodations/accommodationService.js';

const AdminEditAccommodation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Прибираємо user з useSelector, оскільки він тут не потрібен
  // const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    type: '',
    location: '',
    city: '',
    size: '',
    amenities: '', // ✅ Змінили на рядок
    dailyRate: '',
    image: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccommodation = async () => {
      setLoading(true);
      try {
        const data = await getAccommodationById(id);
        setFormData({
          ...data,
          amenities: data.amenities?.join(', ') || '' // ✅ Форматуємо масив в рядок
        });
      } catch {
        setError('Не вдалося завантажити дані помешкання');
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        amenities: formData.amenities.split(',').map((a) => a.trim()) // ✅ Перетворюємо рядок у масив
      };
      // ✅ Прибрали token з аргументів
      await updateAccommodation(id, payload);
      navigate('/admin/accommodations');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка при оновленні');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Завантаження...</p>;

  return (
    <div className="container page">
      <h1 className="text-center">Редагувати помешкання</h1>
      {error && <Notification message={error} type="danger" />}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Тип</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="HOUSE">Будинок</option>
            <option value="APARTMENT">Квартира</option>
            <option value="CONDO">Кондо</option>
            <option value="VACATION_HOME">Дім для відпочинку</option>
          </select>
        </div>
        <div className="form-group">
          <label>Локація</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Місто</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Розмір</label>
          {/* ✅ Використовуємо select для enum */}
          <select name="size" value={formData.size} onChange={handleChange}>
            <option value="SMALL">Маленький</option>
            <option value="MEDIUM">Середній</option>
            <option value="LARGE">Великий</option>
          </select>
        </div>
        <div className="form-group">
          <label>Зручності (через кому)</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Ціна за добу</label>
          <input
            type="number"
            name="dailyRate"
            value={formData.dailyRate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>URL зображення</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Оновлення...' : 'Зберегти'}
        </button>
      </form>
    </div>
  );
};

export default AdminEditAccommodation;
