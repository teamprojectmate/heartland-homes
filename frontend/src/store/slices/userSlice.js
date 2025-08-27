// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// ----- Initial State -----
const savedProfile = localStorage.getItem('userProfile');
const initialState = {
  profile: savedProfile ? JSON.parse(savedProfile) : null,
  loading: false,
  error: null
};

// ----- Fetch Profile -----
export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // 🔑 беремо токен
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося завантажити профіль'
      );
    }
  }
);

// ----- Update Profile -----
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.put('/users/me', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Не вдалося оновити профіль');
    }
  }
);

// ----- Update User Role (Admin/Manager) -----
export const updateUserRole = createAsyncThunk(
  'user/updateUserRole',
  async ({ id, role }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.put(
        `/users/${id}/role`,
        { role },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Не вдалося оновити роль користувача'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      localStorage.removeItem('userProfile');
    }
  },
  extraReducers: (builder) => {
    builder
      // ----- FETCH PROFILE -----
      .addCase(fetchProfile.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProfile.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.profile = payload;
        localStorage.setItem('userProfile', JSON.stringify(payload));
      })
      .addCase(fetchProfile.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // ----- UPDATE PROFILE -----
      .addCase(updateProfile.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateProfile.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.profile = payload;
        localStorage.setItem('userProfile', JSON.stringify(payload));
      })
      .addCase(updateProfile.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // ----- UPDATE ROLE -----
      .addCase(updateUserRole.fulfilled, (s, { payload }) => {
        if (s.profile && s.profile.id === payload.id) {
          s.profile = payload;
          localStorage.setItem('userProfile', JSON.stringify(payload));
        }
      });
  }
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;
