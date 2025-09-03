// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaClipboardList, FaUsers, FaBuilding } from 'react-icons/fa';
import '../../styles/components/_admin-dashboard.scss';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || user.cleanRole !== 'MANAGER') {
      navigate('/');
    }
  }, [user, navigate]);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email;

  return (
    <div className="container page mt-4">
      <h1 className="text-center auth-title">Адмін-панель</h1>
      <p className="text-center mt-2">
        👋 Вітаємо, <strong>{displayName}</strong>!
      </p>

      <div className="dashboard-grid mt-4">
        <Link to="/admin/accommodations" className="dashboard-card">
          <FaBuilding className="dashboard-icon" />
          <h3>Управління помешканнями</h3>
        </Link>
        <Link to="/admin/bookings" className="dashboard-card">
          <FaClipboardList className="dashboard-icon" />
          <h3>Управління бронюваннями</h3>
        </Link>
        <Link to="/admin/users" className="dashboard-card">
          <FaUsers className="dashboard-icon" />
          <h3>Управління користувачами</h3>
        </Link>
        <Link to="/" className="dashboard-card">
          <FaHome className="dashboard-icon" />
          <h3>На сайт</h3>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
