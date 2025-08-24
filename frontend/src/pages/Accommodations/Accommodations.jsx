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

  // 🔹 завантаження даних при зміні фільтрів або сторінки
  useEffect(() => {
    dispatch(loadAccommodations());
  }, [dispatch, filters, page]);

  // 🔹 пошук по місту
  const handleSearch = ({ destination }) => {
    dispatch(setFilters({ city: destination?.trim() ? [destination.trim()] : [] }));
    dispatch(setPage(0)); // скидати на першу сторінку
  };

  // 🔹 застосувати фільтри (по суті, просто скидаємо сторінку)
  const handleApplyFilters = () => {
    dispatch(setPage(0));
  };

  // 🔹 скинути всі фільтри
  const handleResetFilters = () => {
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
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Content */}
      <div className="container mt-4">
        <Offers />
        <h2 className="section-heading mt-5">Доступні помешкання</h2>

        <AccommodationFilters
          cities={filters.city || []}
          types={filters.type || []}
          sizes={filters.size || []}
          minDailyRate={filters.minDailyRate || ''}
          maxDailyRate={filters.maxDailyRate || ''}
          setCities={(arr) => dispatch(setFilters({ city: arr }))}
          setTypes={(val) => dispatch(setFilters({ type: val }))}
          setSizes={(val) => dispatch(setFilters({ size: val }))}
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
