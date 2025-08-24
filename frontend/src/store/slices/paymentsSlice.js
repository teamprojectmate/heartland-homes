import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  clientSecret: null,
  status: 'idle',
  error: null
};

export const createPaymentIntent = createAsyncThunk(
  'payments/createPaymentIntent',
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

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.clientSecret = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.status = 'processing';
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;
