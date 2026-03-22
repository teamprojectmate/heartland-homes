const CardSkeleton = () => (
	<div className="card-skeleton">
		<div className="skeleton card-skeleton-image" />
		<div className="card-skeleton-body">
			<div className="skeleton card-skeleton-line card-skeleton-line-title" />
			<div className="skeleton card-skeleton-line card-skeleton-line-medium" />
			<div className="skeleton card-skeleton-line card-skeleton-line-short" />
			<div className="skeleton card-skeleton-button" />
		</div>
	</div>
);

export default CardSkeleton;
