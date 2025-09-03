// src/layouts/AdminLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { HomeIcon, UserIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { MdAdminPanelSettings } from 'react-icons/md';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* 🔹 Sidebar для desktop */}
      <aside className="admin-sidebar">
        <div className="admin-title">Адмін-панель</div>
        <nav>
          <ul>
            <li>
              <Link to="/admin">
                <HomeIcon className="icon" /> Головна
              </Link>
            </li>
            <li>
              <Link to="/admin/accommodations">
                <MdAdminPanelSettings className="icon" /> Помешкання
              </Link>
            </li>
            <li>
              <Link to="/admin/bookings">
                <CreditCardIcon className="icon" /> Бронювання
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <UserIcon className="icon" /> Користувачі
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* 🔹 Контент сторінки */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
