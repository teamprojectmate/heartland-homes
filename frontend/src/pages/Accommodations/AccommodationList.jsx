// src/pages/Accommodations/AccommodationList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// ✅ Утиліта для виправлення Dropbox URL (отримуємо raw-зображення)
const fixDropboxUrl = (url) => {
  if (!url) return '';
  return url.replace('dl=0', 'raw=1');
};

// ✅ Мапа статусів → кольори та тексти
const statusLabels = {
  PENDING: { text: 'Очікує', className: 'badge-pending' },
  PAID: { text: 'Оплачено', className: 'badge-paid' },
  CANCELLED: { text: 'Скасовано', className: 'badge-cancelled' }
};

const AccommodationList = ({ accommodations }) => {
  if (!accommodations || accommodations.length === 0) {
    return <p className="text-center">Немає доступних помешкань.</p>;
  }

  return (
    <div className="cards-grid">
      {accommodations.map((acc) => (
        <div key={acc.id} className="card-custom">
          {acc.image ? (
            <img
              src={fixDropboxUrl(acc.image)}
              alt={acc.location}
              className="card-img-top-custom"
            />
          ) : (
            <div className="card-img-placeholder">Без зображення</div>
          )}

          <div className="card-body">
            <h5 className="card-title">{acc.location}</h5>

            {/* 🏷️ бейджі */}
            <div className="card-badges">
              <span className="badge badge-type">{acc.type}</span>
              <span className="badge badge-size">{acc.size}</span>

              {/* 🔹 статус, якщо бекенд повернув */}
              {acc.status && (
                <span className={`badge ${statusLabels[acc.status]?.className || ''}`}>
                  {statusLabels[acc.status]?.text || acc.status}
                </span>
              )}
            </div>

            <p className="text-muted">{acc.city}</p>

            <p className="card-price">{acc.dailyRate} грн / доба</p>

            <Link to={`/accommodations/${acc.id}`} className="btn btn-primary w-100">
              Детальніше
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccommodationList;
