import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Notification from '../../components/Notification';
import Pagination from '../../components/Pagination';
import {
  loadAdminAccommodations,
  removeAccommodation,
  setPage
} from '../../store/slices/accommodationsSlice';

const AdminAccommodations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    items: accommodations,
    loading,
    error,
    page,
    totalPages
  } = useSelector((state) => state.accommodations);

  useEffect(() => {
    if (!user || user.role !== 'MANAGER') {
      navigate('/');
      return;
    }
    // ✅ Прибрали token з аргументів
    dispatch(loadAdminAccommodations({ page }));
  }, [user, navigate, dispatch, page]);

  const handleDelete = (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити це помешкання?')) return;
    // ✅ Прибрали token з аргументів
    dispatch(removeAccommodation({ id }));
  };

  if (loading) return <p className="text-center mt-5">Завантаження...</p>;

  return (
    <div className="container admin-page-container">
      <h1 className="section-heading text-center">Керування помешканнями</h1>
      {error && <Notification message={error} type="danger" />}
      <div className="text-end mb-3">
        <Link to="/admin/accommodations/new" className="btn-primary">
          ➕ Додати помешкання
        </Link>
      </div>
      {accommodations.length > 0 ? (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Локація</th>
                <th>Місто</th>
                <th>Тип</th>
                <th>Ціна</th>
                <th>Зображення</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {accommodations.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.id}</td>
                  <td>{acc.location}</td>
                  <td>{acc.city}</td>
                  <td>{acc.type}</td>
                  <td>{acc.dailyRate}$</td>
                  <td>
                    {acc.image ? (
                      <img
                        src={acc.image}
                        alt={acc.location}
                        style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="d-flex gap-2">
                    <Link
                      to={`/admin/accommodations/edit/${acc.id}`}
                      className="btn-secondary btn-sm"
                    >
                      ✏ Редагувати
                    </Link>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleDelete(acc.id)}
                    >
                      🗑 Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => dispatch(setPage(newPage))}
          />
        </>
      ) : (
        <p className="text-center">Помешкань ще немає.</p>
      )}
    </div>
  );
};

export default AdminAccommodations;