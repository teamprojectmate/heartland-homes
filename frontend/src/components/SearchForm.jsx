import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ destination, checkInDate, checkOutDate, guests });
  };

  return (
    <form onSubmit={handleSubmit} className="search-form-container">
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
      <div className="search-input-group">
        <label htmlFor="check-in-date">Дата заїзду - Дата виїзду</label>
        <div className="date-inputs">
          <input
            type="date"
            id="check-in-date"
            className="form-control"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
          <span>-</span>
          <input
            type="date"
            id="check-out-date"
            className="form-control"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </div>
      </div>
      <div className="search-input-group">
        <label htmlFor="guests-count">Кількість дорослих</label>
        <input
          type="number"
          id="guests-count"
          className="form-control"
          min="1"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
        />
      </div>
      <button className="btn btn-primary search-btn" type="submit">
        Шукати
      </button>
    </form>
  );
};

export default SearchForm;
