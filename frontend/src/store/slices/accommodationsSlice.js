import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAccommodations } from '../../api/accommodations/accommodationService';

export const loadAccommodations = createAsyncThunk(
  'accommodations/load',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().accommodations;

      console.log('🔍 Виклик loadAccommodations з фільтрами:', state.filters);

      // ✅ Змінили логіку перевірки на null
      const filters = {
        city: state.filters.city || undefined,
        type: state.filters.type || undefined,
        accommodationSize: state.filters.accommodationSize || undefined,
        minDailyRate: state.filters.minDailyRate ?? undefined,
        maxDailyRate: state.filters.maxDailyRate ?? undefined,
      };

      // ✅ ВИПРАВЛЕНО: Тепер передаємо об'єкт пагінації як другий аргумент
      const pageable = {
        page: state.page,
        size: state.size,
        sort: state.sort // Не забуваємо про сортування
      };

      const data = await fetchAccommodations(filters, pageable);

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
