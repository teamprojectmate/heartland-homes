import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/auth/authService';
import { fetchProfile } from './userSlice';
import { jwtDecode } from 'jwt-decode';

// ----- Initial State -----
const savedAuth = localStorage.getItem('auth');
const initialState = {
  authData: savedAuth ? JSON.parse(savedAuth) : null,
  user: savedAuth ? JSON.parse(savedAuth) : null,
  isAuthenticated: !!savedAuth,
  loading: false,
  error: null
};

// ----- Login -----
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      // 1. Отримуємо токен
      const { token } = await authService.login({ email, password });

      // 2. Тягнемо профіль (id, email, ім’я)
      const user = await dispatch(fetchProfile(token)).unwrap();

      // 3. Витягуємо роль із JWT
      const decoded = jwtDecode(token);
      const role = decoded.role || decoded.roles?.[0] || decoded.authorities?.[0];

      // 4. Об’єднуємо все
      const userData = { token, ...user, role };

      // 5. Зберігаємо в localStorage
      localStorage.setItem('auth', JSON.stringify(userData));

      return userData;
    } catch (err) {
      localStorage.removeItem('auth');
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
      await dispatch(login({ email: formData.email, password: formData.password }));
      return null;
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
      state.authData = null;
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
        s.authData = payload;
        s.user = payload; // 👈 тут уже є role
      })
      .addCase(login.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })
      .addCase(register.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
