import { Link } from 'react-router-dom';

type EmptyStateProps = {
	icon: string;
	title: string;
	description?: string;
	actionLabel?: string;
	actionTo?: string;
};

const EmptyState = ({ icon, title, description, actionLabel, actionTo }: EmptyStateProps) => (
	<div className="empty-state">
		<span className="empty-state-icon">{icon}</span>
		<h3 className="empty-state-title">{title}</h3>
		{description && <p className="empty-state-description">{description}</p>}
		{actionLabel && actionTo && (
			<Link to={actionTo} className="btn btn-primary">
				{actionLabel}
			</Link>
		)}
	</div>
);

export default EmptyState;
