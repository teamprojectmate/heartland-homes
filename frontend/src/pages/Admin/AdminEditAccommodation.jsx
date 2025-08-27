// src/pages/Admin/AdminEditAccommodation.jsx
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
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    type: 'HOUSE',
    location: '',
    city: '',
    size: '',
    amenities: [],
    dailyRate: '',
    image: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const data = await getAccommodationById(id);
        setFormData(data);
      } catch {
        setError('Не вдалося завантажити дані помешкання');
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

  const handleAmenitiesChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      amenities: e.target.value.split(',').map((a) => a.trim())
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAccommodation(id, formData, user.token);
      navigate('/admin/accommodations');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка при оновленні');
    }
  };

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
          <input type="text" name="size" value={formData.size} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Зручності (через кому)</label>
          <input
            type="text"
            value={formData.amenities?.join(', ') || ''}
            onChange={handleAmenitiesChange}
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
        <button type="submit" className="btn-primary">
          Зберегти
        </button>
      </form>
    </div>
  );
};

export default AdminEditAccommodation;
