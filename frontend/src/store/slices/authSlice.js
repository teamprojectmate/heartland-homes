import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/auth/authService';

// Читаємо збережені дані з localStorage
const savedAuth = JSON.parse(localStorage.getItem('auth'));
const savedProfile = JSON.parse(localStorage.getItem('userProfile'));

let initialUser = null;
if (savedAuth) {
  initialUser = { ...savedAuth, ...savedProfile };

  // Витягуємо роль
  let rawRole = Array.isArray(initialUser.roles)
    ? initialUser.roles[0]
    : initialUser.role;

  initialUser.cleanRole = rawRole?.startsWith('ROLE_')
    ? rawRole.replace('ROLE_', '')
    : rawRole;
}

const initialState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// 🔹 Логін
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { token } = await authService.login({ email, password });

      localStorage.setItem('auth', JSON.stringify({ token }));

      const profile = await authService.getProfile();

      let rawRole = profile.role || (profile.roles?.[0] ?? null);
      let cleanRole = rawRole?.startsWith('ROLE_')
        ? rawRole.replace('ROLE_', '')
        : rawRole;

      const userData = {
        token,
        ...profile,
        cleanRole
      };

      localStorage.setItem('auth', JSON.stringify(userData));
      localStorage.setItem('userProfile', JSON.stringify(profile));

      return userData;
    } catch (err) {
      localStorage.removeItem('auth');
      localStorage.removeItem('userProfile');
      return rejectWithValue(err.response?.data?.message || 'Помилка логіну');
    }
  }
);

// 🔹 Реєстрація
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Помилка реєстрації');
    }
  }
);

// 🔹 Логаут
export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (s) => {
      s.isLoading = false;
      s.isSuccess = false;
      s.isError = false;
      s.message = '';
    },
    setUser: (s, { payload }) => {
      s.user = payload;
      s.isAuthenticated = !!payload;
    },
    // 🔹 Додаємо для Google Login
    loginSuccess: (s, { payload }) => {
      s.user = payload;
      s.isAuthenticated = true;
      s.isError = false;
      s.isLoading = false;

      localStorage.setItem('auth', JSON.stringify(payload));
      if (payload.profile) {
        localStorage.setItem('userProfile', JSON.stringify(payload.profile));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
        s.isSuccess = false;
        s.message = '';
      })
      .addCase(login.fulfilled, (s, { payload }) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.user = payload;
        s.isAuthenticated = !!payload;
      })
      .addCase(login.rejected, (s, { payload }) => {
        s.isLoading = false;
        s.isError = true;
        s.message = payload;
        s.user = null;
        s.isAuthenticated = false;
      })
      .addCase(register.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
        s.isSuccess = false;
      })
      .addCase(register.fulfilled, (s) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.message = 'Реєстрація успішна! Тепер увійдіть у систему.';
      })
      .addCase(register.rejected, (s, { payload }) => {
        s.isLoading = false;
        s.isError = true;
        s.message = payload;
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.isAuthenticated = false;
      });
  }
});

export const { reset, setUser, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
