import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getBookedDates } from '../../api/accommodations/accommodationService';
import bookingsService from '../../api/bookings/bookingsService';
import authReducer from '../../store/slices/authSlice';
import bookingsReducer from '../../store/slices/bookingsSlice';
import type { Accommodation } from '../../types';
import BookingForm from './BookingForm';

vi.mock(import('react-i18next'), async (importOriginal) => ({
	...(await importOriginal()),
	useTranslation: (() => ({
		// mirror i18next: a missing key falls back to defaultValue when one is given
		t: (key: string, options?: { defaultValue?: string }) => options?.defaultValue ?? key,
		i18n: { language: 'en' },
	})) as never,
}));

vi.mock('../../api/accommodations/accommodationService', () => ({
	getBookedDates: vi.fn(),
}));

vi.mock('../../api/bookings/bookingsService', () => ({
	default: { createBooking: vi.fn() },
}));

const accommodation = { id: 7, dailyRate: 100 } as Accommodation;

const renderForm = () => {
	const store = configureStore({
		reducer: { auth: authReducer, bookings: bookingsReducer },
		preloadedState: {
			auth: { ...authReducer(undefined, { type: 'init' }), isAuthenticated: true },
		},
	});
	return render(
		<Provider store={store}>
			<MemoryRouter>
				<BookingForm accommodation={accommodation} />
			</MemoryRouter>
		</Provider>,
	);
};

describe('BookingForm', () => {
	const originalTz = process.env.TZ;

	beforeAll(() => {
		process.env.TZ = 'Europe/Kyiv';
	});

	afterAll(() => {
		process.env.TZ = originalTz;
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('warns the user when booked dates cannot be loaded', async () => {
		vi.mocked(getBookedDates).mockRejectedValue(new Error('network'));

		renderForm();

		expect(await screen.findByText('booking.bookedDatesError')).toBeInTheDocument();
	});

	it('sends the selected calendar days without a time zone shift', async () => {
		vi.mocked(getBookedDates).mockResolvedValue([]);
		vi.mocked(bookingsService.createBooking).mockResolvedValue({ id: 1 } as never);
		const user = userEvent.setup();

		renderForm();

		await user.type(screen.getByLabelText('booking.checkInDate'), '06 Oct 2030');
		await user.type(screen.getByLabelText('booking.checkOutDate'), '09 Oct 2030');
		await user.click(screen.getByRole('button', { name: 'booking.bookNow' }));

		await waitFor(() =>
			expect(bookingsService.createBooking).toHaveBeenCalledWith({
				accommodationId: 7,
				checkInDate: '2030-10-06',
				checkOutDate: '2030-10-09',
			}),
		);
	});
});
