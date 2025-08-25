import React from 'react';
import { Link } from 'react-router-dom';

const AccommodationList = ({ accommodations }) => {
  if (!accommodations || accommodations.length === 0) {
    return <p className="text-center">Немає доступних помешкань.</p>;
  }

  return (
    <div className="row">
      {accommodations.map((acc) => (
        <div key={acc.id} className="col-md-4 mb-4">
          <div className="card card-custom h-100">
            {acc.image ? (
              <img
                src={acc.image}
                alt={acc.location}
                className="card-img-top card-img-top-custom"
              />
            ) : (
              <div className="card-img-placeholder">Без зображення</div>
            )}

            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{acc.location}</h5>
              <p className="text-muted">
                {acc.city} • {acc.type}
              </p>
              <p>
                <strong>Ціна:</strong> {acc.dailyRate}$ / доба
              </p>
              <p>
                <strong>Розмір:</strong> {acc.size}
              </p>

              <div className="mt-auto">
                <Link to={`/accommodations/${acc.id}`} className="btn-primary w-100">
                  Детальніше
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccommodationList;
