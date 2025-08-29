// src/pages/Accommodations/AccommodationCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';

const fallbackImage = '/no-image.png';

const AccommodationCard = ({ accommodation }) => {
  const imageUrl = accommodation.image
    ? fixDropboxUrl(accommodation.image)
    : fallbackImage;

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
          <span className="badge badge-type">{accommodation.type}</span>
          <span className="badge badge-size">
            {accommodation.accommodationSize || accommodation.size || '—'}
          </span>
        </div>

        <p className="card-text">{accommodation.city}</p>
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
