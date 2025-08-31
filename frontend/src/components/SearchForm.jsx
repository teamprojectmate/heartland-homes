import React, { useState } from 'react';
import '../styles/components/_forms.scss';
import '../styles/components/_buttons.scss';
import '../styles/components/_searchForm.scss';

// Опції для типів і розмірів житла
const ACCOMMODATION_TYPES = [
  { value: 'HOUSE', label: 'Будинок' },
  { value: 'APARTMENT', label: 'Квартира' },
  { value: 'HOTEL', label: 'Готель' },
  { value: 'VACATION_HOME', label: 'Дім для відпочинку' },
  { value: 'HOSTEL', label: 'Хостел' }
];

const ACCOMMODATION_SIZES = [
  { value: 'SMALL', label: 'Маленький' },
  { value: 'MEDIUM', label: 'Середній' },
  { value: 'LARGE', label: 'Великий' }
];

const SearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    city: '',
    type: '',
    size: '',
    minDailyRate: '',
    maxDailyRate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(e, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form-container">
      <div className="search-input-group">
        <label htmlFor="city">Місто</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Наприклад, Київ"
          className="form-control"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <div className="search-input-group">
        <label htmlFor="type">Тип житла</label>
        <select
          id="type"
          name="type"
          className="form-control"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="">Будь-який</option>
          {ACCOMMODATION_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="search-input-group">
        <label htmlFor="size">Розмір</label>
        <select
          id="size"
          name="size"
          className="form-control"
          value={formData.size}
          onChange={handleChange}
        >
          <option value="">Будь-який</option>
          {ACCOMMODATION_SIZES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="search-input-group">
        <label htmlFor="minDailyRate">Ціна від</label>
        <input
          type="number"
          id="minDailyRate"
          name="minDailyRate"
          className="form-control"
          value={formData.minDailyRate}
          onChange={handleChange}
        />
      </div>

      <div className="search-input-group">
        <label htmlFor="maxDailyRate">Ціна до</label>
        <input
          type="number"
          id="maxDailyRate"
          name="maxDailyRate"
          className="form-control"
          value={formData.maxDailyRate}
          onChange={handleChange}
        />
      </div>

      <button className="btn-primary" type="submit">
        🔍 Шукати
      </button>
    </form>
  );
};

export default SearchForm;
