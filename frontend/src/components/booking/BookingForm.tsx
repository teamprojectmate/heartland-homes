import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getBookedDates } from '../../api/accommodations/accommodationService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createBooking } from '../../store/slices/bookingsSlice';
import '../../styles/components/booking/_booking-form.scss';
import type { Accommodation } from '../../types';
import { calcNights } from '../../utils/dateCalc';
import { type BookingFormData, bookingSchema } from '../../validation/schemas';
import Notification from '../Notification';

import 'react-datepicker/dist/react-datepicker.css';

type DateRange = { checkInDate: string; checkOutDate: string };

const BookingForm = ({ accommodation }: { accommodation: Accommodation }) => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { status } = useAppSelector((state) => state.bookings);
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	const [bookedRanges, setBookedRanges] = useState<DateRange[]>([]);

	const {
		control,
		handleSubmit,
		watch,
		setError,
		formState: { errors },
	} = useForm<BookingFormData>({
		resolver: zodResolver(bookingSchema),
		defaultValues: { checkInDate: '', checkOutDate: '' },
	});

	useEffect(() => {
		getBookedDates(accommodation.id)
			.then((ranges) =>
				setBookedRanges(
					ranges.map((r: { checkInDate: string; checkOutDate: string }) => ({
						checkInDate: r.checkInDate,
						checkOutDate: r.checkOutDate,
					})),
				),
			)
			.catch(() => setBookedRanges([]));
	}, [accommodation.id]);

	const excludedDates = useMemo(() => {
		const dates: Date[] = [];
		for (const range of bookedRanges) {
			const start = new Date(range.checkInDate);
			const end = new Date(range.checkOutDate);
			const current = new Date(start);
			while (current < end) {
				dates.push(new Date(current));
				current.setDate(current.getDate() + 1);
			}
		}
		return dates;
	}, [bookedRanges]);

	const checkInDate = watch('checkInDate');
	const checkOutDate = watch('checkOutDate');

	const totalPrice = useMemo(() => {
		if (!checkInDate || !checkOutDate) return 0;
		if (new Date(checkOutDate) <= new Date(checkInDate)) return 0;
		const nights = calcNights(checkInDate, checkOutDate);
		return nights * (accommodation?.dailyRate || 0);
	}, [checkInDate, checkOutDate, accommodation]);

	const onSubmit = async (data: BookingFormData) => {
		if (!isAuthenticated) {
			setError('root', { message: t('booking.loginRequired') });
			return;
		}

		const bookingData = {
			accommodationId: accommodation.id,
			checkInDate: data.checkInDate,
			checkOutDate: data.checkOutDate,
		};

		const resultAction = await dispatch(createBooking(bookingData));

		if (createBooking.fulfilled.match(resultAction)) {
			setTimeout(() => navigate('/my-bookings'), 1000);
		} else if (createBooking.rejected.match(resultAction)) {
			setError('root', { message: resultAction.payload as string });
		}
	};

	const locale = i18n.language === 'uk' ? 'uk' : 'en';
	const today = new Date();

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="booking-form">
			<div className="form-group">
				<label htmlFor="check-in-date">{t('booking.checkInDate')}</label>
				<Controller
					name="checkInDate"
					control={control}
					render={({ field }) => (
						<DatePicker
							id="check-in-date"
							className="form-control"
							selected={field.value ? new Date(field.value) : null}
							onChange={(date: Date | null) =>
								field.onChange(date ? date.toISOString().split('T')[0] : '')
							}
							excludeDates={excludedDates}
							minDate={today}
							locale={locale}
							dateFormat="dd/MM/yyyy"
							placeholderText={t('booking.checkInDate')}
							autoComplete="off"
						/>
					)}
				/>
				{errors.checkInDate && <span className="form-error">{errors.checkInDate.message}</span>}
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
							selected={field.value ? new Date(field.value) : null}
							onChange={(date: Date | null) =>
								field.onChange(date ? date.toISOString().split('T')[0] : '')
							}
							excludeDates={excludedDates}
							minDate={checkInDate ? new Date(checkInDate) : today}
							locale={locale}
							dateFormat="dd/MM/yyyy"
							placeholderText={t('booking.checkOutDate')}
							autoComplete="off"
						/>
					)}
				/>
				{errors.checkOutDate && <span className="form-error">{errors.checkOutDate.message}</span>}
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
