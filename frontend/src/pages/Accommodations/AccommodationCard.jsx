import React from 'react';
import { Link } from 'react-router-dom';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';
import { mapType } from '../../utils/translations';

const fallbackImage = '/no-image.png';

const AccommodationCard = ({ accommodation }) => {
  const imageUrl = accommodation.image
    ? fixDropboxUrl(accommodation.image)
    : fallbackImage;

  // тип житла (переклад + іконка + колір)
  const { label, icon, color } = mapType(accommodation.type);

  return (
    <div className="card-custom">
      <img
        src={imageUrl}
        alt={accommodation.location || 'Зображення житла'}
        className="card-img-top-custom"
        onError={(e) => (e.target.src = fallbackImage)}
      />

      <div className="card-body">
        <h3 className="card-title">{accommodation.location}</h3>

        <div className="card-badges">
          <span className="badge badge-type" style={{ backgroundColor: color }}>
            {icon} {label}
          </span>

          {/* ✅ виправлений бейдж кількості спалень */}
          {accommodation.size && (
            <span className="badge badge-size">
              {parseInt(accommodation.size, 10)}{' '}
              {parseInt(accommodation.size, 10) > 1 ? 'Спальні' : 'Спальня'}
            </span>
          )}
        </div>

        <p className="city-label">{accommodation.city}</p>

        <p className="card-price">{accommodation.dailyRate} грн / доба</p>

        <Link
          to={`/accommodations/${accommodation.id}`}
          className="btn btn-primary w-100"
        >
          Детальніше
        </Link>
      </div>
    </div>
  );
};

export default AccommodationCard;
