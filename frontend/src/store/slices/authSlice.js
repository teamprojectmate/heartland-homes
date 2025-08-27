import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import authService from '../../api/auth/authService';

// ----- Initial State -----
const savedAuth = localStorage.getItem('auth');
const initialState = {
  token: savedAuth ? JSON.parse(savedAuth).token : null,
  user: null, // ✅ юзер підтягнеться після /me
  isAuthenticated: !!savedAuth,
  loading: false,
  error: null
};

// ----- Login -----
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const loginResponse = await authService.login(email, password);

      if (loginResponse?.token) {
        const token = loginResponse.token;
        const user = await authService.getProfile(token);

        const userData = { token, ...user };
        localStorage.setItem('auth', JSON.stringify(userData));

        return userData;
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
      await authService.register(formData);

      // ⚡ одразу логін після реєстрації
      const result = await dispatch(
        login({ email: formData.email, password: formData.password })
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
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.isAuthenticated = true;
        s.token = payload.token;
        s.user = payload;
      })
      .addCase(login.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })
      .addCase(register.fulfilled, (s, { payload }) => {
        s.isAuthenticated = true;
        s.token = payload.token;
        s.user = payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
