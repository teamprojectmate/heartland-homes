import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import { createAccommodation } from '../../api/accommodations/accommodationService';

const CreateAccommodation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'HOUSE',
    location: '',
    city: '',
    // ✅ ДОДАНО: Нові поля для широти та довготи
    latitude: '',
    longitude: '',
    size: '',
    amenities: '',
    dailyRate: '',
    image: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        // Перетворюємо рядок з зручностями на масив, обрізаючи пробіли
        amenities: formData.amenities.split(',').map((a) => a.trim()),
        dailyRate: Number(formData.dailyRate)
      };
      await createAccommodation(payload);
      navigate('/admin/accommodations');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка при створенні');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <h1 className="text-center">Створити помешкання</h1>
      {error && <Notification message={error} type="danger" />}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Тип</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="HOUSE">Будинок</option>
            <option value="APARTMENT">Квартира</option>
            <option value="HOTEL">Готель</option>
            <option value="VACATION_HOME">Дім для відпочинку</option>
            <option value="HOSTEL">Хостел</option>
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
          <label>Широта (Latitude)</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Довгота (Longitude)</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Розмір</label>
          <input type="text" name="size" value={formData.size} onChange={handleChange} />
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
          {loading ? 'Створення...' : 'Створити'}
        </button>
      </form>
    </div>
  );
};

export default CreateAccommodation;
