// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingsReducer from './slices/bookingsSlice';
import paymentsReducer from './slices/paymentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingsReducer,
    payments: paymentsReducer
  }
});

export default store;
