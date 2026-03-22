import { useTranslation } from 'react-i18next';
import { translateApiError } from '../utils/translateApiError';

type ErrorStateProps = {
	message: string;
	onRetry?: () => void;
};

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
	const { t } = useTranslation();

	return (
		<div className="error-state">
			<svg
				className="error-state-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				role="img"
				aria-label="Warning"
			>
				<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			</svg>
			<p className="error-state-message">{translateApiError(message, t)}</p>
			{onRetry && (
				<button type="button" className="error-state-retry" onClick={onRetry}>
					{t('common.tryAgain')}
				</button>
			)}
		</div>
	);
};

export default ErrorState;
