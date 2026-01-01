import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Détecter le scroll pour changer le style de la navbar
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

  // Fermer le menu mobile lors du clic sur un lien
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Toggle du menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
          <span className="navbar-logo-icon">🧤</span>
          <span>Smart Glove</span>
        </Link>

        {/* Menu Desktop */}
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

        {/* Bouton Menu Mobile */}
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