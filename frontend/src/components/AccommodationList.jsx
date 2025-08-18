import React from "react";
import { Link } from "react-router-dom";

const AccommodationList = ({ accommodations }) => {
  return (
    <div className="row"> {/* ✅ Змінено app-row на row */}
      {accommodations.length > 0 ? (
        accommodations.map((accommodation) => (
          <div key={accommodation.id} className="col-md-4 mb-4"> {/* ✅ Змінено app-col-md-4 на col-md-4 */}
            <div className="card-custom">
              <img
                src={accommodation.mainPhotoUrl}
                className="card-img-top-custom"
                alt={accommodation.location}
              />
              <div className="card-body">
                <h5 className="card-title">{accommodation.location}</h5>
                <p className="card-text">
                  Розмір: {accommodation.size}, Ціна:{" "}
                  {accommodation.dailyRate}$
                </p>
                <Link
                  to={`/accommodations/${accommodation.id}`}
                  className="btn-primary"
                >
                  Переглянути
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">
          Помешкання за вибраними фільтрами не знайдено.
        </p>
      )}
    </div>
  );
};

export default AccommodationList;
