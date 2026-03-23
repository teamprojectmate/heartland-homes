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

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="container text-center mt-5">
					<h2>{i18n.t('common.errorOccurred')}</h2>
					<p>{i18n.t('common.unexpectedError')}</p>
					<div
						style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}
					>
						<button type="button" className="btn-primary" onClick={this.handleReset}>
							{i18n.t('common.tryAgain')}
						</button>
						<a href="/" className="btn-secondary">
							{i18n.t('common.goHome')}
						</a>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
