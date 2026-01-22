import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
          <span className="navbar-logo-icon">🧤</span>
          <span>Smart Glove</span>
        </Link>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className="navbar-link" 
              onClick={handleLinkClick}
            >
              Accueil
            </Link>
          </li>
          <li>
            <a 
              href="#features" 
              className="navbar-link"
              onClick={handleLinkClick}
            >
              Fonctionnalités
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className="navbar-link"
              onClick={handleLinkClick}
            >
              À propos
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className="navbar-link"
              onClick={handleLinkClick}
            >
              Contact
            </a>
          </li>
          <li>
            <Link to="/dashboard" onClick={handleLinkClick}>
              <Button variant="primary" size="small">
                Dashboard
              </Button>
            </Link>
          </li>
        </ul>

        <button 
          className="navbar-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;