type SkeletonProps = {
	width?: string;
	height?: string;
	borderRadius?: string;
	className?: string;
};

const Skeleton = ({ width, height, borderRadius, className = '' }: SkeletonProps) => (
	<div className={`skeleton ${className}`} style={{ width, height, borderRadius }} />
);

export default Skeleton;
