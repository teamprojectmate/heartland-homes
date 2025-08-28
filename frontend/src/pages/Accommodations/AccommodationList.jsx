// src/pages/Accommodations/AccommodationList.jsx
import React from 'react';
import AccommodationCard from './AccommodationCard';

const AccommodationList = ({ accommodations }) => {
  if (!accommodations || accommodations.length === 0) {
    return <p className="text-center">Немає доступних помешкань.</p>;
  }

  return (
    <div className="cards-grid">
      {accommodations.map((acc) => (
        <AccommodationCard key={acc.id} accommodation={acc} />
      ))}
    </div>
  );
};

export default AccommodationList;
