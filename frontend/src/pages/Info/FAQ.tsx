import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const FAQ = () => {
	const { t } = useTranslation();

	const faqs = [
		{ q: t('info.faq1Q'), a: t('info.faq1A') },
		{ q: t('info.faq2Q'), a: t('info.faq2A') },
		{ q: t('info.faq3Q'), a: t('info.faq3A') },
	];

	return (
		<section className="info-page container">
			<div className="info-header">
				<HelpCircle className="info-icon" size={28} />
				<h1 className="page-title">{t('info.faqTitle')}</h1>
			</div>

			<div className="faq-grid">
				{faqs.map(({ q, a }) => (
					<div key={q} className="faq-card">
						<h3 className="faq-question">{q}</h3>
						<p className="faq-answer">{a}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default FAQ;
