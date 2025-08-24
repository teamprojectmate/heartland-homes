import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 🔹 Спільні компоненти
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import TelegramNotifications from './components/TelegramNotifications.jsx';

// 🔹 Auth
import ProtectedRoute from './pages/Auth/ProtectedRoute.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

// 🔹 Accommodations
import Accommodations from './pages/Accommodations/Accommodations.jsx';
import AccommodationDetails from './pages/Accommodations/AccommodationDetails.jsx';

// 🔹 User
import Profile from './pages/User/Profile.jsx';
import MyBookings from './pages/User/MyBookings.jsx';
import Payment from './pages/User/Payment.jsx';

// 🔹 Admin
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminAccommodations from './pages/Admin/AdminAccommodations.jsx';
import CreateAccommodation from './pages/Accommodations/CreateAccommodation.jsx';
import AdminEditAccommodation from './pages/Admin/AdminEditAccommodation.jsx';
import AdminBookings from './pages/Admin/AdminBookings.jsx';

import './styles/main.scss';

function App() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Accommodations />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/accommodations/:id" element={<AccommodationDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User routes */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/telegram-notifications"
            element={
              <ProtectedRoute>
                <TelegramNotifications />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="MANAGER">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/accommodations"
            element={
              <ProtectedRoute requiredRole="MANAGER">
                <AdminAccommodations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/accommodations/new"
            element={
              <ProtectedRoute requiredRole="MANAGER">
                <CreateAccommodation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/accommodations/edit/:id"
            element={
              <ProtectedRoute requiredRole="MANAGER">
                <AdminEditAccommodation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requiredRole="MANAGER">
                <AdminBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
