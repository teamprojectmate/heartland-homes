import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Перевірка, чи користувач є адміністратором
    if (!user || user.role !== 'ADMIN') {
      navigate('/'); // Перенаправляємо, якщо не адміністратор
    }
  }, [user, navigate]);

  return (
    <div className="container page mt-4">
      <h1 className="text-xs-center">Панель адміністратора</h1>
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Управління</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <Link to="/admin/accommodations">
                    Управління помешканнями
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/admin/bookings">
                    Управління бронюваннями
                  </Link>
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
