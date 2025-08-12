import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL для бекенду. Його можна змінити на реальний, якщо додаток буде розгорнуто.
const BASE_URL = 'http://localhost:8080/api/v1';

// Асинхронний запит на вхід
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
      // Логування всієї відповіді для відлагодження
      console.log('API Response:', response.data);
      // Перевіряємо, чи існує токен у відповіді та чи він є рядком
      if (response.data && typeof response.data.token === 'string') {
        localStorage.setItem('token', JSON.stringify(response.data.token));
        return response.data;
      } else {
        // Якщо токен відсутній, відхиляємо запит з помилкою
        return rejectWithValue({ message: 'Токен не був отриманий від сервера.' });
      }
    } catch (error) {
      console.error('Login error:', error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронний запит на реєстрацію
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/registration`, userData);
      // При успішній реєстрації можемо автоматично увійти
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: userData.email,
        password: userData.password,
      });
      console.log('Login after registration response:', loginResponse.data);
      if (loginResponse.data && typeof loginResponse.data.token === 'string') {
        localStorage.setItem('token', JSON.stringify(loginResponse.data.token));
        return loginResponse.data;
      } else {
        return rejectWithValue({ message: 'Токен не був отриманий після реєстрації.' });
      }
    } catch (error) {
      console.error('Registration error:', error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Отримуємо токен з локального сховища при завантаженні додатку
const token = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: !!token,
    token: token ? JSON.parse(token) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Вхід
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Неправильний логін або пароль';
      })
      // Реєстрація
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Помилка реєстрації';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
