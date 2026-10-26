import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { uk } from 'date-fns/locale/uk';
import { useEffect, useMemo, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getBookedDates } from '../../api/accommodations/accommodationService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createBooking } from '../../store/slices/bookingsSlice';
import '../../styles/components/booking/_booking-form.scss';
import type { Accommodation } from '../../types';
import {
	type BookedRange,
	expandBookedNights,
	firstBookedNightAfter,
	fromDateKey,
	toDateKey,
} from '../../utils/bookingDates';
import { calcNights } from '../../utils/dateCalc';
import { type BookingFormData, bookingSchema } from '../../validation/schemas';
import Notification from '../Notification';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('uk', uk);

const BookingForm = ({ accommodation }: { accommodation: Accommodation }) => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { status } = useAppSelector((state) => state.bookings);
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
	const [bookedDatesFailed, setBookedDatesFailed] = useState(false);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<BookingFormData>({
		resolver: zodResolver(bookingSchema),
		defaultValues: { checkInDate: '', checkOutDate: '' },
	});

	useEffect(() => {
		// Ignore a late response for a previous accommodation (the id can change while a request is in flight)
		let isCurrent = true;
		setBookedDatesFailed(false);

		getBookedDates(accommodation.id)
			.then((ranges) => {
				if (isCurrent) setBookedRanges(ranges);
			})
			.catch(() => {
				if (!isCurrent) return;
				setBookedRanges([]);
				setBookedDatesFailed(true);
			});

		return () => {
			isCurrent = false;
		};
	}, [accommodation.id]);

	const bookedNights = useMemo(() => expandBookedNights(bookedRanges), [bookedRanges]);

	const checkInDate = useWatch({ control, name: 'checkInDate' });
	const checkOutDate = useWatch({ control, name: 'checkOutDate' });

	const checkInDay = checkInDate ? fromDateKey(checkInDate) : null;
	const latestCheckOut = checkInDay ? firstBookedNightAfter(checkInDay, bookedNights) : undefined;

	const totalPrice = useMemo(() => {
		if (!checkInDate || !checkOutDate) return 0;
		return calcNights(checkInDate, checkOutDate) * accommodation.dailyRate;
	}, [checkInDate, checkOutDate, accommodation.dailyRate]);

	const onSubmit = async (data: BookingFormData) => {
		if (!isAuthenticated) {
			setError('root', { message: t('booking.loginRequired') });
			return;
		}

		const resultAction = await dispatch(
			createBooking({
				accommodationId: accommodation.id,
				checkInDate: data.checkInDate,
				checkOutDate: data.checkOutDate,
			}),
		);

		if (createBooking.fulfilled.match(resultAction)) {
			navigate('/my-bookings');
		} else {
			setError('root', { message: resultAction.payload ?? t('booking.createError') });
		}
	};

	const locale = i18n.language === 'uk' ? 'uk' : 'en';
	const today = new Date();

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="booking-form">
			{bookedDatesFailed && <Notification message={t('booking.bookedDatesError')} type="warning" />}

			<div className="form-group">
				<label htmlFor="check-in-date">{t('booking.checkInDate')}</label>
				<Controller
					name="checkInDate"
					control={control}
					render={({ field }) => (
						<DatePicker
							id="check-in-date"
							className="form-control"
							selected={field.value ? fromDateKey(field.value) : null}
							onChange={(date: Date | null) => field.onChange(date ? toDateKey(date) : '')}
							excludeDates={bookedNights}
							minDate={today}
							locale={locale}
							dateFormat="dd MMM yyyy"
							placeholderText={t('booking.datePlaceholder')}
							autoComplete="off"
						/>
					)}
				/>
				{errors.checkInDate && (
					<span className="form-error">{t(errors.checkInDate.message ?? '')}</span>
				)}
			</div>

			<div className="form-group form-group-spacing">
				<label htmlFor="check-out-date">{t('booking.checkOutDate')}</label>
				<Controller
					name="checkOutDate"
					control={control}
					render={({ field }) => (
						<DatePicker
							id="check-out-date"
							className="form-control"
							selected={field.value ? fromDateKey(field.value) : null}
							onChange={(date: Date | null) => field.onChange(date ? toDateKey(date) : '')}
							// Check-out may fall on the day another guest checks in, but not past it
							minDate={checkInDay ? addDays(checkInDay, 1) : today}
							maxDate={latestCheckOut}
							locale={locale}
							dateFormat="dd MMM yyyy"
							placeholderText={t('booking.datePlaceholder')}
							autoComplete="off"
						/>
					)}
				/>
				{errors.checkOutDate && (
					<span className="form-error">{t(errors.checkOutDate.message ?? '')}</span>
				)}
			</div>

			{totalPrice > 0 && (
				<p className="total-price">
					{t('booking.totalAmount')}:{' '}
					<strong>
						{totalPrice} {t('common.currency')}
					</strong>
				</p>
			)}

			{errors.root && <Notification message={errors.root.message || ''} type="danger" />}

			<button type="submit" className="btn-primary" disabled={status === 'loading'}>
				{status === 'loading' ? t('booking.booking') : t('booking.bookNow')}
			</button>
		</form>
	);
};

export default BookingForm;
