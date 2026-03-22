import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer from './bookingsSlice';

const createTestStore = () =>
	configureStore({
		reducer: { bookings: bookingsReducer },
	});

const mockBooking = {
	id: 1,
	accommodationId: 10,
	userId: 100,
	checkInDate: '2026-06-01',
	checkOutDate: '2026-06-05',
	status: 'PENDING',
};

const loadBookings = (store: ReturnType<typeof createTestStore>) => {
	store.dispatch({
		type: 'bookings/fetchBookings/fulfilled',
		payload: { content: [mockBooking], totalPages: 1, totalElements: 1 },
	});
};

describe('bookingsSlice', () => {
	describe('initial state', () => {
		it('should have empty bookings and idle status', () => {
			const store = createTestStore();
			const state = store.getState().bookings;

			expect(state.bookings).toEqual([]);
			expect(state.status).toBe('idle');
			expect(state.error).toBeNull();
		});
	});

	describe('fetchBookings', () => {
		it('pending should set loading and clear error', () => {
			const store = createTestStore();
			store.dispatch({ type: 'bookings/fetchBookings/pending' });

			expect(store.getState().bookings.status).toBe('loading');
			expect(store.getState().bookings.error).toBeNull();
		});

		it('fulfilled should store bookings and set succeeded', () => {
			const store = createTestStore();
			loadBookings(store);
			const state = store.getState().bookings;

			expect(state.status).toBe('succeeded');
			expect(state.bookings).toEqual([mockBooking]);
			expect(state.totalPages).toBe(1);
		});

		it('rejected should set error and failed status', () => {
			const store = createTestStore();
			store.dispatch({
				type: 'bookings/fetchBookings/rejected',
				payload: 'Failed to fetch bookings',
			});
			const state = store.getState().bookings;

			expect(state.status).toBe('failed');
			expect(state.error).toBe('Failed to fetch bookings');
		});
	});

	describe('fetchMyBookings', () => {
		it('pending should set loading', () => {
			const store = createTestStore();
			store.dispatch({ type: 'bookings/fetchMyBookings/pending' });

			expect(store.getState().bookings.status).toBe('loading');
		});

		it('fulfilled should store user bookings', () => {
			const store = createTestStore();
			store.dispatch({
				type: 'bookings/fetchMyBookings/fulfilled',
				payload: { content: [mockBooking], totalPages: 1, totalElements: 1 },
			});

			expect(store.getState().bookings.bookings).toEqual([mockBooking]);
			expect(store.getState().bookings.status).toBe('succeeded');
		});

		it('rejected should set error', () => {
			const store = createTestStore();
			store.dispatch({
				type: 'bookings/fetchMyBookings/rejected',
				payload: 'Failed to load your bookings',
			});

			expect(store.getState().bookings.error).toBe('Failed to load your bookings');
		});
	});

	describe('createBooking', () => {
		it('pending should set loading', () => {
			const store = createTestStore();
			store.dispatch({ type: 'bookings/createBooking/pending' });

			expect(store.getState().bookings.status).toBe('loading');
			expect(store.getState().bookings.error).toBeNull();
		});

		it('fulfilled should add booking to list', () => {
			const store = createTestStore();
			store.dispatch({ type: 'bookings/createBooking/fulfilled', payload: mockBooking });

			expect(store.getState().bookings.bookings).toContainEqual(mockBooking);
			expect(store.getState().bookings.status).toBe('succeeded');
		});

		it('rejected should set error', () => {
			const store = createTestStore();
			store.dispatch({
				type: 'bookings/createBooking/rejected',
				payload: 'Selected dates are not available',
			});

			expect(store.getState().bookings.error).toBe('Selected dates are not available');
			expect(store.getState().bookings.status).toBe('failed');
		});
	});

	describe('changeBookingStatus', () => {
		it('fulfilled should update booking status in list', () => {
			const store = createTestStore();
			loadBookings(store);

			const updatedBooking = { ...mockBooking, status: 'CONFIRMED' };
			store.dispatch({
				type: 'bookings/changeBookingStatus/fulfilled',
				payload: updatedBooking,
			});

			const booking = store.getState().bookings.bookings.find((b) => b.id === 1);
			expect(booking?.status).toBe('CONFIRMED');
		});
	});

	describe('cancelBooking', () => {
		it('fulfilled should update status to CANCELED (not remove)', () => {
			const store = createTestStore();
			loadBookings(store);

			store.dispatch({ type: 'bookings/cancelBooking/fulfilled', payload: 1 });
			const state = store.getState().bookings;

			expect(state.bookings).toHaveLength(1);
			expect(state.bookings[0].status).toBe('CANCELED');
		});
	});

	describe('deleteBooking', () => {
		it('fulfilled should remove booking from list', () => {
			const store = createTestStore();
			loadBookings(store);

			store.dispatch({ type: 'bookings/deleteBooking/fulfilled', payload: 1 });

			expect(store.getState().bookings.bookings).toHaveLength(0);
		});
	});

	describe('reducers', () => {
		it('clearCurrentBooking should clear current booking', () => {
			const store = createTestStore();
			store.dispatch({ type: 'bookings/clearCurrentBooking' });

			expect(store.getState().bookings.currentBooking).toBeNull();
		});

		it('setPage should update page number', () => {
			const store = createTestStore();
			store.dispatch({ type: 'bookings/setPage', payload: 2 });

			expect(store.getState().bookings.page).toBe(2);
		});

		it('resetPaymentStatus should reset to idle', () => {
			const store = createTestStore();
			store.dispatch({ type: 'bookings/resetPaymentStatus' });

			expect(store.getState().bookings.paymentStatus).toBe('idle');
		});
	});
});
