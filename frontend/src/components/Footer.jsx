import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <Link to="/" className="logo-font">
          Оренда Помешкань
        </Link>
        <span className="attribution">
          © 2025. Проект створено для навчання.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
