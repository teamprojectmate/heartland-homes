// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Спільні компоненти
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Notification from './components/Notification.jsx';
import PageWrapper from './components/PageWrapper.jsx';

// Auth
import ProtectedRoute from './pages/Auth/ProtectedRoute.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

// Accommodations
import Accommodations from './pages/Accommodations/Accommodations.jsx';
import AccommodationDetails from './pages/Accommodations/AccommodationDetails.jsx';

// Lazy-loaded User/Admin
const Profile = lazy(() => import('./pages/User/Profile.jsx'));
const MyBookings = lazy(() => import('./pages/User/MyBookings.jsx'));
const Payment = lazy(() => import('./pages/User/Payment.jsx'));

const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard.jsx'));
const AdminAccommodations = lazy(() => import('./pages/Admin/AdminAccommodations.jsx'));
const CreateAccommodation = lazy(
  () => import('./pages/Accommodations/CreateAccommodation.jsx')
);
const AdminEditAccommodation = lazy(
  () => import('./pages/Admin/AdminEditAccommodation.jsx')
);
const AdminBookings = lazy(() => import('./pages/Admin/AdminBookings.jsx'));

// NotFound
import NotFound from './pages/NotFound.jsx';

import './styles/main.scss';

function App() {
  // 🔹 Виправлено: тепер беремо слайси окремо, а не весь state
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const bookings = useSelector((state) => state.bookings);
  const accommodations = useSelector((state) => state.accommodations);
  const payments = useSelector((state) => state.payments);

  const errors = [
    auth?.error,
    user?.error,
    bookings?.error,
    accommodations?.error,
    payments?.error
  ].filter(Boolean);

  return (
    <div className="main-layout">
      <Header />

      {/* глобальні повідомлення */}
      {errors.map((err, idx) => (
        <Notification key={idx} message={err} type="error" />
      ))}

      <main className="main-content">
        <Suspense fallback={<p className="text-center mt-5">Завантаження...</p>}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <PageWrapper title="Головна">
                  <Accommodations />
                </PageWrapper>
              }
            />
            <Route
              path="/accommodations"
              element={
                <PageWrapper title="Усі помешкання">
                  <Accommodations />
                </PageWrapper>
              }
            />
            <Route
              path="/accommodations/:id"
              element={
                <PageWrapper title="Деталі помешкання">
                  <AccommodationDetails />
                </PageWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PageWrapper title="Вхід">
                  <Login />
                </PageWrapper>
              }
            />
            <Route
              path="/register"
              element={
                <PageWrapper title="Реєстрація">
                  <Register />
                </PageWrapper>
              }
            />

            {/* User routes */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <PageWrapper title="Мої бронювання">
                    <MyBookings />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageWrapper title="Мій профіль">
                    <Profile />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:bookingId"
              element={
                <ProtectedRoute>
                  <PageWrapper title="Оплата">
                    <Payment />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <PageWrapper title="Адмін-панель">
                    <AdminDashboard />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/accommodations"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <PageWrapper title="Адмін: Помешкання">
                    <AdminAccommodations />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/accommodations/new"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <PageWrapper title="Адмін: Нове помешкання">
                    <CreateAccommodation />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/accommodations/edit/:id"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <PageWrapper title="Адмін: Редагування помешкання">
                    <AdminEditAccommodation />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <PageWrapper title="Адмін: Бронювання">
                    <AdminBookings />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route
              path="*"
              element={
                <PageWrapper title="Сторінку не знайдено">
                  <NotFound />
                </PageWrapper>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;
