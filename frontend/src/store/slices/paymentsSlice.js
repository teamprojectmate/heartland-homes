import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createPayment as createPaymentService, fetchPaymentsByUser as fetchPaymentsByUserServices } from '../../api/payments/paymentService'; // ✅ Оновлений імпорт

const initialState = {
  payment: null,
  payments: [],
  status: 'idle',
  error: null
};

// ----- Create payment -----
export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async ({ bookingId, paymentType = 'CARD' }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated || !auth.authData || !auth.authData.token) {
        return rejectWithValue('Користувач не автентифікований.');
      }
      const token = auth.authData.token;

      const response = await createPaymentService(bookingId, paymentType, token);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Не вдалося створити платіж');
    }
  }
);

// ----- Fetch payments by user -----
export const fetchPaymentsByUser = createAsyncThunk(
  'payments/fetchByUser',
  async ({ pageable }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated || !auth.authData || !auth.authData.token) {
        return rejectWithValue('Користувач не автентифікований.');
      }
      const token = auth.authData.token;
      const userId = auth.user.id;

      const response = await fetchPaymentsByUserServices(userId, pageable, token);
      return response;
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
      .addCase(fetchPaymentsByUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPaymentsByUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payments = action.payload.content || [];
      })
      .addCase(fetchPaymentsByUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;