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

describe('bookingsSlice', () => {
	describe('initial state', () => {
		it('should have empty bookings array', () => {
			const store = createTestStore();
			const state = store.getState().bookings;

			expect(state.bookings).toEqual([]);
			expect(state.status).toBe('idle');
			expect(state.error).toBeNull();
		});
	});

	describe('fetchBookings.fulfilled', () => {
		it('should store bookings and pagination', () => {
			const store = createTestStore();
			const payload = { content: [mockBooking], totalPages: 1, totalElements: 1 };

			store.dispatch({ type: 'bookings/fetchBookings/fulfilled', payload });
			const state = store.getState().bookings;

			expect(state.bookings).toEqual([mockBooking]);
			expect(state.totalPages).toBe(1);
			expect(state.totalElements).toBe(1);
		});
	});

	describe('fetchMyBookings.fulfilled', () => {
		it('should store user bookings', () => {
			const store = createTestStore();
			const payload = { content: [mockBooking], totalPages: 1, totalElements: 1 };

			store.dispatch({ type: 'bookings/fetchMyBookings/fulfilled', payload });

			expect(store.getState().bookings.bookings).toEqual([mockBooking]);
		});
	});

	describe('createBooking.fulfilled', () => {
		it('should add new booking to list', () => {
			const store = createTestStore();
			store.dispatch({ type: 'bookings/createBooking/fulfilled', payload: mockBooking });
			const state = store.getState().bookings;

			expect(state.bookings).toContainEqual(mockBooking);
			expect(state.totalElements).toBe(1);
		});
	});

	describe('changeBookingStatus.fulfilled', () => {
		it('should update booking status in list', () => {
			const store = createTestStore();
			store.dispatch({
				type: 'bookings/fetchBookings/fulfilled',
				payload: { content: [mockBooking], totalPages: 1, totalElements: 1 },
			});

			const updatedBooking = { ...mockBooking, status: 'CONFIRMED' };
			store.dispatch({
				type: 'bookings/changeBookingStatus/fulfilled',
				payload: updatedBooking,
			});

			const booking = store.getState().bookings.bookings.find((b) => b.id === 1);
			expect(booking?.status).toBe('CONFIRMED');
		});
	});

	describe('cancelBooking.fulfilled', () => {
		it('should remove booking from list', () => {
			const store = createTestStore();
			store.dispatch({
				type: 'bookings/fetchBookings/fulfilled',
				payload: { content: [mockBooking], totalPages: 1, totalElements: 1 },
			});

			store.dispatch({ type: 'bookings/cancelBooking/fulfilled', payload: 1 });

			expect(store.getState().bookings.bookings).toHaveLength(0);
		});
	});

	describe('deleteBooking.fulfilled', () => {
		it('should remove booking from list', () => {
			const store = createTestStore();
			store.dispatch({
				type: 'bookings/fetchBookings/fulfilled',
				payload: { content: [mockBooking], totalPages: 1, totalElements: 1 },
			});

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
