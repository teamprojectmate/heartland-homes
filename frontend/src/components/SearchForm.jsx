// src/components/SearchForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilters,
  setPage,
  loadAccommodations
} from '../store/slices/accommodationsSlice';
import '../styles/components/_forms.scss';
import '../styles/components/_buttons.scss';

const SearchForm = () => {
  const dispatch = useDispatch();
  const { filters, page, size } = useSelector((state) => state.accommodations);

  const [formData, setFormData] = useState({
    city: filters.city[0] || '',
    type: filters.type[0] || '',
    size: filters.size[0] || '',
    minDailyRate: filters.minDailyRate || 0,
    maxDailyRate: filters.maxDailyRate || 10000,
    page: page,
    sizePage: size
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 Зберігаємо фільтри у Redux
    dispatch(
      setFilters({
        city: formData.city ? [formData.city] : [],
        type: formData.type ? [formData.type] : [],
        size: formData.size ? [formData.size] : [],
        minDailyRate: Number(formData.minDailyRate),
        maxDailyRate: Number(formData.maxDailyRate)
      })
    );

    // 🔹 Скидаємо сторінку на 0
    dispatch(setPage(0));

    // 🔹 Завантажуємо дані
    dispatch(loadAccommodations());
  };

  return (
    <form onSubmit={handleSubmit} className="search-form-container">
      {/* Місто */}
      <div className="search-input-group">
        <label htmlFor="city">Місто</label>
        <input
          type="text"
          id="city"
          name="city"
          className="form-control"
          placeholder="Наприклад, Київ"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      {/* Тип */}
      <div className="search-input-group">
        <label htmlFor="type">Тип</label>
        <input
          type="text"
          id="type"
          name="type"
          className="form-control"
          placeholder="HOUSE, APARTMENT..."
          value={formData.type}
          onChange={handleChange}
        />
      </div>

      {/* Розмір */}
      <div className="search-input-group">
        <label htmlFor="size">Розмір</label>
        <input
          type="text"
          id="size"
          name="size"
          className="form-control"
          placeholder="Small, Medium..."
          value={formData.size}
          onChange={handleChange}
        />
      </div>

      {/* Ціна від */}
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

      {/* Ціна до */}
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

      <button className="btn-primary search-btn" type="submit">
        🔍 Шукати
      </button>
    </form>
  );
};

export default SearchForm;
