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

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Accommodations />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/accommodations/:id" element={<AccommodationDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          
          {/* Маршрути для адміністратора, захищені ProtectedRoute */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="accommodations" element={<AdminAccommodations />} />
            <Route path="accommodations/new" element={<CreateAccommodation />} />
            <Route path="accommodations/edit/:id" element={<AdminEditAccommodation />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
