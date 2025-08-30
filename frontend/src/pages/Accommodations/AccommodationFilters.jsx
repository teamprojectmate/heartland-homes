import React, { useState, useEffect } from 'react';
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
  onApplyFilters,
  onResetFilters
}) => {
  // 🔹 Локальний state для вводу
  const [localFilters, setLocalFilters] = useState({
    city: city || '',
    type: type || '',
    size: size || '',
    minDailyRate: minDailyRate || '',
    maxDailyRate: maxDailyRate || ''
  });

  // Якщо Redux-фільтри оновились ззовні → оновлюємо локальні
  useEffect(() => {
    setLocalFilters({
      city: city || '',
      type: type || '',
      size: size || '',
      minDailyRate: minDailyRate || '',
      maxDailyRate: maxDailyRate || ''
    });
  }, [city, type, size, minDailyRate, maxDailyRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value
    }));
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
              name="city"
              className="form-control"
              placeholder="Наприклад Київ"
              value={localFilters.city}
              onChange={handleChange}
            />
          </div>

          {/* Тип житла */}
          <div className="filter-item">
            <label>Тип житла</label>
            <select
              name="type"
              className="form-control"
              value={localFilters.type}
              onChange={handleChange}
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
              name="size"
              className="form-control"
              value={localFilters.size}
              onChange={handleChange}
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
              name="minDailyRate"
              className="form-control"
              placeholder="Від, грн"
              value={localFilters.minDailyRate}
              onChange={handleChange}
            />
          </div>

          {/* Ціна до */}
          <div className="filter-item">
            <label>Ціна до (₴)</label>
            <input
              type="number"
              name="maxDailyRate"
              className="form-control"
              placeholder="До, грн"
              value={localFilters.maxDailyRate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="filters-actions">
          <button
            className="btn-primary btn-with-icon"
            onClick={(e) => onApplyFilters(e, localFilters)}
          >
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
