const CardSkeleton = () => (
	<div className="card-skeleton">
		<div className="skeleton card-skeleton__image" />
		<div className="card-skeleton__body">
			<div className="skeleton card-skeleton__line card-skeleton__line--title" />
			<div className="skeleton card-skeleton__line card-skeleton__line--medium" />
			<div className="skeleton card-skeleton__line card-skeleton__line--short" />
			<div className="skeleton card-skeleton__button" />
		</div>
	</div>
);

export default CardSkeleton;
