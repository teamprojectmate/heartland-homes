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
    city: filters.city.length > 0 ? filters.city[0] : '',
    type: filters.type.length > 0 ? filters.type[0] : '',
    size: filters.size.length > 0 ? filters.size[0] : '', // ✅ тільки перший елемент
    minDailyRate: filters.minDailyRate ?? '',
    maxDailyRate: filters.maxDailyRate ?? '',
    page,
    sizePage: size
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

    // 🔹 Зберігаємо фільтри у Redux
    dispatch(
      setFilters({
        city: formData.city ? [formData.city] : [],
        type: formData.type ? [formData.type] : [],
        size: formData.size ? [formData.size] : [], // ✅ завжди масив
        minDailyRate: formData.minDailyRate ? Number(formData.minDailyRate) : undefined,
        maxDailyRate: formData.maxDailyRate ? Number(formData.maxDailyRate) : undefined
      })
    );

    dispatch(setPage(0));
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
          placeholder="Наприклад, Kyiv"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      {/* Тип житла */}
      <div className="search-input-group">
        <label htmlFor="type">Тип</label>
        <select
          id="type"
          name="type"
          className="form-control"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="">Будь-який</option>
          <option value="HOUSE">House</option>
          <option value="APARTMENT">Apartment</option>
          <option value="CONDO">Condo</option>
          <option value="VACATION_HOME">Vacation Home</option>
        </select>
      </div>

      {/* Розмір */}
      <div className="search-input-group">
        <label htmlFor="size">Розмір</label>
        <select
          id="size"
          name="size"
          className="form-control"
          value={formData.size} // ✅ рядок
          onChange={handleChange}
        >
          <option value="">Будь-який</option>
          <option value="SMALL">Small</option>
          <option value="MEDIUM">Medium</option>
          <option value="LARGE">Large</option>
        </select>
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
