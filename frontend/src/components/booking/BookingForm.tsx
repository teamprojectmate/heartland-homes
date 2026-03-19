import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createBooking } from '../../store/slices/bookingsSlice';
import '../../styles/components/booking/_booking-form.scss';
import { type BookingFormData, bookingSchema } from '../../validation/schemas';
import Notification from '../Notification';

const BookingForm = ({ accommodation }) => {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		watch,
		setError,
		formState: { errors },
	} = useForm<BookingFormData>({
		resolver: zodResolver(bookingSchema),
		defaultValues: {
			checkInDate: '',
			checkOutDate: '',
		},
	});

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { status } = useAppSelector((state) => state.bookings);
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	const checkInDate = watch('checkInDate');
	const checkOutDate = watch('checkOutDate');

	const totalPrice = useMemo(() => {
		if (!checkInDate || !checkOutDate) return 0;

		const start = new Date(checkInDate);
		const end = new Date(checkOutDate);

		if (end <= start) return 0;

		const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
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
			setTimeout(() => {
				navigate('/my-bookings');
			}, 1000);
		} else if (createBooking.rejected.match(resultAction)) {
			setError('root', { message: resultAction.payload as string });
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="booking-form">
			<div className="form-group">
				<label htmlFor="check-in-date">{t('booking.checkInDate')}</label>
				<input
					type="date"
					className="form-control"
					id="check-in-date"
					{...register('checkInDate')}
				/>
				{errors.checkInDate && <span className="form-error">{errors.checkInDate.message}</span>}
			</div>

			<div className="form-group form-group-spacing">
				<label htmlFor="check-out-date">{t('booking.checkOutDate')}</label>
				<input
					type="date"
					className="form-control"
					id="check-out-date"
					{...register('checkOutDate')}
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

			{errors.root && <Notification message={errors.root.message} type="danger" />}

			<button type="submit" className="btn-primary" disabled={status === 'loading'}>
				{status === 'loading' ? t('booking.booking') : t('booking.bookNow')}
			</button>
		</form>
	);
};

export default BookingForm;
