import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import { createAccommodation } from '../../api/accommodations/accommodationService';
import AccommodationFormFields from '../../components/AccommodationFormFields';
const CreateAccommodation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container page">
      <h1 className="text-center">Створити помешкання</h1>
      {error && <Notification message={error} type="danger" />}
      <form onSubmit={handleSubmit} className="form">
        {/* ✅ Використовуємо перевикористовуваний компонент для полів форми */}
        <AccommodationFormFields formData={formData} handleChange={handleChange} />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Створення...' : 'Створити'}
        </button>
      </form>
    </div>
  );
};

export default CreateAccommodation;
