import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// 🔹 Завантаження житла (для користувачів із фільтрами)
export const loadAccommodations = createAsyncThunk(
  'accommodations/load',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().accommodations;

      const requestBody = {
        searchParameters: {
          city: state.filters.city || [],
          type: state.filters.types || [],
          size: state.filters.sizes || [],
          minDailyRate: state.filters.minDailyRate
            ? Number(state.filters.minDailyRate)
            : null,
          maxDailyRate: state.filters.maxDailyRate
            ? Number(state.filters.maxDailyRate)
            : null
        },
        pageable: {
          page: state.page,
          size: state.size
        }
      };

      const response = await api.post('/accommodations/search', requestBody);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Помилка при завантаженні');
    }
  }
);

// 🔹 Завантаження житла (для адміна)
export const loadAdminAccommodations = createAsyncThunk(
  'accommodations/loadAdmin',
  async ({ page = 0, size = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/accommodations', {
        params: { page, size }
      });
      return { data: response.data, page, size };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Помилка при завантаженні');
    }
  }
);

// 🔹 Видалення житла
export const removeAccommodation = createAsyncThunk(
  'accommodations/remove',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/accommodations/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Помилка при видаленні');
    }
  }
);

const accommodationsSlice = createSlice({
  name: 'accommodations',
  initialState: {
    items: [],
    totalPages: 0,
    totalElements: 0,
    page: 0,
    size: 10,
    loading: false,
    error: null,
    filters: {
      city: [], // ✅ масив
      types: [], // ✅ масив
      sizes: [], // ✅ масив
      minDailyRate: null,
      maxDailyRate: null
    },
    adminMode: false
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 0;
    },
    resetFilters(state) {
      state.filters = {
        city: [],
        types: [],
        sizes: [],
        minDailyRate: null,
        maxDailyRate: null
      };
      state.page = 0;
    },
    setPage(state, action) {
      state.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAccommodations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAccommodations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
        state.adminMode = false;
      })
      .addCase(loadAccommodations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadAdminAccommodations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.content || action.payload.data;
        state.totalPages = action.payload.data.totalPages || 0;
        state.totalElements = action.payload.data.totalElements || 0;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.adminMode = true;
      })
      .addCase(removeAccommodation.fulfilled, (state, action) => {
        state.items = state.items.filter((acc) => acc.id !== action.payload);
        state.totalElements = state.totalElements - 1;
      });
  }
});

export const { setFilters, resetFilters, setPage } = accommodationsSlice.actions;
export default accommodationsSlice.reducer;
