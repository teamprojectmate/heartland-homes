import { FacebookIcon, InstagramIcon, Mail, MapPin, Phone, TwitterIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import '../styles/components/footer/_footer.scss';

const Footer = () => {
	const { t } = useTranslation();
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	const footerLinks = [
		{
			heading: t('footer.support'),
			links: [
				{ to: '/faq', label: 'FAQ' },
				{ to: '/support', label: t('footer.contactUs') },
				{ to: '/about', label: t('footer.aboutUs') },
			],
		},
		{
			heading: t('footer.proposals'),
			links: [
				{ to: '/offers', label: t('footer.offersDiscounts') },
				{ to: '/popular', label: t('footer.popularDestinations') },
				{ to: '/partners', label: t('footer.partners') },
			],
		},
		{
			heading: t('footer.information'),
			links: [
				{ to: '/terms', label: t('footer.terms') },
				{ to: '/privacy', label: t('footer.privacy') },
				{ to: '/cookies', label: t('footer.cookies') },
			],
		},
	];

	const socialLinks = [
		{ href: 'https://facebook.com', icon: <FacebookIcon />, label: 'Facebook' },
		{ href: 'https://instagram.com', icon: <InstagramIcon />, label: 'Instagram' },
		{ href: 'https://x.com', icon: <TwitterIcon />, label: 'X' },
	];

	return (
		<footer className="footer" role="contentinfo">
			<div className="footer__inner">
				{isAuthenticated && (
					<section className="footer__property">
						<h5 className="footer__property__title">{t('footer.registerProperty')}</h5>
						<p className="footer__property__text">{t('footer.registerPropertyDesc')}</p>
						<Link to="/accommodations/new" className="btn-secondary footer__property__btn">
							{t('footer.getStarted')}
						</Link>
					</section>
				)}

				<div className="footer__main">
					<nav className="footer__links" aria-label={t('footer.usefulLinks')}>
						{footerLinks.map((col) => (
							<div key={col.heading} className="footer__column">
								<h5 className="footer__column__title">{col.heading}</h5>
								<ul className="footer__column__list">
									{col.links.map((link) => (
										<li key={link.to} className="footer__column__item">
											<Link to={link.to} className="footer__column__link">
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>

					<address className="footer__contacts" aria-label={t('footer.contactInfo')}>
						<a href="tel:+380671234567" className="footer__contacts__link">
							<Phone size={18} /> +380 67 123 45 67
						</a>
						<a href="mailto:support@heartlandhomes.com" className="footer__contacts__link">
							<Mail size={18} /> support@heartlandhomes.com
						</a>
						<a
							href="https://goo.gl/maps/x9c6q"
							target="_blank"
							rel="noopener noreferrer"
							className="footer__contacts__link"
						>
							<MapPin size={18} /> {t('footer.address')}
						</a>
					</address>

					<div className="footer__social">
						{socialLinks.map((social) => (
							<a
								key={social.label}
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								className="footer__social__link"
								aria-label={social.label}
							>
								{social.icon}
							</a>
						))}
					</div>
				</div>

				<div className="footer__copyright">
					<p className="footer__copyright__text">
						{t('footer.copyright', { year: new Date().getFullYear() })}
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
