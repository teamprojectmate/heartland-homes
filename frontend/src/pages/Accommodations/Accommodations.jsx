// src/pages/Accommodations/Accommodations.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import AccommodationList from './AccommodationList';
import Notification from '../../components/Notification';
import AccommodationFilters from './AccommodationFilters';
import Pagination from '../../components/Pagination';
import AccommodationsMap from './AccommodationsMap'; // ✅ ДОДАНО: новий компонент карти
import {
  loadAccommodations,
  setFilters,
  resetFilters,
  setPage
} from '../../store/slices/accommodationsSlice';

// ✅ ДОДАНО: імпорт стилів для сторінки
import '../../styles/components/_accommodations-map.scss';

const Accommodations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, loading, error, filters, page, totalPages } = useSelector(
    (state) => state.accommodations
  );
  const accommodationListRef = useRef(null);
  const [highlightedId, setHighlightedId] = useState(null); // ✅ ДОДАНО: новий стан для виділеної картки

  // читаємо фільтри з URL і зберігаємо в Redux
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters = {};
    for (const [key, value] of queryParams.entries()) {
      if (value !== 'null' && value !== '') {
        newFilters[key] = value;
      }
    }
    dispatch(setFilters(newFilters));
  }, [dispatch, location.search]);

  // коли змінюються фільтри → робимо запит
  useEffect(() => {
    dispatch(loadAccommodations());
  }, [dispatch, filters, page]);

  const handleApplyFilters = (e, formData) => {
    e.preventDefault();
    const newFilters = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== null && v !== '')
    );
    navigate(`/accommodations?${newFilters ? new URLSearchParams(newFilters) : ''}`);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(setPage(0));
    navigate('/accommodations');
  };

  // ✅ НОВА ФУНКЦІЯ: для зміни стану при наведенні
  const handleCardHover = (id) => {
    setHighlightedId(id);
  };

  return (
    <div className="accommodations-page-container">
      <div className="accommodations-list-wrapper">
        <div className="container mt-4">
          <h2 ref={accommodationListRef} className="section-heading mt-5">
            Доступні помешкання
          </h2>
          <AccommodationFilters
            city={filters.city || ''}
            type={filters.type || ''}
            size={filters.accommodationSize || ''}
            minDailyRate={filters.minDailyRate || ''}
            maxDailyRate={filters.maxDailyRate || ''}
            setCity={(val) => dispatch(setFilters({ city: val }))}
            setType={(val) => dispatch(setFilters({ type: val }))}
            setSize={(val) => dispatch(setFilters({ accommodationSize: val }))}
            setMinDailyRate={(val) =>
              dispatch(setFilters({ minDailyRate: val ? Number(val) : null }))
            }
            setMaxDailyRate={(val) =>
              dispatch(setFilters({ maxDailyRate: val ? Number(val) : null }))
            }
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          {loading && <p className="text-center">Завантаження...</p>}
          {error && <Notification message={error} type="danger" />}

          {!loading && !error && items.length > 0 ? (
            <>
              {/* ✅ ОНОВЛЕНО: передаємо новий пропс */}
              <AccommodationList accommodations={items} onCardHover={handleCardHover} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => dispatch(setPage(newPage))}
              />
            </>
          ) : (
            <p className="text-center">Помешкань не знайдено</p>
          )}
        </div>
      </div>
      {/* ✅ НОВИЙ КОМПОНЕНТ КАРТИ */}
      <div className="accommodations-map-wrapper">
        <AccommodationsMap accommodations={items} highlightedId={highlightedId} />
      </div>
    </div>
  );
};

export default Accommodations;
