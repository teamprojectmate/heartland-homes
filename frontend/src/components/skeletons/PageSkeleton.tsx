import CardSkeleton from './CardSkeleton';

const PageSkeleton = () => (
	<div className="page-skeleton">
		<div className="skeleton page-skeleton__header" />
		<div className="page-skeleton__grid">
			<CardSkeleton />
			<CardSkeleton />
			<CardSkeleton />
		</div>
	</div>
);

export default PageSkeleton;
