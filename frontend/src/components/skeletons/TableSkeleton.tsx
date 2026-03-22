type TableSkeletonProps = {
	rows?: number;
	columns?: number;
};

const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => (
	<div className="table-skeleton">
		<div className="table-skeleton-header">
			{Array.from({ length: columns }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
				<div key={i} className="skeleton table-skeleton-header-cell" />
			))}
		</div>
		{Array.from({ length: rows }, (_, i) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
			<div key={i} className="table-skeleton-row">
				{Array.from({ length: columns }, (_, j) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
					<div key={j} className="skeleton table-skeleton-cell" />
				))}
			</div>
		))}
	</div>
);

export default TableSkeleton;
