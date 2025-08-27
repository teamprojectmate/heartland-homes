// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/components/_admin.scss';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || user.role !== 'MANAGER') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="container page mt-4">
      <h1 className="text-center auth-title">Панель адміністратора</h1>
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <div className="admin-card">
            <div className="admin-card-body">
              <h5 className="admin-card-title">Управління</h5>
              <ul className="admin-list-group">
                <li className="admin-list-group-item">
                  <Link to="/admin/accommodations">Управління помешканнями</Link>
                </li>
                <li className="admin-list-group-item">
                  <Link to="/admin/bookings">Управління бронюваннями</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
