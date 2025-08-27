// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/_footer.scss';
import '../styles/layout/_main-layout.scss';

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
  }
];

const Footer = () => (
  <footer className="main-footer" role="contentinfo">
    <div className="container">
      <div className="footer-links">
        {footerLinks.map((col) => (
          <div key={col.heading} className="footer-column">
            <h5 className="footer-heading">{col.heading}</h5>
            <ul className="list-unstyled">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
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

export default Footer;
