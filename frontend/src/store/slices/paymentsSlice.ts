import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	cancelPayment as cancelPaymentService,
	createPayment as createPaymentService,
	fetchPaymentsByUser as fetchPaymentsByUserService,
	getAllPaymentsService,
} from '../../api/payments/paymentService';
import { getApiErrorMessage } from '../../utils/accommodationPayload';

type PaymentsState = {
	payment: Record<string, unknown> | null;
	payments: Record<string, unknown>[];
	totalPages: number;
	createStatus: string;
	fetchStatus: string;
	cancelStatus: string;
	error: string | null;
};

const initialState: PaymentsState = {
	payment: null,
	payments: [],
	totalPages: 1,
	createStatus: 'idle',
	fetchStatus: 'idle',
	cancelStatus: 'idle',
	error: null,
};

//  Create payment
export const createPayment = createAsyncThunk(
	'payments/createPayment',
	async (
		{ bookingId, paymentType = 'PAYMENT' }: { bookingId: number; paymentType?: string },
		{ rejectWithValue },
	) => {
		try {
			const response = await createPaymentService(bookingId, paymentType);
			return response;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to create payment'));
		}
	},
);

//  Fetch payments by user
export const fetchPaymentsByUser = createAsyncThunk(
	'payments/fetchByUser',
	async (
		{ userId, pageable }: { userId: number; pageable: Record<string, unknown> },
		{ rejectWithValue },
	) => {
		try {
			const response = await fetchPaymentsByUserService(userId, pageable);
			return response;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to fetch payments'));
		}
	},
);

//  Cancel payment
export const cancelPayment = createAsyncThunk(
	'payments/cancelPayment',
	async (paymentId: number, { rejectWithValue }) => {
		try {
			await cancelPaymentService(paymentId);
			return paymentId;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to cancel payment'));
		}
	},
);

//  Fetch all payments (admin)
export const fetchAllPayments = createAsyncThunk(
	'payments/fetchAll',
	// biome-ignore lint/suspicious/noConfusingVoidType: RTK requires void for optional thunk args
	async (params: Record<string, unknown> | void, { rejectWithValue }) => {
		try {
			const response = await getAllPaymentsService(params || {});
			return response;
		} catch (err: unknown) {
			return rejectWithValue(getApiErrorMessage(err, 'Failed to fetch all payments'));
		}
	},
);

const paymentsSlice = createSlice({
	name: 'payments',
	initialState,
	reducers: {
		resetPayment: (state) => {
			state.payment = null;
			state.createStatus = 'idle';
			state.error = null;
		},
		resetPaymentsList: (state) => {
			state.payments = [];
			state.totalPages = 1;
			state.fetchStatus = 'idle';
			state.error = null;
		},
		clearPaymentsError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// createPayment
			.addCase(createPayment.pending, (state) => {
				state.createStatus = 'loading';
			})
			.addCase(createPayment.fulfilled, (state, action) => {
				state.createStatus = 'succeeded';
				state.payment = action.payload;
			})
			.addCase(createPayment.rejected, (state, action) => {
				state.createStatus = 'failed';
				state.error = action.payload as string;
			})

			// fetchPaymentsByUser
			.addCase(fetchPaymentsByUser.pending, (state) => {
				state.fetchStatus = 'loading';
			})
			.addCase(fetchPaymentsByUser.fulfilled, (state, action) => {
				state.fetchStatus = 'succeeded';
				state.payments = action.payload.content || [];
				state.totalPages = action.payload.totalPages || 1;
			})
			.addCase(fetchPaymentsByUser.rejected, (state, action) => {
				state.fetchStatus = 'failed';
				state.error = action.payload as string;
			})

			//  cancelPayment
			.addCase(cancelPayment.pending, (state) => {
				state.cancelStatus = 'loading';
			})
			.addCase(cancelPayment.fulfilled, (state, action) => {
				state.cancelStatus = 'succeeded';
				state.payments = state.payments.map((p) =>
					p.id === action.payload ? { ...p, status: 'CANCELED' } : p,
				);
			})
			.addCase(cancelPayment.rejected, (state, action) => {
				state.cancelStatus = 'failed';
				state.error = action.payload as string;
			})

			// fetchAllPayments (admin)
			.addCase(fetchAllPayments.pending, (state) => {
				state.fetchStatus = 'loading';
			})
			.addCase(fetchAllPayments.fulfilled, (state, action) => {
				state.fetchStatus = 'succeeded';
				state.payments = action.payload.content || [];
				state.totalPages = action.payload.totalPages || 1;
			})
			.addCase(fetchAllPayments.rejected, (state, action) => {
				state.fetchStatus = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const { resetPayment, resetPaymentsList, clearPaymentsError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
