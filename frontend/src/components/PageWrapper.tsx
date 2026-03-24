import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAccommodationsError } from '../store/slices/accommodationsSlice';
import { clearBookingsError } from '../store/slices/bookingsSlice';
import { clearPaymentsError } from '../store/slices/paymentsSlice';
import { clearUserError } from '../store/slices/userSlice';
import Notification from './Notification';

type PageWrapperProps = {
	title?: string;
	children: React.ReactNode;
	extraErrors?: string[];
};

const PageWrapper = ({ title, children, extraErrors = [] }: PageWrapperProps) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const location = useLocation();

	const userError = useAppSelector((s) => s.user.error);
	const bookingsError = useAppSelector((s) => s.bookings.error);
	const accommodationsError = useAppSelector((s) => s.accommodations.error);
	const paymentsError = useAppSelector((s) => s.payments.error);

	const errors = [
		userError,
		bookingsError,
		accommodationsError,
		paymentsError,
		...extraErrors,
	].filter(Boolean);

	const [blink, setBlink] = useState(false);
	const [prevPath, setPrevPath] = useState(location.pathname);

	// Clear all errors on route change
	if (location.pathname !== prevPath) {
		setPrevPath(location.pathname);
		dispatch(clearUserError());
		dispatch(clearBookingsError());
		dispatch(clearAccommodationsError());
		dispatch(clearPaymentsError());
	}

	const clearAllErrors = useCallback(() => {
		dispatch(clearUserError());
		dispatch(clearBookingsError());
		dispatch(clearAccommodationsError());
		dispatch(clearPaymentsError());
	}, [dispatch]);

	useEffect(() => {
		if (errors.length === 0) return;

		const interval = setInterval(() => setBlink((prev) => !prev), 1500);
		return () => clearInterval(interval);
	}, [errors.length]);

	// update title + favicon
	useEffect(() => {
		const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
		const errorMsg = errors[0];

		if (errors.length > 0) {
			document.title = blink
				? `${t('common.errorPrefix', { message: errorMsg })}`
				: title
					? `${title} | Heartland Homes`
					: 'Heartland Homes';

			if (favicon) {
				favicon.href = blink
					? `/favicon-error.ico?v=${Date.now()}`
					: `/favicon.ico?v=${Date.now()}`;
			}
		} else {
			document.title = title ? `${title} | Heartland Homes` : 'Heartland Homes';
			if (favicon) favicon.href = '/favicon.ico';
		}
	}, [blink, errors, title, t]);

	return (
		<>
			{errors.map((err) => (
				<Notification
					key={String(err)}
					message={String(err)}
					type="danger"
					onClose={clearAllErrors}
				/>
			))}
			{children}
		</>
	);
};

export default PageWrapper;
