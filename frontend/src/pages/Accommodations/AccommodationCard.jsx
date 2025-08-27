import React from 'react';
import { Link } from 'react-router-dom';

const AccommodationCard = ({ accommodation }) => {
  return (
    <div className="card-custom">
      <img
        src={accommodation.image}
        alt={accommodation.location}
        className="card-img-top-custom"
      />

      <div className="card-body">
        <h3 className="card-title">{accommodation.location}</h3>

        {/* 🏷️ Бейджі */}
        <div className="card-badges">
          <span className="badge badge-type">{accommodation.type}</span>
          <span className="badge badge-size">{accommodation.size}</span>
        </div>

        <p className="card-text">{accommodation.city}</p>

        <p className="card-price">{accommodation.dailyRate} грн / доба</p>

        <Link to={`/accommodations/${accommodation.id}`} className="btn btn-primary">
          Детальніше
        </Link>
      </div>
    </div>
  );
};

export default AccommodationCard;
