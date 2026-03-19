const FormSkeleton = () => (
	<div className="form-skeleton">
		{Array.from({ length: 4 }, (_, i) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
			<div key={i} className="form-skeleton__field">
				<div className="skeleton form-skeleton__label" />
				<div className="skeleton form-skeleton__input" />
			</div>
		))}
		<div className="skeleton form-skeleton__button" />
	</div>
);

export default FormSkeleton;
