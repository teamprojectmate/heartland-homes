// src/pages/Accommodations/AccommodationList.jsx
import React from 'react';
import AccommodationCard from './AccommodationCard';

const AccommodationList = ({ accommodations, onCardHover }) => {
  if (!accommodations || accommodations.length === 0) {
    return <p className="text-center">Немає доступних помешкань.</p>;
  }

  return (
    <div className="cards-grid">
      {accommodations.map((acc) => (
        <div
          key={acc.id}
          // ✅ ДОДАНО: обробники подій для наведення
          onMouseEnter={() => onCardHover(acc.id)}
          onMouseLeave={() => onCardHover(null)}
        >
          <AccommodationCard accommodation={acc} />
        </div>
      ))}
    </div>
  );
};

export default AccommodationList;
