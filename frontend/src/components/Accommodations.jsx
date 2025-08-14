import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const BASE_URL = "http://localhost:8080/api/v1";

const Accommodations = () => {
  // Використовуємо useSearchParams для читання фільтрів з URL
  const [searchParams] = useSearchParams();

  // Стан для списку помешкань
  const [accommodations, setAccommodations] = useState([]);
  // Стан для пагінації
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Стан для фільтрів, які ти просив
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [size, setSize] = useState(searchParams.get("size") || "");
  const [minDailyRate, setMinDailyRate] = useState(searchParams.get("minDailyRate") || "");
  const [maxDailyRate, setMaxDailyRate] = useState(searchParams.get("maxDailyRate") || "");

  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        // ✅ Формуємо URL запиту з динамічними фільтрами
        const params = new URLSearchParams();
        params.append("page", page);
        if (city) params.append("location", city);
        if (type) params.append("type", type);
        if (size) params.append("size", size);
        if (minDailyRate) params.append("dailyRateMin", minDailyRate);
        if (maxDailyRate) params.append("dailyRateMax", maxDailyRate);

        const response = await axios.get(`${BASE_URL}/accommodations`, {
          params,
          headers: {
            Authorization: isAuthenticated ? `Bearer ${token}` : undefined,
          },
        });

        setAccommodations(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Не вдалося завантажити помешкання.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [page, city, type, size, minDailyRate, maxDailyRate, isAuthenticated, token]); // ✅ Додаємо фільтри до залежностей

  // Функції для зміни сторінки
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div className="container page mt-4"><p className="text-xs-center">Завантаження...</p></div>;
  }

  if (error) {
    return <div className="container page mt-4"><p className="text-xs-center text-danger">{error}</p></div>;
  }

  return (
    <div className="container page mt-4">
      <h1 className="text-xs-center">Доступне житло</h1>

      {/* ✅ Форма для фільтрації */}
      <div className="card my-4 p-4">
        <h5 className="card-title">Фільтри</h5>
        <div className="row">
          <div className="col-md-3 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Місто"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-3">
            {/* ✅ Використовуємо select для типу помешкання */}
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Всі типи</option>
              <option value="HOUSE">Будинок</option>
              <option value="APARTMENT">Квартира</option>
              <option value="CONDO">Кондо</option>
              <option value="VACATION_HOME">Будинок для відпочинку</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Розмір"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Ціна від"
              value={minDailyRate}
              onChange={(e) => setMinDailyRate(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Ціна до"
              value={maxDailyRate}
              onChange={(e) => setMaxDailyRate(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Список помешкань */}
      <div className="row">
        {accommodations.length > 0 ? (
          accommodations.map((accommodation) => (
            <div key={accommodation.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={accommodation.picture}
                  className="card-img-top"
                  alt={accommodation.location}
                />
                <div className="card-body">
                  <h5 className="card-title">{accommodation.location}</h5>
                  <p className="card-text">
                    Розмір: {accommodation.size}, Ціна: {accommodation.dailyRate}$
                  </p>
                  <Link
                    to={`/accommodations/${accommodation.id}`}
                    className="btn btn-primary"
                  >
                    Переглянути
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs-center">
            Помешкання за вибраними фільтрами не знайдено.
          </p>
        )}
      </div>

      {/* Пагінація */}
      <nav className="my-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(page - 1)}>
              Попередня
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(i)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(page + 1)}>
              Наступна</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Accommodations;
