import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import bookingsService from '../../api/bookings/bookingsService';
import { getApiErrorMessage } from '../../utils/accommodationPayload';
import { calcNights } from '../../utils/dateCalc';

const enrichBookings = async (bookings: any[]) =>
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

const initialState = {
	bookings: [],
	currentBooking: null,
	status: 'idle',
	error: null,
	paymentStatus: 'idle',
	page: 0,
	totalPages: 0,
	totalElements: 0,
};

//  Хелпер: оновлення сторінки/пагінації
function updatePageState(state, payload) {
	state.bookings = payload.content || [];
	state.page = payload.pageable?.pageNumber ?? 0;
	state.totalPages = payload.totalPages || 0;
	state.totalElements = payload.totalElements || 0;
}

//  Хелпер: видалення бронювання (cancel/delete)
function removeBooking(state, id) {
	state.bookings = state.bookings.filter((b) => b.id !== id);
	state.totalElements = Math.max(0, state.totalElements - 1);
	state.totalPages = Math.ceil(state.totalElements / 5);
}

// Create booking
export const createBooking = createAsyncThunk(
	'bookings/createBooking',
	async (bookingData: any, { rejectWithValue }) => {
		try {
			return await bookingsService.createBooking(bookingData);
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Не вдалося створити бронювання.'));
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
			return rejectWithValue(getApiErrorMessage(err, 'Не вдалося отримати список бронювань.'));
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
			return rejectWithValue(getApiErrorMessage(err, 'Не вдалося завантажити мої бронювання.'));
		}
	},
);

// Change booking status (admin)
export const changeBookingStatus = createAsyncThunk(
	'bookings/changeBookingStatus',
	async ({ booking, status }: { booking: any; status: string }, { rejectWithValue }) => {
		try {
			const updatedBooking = {
				checkInDate: booking.checkInDate,
				checkOutDate: booking.checkOutDate,
				accommodationId: booking.accommodationId,
				status,
			};

			const response = await bookingsService.updateBooking(booking.id, updatedBooking);
			return response;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Не вдалося змінити статус бронювання.'));
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
			return rejectWithValue(getApiErrorMessage(err, 'Не вдалося скасувати бронювання.'));
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
			return rejectWithValue(getApiErrorMessage(err, 'Не вдалося видалити бронювання.'));
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
			.addCase(createBooking.fulfilled, (state, action) => {
				state.bookings.push(action.payload);
				state.totalElements += 1;
				state.totalPages = Math.ceil(state.totalElements / 5);
			})
			.addCase(fetchBookings.fulfilled, (state, action) => {
				updatePageState(state, action.payload);
			})
			.addCase(fetchMyBookings.fulfilled, (state, action) => {
				updatePageState(state, action.payload);
			})
			.addCase(changeBookingStatus.fulfilled, (state, action) => {
				const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
				if (idx !== -1) state.bookings[idx] = action.payload;
			})
			.addCase(cancelBooking.fulfilled, (state, action) => {
				removeBooking(state, action.payload);
			})
			.addCase(deleteBooking.fulfilled, (state, action) => {
				removeBooking(state, action.payload);
			});
	},
});

export { changeBookingStatus as updateBookingStatus };
export const { clearCurrentBooking, resetPaymentStatus, setPage } = bookingsSlice.actions;
export default bookingsSlice.reducer;
