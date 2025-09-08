// src/store/selectors/paymentsSelectors.js
export const selectPaymentByBookingId = (state, bookingId) => {
  return state.payments.payments.find((p) => p.bookingId === bookingId);
};
