import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import { createAccommodation } from '../../api/accommodations/accommodationService';
import { mapType, mapAmenity } from '../../utils/translations';
import { getSafeImageUrl } from '../../utils/getSafeImageUrl';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import setupLeaflet from '../../utils/leafletConfig';
import 'leaflet/dist/leaflet.css';

setupLeaflet();

// Стандартна іконка
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// компонент для кліку по карті
const LocationPicker = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      setCoordinates({
        latitude: e.latlng.lat.toFixed(6),
        longitude: e.latlng.lng.toFixed(6)
      });
    }
  });
  return null;
};

const CreateAccommodation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: 'HOUSE',
    location: '',
    city: '',
    latitude: '',
    longitude: '',
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

  const setCoordinates = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude
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
      navigate('/accommodations');
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

        {/* Тип */}
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

        {/* Карта */}
        <div className="form-group">
          <label>Виберіть розташування на карті</label>
          <div style={{ height: '300px', width: '100%', marginBottom: '1rem' }}>
            <MapContainer
              center={[49, 31]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <LocationPicker setCoordinates={setCoordinates} />
              {formData.latitude && formData.longitude && (
                <Marker
                  position={[formData.latitude, formData.longitude]}
                  icon={defaultIcon}
                />
              )}
            </MapContainer>
          </div>
          {formData.latitude && formData.longitude && (
            <p>
              📍 Обрані координати: {formData.latitude}, {formData.longitude}
            </p>
          )}
        </div>

        {/* Amenities */}
        <div className="form-group">
          <label>Зручності (через кому)</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="Wi-Fi, кухня, кондиціонер..."
          />
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
          {formData.image && (
            <div className="preview-image" style={{ marginTop: '0.5rem' }}>
              <img
                src={getSafeImageUrl(formData.image)}
                alt="Превʼю"
                style={{ maxWidth: '200px', borderRadius: '8px' }}
                onError={(e) => (e.currentTarget.src = '/no-image.png')}
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Створення...' : 'Створити'}
        </button>
      </form>
    </div>
  );
};

export default CreateAccommodation;
