// src/pages/Admin/AdminAccommodations.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Notification from '../../components/Notification';
import Pagination from '../../components/Pagination';
import {
  loadAdminAccommodations,
  removeAccommodation,
  setPage,
  updateAccommodationStatusAsync
} from '../../store/slices/accommodationsSlice';
import '../../styles/components/_admin.scss';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { mapType } from '../../utils/translations';
import '../../styles/components/_badges.scss';
import '../../styles/components/_status-select.scss';

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
  } = useSelector((s) => s.accommodations);

  useEffect(() => {
    if (!user || user.cleanRole !== 'MANAGER') {
      navigate('/');
      return;
    }
    dispatch(loadAdminAccommodations({ page }));
  }, [user, navigate, dispatch, page]);

  const handleDelete = (id) => {
    if (window.confirm('Видалити помешкання?')) {
      dispatch(removeAccommodation(id));
    }
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateAccommodationStatusAsync({ id, status }));
  };

  if (loading) return <p className="text-center mt-5">Завантаження...</p>;

  const fallbackImage = '/no-image.png';

  return (
    <div className="container admin-page-container">
      <h1 className="section-heading text-center">Управління помешканнями</h1>
      {error && <Notification message={error} type="danger" />}

      <div className="text-end mb-3">
        <Link to="/admin/accommodations/new" className="btn-primary">
          <FaPlus /> Додати помешкання
        </Link>
      </div>

      {accommodations.length > 0 ? (
        <>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Назва</th>
                  <th>Місто</th>
                  <th>Тип</th>
                  <th className="text-end">Ціна</th>
                  <th>Зображення</th>
                  <th>Статус</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {accommodations.map((acc) => {
                  const imageUrl = acc.image ? fixDropboxUrl(acc.image) : fallbackImage;
                  const { label, icon, color } = mapType(acc.type);

                  return (
                    <tr key={acc.id}>
                      <td data-label="ID">{acc.id}</td>
                      <td data-label="Назва">{acc.name}</td>
                      <td data-label="Місто">{acc.city}</td>
                      <td data-label="Тип">
                        <span
                          className="badge badge-type"
                          style={{ backgroundColor: color }}
                        >
                          {icon} {label}
                        </span>
                      </td>
                      <td data-label="Ціна" className="price">
                        {acc.dailyRate} грн
                      </td>
                      <td data-label="Зображення">
                        <img
                          src={imageUrl}
                          alt={acc.name || 'Зображення помешкання'}
                          className="table-img"
                        />
                      </td>
                      <td data-label="Статус">
                        <select
                          value={acc.accommodationStatus}
                          onChange={(e) => handleStatusChange(acc.id, e.target.value)}
                          className={`status-select ${acc.accommodationStatus?.toLowerCase()}`}
                        >
                          <option value="REQUIRES_VERIFICATION">Очікує перевірки</option>
                          <option value="PERMITTED">Дозволено</option>
                          <option value="REJECTED">Відхилено</option>
                        </select>
                      </td>
                      <td data-label="Дії" className="actions">
                        <Link
                          to={`/admin/accommodations/edit/${acc.id}`}
                          className="btn-icon btn-secondary"
                          title="Редагувати"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => handleDelete(acc.id)}
                          title="Видалити"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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
