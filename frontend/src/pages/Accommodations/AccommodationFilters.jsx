import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import AccommodationFormFields from './AccommodationFormFields';
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
  const [localFilters, setLocalFilters] = useState({
    city: city || '',
    type: type || '',
    size: size || '',
    minDailyRate: minDailyRate || '',
    maxDailyRate: maxDailyRate || ''
  });

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

  const handleApply = (e) => {
    e.preventDefault();
    if (onApplyFilters) {
      onApplyFilters(e, localFilters);
    }
  };

  return (
    <section className="filters-section">
      <div className="filters-box">
        <h4 className="filters-heading">Фільтри та сортування</h4>
        <form onSubmit={handleApply}>
          <div className="filters-grid">
            {/* Використовуємо універсальний компонент і передаємо всі необхідні пропси */}
            <AccommodationFormFields
              formData={localFilters}
              handleChange={handleChange}
              // ✅ Передаємо пропси, які приховають зайві поля
              showLocation={false}
              showImage={false}
              showAmenities={false}
              showLatitude={false}
              showLongitude={false}
              // ✅ Явно вказуємо, що потрібні поля для діапазону цін
              showDailyRate={false}
              showDailyRateRange={true}
            />
          </div>

          <div className="filters-actions">
            <button className="btn-primary btn-with-icon" type="submit">
              <Filter size={18} /> Застосувати
            </button>
            <button
              className="btn-outline btn-with-icon"
              type="button"
              onClick={onResetFilters}
            >
              <RotateCcw size={18} /> Скинути
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AccommodationFilters;
