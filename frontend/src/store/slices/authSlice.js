// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// ----- Initial State -----
const savedAuth = localStorage.getItem('auth');
const initialState = {
  token: savedAuth ? JSON.parse(savedAuth).token : null,
  isAuthenticated: !!savedAuth,
  loading: false,
  error: null
};

// ----- Login -----
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('auth', JSON.stringify({ token: response.data.token }));
        return response.data.token;
      }
      return rejectWithValue('Сервер не повернув токен');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Помилка логіну');
    }
  }
);

// ----- Register -----
export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/auth/registration', formData);
      // після реєстрації одразу логін
      const result = await dispatch(
        login({
          email: formData.email,
          password: formData.password
        })
      ).unwrap();
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Помилка реєстрації');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('auth');
      state.token = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // ----- LOGIN -----
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.isAuthenticated = true;
        s.token = payload;
      })
      .addCase(login.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // ----- REGISTER -----
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(register.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.isAuthenticated = true;
        s.token = payload;
      })
      .addCase(register.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
