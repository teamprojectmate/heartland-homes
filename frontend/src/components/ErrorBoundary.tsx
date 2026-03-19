import React from 'react';
import i18n from '../i18n';

type ErrorBoundaryProps = { children: React.ReactNode };
type ErrorBoundaryState = { hasError: boolean; error: Error | null };

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="container text-center mt-5">
					<h2>{i18n.t('common.errorOccurred')}</h2>
					<p>{this.state.error?.message || i18n.t('common.unexpectedError')}</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
