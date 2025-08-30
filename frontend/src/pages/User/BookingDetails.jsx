import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookingById, cancelBooking } from '../../api/bookings/bookingsService';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import BookingCard from '../../components/BookingCard';

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await fetchBookingById(id); // ✅ виправлено назву функції
        let accommodation = null;
        try {
          accommodation = await getAccommodationById(data.accommodationId);
        } catch (err) {
          console.warn('⚠️ Не вдалось отримати житло:', err);
        }
        setBooking({ ...data, accommodation });
      } catch (err) {
        console.error('❌ Помилка завантаження бронювання:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      window.location.reload();
    } catch (err) {
      console.error('❌ Помилка скасування:', err);
    }
  };

  if (loading) return <p className="text-center">Завантаження...</p>;
  if (!booking) return <p className="text-center">Бронювання не знайдено</p>;

  return (
    <div className="container page">
      <h1 className="text-center">Деталі бронювання</h1>
      <BookingCard booking={booking} onCancel={handleCancelBooking} />
    </div>
  );
}

export default BookingDetails;
