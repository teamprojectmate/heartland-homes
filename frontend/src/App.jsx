import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Accommodations from './components/Accommodations';
import AccommodationDetails from './components/AccommodationDetails';
import MyBookings from './components/MyBookings';
import AdminDashboard from './components/AdminDashboard';
import AdminAccommodations from './components/AdminAccommodations';
import CreateAccommodation from './components/CreateAccommodation';
import AdminEditAccommodation from './components/AdminEditAccommodation';
import AdminBookings from './components/AdminBookings';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import TelegramNotifications from './components/TelegramNotifications';
import './styles/main.scss';

function App() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Accommodations />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/accommodations/:id" element={<AccommodationDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
            path="/telegram-notifications"
            element={
              <ProtectedRoute>
                <TelegramNotifications />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
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
