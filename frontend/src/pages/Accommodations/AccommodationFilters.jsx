import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import '../../styles/components/_forms.scss';
import '../../styles/components/_buttons.scss';
import '../../styles/components/_filters.scss';

const AccommodationFilters = ({
  cities,
  type,
  size,
  minDailyRate,
  maxDailyRate,
  setCities,
  setType,
  setSize,
  setMinDailyRate,
  setMaxDailyRate,
  onApplyFilters,
  onResetFilters
}) => {
  // 🔹 Обробка міста
  const handleCityChange = (e) => {
    const value = e.target.value.trim();
    setCities(value ? [value] : []);
  };

  // 🔹 Обробка чекбоксів типів житла
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setType([...type, value]);
    } else {
      setType(type.filter((t) => t !== value));
    }
  };

  // 🔹 Обробка розміру (select → завжди масив)
  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSize(value ? [value] : []); // ✅ гарантуємо масив
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
              value={cities[0] || ''}
              onChange={handleCityChange}
            />
          </div>

          {/* Тип житла */}
          <div className="filter-item">
            <label>Тип житла</label>
            <div className="form-check-group">
              {['HOUSE', 'APARTMENT', 'CONDO', 'VACATION_HOME'].map((t) => (
                <label className="form-check" key={t}>
                  <input
                    type="checkbox"
                    value={t}
                    checked={type.includes(t)}
                    onChange={handleTypeChange}
                  />
                  {t === 'HOUSE' && 'Будинок'}
                  {t === 'APARTMENT' && 'Квартира'}
                  {t === 'CONDO' && 'Кондо'}
                  {t === 'VACATION_HOME' && 'Дім для відпочинку'}
                </label>
              ))}
            </div>
          </div>

          {/* Розмір */}
          <div className="filter-item">
            <label>Розмір</label>
            <select
              className="form-control"
              value={size[0] || ''} // ✅ беремо перший елемент
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
              value={minDailyRate || ''}
              onChange={(e) => setMinDailyRate(e.target.value)}
            />
          </div>

          {/* Ціна до */}
          <div className="filter-item">
            <label>Ціна до (₴)</label>
            <input
              type="number"
              className="form-control"
              placeholder="До, грн"
              value={maxDailyRate || ''}
              onChange={(e) => setMaxDailyRate(e.target.value)}
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
