// src/store/slices/bookingsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// ----- Initial state -----
const initialState = {
  bookings: [],
  currentBooking: null,
  status: 'idle',
  error: null,
  paymentStatus: 'idle',
  page: 0,
  totalPages: 0,
  totalElements: 0
};

// ----- Create booking -----
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async ({ bookingData, token }, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося створити бронювання.'
      );
    }
  }
);

// ----- Fetch current user's bookings (with pagination) -----
export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async ({ page = 0, size = 5, token }, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings/my', {
        params: { page, size },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; // PageBookingDto
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося завантажити бронювання.'
      );
    }
  }
);

// ----- Fetch all bookings (admin) -----
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async ({ page = 0, size = 10, user_id, status, token } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings', {
        params: { page, size, user_id, status },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося отримати список бронювань.'
      );
    }
  }
);

// ----- Fetch booking by ID -----
export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося отримати бронювання.'
      );
    }
  }
);

// ----- Update booking -----
export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData, token }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося оновити бронювання.'
      );
    }
  }
);

// ----- Delete booking -----
export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await api.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося скасувати бронювання.'
      );
    }
  }
);

// ----- Slice -----
const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    resetPaymentStatus: (state) => {
      state.paymentStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })

      // FETCH MY BOOKINGS
      .addCase(fetchMyBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload.content || [];
        state.page = action.payload.pageable?.pageNumber || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // FETCH ALL BOOKINGS
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
      })

      // FETCH BY ID
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
      })

      // UPDATE
      .addCase(updateBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.bookings[idx] = action.payload;
        state.currentBooking = action.payload;
      })

      // DELETE
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      });
  }
});

export const { clearCurrentBooking, resetPaymentStatus } = bookingsSlice.actions;
export default bookingsSlice.reducer;
