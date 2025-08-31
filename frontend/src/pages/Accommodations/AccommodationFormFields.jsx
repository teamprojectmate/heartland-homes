import React from 'react';
import PropTypes from 'prop-types';

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

const AccommodationFormFields = ({
  formData,
  handleChange,
  showLocation = true,
  showDailyRate = true,
  showDailyRateRange = false, // ✅ Новий пропс для діапазону цін
  showImage = true,
  showAmenities = true,
  showLatitude = true,
  showLongitude = true
}) => {
  return (
    <>
      <div className="form-group">
        <label>Тип житла</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Будь-який</option>
          {ACCOMMODATION_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Місто</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="form-control"
          placeholder="Наприклад, Київ"
        />
      </div>

      <div className="form-group">
        <label>Розмір</label>
        <select
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Будь-який</option>
          {ACCOMMODATION_SIZES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {showLocation && (
        <div className="form-group">
          <label>Локація</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      )}

      {showLatitude && (
        <div className="form-group">
          <label>Широта (Latitude)</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      )}

      {showLongitude && (
        <div className="form-group">
          <label>Довгота (Longitude)</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      )}

      {showAmenities && (
        <div className="form-group">
          <label>Зручності (через кому)</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      )}

      {showDailyRate && (
        <div className="form-group">
          <label>Ціна за добу</label>
          <input
            type="number"
            name="dailyRate"
            value={formData.dailyRate}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      )}

      {showDailyRateRange && (
        <div className="price-range-group">
          <div className="form-group">
            <label>Ціна від</label>
            <input
              type="number"
              name="minDailyRate"
              value={formData.minDailyRate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Ціна до</label>
            <input
              type="number"
              name="maxDailyRate"
              value={formData.maxDailyRate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
      )}

      {showImage && (
        <div className="form-group">
          <label>URL зображення</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      )}
    </>
  );
};

AccommodationFormFields.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  showLocation: PropTypes.bool,
  showDailyRate: PropTypes.bool,
  showDailyRateRange: PropTypes.bool,
  showImage: PropTypes.bool,
  showAmenities: PropTypes.bool,
  showLatitude: PropTypes.bool,
  showLongitude: PropTypes.bool
};

export default AccommodationFormFields;
