import {
	selectAccommodationItems,
	selectAccommodations,
	selectAccommodationsFilters,
	selectAccommodationsLoading,
	selectAuth,
	selectAuthError,
	selectAuthLoading,
	selectAuthMessage,
	selectBookings,
	selectBookingsError,
	selectBookingsList,
	selectBookingsStatus,
	selectCurrentBooking,
	selectIsAuthenticated,
	selectPayments,
	selectPaymentsFetchStatus,
	selectPaymentsList,
	selectUser,
	selectUserLoading,
	selectUserProfile,
	selectUserState,
} from './selectors';
import type { RootState } from './store';

const mockState: RootState = {
	auth: {
		user: { id: 1, email: 'test@test.com', cleanRole: 'CUSTOMER' },
		isAuthenticated: true,
		isError: false,
		isSuccess: true,
		isLoading: false,
		message: '',
	},
	accommodations: {
		items: [{ id: 1, name: 'Hotel' }],
		loading: false,
		error: null,
		page: 0,
		totalPages: 1,
		totalElements: 1,
		size: 10,
		sort: null,
		filters: { city: 'Kyiv', type: null, minDailyRate: null, maxDailyRate: null },
		adminMode: false,
		myMode: false,
	},
	bookings: {
		bookings: [{ id: 1, status: 'PENDING' }],
		currentBooking: null,
		status: 'succeeded',
		error: null,
		paymentStatus: 'idle',
		page: 0,
		totalPages: 1,
		totalElements: 1,
	},
	payments: {
		payments: [{ id: 1, amount: 500 }],
		payment: null,
		fetchStatus: 'idle',
		createStatus: 'idle',
		error: null,
		page: 0,
		totalPages: 1,
		totalElements: 1,
	},
	user: {
		profile: { id: 1, firstName: 'Test', lastName: 'User' },
		items: [],
		loading: false,
		error: null,
	},
} as unknown as RootState;

describe('Auth selectors', () => {
	it('selectAuth returns auth state', () => {
		expect(selectAuth(mockState)).toBe(mockState.auth);
	});

	it('selectUser returns user', () => {
		expect(selectUser(mockState)).toEqual({ id: 1, email: 'test@test.com', cleanRole: 'CUSTOMER' });
	});

	it('selectIsAuthenticated returns true', () => {
		expect(selectIsAuthenticated(mockState)).toBe(true);
	});

	it('selectAuthLoading returns false', () => {
		expect(selectAuthLoading(mockState)).toBe(false);
	});

	it('selectAuthError returns false', () => {
		expect(selectAuthError(mockState)).toBe(false);
	});

	it('selectAuthMessage returns empty string', () => {
		expect(selectAuthMessage(mockState)).toBe('');
	});
});

describe('Accommodations selectors', () => {
	it('selectAccommodations returns full state', () => {
		expect(selectAccommodations(mockState)).toBe(mockState.accommodations);
	});

	it('selectAccommodationItems returns items array', () => {
		expect(selectAccommodationItems(mockState)).toHaveLength(1);
	});

	it('selectAccommodationsLoading returns false', () => {
		expect(selectAccommodationsLoading(mockState)).toBe(false);
	});

	it('selectAccommodationsFilters returns filters with city', () => {
		expect(selectAccommodationsFilters(mockState).city).toBe('Kyiv');
	});
});

describe('Bookings selectors', () => {
	it('selectBookings returns full state', () => {
		expect(selectBookings(mockState)).toBe(mockState.bookings);
	});

	it('selectBookingsList returns bookings array', () => {
		expect(selectBookingsList(mockState)).toHaveLength(1);
	});

	it('selectBookingsStatus returns succeeded', () => {
		expect(selectBookingsStatus(mockState)).toBe('succeeded');
	});

	it('selectBookingsError returns null', () => {
		expect(selectBookingsError(mockState)).toBeNull();
	});

	it('selectCurrentBooking returns null', () => {
		expect(selectCurrentBooking(mockState)).toBeNull();
	});
});

describe('Payments selectors', () => {
	it('selectPayments returns full state', () => {
		expect(selectPayments(mockState)).toBe(mockState.payments);
	});

	it('selectPaymentsList returns payments array', () => {
		expect(selectPaymentsList(mockState)).toHaveLength(1);
	});

	it('selectPaymentsFetchStatus returns idle', () => {
		expect(selectPaymentsFetchStatus(mockState)).toBe('idle');
	});
});

describe('User selectors', () => {
	it('selectUserState returns full state', () => {
		expect(selectUserState(mockState)).toBe(mockState.user);
	});

	it('selectUserProfile returns profile', () => {
		expect(selectUserProfile(mockState)).toEqual({ id: 1, firstName: 'Test', lastName: 'User' });
	});

	it('selectUserLoading returns false', () => {
		expect(selectUserLoading(mockState)).toBe(false);
	});
});
