import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const BASE_URL = "http://localhost:8080/api/v1";

const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        // Запит до бекенду для отримання даних про житло
        const response = await axios.get(`${BASE_URL}/accommodations/${id}`);
        setAccommodation(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodation();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/bookings`, // Припускаємо, що ендпоінт для бронювання - /bookings
        {
          accommodationId: id,
          checkInDate,
          checkOutDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Бронювання успішне!", response.data);
      navigate(`/payment/${response.data.id}`);
    } catch (err) {
      console.error("Помилка бронювання:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Помилка бронювання");
    }
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  if (!accommodation) {
    return <div>Помешкання не знайдено.</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        {/* Використовуємо поле 'picture' з бекенду */}
        {accommodation.picture && (
          <img src={accommodation.picture} className="card-img-top" alt={accommodation.location} />
        )}
        <div className="card-body">
          <h1 className="card-title">{accommodation.location}</h1>
          <p className="card-text">
            <strong>Тип:</strong> {accommodation.type}
          </p>
          <p className="card-text">
            <strong>Розмір:</strong> {accommodation.size}
          </p>
          <p className="card-text">
            <strong>Зручності:</strong> {accommodation.amenities.join(", ")}
          </p>
          <p className="card-text">
            <strong>Ціна за добу:</strong> {accommodation.dailyRate} $
          </p>
          <p className="card-text">
            <strong>Доступно:</strong> {accommodation.availability}
          </p>
          <p className="card-text">
            <strong>Адреса:</strong> {accommodation.location}
          </p>

          <hr />

          {/* Форма бронювання */}
          <form onSubmit={handleBooking}>
            <h3>Забронювати</h3>
            <div className="form-group">
              <label>Дата заїзду:</label>
              <input
                type="date"
                className="form-control"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label>Дата виїзду:</label>
              <input
                type="date"
                className="form-control"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <button type="submit" className="btn btn-success mt-3" disabled={!accommodation.availability}>
              Забронювати
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetails;
