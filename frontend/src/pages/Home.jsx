// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAccommodations, setFilters } from '../store/slices/accommodationsSlice';
import { useNavigate, Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import Offers from '../components/Offers';
import AccommodationList from './Accommodations/AccommodationList';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.accommodations);

  useEffect(() => {
    dispatch(loadAccommodations({ pageable: { page: 0, size: 4 } }));
  }, [dispatch]);

  const handleSearch = (e, formData) => {
    e.preventDefault();
    dispatch(setFilters(formData));
    const queryParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== null && v !== '')
      )
    ).toString();
    navigate(`/accommodations?${queryParams}`);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-heading">Знайдіть помешкання для наступної подорожі</h1>
          <p className="hero-subheading">
            Знаходьте пропозиції готелів, приватних помешкань та багато іншого...
          </p>
          {/* ✅ Використовуємо компонент SearchForm */}
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Пропозиції */}
      <section className="offers-section">
        <div className="container">
          <h2 className="section-heading">Пропозиції</h2>
          <p className="section-subheading">
            Акції, знижки та спеціальні пропозиції для вас
          </p>
          <Offers />
        </div>
      </section>

      {/* Топ житла */}
      <section className="accommodations-section">
        <div className="container">
          <h2 className="section-heading">Доступні помешкання</h2>
          {loading && <p className="text-center">Завантаження...</p>}
          {error && <p className="text-center text-danger">{error}</p>}
          {!loading && !error && (
            <>
              <AccommodationList accommodations={items.slice(0, 4)} />
              <div className="text-center mt-4">
                <Link to="/accommodations" className="btn btn-secondary">
                  Переглянути всі помешкання →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
