import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import AccommodationList from '../components/AccommodationList';
import Notification from '../components/Notification';
import SearchForm from '../components/SearchForm';
import Offers from '../components/Offers';
import AccommodationFilters from '../components/AccommodationFilters';

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Фільтри
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [minDailyRate, setMinDailyRate] = useState('');
  const [maxDailyRate, setMaxDailyRate] = useState('');

  // 🔹 Запит на бекенд
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('/accommodations/search', {
        params: {
          city: cities,
          type: types,
          size: sizes,
          minDailyRate: minDailyRate || undefined,
          maxDailyRate: maxDailyRate || undefined
        }
      });

      setAccommodations(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Не вдалося завантажити помешкання.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, [cities, types, sizes, minDailyRate, maxDailyRate]);

  // 🔹 Обробка пошуку з SearchForm
  const handleSearch = ({ destination }) => {
    if (destination) {
      setCities([destination]);
    } else {
      setCities([]);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Знайдіть помешкання для наступної подорожі</h1>
          <p className="hero-subtitle">
            Знахoдьте пропозиції готелів, приватних помешкань та багато іншого...
          </p>
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Content */}
      <div className="container mt-4">
        <Offers />
        <h2 className="section-heading mt-5">Доступні помешкання</h2>

        {/* 🔹 Фільтри */}
        <AccommodationFilters
          cities={cities}
          types={types}
          sizes={sizes}
          minDailyRate={minDailyRate}
          maxDailyRate={maxDailyRate}
          setCities={setCities}
          setTypes={setTypes}
          setSizes={setSizes}
          setMinDailyRate={setMinDailyRate}
          setMaxDailyRate={setMaxDailyRate}
        />

        {/* 🔹 Результати */}
        {loading && <p className="text-center">Завантаження...</p>}
        {error && <Notification message={error} type="danger" />}
        {!loading &&
          !error &&
          (accommodations.length > 0 ? (
            <AccommodationList accommodations={accommodations} />
          ) : (
            <p className="text-center">Помешкань за вашим запитом не знайдено.</p>
          ))}
      </div>
    </div>
  );
};

export default Accommodations;
