import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  bookings: [],
  currentBooking: null,
  status: 'idle',
  error: null,
  paymentStatus: 'idle'
};

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося створити бронювання.'
      );
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings/my');
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося завантажити бронювання.'
      );
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings', { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося отримати список бронювань.'
      );
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося отримати бронювання.'
      );
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося оновити бронювання.'
      );
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/bookings/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося скасувати бронювання.'
      );
    }
  }
);

export const payBooking = createAsyncThunk(
  'bookings/payBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/create', { bookingId });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося ініціювати оплату.'
      );
    }
  }
);

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
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.bookings[idx] = action.payload;
        state.currentBooking = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      })
      .addCase(payBooking.pending, (state) => {
        state.paymentStatus = 'processing';
      })
      .addCase(payBooking.fulfilled, (state) => {
        state.paymentStatus = 'succeeded';
      })
      .addCase(payBooking.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearCurrentBooking, resetPaymentStatus } = bookingsSlice.actions;
export default bookingsSlice.reducer;
