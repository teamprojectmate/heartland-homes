import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AccommodationList from './AccommodationList';
import Notification from '../../components/Notification';
import SearchForm from '../../components/SearchForm';
import Offers from '../../components/Offers';
import AccommodationFilters from './AccommodationFilters';
import Pagination from '../../components/Pagination';
import {
  loadAccommodations,
  setFilters,
  resetFilters,
  setPage
} from '../../store/slices/accommodationsSlice';

const Accommodations = () => {
  const dispatch = useDispatch();
  const { items, loading, error, filters, page, totalPages } = useSelector(
    (state) => state.accommodations
  );

  // ✅ Об'єднуємо логіку завантаження в один useEffect
  useEffect(() => {
    // Вантажимо дані, коли змінюються фільтри або сторінка
    dispatch(loadAccommodations());
  }, [dispatch, filters, page]);

  const handleApplyFilters = () => {
    // Просто скидаємо сторінку на 0, а useEffect сам завантажить дані
    dispatch(setPage(0));
  };

  const handleResetFilters = () => {
    // Скидаємо фільтри, а useEffect сам завантажить дані
    dispatch(resetFilters());
    dispatch(setPage(0));
  };

  return (
    <div>
      {/* Hero */}
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Знайдіть помешкання для наступної подорожі</h1>
          <p className="hero-subtitle">
            Знаходьте пропозиції готелів, приватних помешкань та багато іншого...
          </p>
          <SearchForm onSearch={handleApplyFilters} />
        </div>
      </div>

      {/* Content */}
      <div className="container mt-4">
        <Offers />
        <h2 className="section-heading mt-5">Доступні помешкання</h2>

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
        {!loading &&
          !error &&
          (items.length > 0 ? (
            <>
              <AccommodationList accommodations={items} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => dispatch(setPage(newPage))}
              />
            </>
          ) : (
            <p className="text-center">Помешкань не знайдено</p>
          ))}
      </div>
    </div>
  );
};

export default Accommodations;