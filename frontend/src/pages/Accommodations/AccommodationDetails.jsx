// src/pages/Accommodations/AccommodationDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../../components/BookingForm';
import LocationMap from '../../components/LocationMap';
import { getAccommodationById } from '../../api/accommodations/accommodationService';

// 🔹 утиліта для виправлення Dropbox URL
const fixDropboxUrl = (url) => {
  if (!url) return '';
  return url.replace('dl=0', 'raw=1');
};

const AccommodationDetails = () => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const data = await getAccommodationById(id);
        setAccommodation(data);
      } catch {
        setError('Не вдалося завантажити деталі помешкання.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodation();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Завантаження...</p>;
  if (error) return <p className="alert alert-danger mt-5 text-center">{error}</p>;
  if (!accommodation) return <p className="text-center mt-5">Помешкання не знайдено.</p>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card card-custom p-3">
            {accommodation.image ? (
              <img
                src={fixDropboxUrl(accommodation.image)} // ✅ правильний URL
                alt={accommodation.location}
                className="card-img-top card-img-top-custom mb-3"
              />
            ) : (
              <div className="card-img-placeholder mb-3">Без зображення</div>
            )}

            <h1>{accommodation.location}</h1>
            <hr />
            <h4>Характеристики</h4>
            <ul>
              <li>
                <strong>Тип:</strong> {accommodation.type}
              </li>
              <li>
                <strong>Кількість кімнат:</strong> {accommodation.size}
              </li>
              <li>
                <strong>Ціна:</strong> {accommodation.dailyRate} грн / доба
              </li>
              <li>
                <strong>Зручності:</strong>{' '}
                {accommodation.amenities && accommodation.amenities.length > 0
                  ? accommodation.amenities.join(', ')
                  : 'немає даних'}
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h4>Розташування</h4>
            <LocationMap location={accommodation.location} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card card-custom p-3">
            <h5>Забронювати</h5>
            <p>
              Ціна: <strong>{accommodation.dailyRate} грн</strong> / доба
            </p>
            <BookingForm
              accommodationId={accommodation.id}
              dailyRate={accommodation.dailyRate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetails;
