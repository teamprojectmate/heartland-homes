import type { RootState } from './store';

// ── Auth ──
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.isError;
export const selectAuthMessage = (state: RootState) => state.auth.message;

// ── Accommodations ──
export const selectAccommodations = (state: RootState) => state.accommodations;
export const selectAccommodationItems = (state: RootState) => state.accommodations.items;
export const selectAccommodationsLoading = (state: RootState) => state.accommodations.loading;
export const selectAccommodationsError = (state: RootState) => state.accommodations.error;
export const selectAccommodationsPage = (state: RootState) => state.accommodations.page;
export const selectAccommodationsTotalPages = (state: RootState) => state.accommodations.totalPages;
export const selectAccommodationsFilters = (state: RootState) => state.accommodations.filters;

// ── Bookings ──
export const selectBookings = (state: RootState) => state.bookings;
export const selectBookingsList = (state: RootState) => state.bookings.bookings;
export const selectBookingsStatus = (state: RootState) => state.bookings.status;
export const selectBookingsError = (state: RootState) => state.bookings.error;
export const selectBookingsPage = (state: RootState) => state.bookings.page;
export const selectBookingsTotalPages = (state: RootState) => state.bookings.totalPages;
export const selectCurrentBooking = (state: RootState) => state.bookings.currentBooking;

// ── Payments ──
export const selectPayments = (state: RootState) => state.payments;
export const selectPaymentsList = (state: RootState) => state.payments.payments;
export const selectPaymentsFetchStatus = (state: RootState) => state.payments.fetchStatus;
export const selectPaymentsError = (state: RootState) => state.payments.error;
export const selectPaymentsTotalPages = (state: RootState) => state.payments.totalPages;

// ── User ──
export const selectUserState = (state: RootState) => state.user;
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserItems = (state: RootState) => state.user.items;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
