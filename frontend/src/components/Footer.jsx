import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import '../styles/components/_footer.scss';
import '../styles/components/_footer-extension.scss';

const footerLinks = [
  {
    heading: 'Підтримка',
    links: [
      { to: '/faq', label: 'FAQ' },
      { to: '/support', label: "Зв'язатися з нами" },
      { to: '/about', label: 'Про нас' }
    ]
  },
  {
    heading: 'Пропозиції',
    links: [
      { to: '/offers', label: 'Акції та знижки' },
      { to: '/popular', label: 'Популярні напрямки' },
      { to: '/partners', label: 'Партнери' }
    ]
  },
  {
    heading: 'Інформація',
    links: [
      { to: '/terms', label: 'Умови використання' },
      { to: '/privacy', label: 'Політика конфіденційності' },
      { to: '/cookies', label: 'Файли Cookie' }
    ]
  },
  {
    heading: 'Контакти',
    isContact: true
  }
];

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <footer className="main-footer" role="contentinfo">
      <div className="footer-inner">
        {/* ✅ Нова секція для авторизованих користувачів */}
        {isAuthenticated && (
          <div className="list-property-section">
            <h5 className="footer-heading">Зареєструвати своє помешкання</h5>
            <p>Отримайте доступ до мільйонів потенційних гостей по всьому світу.</p>
            <Link to="/admin/accommodations/new" className="btn-secondary">
              Розпочати
            </Link>
          </div>
        )}

        <div className="footer-links">
          {footerLinks.map((col) => (
            <div key={col.heading} className="footer-column">
              <h5 className="footer-heading">{col.heading}</h5>
              {col.isContact ? (
                <>
                  <div className="footer-contact">
                    <a href="tel:+380671234567">
                      <Phone size={18} /> +380 67 123 45 67
                    </a>
                    <a href="mailto:support@heartlandhomes.com">
                      <Mail size={18} /> support@heartlandhomes.com
                    </a>
                    <a
                      href="https://goo.gl/maps/x9c6q"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin size={18} /> Київ, вул. Хрещатик, 12
                    </a>
                  </div>
                  <div className="social-links">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter />
                    </a>
                  </div>
                </>
              ) : (
                <ul className="list-unstyled">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="footer-copyright">
          <p className="footer-text">
            Heartland Homes © {new Date().getFullYear()}. Проєкт створено для навчання.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
