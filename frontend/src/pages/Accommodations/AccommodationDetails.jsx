import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../../components/BookingForm';
import LocationMap from '../../components/LocationMap';
import AccommodationGallery from './AccommodationGallery';
import { getAccommodationById } from '../../api/accommodations/accommodationService';

// словники
import { mapType, mapAmenity } from '../../utils/translations';

// стилі
import '../../styles/components/_accommodation-details.scss';
import '../../styles/components/_accommodation-gallery.scss';
import '../../styles/components/_badges.scss';

const AccommodationDetails = () => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const data = await getAccommodationById(id);

        if (!data) {
          setError('Помешкання не знайдено.');
          return;
        }
        setAccommodation(data);
      } catch (err) {
        console.error('❌ Помилка завантаження житла:', err);
        setError('Не вдалося завантажити деталі помешкання.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodation();
  }, [id]);

  if (loading) return <div className="loading">Завантаження...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!accommodation) return <div className="not-found">Помешкання не знайдено.</div>;

  // тип житла
  const {
    label: typeLabel,
    icon: typeIcon,
    color: typeColor
  } = mapType(accommodation.type);

  return (
    <div className="accommodation-details-page">
      {/* Заголовок */}
      <div className="page-header">
        <h2 className="page-title">Деталі помешкання</h2>
        <p className="page-subtitle">{accommodation?.location || 'Без адреси'}</p>
      </div>

      {/* Галерея */}
      <AccommodationGallery
        images={
          accommodation.images || (accommodation.image ? [accommodation.image] : [])
        }
      />

      {/* Контент */}
      <div className="details-grid">
        <div className="details-info-section">
          <div className="details-card">
            <h4 className="details-section-title">Інформація</h4>

            <div className="characteristics-inline">
              <span className="badge badge-type" style={{ backgroundColor: typeColor }}>
                {typeIcon} {typeLabel}
              </span>

              <span className="badge badge-size">
                {accommodation?.size || '—'} Спальні
              </span>
            </div>

            <div className="mt-3">
              <strong>Зручності:</strong>
              <div className="badge-group mt-2">
                {accommodation?.amenities?.length > 0 ? (
                  accommodation.amenities.map((amenity, index) => {
                    const { label, icon, slug, color } = mapAmenity(amenity);
                    return (
                      <span
                        key={index}
                        className={`badge badge-amenity ${slug}`}
                        style={{ backgroundColor: color, color: '#fff' }}
                      >
                        {icon} {label}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-muted">немає даних</span>
                )}
              </div>
            </div>
          </div>

          {accommodation?.latitude && accommodation?.longitude && (
            <div className="location-map-container">
              <h4 className="details-section-title">Розташування</h4>
              <LocationMap
                location={accommodation?.location}
                city={accommodation?.city}
                latitude={accommodation?.latitude}
                longitude={accommodation?.longitude}
              />
            </div>
          )}
        </div>

        {/* Блок бронювання */}
        <div className="booking-card">
          <h5 className="booking-title">Забронювати</h5>
          <p className="booking-price">
            {accommodation?.dailyRate || '—'} грн <span>/ доба</span>
          </p>
          {accommodation?.id ? (
            <BookingForm
              accommodationId={accommodation.id}
              dailyRate={accommodation.dailyRate}
            />
          ) : (
            <p className="text-muted">Бронювання недоступне</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetails;
