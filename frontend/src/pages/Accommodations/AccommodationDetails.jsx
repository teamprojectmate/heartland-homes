import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../../components/BookingForm';
import LocationMap from '../../components/LocationMap';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';
import '../../styles/components/_accommodation-details.scss';

const AccommodationDetails = () => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ ВИПРАВЛЕНО: Додаємо фавікон програмно
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href =
      'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>'; // Емодзі-фавікон
    document.head.appendChild(link);
  }, []);

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

  const imageUrl = accommodation.image
    ? fixDropboxUrl(accommodation.image)
    : '/no-image.png';

  return (
    <div className="container mt-4 accommodation-details-container">
      <div className="row">
        <div className="col-md-8">
          <div className="card card-custom p-3">
            <img
              src={imageUrl}
              alt={accommodation.location || 'Зображення житла'}
              className="card-img-top card-img-top-custom mb-3"
              onError={(e) => (e.target.src = '/no-image.png')}
            />
            <h1 className="details-heading">{accommodation.location}</h1>
            <hr />
            <h4 className="details-subheading">Характеристики</h4>
            <ul className="details-list">
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

          <div className="mt-4 location-map-container">
            <h4 className="details-subheading">Розташування</h4>
            <LocationMap
              location={accommodation.location}
              city={accommodation.city}
              latitude={accommodation.latitude}
              longitude={accommodation.longitude}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card booking-card p-3 sticky-top">
            <h5 className="booking-title">Забронювати</h5>
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
