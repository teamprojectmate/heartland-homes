// src/components/AccommodationFilters.jsx
import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import '../styles/components/_forms.scss';
import '../styles/components/_buttons.scss';
import '../styles/components/_filters.scss';

const AccommodationFilters = ({
  cities,
  types,
  sizes,
  minDailyRate,
  maxDailyRate,
  setCities,
  setTypes,
  setSizes,
  setMinDailyRate,
  setMaxDailyRate,
  onApplyFilters,
  onResetFilters
}) => {
  // 🔹 Обробка міста
  const handleCityChange = (e) => {
    setCities(
      e.target.value
        .split(',')
        .map((city) => city.trim())
        .filter(Boolean)
    );
  };

  // 🔹 Обробка чекбоксів типів житла
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTypes([...types, value]);
    } else {
      setTypes(types.filter((type) => type !== value));
    }
  };

  // 🔹 Обробка розміру
  const handleSizeChange = (e) => {
    setSizes(
      e.target.value
        .split(',')
        .map((size) => size.trim())
        .filter(Boolean)
    );
  };

  return (
    <section className="filters-section">
      <div className="filters-box">
        <h4 className="filters-heading">Фільтри та сортування</h4>

        {/* Сітка фільтрів */}
        <div className="filters-grid">
          {/* Місто */}
          <div className="filter-item">
            <label>Місто (через кому)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Київ, Львів"
              value={cities.join(', ')}
              onChange={handleCityChange}
            />
          </div>

          {/* Тип житла */}
          <div className="filter-item">
            <label>Тип житла</label>
            <div className="form-check-group">
              <label className="form-check">
                <input
                  type="checkbox"
                  value="HOUSE"
                  checked={types.includes('HOUSE')}
                  onChange={handleTypeChange}
                />
                Будинок
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  value="APARTMENT"
                  checked={types.includes('APARTMENT')}
                  onChange={handleTypeChange}
                />
                Квартира
              </label>
            </div>
          </div>

          {/* Розмір */}
          <div className="filter-item">
            <label>Розмір</label>
            <input
              type="text"
              className="form-control"
              placeholder="Напр. 2 кімнати"
              value={sizes.join(', ')}
              onChange={handleSizeChange}
            />
          </div>

          {/* Ціна від */}
          <div className="filter-item">
            <label>Ціна від</label>
            <input
              type="number"
              className="form-control"
              placeholder="Від"
              value={minDailyRate}
              onChange={(e) => setMinDailyRate(e.target.value)}
            />
          </div>

          {/* Ціна до */}
          <div className="filter-item">
            <label>Ціна до</label>
            <input
              type="number"
              className="form-control"
              placeholder="До"
              value={maxDailyRate}
              onChange={(e) => setMaxDailyRate(e.target.value)}
            />
          </div>
        </div>

        {/* ✅ Футер з кнопками */}
        <div className="filters-actions">
          <button className="btn-primary btn-with-icon" onClick={onApplyFilters}>
            <Filter size={18} /> Застосувати
          </button>
          <button className="btn-outline btn-with-icon" onClick={onResetFilters}>
            <RotateCcw size={18} /> Скинути
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccommodationFilters;
