// src/components/SearchForm.jsx
import React, { useState } from 'react';
import '../styles/components/_hero.scss';
import '../styles/components/_forms.scss';
import '../styles/components/_buttons.scss';

const SearchForm = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 Очищаємо від пробілів (щоб не було %20 у кінці)
    const cleanDestination = destination.trim();

    onSearch({
      destination: cleanDestination,
      checkInDate,
      checkOutDate,
      adults,
      children
    });
  };

  return (
    <form onSubmit={handleSubmit} className="search-form-container">
      {/* Місто */}
      <div className="search-input-group">
        <label htmlFor="destination-input">Куди ви вирушаєте?</label>
        <input
          type="text"
          id="destination-input"
          className="form-control"
          placeholder="Наприклад, Київ"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* Блок дат */}
      <div className="search-input-group date-range-group">
        <label>Дата заїзду - Дата виїзду</label>
        <div className="date-range-inputs">
          <input
            type="date"
            id="check-in-date"
            className="form-control"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
          <span className="date-separator">-</span>
          <input
            type="date"
            id="check-out-date"
            className="form-control"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </div>
      </div>

      {/* Дорослі */}
      <div className="search-input-group">
        <label htmlFor="adults-count">Кількість дорослих</label>
        <input
          type="number"
          id="adults-count"
          className="form-control"
          min="1"
          value={adults}
          onChange={(e) => setAdults(parseInt(e.target.value))}
        />
      </div>

      {/* Діти */}
      <div className="search-input-group">
        <label htmlFor="children-count">Кількість дітей</label>
        <input
          type="number"
          id="children-count"
          className="form-control"
          min="0"
          value={children}
          onChange={(e) => setChildren(parseInt(e.target.value))}
        />
      </div>

      <button className="btn-primary search-btn" type="submit">
        🔍 Шукати
      </button>
    </form>
  );
};

export default SearchForm;
