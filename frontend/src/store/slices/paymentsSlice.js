// src/store/slices/paymentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  payment: null, // один конкретний платіж (PaymentDto)
  payments: [], // список платежів користувача
  status: 'idle',
  error: null
};

// 🔹 Створення платежу
export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async ({ bookingId, paymentType = 'CARD', token }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/payments',
        { bookingId, paymentType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // PaymentDto
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Не вдалося створити платіж');
    }
  }
);

// 🔹 Отримати платежі користувача
export const fetchPaymentsByUser = createAsyncThunk(
  'payments/fetchByUser',
  async ({ userId, pageable, token }, { rejectWithValue }) => {
    try {
      const response = await api.get('/payments', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          user_id: userId,
          pageable: JSON.stringify(pageable)
        }
      });
      return response.data; // PagePaymentDto
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося отримати список платежів'
      );
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.payment = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Create Payment ---
      .addCase(createPayment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payment = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- Fetch Payments ---
      .addCase(fetchPaymentsByUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPaymentsByUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payments = action.payload.content || []; // PagePaymentDto.content
      })
      .addCase(fetchPaymentsByUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;
