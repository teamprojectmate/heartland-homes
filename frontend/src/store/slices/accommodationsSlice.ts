import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApiErrorMessage } from '../../utils/accommodationPayload';
import * as accommodationService from '../../api/accommodations/accommodationService';

// Public: завантаження житла
export const loadAccommodations = createAsyncThunk(
	'accommodations/load',
	async (params: { pageable?: { page?: number; size?: number; sort?: string } } | void, { getState, rejectWithValue }) => {
		try {
			const state = (getState() as { accommodations: any }).accommodations;

			const filters = {
				city: state.filters.city || undefined,
				type: state.filters.type || undefined,
				minDailyRate: state.filters.minDailyRate ?? undefined,
				maxDailyRate: state.filters.maxDailyRate ?? undefined,
				status: 'PERMITTED',
			};

			const pageable = (params && 'pageable' in params ? params.pageable : null) || {
				page: state.page,
				size: state.size,
				sort: state.sort,
			};

			const data = await accommodationService.fetchAccommodations({
				...filters,
				...pageable,
			});
			return data;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Помилка при завантаженні'));
		}
	},
);

// Admin: завантаження списку
export const loadAdminAccommodations = createAsyncThunk(
	'accommodations/loadAdmin',
	async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
		try {
			return await accommodationService.fetchAdminAccommodations(page, size);
		} catch (err: unknown) {
			return rejectWithValue(
				getApiErrorMessage(err, 'Помилка при завантаженні житла (адмін)'),
			);
		}
	},
);

//  Customer: завантаження своїх помешкань
export const loadMyAccommodations = createAsyncThunk(
	'accommodations/loadMy',
	async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
		try {
			return await accommodationService.fetchMyAccommodations(page, size);
		} catch (err: unknown) {
			return rejectWithValue(
				getApiErrorMessage(err, 'Помилка при завантаженні ваших помешкань'),
			);
		}
	},
);

// Admin: видалення житла
export const removeAccommodation = createAsyncThunk(
	'accommodations/remove',
	async (id: number, { rejectWithValue }) => {
		try {
			await accommodationService.deleteAccommodation(id);
			return id;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Не вдалося видалити житло'));
		}
	},
);

// Створення житла
export const createAccommodationAsync = createAsyncThunk(
	'accommodations/create',
	async (formData: any, { rejectWithValue }) => {
		try {
			return await accommodationService.createAccommodation(formData);
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Помилка при створенні житла'));
		}
	},
);

// Admin: оновлення статусу житла
export const updateAccommodationStatusAsync = createAsyncThunk(
	'accommodations/updateStatus',
	async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
		try {
			const response = await accommodationService.updateAccommodationStatus(id, status);
			return { id, accommodationStatus: response.accommodationStatus };
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Не вдалося оновити статус житла'));
		}
	},
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
			minDailyRate: null,
			maxDailyRate: null,
		},
		adminMode: false,
		myMode: false,
	},
	reducers: {
		setFilters(state, action) {
			state.filters = { ...state.filters, ...action.payload };
			state.page = 0;
		},
		resetFilters(state) {
			state.filters = {
				city: null,
				type: null,
				minDailyRate: null,
				maxDailyRate: null,
			};
			state.page = 0;
		},
		setPage(state, action) {
			state.page = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Public load
			.addCase(loadAccommodations.pending, (s) => {
				s.loading = true;
				s.error = null;
			})
			.addCase(loadAccommodations.fulfilled, (s, { payload }) => {
				s.loading = false;
				s.items = payload.content || [];
				s.totalPages = payload.totalPages || 0;
				s.totalElements = payload.totalElements || 0;
				s.adminMode = false;
				s.myMode = false;
			})
			.addCase(loadAccommodations.rejected, (s, { payload }) => {
				s.loading = false;
				s.error = payload;
			})

			// Admin load
			.addCase(loadAdminAccommodations.pending, (s) => {
				s.loading = true;
				s.error = null;
			})
			.addCase(loadAdminAccommodations.fulfilled, (s, { payload }) => {
				s.loading = false;
				s.items = payload.content || [];
				s.totalPages = payload.totalPages || 0;
				s.totalElements = payload.totalElements || 0;
				s.adminMode = true;
				s.myMode = false;
			})
			.addCase(loadAdminAccommodations.rejected, (s, { payload }) => {
				s.loading = false;
				s.error = payload;
			})

			//  My accommodations load
			.addCase(loadMyAccommodations.pending, (s) => {
				s.loading = true;
				s.error = null;
			})
			.addCase(loadMyAccommodations.fulfilled, (s, { payload }) => {
				s.loading = false;
				s.items = payload.content || [];
				s.totalPages = payload.totalPages || 0;
				s.totalElements = payload.totalElements || 0;
				s.myMode = true;
				s.adminMode = false;
			})
			.addCase(loadMyAccommodations.rejected, (s, { payload }) => {
				s.loading = false;
				s.error = payload;
			})

			// Admin remove
			.addCase(removeAccommodation.fulfilled, (s, { payload }) => {
				s.items = s.items.filter((acc) => acc.id !== payload);
			})

			// Create
			.addCase(createAccommodationAsync.pending, (s) => {
				s.loading = true;
				s.error = null;
			})
			.addCase(createAccommodationAsync.fulfilled, (s) => {
				s.loading = false;
				s.error = null;
			})
			.addCase(createAccommodationAsync.rejected, (s, { payload }) => {
				s.loading = false;
				s.error = payload;
			})

			// Admin update status
			.addCase(updateAccommodationStatusAsync.fulfilled, (state, action) => {
				const { id, accommodationStatus } = action.payload;
				const acc = state.items.find((item) => item.id === id);
				if (acc) acc.accommodationStatus = accommodationStatus;
			});
	},
});

export const { setFilters, resetFilters, setPage } = accommodationsSlice.actions;
export default accommodationsSlice.reducer;
