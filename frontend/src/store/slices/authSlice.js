import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

const savedUser = localStorage.getItem('user');
const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
  token: savedUser ? JSON.parse(savedUser).token : null,
  loading: false,
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      if (response.data && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } else {
        return rejectWithValue({ message: 'Токен не був отриманий від сервера.' });
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Помилка логіну' });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/registration', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Помилка реєстрації' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          'Неправильний логін або пароль';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || action.error.message || 'Помилка реєстрації';
      });
  }
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
