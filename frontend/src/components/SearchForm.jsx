// src/components/SearchForm.jsx
import React, { useState } from 'react';
import '../styles/components/_forms.scss';
import '../styles/components/_buttons.scss';

const SearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    city: '',
    type: '',
    accommodationSize: '',
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
        <label>Місто</label>
        <input
          type="text"
          name="city"
          placeholder="Наприклад, Київ"
          className="form-control"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <div className="search-input-group">
        <label>Тип</label>
        <select
          name="type"
          className="form-control"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="">Будь-який</option>
          <option value="HOUSE">Будинок</option>
          <option value="APARTMENT">Квартира</option>
          <option value="CONDO">Кондо</option>
          <option value="VACATION_HOME">Будинок для відпочинку</option>
        </select>
      </div>

      <div className="search-input-group">
        <label>Розмір</label>
        <select
          name="accommodationSize"
          className="form-control"
          value={formData.accommodationSize}
          onChange={handleChange}
        >
          <option value="">Будь-який</option>
          <option value="SMALL">Маленький</option>
          <option value="MEDIUM">Середній</option>
          <option value="LARGE">Великий</option>
        </select>
      </div>

      <div className="search-input-group">
        <label>Ціна від</label>
        <input
          type="number"
          name="minDailyRate"
          className="form-control"
          value={formData.minDailyRate}
          onChange={handleChange}
        />
      </div>

      <div className="search-input-group">
        <label>Ціна до</label>
        <input
          type="number"
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
