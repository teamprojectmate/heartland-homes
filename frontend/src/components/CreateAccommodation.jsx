// src/components/CreateAccommodation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import Notification from './Notification';

const CreateAccommodation = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    type: 'HOUSE',
    location: '',
    size: '',
    amenities: [],
    dailyRate: '',
    availability: '',
    picture: ''
  });
  const [error, setError] = useState(null);

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
      await axios.post('/accommodations', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate('/admin/accommodations');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка при створенні');
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
          <label>Розмір</label>
          <input type="text" name="size" value={formData.size} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Зручності (через кому)</label>
          <input type="text" onChange={handleAmenitiesChange} />
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
          <label>Кількість доступних</label>
          <input
            type="number"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>URL зображення</label>
          <input
            type="text"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-primary">
          Створити
        </button>
      </form>
    </div>
  );
};

export default CreateAccommodation;
