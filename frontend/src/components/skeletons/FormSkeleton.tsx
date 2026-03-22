const FormSkeleton = () => (
	<div className="form-skeleton">
		{Array.from({ length: 4 }, (_, i) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
			<div key={i} className="form-skeleton-field">
				<div className="skeleton form-skeleton-label" />
				<div className="skeleton form-skeleton-input" />
			</div>
		))}
		<div className="skeleton form-skeleton-button" />
	</div>
);

export default FormSkeleton;
