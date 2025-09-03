import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingsService from '../../api/bookings/bookingsService';

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
  async (bookingData, { rejectWithValue }) => {
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
  async ({ page = 0, size = 5 } = {}, { rejectWithValue }) => {
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
  async ({ page = 0, size = 10, userId, status } = {}, { rejectWithValue }) => {
    try {
      const response = await bookingsService.fetchBookings(page, size, userId, status);

      // 🔹 enrichment тільки житлом і ціною
      const { getAccommodationById } = await import(
        '../../api/accommodations/accommodationService'
      );

      const enriched = await Promise.all(
        (response.content || []).map(async (b) => {
          let accommodation = null;
          let totalPrice = null;

          try {
            accommodation = await getAccommodationById(b.accommodationId);
            if (accommodation && b.checkInDate && b.checkOutDate) {
              const start = new Date(b.checkInDate);
              const end = new Date(b.checkOutDate);
              const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
              totalPrice = nights * (accommodation.dailyRate || 0);
            }
          } catch (e) {
            console.warn(`Не вдалося завантажити житло id=${b.accommodationId}`);
          }

          return { ...b, accommodation, totalPrice };
        })
      );

      return { ...response, content: enriched };
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
  async (id, { rejectWithValue }) => {
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
  async ({ id, bookingData }, { rejectWithValue }) => {
    try {
      return await bookingsService.updateBooking(id, bookingData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося оновити бронювання.'
      );
    }
  }
);

// ----- Change booking status (admin) -----
export const changeBookingStatus = createAsyncThunk(
  'bookings/changeBookingStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await bookingsService.updateBooking(id, { status });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося змінити статус бронювання.'
      );
    }
  }
);

// ----- Cancel booking (user) -----
export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id, { rejectWithValue }) => {
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
  async (id, { rejectWithValue }) => {
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
      .addCase(createBooking.fulfilled, (state, action) => {
        const booking = action.payload;
        state.bookings.push(booking);
        state.totalElements += 1;
        state.totalPages = Math.ceil(state.totalElements / 5);
      })
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
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.bookings[idx] = action.payload;
        state.currentBooking = action.payload;
      })
      .addCase(changeBookingStatus.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.bookings[idx] = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
        state.totalElements -= 1;
        state.totalPages = Math.ceil(state.totalElements / 5);
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
        state.totalElements -= 1;
        state.totalPages = Math.ceil(state.totalElements / 5);
      });
  }
});

export { changeBookingStatus as updateBookingStatus };
export const { clearCurrentBooking, resetPaymentStatus, setPage } = bookingsSlice.actions;
export default bookingsSlice.reducer;
