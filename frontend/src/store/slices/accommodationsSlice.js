import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as accommodationService from '../../api/accommodations/accommodationService';

// ----- Public -----
export const loadAccommodations = createAsyncThunk(
  'accommodations/load',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().accommodations;

      const filters = {
        city: state.filters.city || undefined,
        type: state.filters.type || undefined,
        accommodationSize: state.filters.accommodationSize || undefined,
        minDailyRate: state.filters.minDailyRate ?? undefined,
        maxDailyRate: state.filters.maxDailyRate ?? undefined
      };

      const pageable = {
        page: state.page,
        size: state.size,
        sort: state.sort
      };

      const data = await accommodationService.fetchAccommodations(filters, pageable);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Помилка при завантаженні');
    }
  }
);

// ----- Admin: завантаження списку -----
export const loadAdminAccommodations = createAsyncThunk(
  'accommodations/loadAdmin',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const data = await accommodationService.fetchAdminAccommodations(page, size);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Помилка при завантаженні житла (адмін)'
      );
    }
  }
);

// ----- Admin: видалення житла -----
export const removeAccommodation = createAsyncThunk(
  'accommodations/remove',
  async (id, { rejectWithValue }) => {
    try {
      await accommodationService.deleteAccommodation(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Не вдалося видалити житло');
    }
  }
);

// ✅ ДОДАНО: Створення житла
export const createAccommodationAsync = createAsyncThunk(
  'accommodations/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await accommodationService.createAccommodation(formData);
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Помилка при створенні житла'
      );
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
    sort: null,
    loading: false,
    error: null,
    filters: {
      city: null,
      type: null,
      accommodationSize: null,
      minDailyRate: null,
      maxDailyRate: null
    },
    adminMode: false
  },
  reducers: {
    setFilters(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
      state.page = 0;
    },
    resetFilters(state) {
      state.filters = {
        city: null,
        type: null,
        accommodationSize: null,
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
      // Public
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

      // Admin load
      .addCase(loadAdminAccommodations.fulfilled, (state, action) => {
        state.items = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
        state.adminMode = true;
      })

      // Admin remove
      .addCase(removeAccommodation.fulfilled, (state, action) => {
        state.items = state.items.filter((acc) => acc.id !== action.payload);
      })

      // ✅ ДОДАНО: Створення житла
      .addCase(createAccommodationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccommodationAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createAccommodationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, resetFilters, setPage } = accommodationsSlice.actions;
export default accommodationsSlice.reducer;
