import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingsService from '../../api/bookings/bookingsService';
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
  async (bookingData, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (auth?.authData?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.authData.token}`;
    }

    try {
      return await bookingsService.createBooking(bookingData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося створити бронювання.'
      );
    }
  }
);

// ----- Fetch current user's bookings -----
export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async ({ page = 0, size = 5 } = {}, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (auth?.authData?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.authData.token}`;
    }

    try {
      return await bookingsService.fetchMyBookings(page, size);
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
  async ({ page = 0, size = 10, userId, status } = {}, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (auth?.authData?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.authData.token}`;
    }

    try {
      return await bookingsService.fetchBookings(page, size, userId, status);
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
  async (id, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (auth?.authData?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.authData.token}`;
    }

    try {
      return await bookingsService.fetchBookingById(id);
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
  async ({ id, bookingData }, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (auth?.authData?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.authData.token}`;
    }

    try {
      return await bookingsService.updateBooking(id, bookingData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося оновити бронювання.'
      );
    }
  }
);

// ----- Cancel booking (user) -----
export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (auth?.authData?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.authData.token}`;
    }

    try {
      await bookingsService.cancelBooking(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося скасувати бронювання.'
      );
    }
  }
);

// ----- Delete booking (admin) -----
export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (auth?.authData?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.authData.token}`;
    }

    try {
      await bookingsService.deleteBooking(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося видалити бронювання.'
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
    },
    setPage: (state, action) => {
      state.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
        state.totalElements += 1;
        state.totalPages = Math.ceil(state.totalElements / 5);
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

      // FETCH ALL BOOKINGS (ADMIN)
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

      // CANCEL (USER)
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
        state.totalElements -= 1;
        state.totalPages = Math.ceil(state.totalElements / 5);
      })

      // DELETE (ADMIN)
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
        state.totalElements -= 1;
        state.totalPages = Math.ceil(state.totalElements / 5);
      });
  }
});

export const { clearCurrentBooking, resetPaymentStatus, setPage } = bookingsSlice.actions;
export default bookingsSlice.reducer;
