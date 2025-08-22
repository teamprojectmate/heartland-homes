import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

const initialState = {
  clientSecret: null,
  status: 'idle', // 'idle' | 'processing' | 'succeeded' | 'failed'
  error: null
};

// 📌 Ініціювати оплату (отримати clientSecret від бекенду)
export const createPaymentIntent = createAsyncThunk(
  'payments/createPaymentIntent',
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { user }
      } = getState();

      const response = await axios.post(
        '/payments/create',
        { bookingId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      return response.data; // { clientSecret }
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
        state.error = null;
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
