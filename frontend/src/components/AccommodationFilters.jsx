import React from "react";

const AccommodationFilters = ({
  cities,
  types,
  minDailyRate,
  maxDailyRate,
  sortBy,
  handleCityChange,
  handleTypeChange,
  setMinDailyRate,
  setMaxDailyRate,
  setSortBy,
}) => {
  return (
    <div className="filters-container">
      <h5 className="filter-heading">Фільтри та сортування</h5>
      <div className="row">
        <div className="col-md-3 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Місто (через кому)"
            value={cities.join(",")}
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
        <div className="col-md-3 mb-3">
          <label htmlFor="sortBy">Сортувати за:</label>
          <select
            id="sortBy"
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Без сортування</option>
            <option value="dailyRate_asc">Ціна (зростання)</option>
            <option value="dailyRate_desc">Ціна (спадання)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AccommodationFilters;
