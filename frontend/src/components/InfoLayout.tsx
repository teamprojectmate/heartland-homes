import type React from 'react';
import '../styles/components/_info-pages.scss';

type InfoLayoutProps = {
	title: string;
	icon?: React.ComponentType<{ size: number; className?: string }>;
	children: React.ReactNode;
};

const InfoLayout = ({ title, icon: Icon, children }: InfoLayoutProps) => {
	return (
		<section className="info-page container">
			<div className="info-header">
				{Icon && <Icon size={28} className="info-icon" />}
				<h1 className="page-title">{title}</h1>
			</div>
			<div className="info-content">{children}</div>
		</section>
	);
};

export default InfoLayout;
