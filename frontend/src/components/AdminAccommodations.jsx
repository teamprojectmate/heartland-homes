import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080/api/v1';

const AdminAccommodations = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const fetchAccommodations = async () => {
      try {
        const token = user.token;
        const response = await axios.get(`${BASE_URL}/accommodations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAccommodations(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [user, navigate]);

  // Функція для видалення помешкання
  const handleDelete = async (id) => {
    try {
      const token = user.token;
      await axios.delete(`${BASE_URL}/accommodations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Оновлюємо список помешкань, видаливши елемент
      setAccommodations(accommodations.filter(acc => acc.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка видалення помешкання');
    }
  };

  if (loading) {
    return <p className="text-xs-center mt-5">Завантаження...</p>;
  }

  if (error) {
    return <p className="text-xs-center text-danger mt-5">Помилка: {error}</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-xs-center">Керування помешканнями</h2>
      <div className="text-xs-right mb-3">
        <Link to="/admin/accommodations/new" className="btn btn-success">Додати нове помешкання</Link>
      </div>
      <div className="row">
        {accommodations.length > 0 ? (
          accommodations.map(accommodation => (
            <div key={accommodation.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{accommodation.name}</h5>
                  <p className="card-text">{accommodation.description}</p>
                  <Link to={`/admin/accommodations/edit/${accommodation.id}`} className="btn btn-primary btn-sm">Редагувати</Link>
                  <button 
                    onClick={() => setConfirmDeleteId(accommodation.id)} 
                    className="btn btn-danger btn-sm ml-2"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-md-12">
            <div className="alert alert-info text-xs-center">Помешкань ще немає.</div>
          </div>
        )}
      </div>

      {/* Модальне вікно для підтвердження видалення */}
      {confirmDeleteId && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Підтвердження видалення</h5>
              </div>
              <div className="modal-body">
                <p>Ви впевнені, що хочете видалити це помешкання?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                  Скасувати
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(confirmDeleteId)}>
                  Видалити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccommodations;
