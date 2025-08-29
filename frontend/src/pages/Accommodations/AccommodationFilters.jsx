// src/pages/Accommodations/AccommodationFilters.jsx
import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import '../../styles/components/_forms.scss';
import '../../styles/components/_buttons.scss';
import '../../styles/components/_filters.scss';

const AccommodationFilters = ({
  city,
  type,
  size,
  minDailyRate,
  maxDailyRate,
  setCity,
  setType,
  setSize,
  setMinDailyRate,
  setMaxDailyRate,
  onApplyFilters,
  onResetFilters
}) => {
  // 🔹 Місто
  const handleCityChange = (e) => {
    setCity(e.target.value.trim() || null);
  };

  // 🔹 Тип житла (одне значення ENUM)
  const handleTypeChange = (e) => {
    setType(e.target.value || null);
  };

  // 🔹 Розмір (одне значення ENUM)
  const handleSizeChange = (e) => {
    setSize(e.target.value || null);
  };

  return (
    <section className="filters-section">
      <div className="filters-box">
        <h4 className="filters-heading">Фільтри та сортування</h4>

        <div className="filters-grid">
          {/* Місто */}
          <div className="filter-item">
            <label>Місто</label>
            <input
              type="text"
              className="form-control"
              placeholder="Наприклад Київ"
              value={city || ''}
              onChange={handleCityChange}
            />
          </div>

          {/* Тип житла */}
          <div className="filter-item">
            <label>Тип житла</label>
            <select
              className="form-control"
              value={type || ''}
              onChange={handleTypeChange}
            >
              <option value="">Будь-який</option>
              <option value="HOUSE">Будинок</option>
              <option value="APARTMENT">Квартира</option>
              <option value="CONDO">Кондо</option>
              <option value="VACATION_HOME">Дім для відпочинку</option>
            </select>
          </div>

          {/* Розмір */}
          <div className="filter-item">
            <label>Розмір</label>
            <select
              className="form-control"
              value={size || ''}
              onChange={handleSizeChange}
            >
              <option value="">Будь-який</option>
              <option value="SMALL">Маленький</option>
              <option value="MEDIUM">Середній</option>
              <option value="LARGE">Великий</option>
            </select>
          </div>

          {/* Ціна від */}
          <div className="filter-item">
            <label>Ціна від (₴)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Від, грн"
              value={minDailyRate ?? ''}
              onChange={(e) =>
                setMinDailyRate(e.target.value ? Number(e.target.value) : null)
              }
            />
          </div>

          {/* Ціна до */}
          <div className="filter-item">
            <label>Ціна до (₴)</label>
            <input
              type="number"
              className="form-control"
              placeholder="До, грн"
              value={maxDailyRate ?? ''}
              onChange={(e) =>
                setMaxDailyRate(e.target.value ? Number(e.target.value) : null)
              }
            />
          </div>
        </div>

        {/* Кнопки */}
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
