import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
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

      // 🔑 Декодуємо токен
      const decoded = jwtDecode(token);
      console.log('🔑 JWT payload:', decoded);

      // Витягуємо роль з токена
      let rawRole;
      if (Array.isArray(decoded.roles) && decoded.roles.length > 0) {
        rawRole = decoded.roles[0];
      } else if (decoded.role) {
        rawRole = decoded.role;
      } else {
        rawRole = decoded.authorities?.[0] || null;
      }

      let cleanRole = rawRole?.startsWith('ROLE_')
        ? rawRole.replace('ROLE_', '')
        : rawRole;

      // Підтягуємо профіль
      let profile = {};
      try {
        profile = await authService.getProfile();
        localStorage.setItem('userProfile', JSON.stringify(profile));

        if (Array.isArray(profile?.roles) && profile.roles.length > 0) {
          cleanRole = profile.roles[0]?.startsWith('ROLE_')
            ? profile.roles[0].replace('ROLE_', '')
            : profile.roles[0];
        }
      } catch {
        console.warn('⚠️ /users/me недоступний, використовую тільки JWT');
      }

      // Формуємо фінальний об'єкт користувача
      const userData = {
        token,
        ...decoded,
        ...profile,
        cleanRole
      };

      // Зберігаємо
      localStorage.setItem('auth', JSON.stringify(userData));

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
  localStorage.removeItem('auth');
  localStorage.removeItem('userProfile');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (s) => {
      s.isLoading = false;
      s.isSuccess = false;
      s.isError = false;
      s.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (s) => {
        s.isLoading = true;
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

      // REGISTER
      .addCase(register.pending, (s) => {
        s.isLoading = true;
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

      // LOGOUT
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.isAuthenticated = false;
      });
  }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
