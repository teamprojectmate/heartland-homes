import React from 'react';

import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import STRIPE_PUBLIC_KEY from './stripe-key';
import { logout } from './store/slices/authSlice';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Accommodations from './components/Accommodations';
import AccommodationDetails from './components/AccommodationDetails';
import MyBookings from './components/MyBookings';
import Profile from './components/Profile';
import Payment from './components/Payment';
import AdminBookings from './components/AdminBookings';
// Імпорт правильної іконки з Lucide
import { Home } from 'lucide-react';

const Dashboard = () => <h1>Панель керування</h1>;

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="page" style={{ backgroundColor: '#e9ecef', minHeight: '100vh' }}>
        <nav className="navbar navbar-light">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <span style={{ verticalAlign: 'middle' }}>
                {/* Використання правильного компонента іконки */}
                <Home size={24} style={{ marginRight: '8px' }} />
                Оренда Помешкань
              </span>
            </Link>
            <ul className="nav navbar-nav pull-xs-right">
              <li className="nav-item">
                <Link className="nav-link" to="/">Головна</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/accommodations">Помешкання</Link>
              </li>
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Вхід</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Реєстрація</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Профіль</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/bookings/my">Мої бронювання</Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn nav-link" onClick={handleLogout}>Вихід</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
        {/*
          УВАГА! Я обгорнув компонент <Routes> у div з класом container.
          Це вирішить проблему з вирівнюванням контенту.
        */}
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<h1>Головна сторінка</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/accommodations/:id" element={<AccommodationDetails />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bookings/my" element={<MyBookings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/payment/:bookingId" element={<Payment />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Elements>
  );
}

export default App;
