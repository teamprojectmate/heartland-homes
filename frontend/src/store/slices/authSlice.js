import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import authService from '../../api/auth/authService';
import { fetchProfile } from './userSlice'; 

// ----- Initial State -----
const savedAuth = localStorage.getItem('auth');
const initialState = {
  authData: savedAuth ? JSON.parse(savedAuth) : null,
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

      // 2. Тепер, коли у нас є токен, ми можемо запитати профіль
      const user = await dispatch(fetchProfile(token)).unwrap();

      // 3. Комбінуємо дані і зберігаємо в localStorage
      const userData = { token, ...user };
      localStorage.setItem('auth', JSON.stringify(userData));

      // Повертаємо дані для Redux
      return userData;
    } catch (err) {
      // ❌ Якщо хоч один крок вище провалився, очищаємо localStorage
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

      // ⚡ Одразу логін після реєстрації
      await dispatch(login({ email: formData.email, password: formData.password }));

      // Успіх буде оброблено в fulfilled логіні
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
      })
      .addCase(login.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })
      // ✅ Замість .addCase(register.fulfilled...), бо логін обробляє результат
      .addCase(register.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
