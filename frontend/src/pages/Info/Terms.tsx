import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const Terms = () => {
	const { t } = useTranslation();

	return (
		<section className="info-page container">
			<div className="info-header">
				<FileText className="info-icon" size={28} />
				<h1 className="page-title">{t('info.termsTitle')}</h1>
			</div>

			<div className="info-block">
				<p>{t('info.termsText')}</p>
				<ul className="styled-list terms">
					<li>{t('info.terms1')}</li>
					<li>{t('info.terms2')}</li>
					<li>{t('info.terms3')}</li>
				</ul>
			</div>
		</section>
	);
};

export default Terms;
