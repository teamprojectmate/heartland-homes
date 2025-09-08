// src/components/booking/BookingDetails.jsx
import React, { useMemo } from 'react';
import BookingInfo from './BookingInfo';
import BookingActions from './BookingActions';
import BookingStatusBlock from '../BookingStatusBlock';

import '../../styles/components/booking/_booking-card.scss';
import '../../styles/components/booking/_booking-details.scss';

const BookingDetails = ({ booking, onCancel, onDelete, onPay }) => {
  if (!booking) return null;

  // 🚀 Автофікс статусу (як у MyBookings.jsx)
  const enrichedBooking = useMemo(() => {
    if (!booking) return booking;
    let fixedStatus = booking.status;
    if (booking.payment?.status === 'PAID' && booking.status === 'PENDING') {
      fixedStatus = 'CONFIRMED';
    }
    return { ...booking, status: fixedStatus };
  }, [booking]);

  const isPaid = enrichedBooking.payment?.status === 'PAID';

  return (
    <div className="container booking-details-page">
      <h1 className="section-heading">Деталі бронювання</h1>

      <div className="details-grid">
        {/* 🔹 Ліва частина — інформація про бронювання */}
        <BookingInfo booking={enrichedBooking} />

        {/* 🔹 Права частина — статуси та дії */}
        <div className="details-actions">
          <BookingStatusBlock booking={enrichedBooking} />

          <BookingActions
            booking={enrichedBooking}
            onCancel={onCancel}
            onDelete={onDelete}
            onPay={onPay}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
