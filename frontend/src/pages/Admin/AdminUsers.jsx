// src/pages/Admin/AdminUsers.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserRole, removeUser } from '../../store/slices/userSlice';
import Notification from '../../components/Notification';
import { FaTrash } from 'react-icons/fa';
import '../../styles/components/_admin-users.scss';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUpdateRole = (id, role) => {
    dispatch(updateUserRole({ id, role }));
  };

  const handleDeleteUser = (id) => {
    dispatch(removeUser(id));
  };

  if (loading) return <p className="text-center mt-4">⏳ Завантаження...</p>;

  return (
    <div className="container page">
      <h1 className="section-heading text-center">Користувачі</h1>
      {error && <Notification message={error} type="danger" />}
      <div className="admin-users-table-wrapper">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Ім’я</th>
              <th>Прізвище</th>
              <th>Роль</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td>
                  <select
                    className="role-select"
                    value={u.role}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  Немає користувачів
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
