// src/pages/Admin/CreateAccommodation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import { createAccommodation } from '../../api/accommodations/accommodationService';
import { mapType, mapAmenity } from '../../utils/translations/index';

const CreateAccommodation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: 'HOUSE',
    location: '',
    city: '',
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
        amenities: formData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
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
      <form onSubmit={handleSubmit} className="admin-form">
        <h1>Створити помешкання</h1>
        {error && <Notification message={error} type="danger" />}

        {/* Назва */}
        <div className="form-group">
          <label>Назва</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>

        {/* Тип + бейдж превʼю */}
        <div className="form-group">
          <label>Тип</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="HOUSE">Будинок</option>
            <option value="APARTMENT">Квартира</option>
            <option value="HOTEL">Готель</option>
            <option value="VACATION_HOME">Дім для відпочинку</option>
            <option value="HOSTEL">Хостел</option>
            <option value="COTTAGE">Котедж</option>
          </select>
          {formData.type && (
            <div className="badge-group" style={{ marginTop: '0.5rem' }}>
              {(() => {
                const type = mapType(formData.type);
                return (
                  <span className={`badge badge-type-${formData.type.toLowerCase()}`}>
                    {type.icon} {type.label}
                  </span>
                );
              })()}
            </div>
          )}
        </div>

        {/* Локація */}
        <div className="form-group">
          <label>Локація</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* Місто */}
        <div className="form-group">
          <label>Місто</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} />
        </div>

        {/* Latitude */}
        <div className="form-group">
          <label>Широта (Latitude)</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
          />
        </div>

        {/* Longitude */}
        <div className="form-group">
          <label>Довгота (Longitude)</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
          />
        </div>

        {/* Size */}
        <div className="form-group">
          <label>Розмір</label>
          <input type="text" name="size" value={formData.size} onChange={handleChange} />
        </div>

        {/* Amenities + бейджі */}
        <div className="form-group">
          <label>Зручності (через кому)</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="Wi-Fi, кухня, кондиціонер..."
          />
          <div className="badge-group" style={{ marginTop: '0.5rem' }}>
            {formData.amenities
              .split(',')
              .map((a) => a.trim())
              .filter(Boolean)
              .map((a, idx) => {
                const amenity = mapAmenity(a);
                return (
                  <span key={idx} className={`badge badge-amenity ${amenity.slug}`}>
                    {amenity.icon} {amenity.label}
                  </span>
                );
              })}
          </div>
        </div>

        {/* Daily rate */}
        <div className="form-group">
          <label>Ціна за добу</label>
          <input
            type="number"
            name="dailyRate"
            value={formData.dailyRate}
            onChange={handleChange}
          />
        </div>

        {/* Image */}
        <div className="form-group">
          <label>URL зображення</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
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
