import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAccommodations } from '../../api/accommodations/accommodationService';

export const loadAccommodations = createAsyncThunk(
  'accommodations/load',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().accommodations;

      console.log('🔍 Виклик loadAccommodations з фільтрами:', state.filters);

      const data = await fetchAccommodations({
        city: state.filters.city,
        type: state.filters.type,
        size: state.filters.size,
        minDailyRate: state.filters.minDailyRate,
        maxDailyRate: state.filters.maxDailyRate,
        page: state.page,
        sizePage: state.size
      });

      console.log('✅ Відповідь від бекенду:', data);
      return data;
    } catch (err) {
      console.error('❌ Помилка у loadAccommodations:', err);
      return rejectWithValue(err.response?.data?.message || 'Помилка при завантаженні');
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
      city: [],
      type: [],
      size: [],
      minDailyRate: undefined,
      maxDailyRate: undefined
    },
    adminMode: false
  },
  reducers: {
    setFilters(state, action) {
      const { city, type, size, minDailyRate, maxDailyRate } = action.payload;

      state.filters = {
        ...state.filters,
        city: city ?? state.filters.city,
        type: type ?? state.filters.type,
        size: Array.isArray(size) ? size : size ? [size] : [],
        minDailyRate: minDailyRate !== undefined ? minDailyRate : undefined,
        maxDailyRate: maxDailyRate !== undefined ? maxDailyRate : undefined
      };

      state.page = 0;
    },
    resetFilters(state) {
      state.filters = {
        city: [],
        type: [],
        size: [],
        minDailyRate: undefined,
        maxDailyRate: undefined
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
      });
  }
});

export const { setFilters, resetFilters, setPage } = accommodationsSlice.actions;
export default accommodationsSlice.reducer;
