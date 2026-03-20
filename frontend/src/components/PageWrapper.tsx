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
	const authError = useAppSelector((s) =>
		s.auth.message && s.auth.isError ? s.auth.message : null,
	);
	const userError = useAppSelector((s) => s.user.error);
	const bookingsError = useAppSelector((s) => s.bookings.error);
	const accommodationsError = useAppSelector((s) => s.accommodations.error);
	const paymentsError = useAppSelector((s) => s.payments.error);

	const errors = [
		authError,
		userError,
		bookingsError,
		accommodationsError,
		paymentsError,
		...extraErrors,
	].filter(Boolean);

	const [blink, setBlink] = useState(false);

	// toggle blink, тільки коли є errors
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
