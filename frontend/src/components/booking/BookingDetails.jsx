// src/components/booking/BookingDetails.jsx
import React from 'react';
import BookingInfo from './BookingInfo';
import BookingActions from './BookingActions';

import '../../styles/components/booking/_booking-card.scss';
import '../../styles/components/booking/_booking-details.scss';

const BookingDetails = ({ booking, onCancel, onDelete }) => {
  if (!booking) return null;

  return (
    <div className="container booking-details-page">
      <h1 className="section-heading">Деталі бронювання</h1>

      <div className="details-grid">
        {/* Ліва частина */}
        <BookingInfo booking={booking} />

        {/* Права частина */}
        <BookingActions booking={booking} onCancel={onCancel} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default BookingDetails;
