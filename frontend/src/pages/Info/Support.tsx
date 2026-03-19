import { Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const Support = () => {
	const { t } = useTranslation();

	return (
		<section className="info-page container">
			<div className="info-header">
				<Mail className="info-icon" size={28} />
				<h1 className="page-title">{t('info.supportTitle')}</h1>
			</div>

			<p className="lead-text">{t('info.supportText')}</p>

			<div className="support-box">
				<p>
					<Phone size={20} /> <a href="tel:+380671234567">+380 67 123 45 67</a>
				</p>
				<p>
					<Mail size={20} />{' '}
					<a href="mailto:support@heartlandhomes.com">support@heartlandhomes.com</a>
				</p>
			</div>
		</section>
	);
};

export default Support;
