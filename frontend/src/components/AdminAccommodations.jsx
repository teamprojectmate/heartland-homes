// src/components/AdminAccommodations.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import Notification from './Notification';

const AdminAccommodations = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'MANAGER') {
      navigate('/');
      return;
    }

    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/accommodations', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setAccommodations(response.data.content || response.data); // якщо приходить Page<>
      } catch (err) {
        setError(err.response?.data?.message || 'Не вдалося завантажити помешкання');
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [user, navigate]);

  if (loading) return <p className="text-center mt-5">Завантаження...</p>;

  return (
    <div className="container admin-page-container">
      <h1 className="section-heading text-center">Керування помешканнями</h1>
      {error && <Notification message={error} type="danger" />}
      <div className="text-end mb-3">
        <Link to="/admin/accommodations/create" className="btn-primary">
          ➕ Додати помешкання
        </Link>
      </div>
      {accommodations.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Назва</th>
              <th>Тип</th>
              <th>Ціна</th>
              <th>Доступність</th>
              <th>Зображення</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {accommodations.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.id}</td>
                <td>{acc.location}</td>
                <td>{acc.type}</td>
                <td>{acc.dailyRate}$</td>
                <td>{acc.availability}</td>
                <td>
                  {acc.picture ? (
                    <img
                      src={acc.picture}
                      alt={acc.location}
                      style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <Link
                    to={`/admin/accommodations/edit/${acc.id}`}
                    className="btn-secondary btn-sm"
                  >
                    Редагувати
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">Помешкань ще немає.</p>
      )}
    </div>
  );
};

export default AdminAccommodations;
