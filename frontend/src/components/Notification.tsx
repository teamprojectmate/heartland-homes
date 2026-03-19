import { useEffect, useState } from 'react';
import '../styles/components/_notifications.scss';

type NotificationProps = {
	message: string;
	type?: string;
	duration?: number;
	onClose?: () => void;
};

const Notification = ({
	message,
	type = 'success',
	duration = 3000,
	onClose,
}: NotificationProps) => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false);
			onClose?.();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	if (!visible || !message) return null;

	const notificationClass = `notification notification-${type}`;

	return (
		<div className={`${notificationClass}`} role="alert" aria-live="assertive" aria-atomic="true">
			<span>{message}</span>
			<button
				type="button"
				className="close-btn"
				onClick={() => {
					setVisible(false);
					onClose?.();
				}}
			>
				×
			</button>
		</div>
	);
};

export default Notification;
