import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as accommodationService from '../../api/accommodations/accommodationService';
import type { Accommodation } from '../../types';
import { getApiErrorMessage } from '../../utils/accommodationPayload';

export const loadAccommodations = createAsyncThunk(
	'accommodations/load',
	async (
		// biome-ignore lint/suspicious/noConfusingVoidType: RTK requires void for optional thunk args
		params: { pageable?: { page?: number; size?: number; sort?: string } } | void,
		{ getState, rejectWithValue },
	) => {
		try {
			// biome-ignore lint/suspicious/noExplicitAny: getState() returns unknown in RTK, accommodations slice shape is internal
			const state = (getState() as any).accommodations;

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
			return rejectWithValue(getApiErrorMessage(err, 'Failed to load accommodations'));
		}
	},
);

export const loadAdminAccommodations = createAsyncThunk(
	'accommodations/loadAdmin',
	async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
		try {
			return await accommodationService.fetchAdminAccommodations(page, size);
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to load accommodations (admin)'));
		}
	},
);

export const loadMyAccommodations = createAsyncThunk(
	'accommodations/loadMy',
	async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
		try {
			return await accommodationService.fetchMyAccommodations(page, size);
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to load your accommodations'));
		}
	},
);

export const removeAccommodation = createAsyncThunk(
	'accommodations/remove',
	async (id: number, { rejectWithValue }) => {
		try {
			await accommodationService.deleteAccommodation(id);
			return id;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to delete accommodation'));
		}
	},
);

export const createAccommodationAsync = createAsyncThunk(
	'accommodations/create',
	async (formData: Record<string, unknown>, { rejectWithValue }) => {
		try {
			return await accommodationService.createAccommodation(formData);
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to create accommodation'));
		}
	},
);

export const updateAccommodationStatusAsync = createAsyncThunk(
	'accommodations/updateStatus',
	async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
		try {
			const response = await accommodationService.updateAccommodationStatus(id, status);
			return { id, status: response.status };
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to update accommodation status'));
		}
	},
);

const accommodationsSlice = createSlice({
	name: 'accommodations',
	initialState: {
		items: [] as Accommodation[],
		totalPages: 0,
		totalElements: 0,
		page: 0,
		size: 10,
		sort: null as string | null,
		loading: false,
		error: null as string | null,
		filters: {
			city: null as string | null,
			type: null as string | null,
			minDailyRate: null as number | null,
			maxDailyRate: null as number | null,
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
		clearAccommodationsError(state) {
			state.error = null;
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
				s.error = (payload as string) ?? null;
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
				s.error = (payload as string) ?? null;
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
				s.error = (payload as string) ?? null;
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
				s.error = (payload as string) ?? null;
			})

			// Admin update status
			.addCase(updateAccommodationStatusAsync.fulfilled, (state, action) => {
				const { id, status } = action.payload;
				const acc = state.items.find((item) => item.id === id);
				if (acc) acc.status = status;
			});
	},
});

export const { setFilters, resetFilters, setPage, clearAccommodationsError } =
	accommodationsSlice.actions;
export default accommodationsSlice.reducer;
