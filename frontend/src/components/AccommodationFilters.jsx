// src/components/AccommodationFilters.jsx

import React from "react";
import "../styles/components/_filters.scss";
import "../styles/components/_forms.scss";
import "../styles/layout/_main-layout.scss";

const AccommodationFilters = ({
  cities = [],
  types = [],
  minDailyRate = "",
  maxDailyRate = "",
  sortBy = "",
  handleCityChange,
  handleTypeChange,
  setMinDailyRate,
  setMaxDailyRate,
  setSortBy,
}) => {
  return (
    <section className="filters-section">
      <div className="container">
        <div className="filters-box">
          <h5 className="filters-heading">Фільтри та сортування</h5>

          <div className="filters-grid">
            {/* Місто */}
            <div className="filter-item">
              <label htmlFor="city">Місто (через кому)</label>
              <input
                id="city"
                type="text"
                className="form-control"
                placeholder="Місто"
                value={cities.join(",")}
                onChange={handleCityChange}
              />
            </div>

            {/* Тип житла */}
            <div className="filter-item">
              <label>Тип житла</label>
              <div className="form-check-group">
                <label className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="HOUSE"
                    checked={types.includes("HOUSE")}
                    onChange={handleTypeChange}
                  />
                  <span className="form-check-label">Будинок</span>
                </label>
                <label className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="APARTMENT"
                    checked={types.includes("APARTMENT")}
                    onChange={handleTypeChange}
                  />
                  <span className="form-check-label">Квартира</span>
                </label>
              </div>
            </div>

            {/* Ціна від */}
            <div className="filter-item">
              <label htmlFor="priceFrom">Ціна від</label>
              <input
                id="priceFrom"
                type="number"
                className="form-control"
                placeholder="Ціна"
                value={minDailyRate}
                onChange={(e) => setMinDailyRate(e.target.value)}
              />
            </div>

            {/* Ціна до */}
            <div className="filter-item">
              <label htmlFor="priceTo">Ціна до</label>
              <input
                id="priceTo"
                type="number"
                className="form-control"
                placeholder="Ціна"
                value={maxDailyRate}
                onChange={(e) => setMaxDailyRate(e.target.value)}
              />
            </div>

            {/* Сортування */}
            <div className="filter-item filter-item--end">
              <label htmlFor="sortBy">Сортувати за:</label>
              <select
                id="sortBy"
                className="form-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Без сортування</option>
                <option value="dailyRate_asc">За ціною (зростання)</option>
                <option value="dailyRate_desc">За ціною (спадання)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationFilters;
