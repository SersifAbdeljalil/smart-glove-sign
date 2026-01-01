/* ============================================
   FICHIER: src/components/Footer.js
   Composant pied de page
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contenu principal du footer */}
        <div className="footer-content">
          {/* Section Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span style={{ fontSize: '2rem' }}>🧤</span>
              <span>Smart Glove</span>
            </Link>
            <p className="footer-description">
              Système intelligent de reconnaissance de gestes utilisant 
              l'apprentissage profond pour transformer vos mouvements 
              en commandes avec une précision exceptionnelle.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)',
              marginTop: 'var(--spacing-md)'
            }}>
              <span style={{ 
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                backgroundColor: 'var(--primary)',
                color: 'var(--secondary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                IA
              </span>
              <span style={{ 
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                backgroundColor: 'var(--accent)',
                color: 'var(--secondary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Deep Learning
              </span>
              <span style={{ 
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                backgroundColor: 'var(--secondary-light)',
                color: 'var(--primary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Temps Réel
              </span>
            </div>
          </div>

          {/* Section Liens Rapides */}
          <div className="footer-section">
            <h4 className="footer-section-title">Liens Rapides</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Accueil
                </Link>
              </li>
              <li>
                <a href="#features" className="footer-link">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#about" className="footer-link">
                  À propos
                </a>
              </li>
            </ul>
          </div>

          {/* Section Ressources */}
          <div className="footer-section">
            <h4 className="footer-section-title">Ressources</h4>
            <ul className="footer-links">
              <li>
                <a href="#documentation" className="footer-link">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#api" className="footer-link">
                  API
                </a>
              </li>
              <li>
                <a href="#tutorials" className="footer-link">
                  Tutoriels
                </a>
              </li>
              <li>
                <a href="#faq" className="footer-link">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Section Contact */}
          <div className="footer-section">
            <h4 className="footer-section-title">Contact</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:contact@smartglove.com" className="footer-link">
                  contact@smartglove.com
                </a>
              </li>
              <li>
                <a href="tel:+212600000000" className="footer-link">
                  +212 6 00 00 00 00
                </a>
              </li>
              <li>
                <span className="footer-link" style={{ cursor: 'default' }}>
                  Casablanca, Maroc
                </span>
              </li>
              <li>
                <a href="#support" className="footer-link">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="footer-bottom">
          {/* Copyright */}
          <div className="footer-copyright">
            <p>
              © {currentYear} Smart Glove. Tous droits réservés.
            </p>
            <p style={{ 
              fontSize: '0.875rem',
              marginTop: 'var(--spacing-xs)',
              opacity: 0.8
            }}>
              Fait avec ❤️ par l'équipe Smart Glove
            </p>
          </div>

          {/* Réseaux sociaux */}
          <div className="footer-social">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitHub"
            >
              <span style={{ fontSize: '1.25rem' }}>💻</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <span style={{ fontSize: '1.25rem' }}>💼</span>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Twitter"
            >
              <span style={{ fontSize: '1.25rem' }}>🐦</span>
            </a>
            <a 
              href="mailto:contact@smartglove.com" 
              className="footer-social-link"
              aria-label="Email"
            >
              <span style={{ fontSize: '1.25rem' }}>📧</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;