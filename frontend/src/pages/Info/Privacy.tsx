import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const Privacy = () => {
	const { t } = useTranslation();

	return (
		<section className="info-page container">
			<div className="info-header">
				<Shield className="info-icon" size={28} />
				<h1 className="page-title">{t('info.privacyTitle')}</h1>
			</div>

			<div className="info-block">
				<p>{t('info.privacyText1')}</p>
				<p>{t('info.privacyText2')}</p>
			</div>
		</section>
	);
};

export default Privacy;
