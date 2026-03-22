import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import bookingsService from '../../api/bookings/bookingsService';
import { getApiErrorMessage } from '../../utils/accommodationPayload';
import { calcNights } from '../../utils/dateCalc';

type RawBooking = {
	accommodationId: number;
	checkInDate?: string;
	checkOutDate?: string;
	[key: string]: unknown;
};

const enrichBookings = async (bookings: RawBooking[]) =>
	Promise.all(
		bookings.map(async (b) => {
			let accommodation = null;
			let totalPrice = null;
			try {
				accommodation = await getAccommodationById(b.accommodationId);
				if (accommodation && b.checkInDate && b.checkOutDate) {
					totalPrice = calcNights(b.checkInDate, b.checkOutDate) * (accommodation.dailyRate || 0);
				}
			} catch {
				/* accommodation not found — skip */
			}
			return { ...b, accommodation, totalPrice };
		}),
	);

type BookingsState = {
	bookings: Record<string, unknown>[];
	currentBooking: Record<string, unknown> | null;
	status: string;
	error: string | null;
	paymentStatus: string;
	page: number;
	totalPages: number;
	totalElements: number;
};

const initialState: BookingsState = {
	bookings: [],
	currentBooking: null,
	status: 'idle',
	error: null,
	paymentStatus: 'idle',
	page: 0,
	totalPages: 0,
	totalElements: 0,
};

function updatePageState(state: BookingsState, payload: Record<string, unknown>) {
	state.bookings = (payload.content as Record<string, unknown>[]) || [];
	state.page = ((payload.pageable as Record<string, unknown>)?.pageNumber as number) ?? 0;
	state.totalPages = (payload.totalPages as number) || 0;
	state.totalElements = (payload.totalElements as number) || 0;
}

function removeBooking(state: BookingsState, id: number) {
	state.bookings = state.bookings.filter((b: Record<string, unknown>) => b.id !== id);
	state.totalElements = Math.max(0, state.totalElements - 1);
	state.totalPages = Math.ceil(state.totalElements / 5);
}

// Create booking
export const createBooking = createAsyncThunk(
	'bookings/createBooking',
	async (bookingData: Record<string, unknown>, { rejectWithValue }) => {
		try {
			return await bookingsService.createBooking(bookingData);
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to create booking'));
		}
	},
);

//  Fetch all bookings (admin)
export const fetchBookings = createAsyncThunk(
	'bookings/fetchBookings',
	async (
		// biome-ignore lint/suspicious/noConfusingVoidType: RTK requires void for optional thunk args
		args: { page?: number; size?: number; userId?: number; status?: string } | void,
		{ rejectWithValue },
	) => {
		const { page = 0, size = 10, userId, status } = args || {};
		try {
			const response = await bookingsService.fetchBookings(page, size, userId, status);
			const enriched = await enrichBookings(response.content || []);
			return { ...response, content: enriched };
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to fetch bookings'));
		}
	},
);

//  Fetch my bookings (current user)
export const fetchMyBookings = createAsyncThunk(
	'bookings/fetchMyBookings',
	// biome-ignore lint/suspicious/noConfusingVoidType: RTK requires void for optional thunk args
	async (args: { page?: number; size?: number } | void, { rejectWithValue }) => {
		const { page = 0, size = 5 } = args || {};
		try {
			const response = await bookingsService.fetchMyBookings(page, size);
			const enriched = await enrichBookings(response.content || []);
			return { ...response, content: enriched };
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to fetch my bookings'));
		}
	},
);

// Change booking status (admin)
export const changeBookingStatus = createAsyncThunk(
	'bookings/changeBookingStatus',
	async (
		{ booking, status }: { booking: Record<string, unknown>; status: string },
		{ rejectWithValue },
	) => {
		try {
			const updatedBooking = {
				checkInDate: booking.checkInDate,
				checkOutDate: booking.checkOutDate,
				accommodationId: booking.accommodationId,
				status,
			};

			const response = await bookingsService.updateBooking(booking.id as number, updatedBooking);
			return response;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to update booking status'));
		}
	},
);

// Cancel booking (user)
export const cancelBooking = createAsyncThunk(
	'bookings/cancelBooking',
	async (id: number, { rejectWithValue }) => {
		try {
			await bookingsService.cancelBooking(id);
			return id;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to cancel booking'));
		}
	},
);

//  Delete booking (admin)
export const deleteBooking = createAsyncThunk(
	'bookings/deleteBooking',
	async (id: number, { rejectWithValue }) => {
		try {
			await bookingsService.deleteBooking(id);
			return id;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to delete booking'));
		}
	},
);

const bookingsSlice = createSlice({
	name: 'bookings',
	initialState,
	reducers: {
		clearCurrentBooking: (state) => {
			state.currentBooking = null;
		},
		resetPaymentStatus: (state) => {
			state.paymentStatus = 'idle';
		},
		setPage: (state, action) => {
			state.page = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Create booking
			.addCase(createBooking.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(createBooking.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.bookings.push(action.payload);
				state.totalElements += 1;
				state.totalPages = Math.ceil(state.totalElements / 5);
			})
			.addCase(createBooking.rejected, (state, { payload }) => {
				state.status = 'failed';
				state.error = (payload as string) ?? null;
			})
			// Fetch bookings (admin)
			.addCase(fetchBookings.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchBookings.fulfilled, (state, action) => {
				state.status = 'succeeded';
				updatePageState(state, action.payload);
			})
			.addCase(fetchBookings.rejected, (state, { payload }) => {
				state.status = 'failed';
				state.error = (payload as string) ?? null;
			})
			// Fetch my bookings
			.addCase(fetchMyBookings.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchMyBookings.fulfilled, (state, action) => {
				state.status = 'succeeded';
				updatePageState(state, action.payload);
			})
			.addCase(fetchMyBookings.rejected, (state, { payload }) => {
				state.status = 'failed';
				state.error = (payload as string) ?? null;
			})
			// Change status
			.addCase(changeBookingStatus.fulfilled, (state, action) => {
				const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
				if (idx !== -1) state.bookings[idx] = action.payload;
			})
			// Cancel booking — update status, don't remove
			.addCase(cancelBooking.fulfilled, (state, action) => {
				const idx = state.bookings.findIndex(
					(b: Record<string, unknown>) => b.id === action.payload,
				);
				if (idx !== -1) {
					(state.bookings[idx] as Record<string, unknown>).status = 'CANCELED';
				}
			})
			// Delete booking — remove from list
			.addCase(deleteBooking.fulfilled, (state, action) => {
				removeBooking(state, action.payload);
			});
	},
});

export { changeBookingStatus as updateBookingStatus };
export const { clearCurrentBooking, resetPaymentStatus, setPage } = bookingsSlice.actions;
export default bookingsSlice.reducer;
