import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080/api/v1';

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Використовуємо useSearchParams для отримання параметрів запиту з URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query');

  useEffect(() => {
    // Асинхронна функція для отримання помешкань з бекенду
    const fetchAccommodations = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/accommodations`);
        setAccommodations(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  // Ефект, який фільтрує помешкання, коли змінюється список помешкань або пошуковий запит
  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = accommodations.filter(acc =>
        acc.name.toLowerCase().includes(lowerCaseQuery) ||
        acc.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredAccommodations(filtered);
    } else {
      // Якщо немає пошукового запиту, показуємо всі помешкання
      setFilteredAccommodations(accommodations);
    }
  }, [accommodations, searchQuery]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>Помилка: {error}</div>;
  }
  
  // Використовуємо відфільтрований список для відображення
  const accommodationsToDisplay = searchQuery ? filteredAccommodations : accommodations;

  return (
    <div className="container mt-4">
      <h2>
        Доступні помешкання
        {searchQuery && (
          <span className="text-muted ml-2"> - Результати для "{searchQuery}"</span>
        )}
      </h2>
      {accommodationsToDisplay.length > 0 ? (
        <div className="row">
          {accommodationsToDisplay.map(accommodation => (
            <div key={accommodation.id} className="col-md-4 mb-4">
              <div className="card">
                {/* <img src={accommodation.imageUrl} className="card-img-top" alt={accommodation.name} /> */}
                <div className="card-body">
                  <h5 className="card-title">{accommodation.name}</h5>
                  <p className="card-text">{accommodation.description}</p>
                  <Link to={`/accommodations/${accommodation.id}`} className="btn btn-primary">Детальніше</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-xs-center mt-4">
          Помешкань за вашим запитом "{searchQuery}" не знайдено.
        </div>
      )}
    </div>
  );
};

export default Accommodations;
