import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080/api/v1';

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Доступні помешкання</h2>
      <div className="row">
        {accommodations.map(accommodation => (
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
    </div>
  );
};

export default Accommodations;
