import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import Notification from './Notification';

type PageWrapperProps = {
	title?: string;
	children: React.ReactNode;
	extraErrors?: string[];
};

const PageWrapper = ({ title, children, extraErrors = [] }: PageWrapperProps) => {
	const { t } = useTranslation();
	// Auth errors are handled inline by Login/Register forms — skip them here
	// to avoid raw backend messages in the page title and notification banner
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
				<Notification key={String(err)} message={String(err)} type="danger" />
			))}
			{children}
		</>
	);
};

export default PageWrapper;
