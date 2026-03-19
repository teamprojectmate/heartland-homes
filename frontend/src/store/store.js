import { configureStore } from '@reduxjs/toolkit';
import accommodationsReducer from './slices/accommodationsSlice';
import authReducer from './slices/authSlice';
import bookingsReducer from './slices/bookingsSlice';
import paymentsReducer from './slices/paymentsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		bookings: bookingsReducer,
		payments: paymentsReducer,
		accommodations: accommodationsReducer,
		user: userReducer,
	},
});

export default store;
