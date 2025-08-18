// src/components/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/_footer.scss";
import "../styles/layout/_main-layout.scss";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-links">
          <div className="footer-column">
            <h5 className="footer-heading">Підтримка</h5>
            <ul className="list-unstyled">
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/support" className="footer-link">Зв'язатися з нами</Link></li>
              <li><Link to="/about" className="footer-link">Про нас</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h5 className="footer-heading">Пропозиції</h5>
            <ul className="list-unstyled">
              <li><Link to="/offers" className="footer-link">Акції та знижки</Link></li>
              <li><Link to="/popular" className="footer-link">Популярні напрямки</Link></li>
              <li><Link to="/partners" className="footer-link">Партнери</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h5 className="footer-heading">Інформація</h5>
            <ul className="list-unstyled">
              <li><Link to="/terms" className="footer-link">Умови використання</Link></li>
              <li><Link to="/privacy" className="footer-link">Політика конфіденційності</Link></li>
              <li><Link to="/cookies" className="footer-link">Файли Cookie</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-copyright">
          <p className="footer-text">Heartland Homes © 2025. Проєкт створено для навчання.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
