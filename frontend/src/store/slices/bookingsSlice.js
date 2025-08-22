import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

const initialState = {
  bookings: [],
  currentBooking: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  paymentStatus: 'idle' // 'idle' | 'processing' | 'succeeded' | 'failed'
};

// 📌 Створення нового бронювання
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { user }
      } = getState();
      if (!user || !user.token) {
        return rejectWithValue('Користувач не авторизований.');
      }
      const response = await axios.post('/bookings', bookingData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося створити бронювання.'
      );
    }
  }
);

// 📌 Отримати бронювання поточного користувача
export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { user }
      } = getState();
      const response = await axios.get('/bookings/my', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося завантажити бронювання.'
      );
    }
  }
);

// 📌 Отримати всі бронювання (адмін/менеджер)
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (queryParams = {}, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { user }
      } = getState();
      const response = await axios.get('/bookings', {
        params: queryParams,
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося отримати список бронювань.'
      );
    }
  }
);

// 📌 Отримати одне бронювання за ID
export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { user }
      } = getState();
      const response = await axios.get(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося отримати бронювання.'
      );
    }
  }
);

// 📌 Оновити бронювання
export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { user }
      } = getState();
      const response = await axios.put(`/bookings/${id}`, bookingData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося оновити бронювання.'
      );
    }
  }
);

// 📌 Видалити (скасувати) бронювання
export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { user }
      } = getState();
      await axios.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося скасувати бронювання.'
      );
    }
  }
);

// 📌 Оплата бронювання
export const payBooking = createAsyncThunk(
  'bookings/payBooking',
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { user }
      } = getState();
      const response = await axios.post(
        '/payments/create',
        { bookingId },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      return response.data; // { clientSecret }
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
      // ---- CREATE ----
      .addCase(createBooking.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings.push(action.payload);
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ---- FETCH MY BOOKINGS ----
      .addCase(fetchMyBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ---- FETCH ALL BOOKINGS ----
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ---- FETCH BOOKING BY ID ----
      .addCase(fetchBookingById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ---- UPDATE ----
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.bookings[idx] = action.payload;
        state.currentBooking = action.payload;
      })

      // ---- DELETE ----
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      })

      // ---- PAY ----
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
