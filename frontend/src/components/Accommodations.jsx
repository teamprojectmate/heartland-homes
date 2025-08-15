import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

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

  // Оновлений стан для фільтрів.
  // ✅ Зміни тут: зчитуємо query з URL
  const [cities, setCities] = useState(
    searchParams.get("query")
      ? [searchParams.get("query")]
      : searchParams.getAll("city"),
  );
  const [types, setTypes] = useState(searchParams.getAll("type"));
  const [minDailyRate, setMinDailyRate] = useState(
    searchParams.get("minDailyRate") || "",
  );
  const [maxDailyRate, setMaxDailyRate] = useState(
    searchParams.get("maxDailyRate") || "",
  );

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", page);

        // ✅ Зміни тут: використовуємо оновлений стан cities
        cities.forEach((city) => params.append("city", city));
        types.forEach((type) => params.append("type", type));

        if (minDailyRate) params.append("minDailyRate", minDailyRate);
        if (maxDailyRate) params.append("maxDailyRate", maxDailyRate);

        const response = await axios.get(`${BASE_URL}/accommodations/search`, {
          params,
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
  }, [page, cities, types, minDailyRate, maxDailyRate]);

  // Функції для зміни сторінки
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // ✅ Обробник для типу помешкання (чекбокс)
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTypes([...types, value]);
    } else {
      setTypes(types.filter((type) => type !== value));
    }
  };

  // ✅ Новий обробник для міста
  const handleCityChange = (e) => {
    setCities(e.target.value.split(",").map((c) => c.trim()));
  };

  if (loading) {
    return (
      <div className="container page mt-4">
        <p className="text-xs-center">Завантаження...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page mt-4">
        <p className="text-xs-center text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container page mt-4">
      <h1 className="text-xs-center">Доступне житло</h1>

      <div className="card my-4 p-4">
        <h5 className="card-title">Фільтри</h5>
        <div className="row">
          <div className="col-md-3 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Місто (через кому)"
              value={cities.join(",")}
              // ✅ Виправлення тут: використовуємо новий обробник
              onChange={handleCityChange}
            />
          </div>
          <div className="col-md-3 mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="HOUSE"
                id="typeHouse"
                checked={types.includes("HOUSE")}
                onChange={handleTypeChange}
              />
              <label className="form-check-label" htmlFor="typeHouse">
                Будинок
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="APARTMENT"
                id="typeApartment"
                checked={types.includes("APARTMENT")}
                onChange={handleTypeChange}
              />
              <label className="form-check-label" htmlFor="typeApartment">
                Квартира
              </label>
            </div>
            {/* Додайте інші типи за потребою */}
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
                    Розмір: {accommodation.size}, Ціна:{" "}
                    {accommodation.dailyRate}$
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

      <nav className="my-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(page - 1)}
            >
              Попередня
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${page === i ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => handlePageChange(i)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(page + 1)}
            >
              Наступна
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Accommodations;
