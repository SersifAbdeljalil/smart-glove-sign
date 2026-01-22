

import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Rocket, BookOpen, Home as HomeIcon, GraduationCap, Settings, Zap,Linkedin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import '../styles/home.css';

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
const logoPath = '/gestures/LOGO.png';
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
  <img 
    src="/gestures/LOGO.png" 
    alt="Smart Glove Logo" 
    className="navbar-logo-icon"
    style={{
      width: '40px',
      height: '40px',
      objectFit: 'contain'
    }}
  />
  <span>Smart Glove</span>
</Link>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className="navbar-link" 
              onClick={handleLinkClick}
            >
              <HomeIcon size={18} style={{ marginRight: '0.5rem' }} />
              <span>Accueil</span>
            </Link>
          </li>
          <li>
            <a 
              href="#features" 
              className="navbar-link"
              onClick={handleLinkClick}
            >
              <Sparkles size={18} style={{ marginRight: '0.5rem' }} />
              <span>Fonctionnalités</span>
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className="navbar-link"
              onClick={handleLinkClick}
            >
              <BookOpen size={18} style={{ marginRight: '0.5rem' }} />
              <span>À propos</span>
            </a>
          </li>
          <li>
  <a 
    href="/#team" 
    className="navbar-link"
    onClick={handleLinkClick}
  >
    <Users size={18} />
    <span>Équipe</span>
  </a>
</li>
          <li>
            <Link to="/dashboard" onClick={handleLinkClick}>
              <button className="hero-button hero-button-primary" style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                fontSize: '0.875rem'
              }}>
                <Rocket size={18} />
                <span>Dashboard</span>
              </button>
            </Link>
          </li>
        </ul>

        <button 
          className="navbar-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

const Home = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      <Hero />
<section className="team-section" id="team">
  <div className="team-container">
    <div className="team-header">
      <span className="team-badge">
        <Users size={16} />
        Notre Équipe
      </span>
      <h2 className="team-title">Les Créateurs du Projet</h2>
      <p className="team-description">
        Une équipe polyvalente de développeurs Full Stack spécialisés en IA et IoT
      </p>
    </div>

    <div className="team-grid">
      <div className="team-card">
        <div className="team-image-wrapper">
          <img 
            src="/gestures/SERSIF Abdeljalil.jpg" 
            alt="SERSIF Abdeljalil"
            className="team-image"
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=Abdeljalil+SERSIF&background=6FF0E2&color=06141B&size=400&bold=true&font-size=0.4';
            }}
          />
          <div className="team-overlay">
            <a 
              href="https://www.linkedin.com/in/abdeljalil-sersif" 
              target="_blank" 
              rel="noopener noreferrer"
              className="team-linkedin-btn"
            >
              <Linkedin size={24} />
              <span>Voir le profil</span>
            </a>
          </div>
        </div>
        <div className="team-info">
          <h3 className="team-name">SERSIF Abdeljalil</h3>
          <p className="team-role">Full Stack Developer</p>
          <div className="team-skills">
            <span className="team-skill">IA</span>
            <span className="team-skill">IoT</span>
            <span className="team-skill">Web</span>
          </div>
        </div>
      </div>

      <div className="team-card">
        <div className="team-image-wrapper">
          <img 
            src="/gestures/nouha.png" 
            alt="CHAHMI Nouhaila"
            className="team-image"
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=Nouhaila+Chahmi&background=8B1538&color=ffffff&size=400&bold=true&font-size=0.4';
            }}
          />
          <div className="team-overlay">
            <a 
              href="https://www.linkedin.com/in/nouhaila-chahmi-485542351" 
              target="_blank" 
              rel="noopener noreferrer"
              className="team-linkedin-btn"
            >
              <Linkedin size={24} />
              <span>Voir le profil</span>
            </a>
          </div>
        </div>
        <div className="team-info">
          <h3 className="team-name">CHAHMI Nouhaila</h3>
          <p className="team-role">Full Stack Developer</p>
          <div className="team-skills">
            <span className="team-skill">IA</span>
            <span className="team-skill">IoT</span>
            <span className="team-skill">Web</span>
          </div>
        </div>
      </div>

      <div className="team-card">
        <div className="team-image-wrapper">
          <img 
            src="https://ui-avatars.com/api/?name=Kawtar+Gantouh&background=9B7EBD&color=ffffff&size=400&bold=true&font-size=0.4"
            alt="GANTOUH Kawtar"
            className="team-image"
          />
          <div className="team-overlay">
            <a 
              href="https://www.linkedin.com/in/kawtar-gantouh-67a002352" 
              target="_blank" 
              rel="noopener noreferrer"
              className="team-linkedin-btn"
            >
              <Linkedin size={24} />
              <span>Voir le profil</span>
            </a>
          </div>
        </div>
        <div className="team-info">
          <h3 className="team-name">GANTOUH Kawtar</h3>
          <p className="team-role">Full Stack Developer</p>
          <div className="team-skills">
            <span className="team-skill">IA</span>
            <span className="team-skill">IoT</span>
            <span className="team-skill">Web</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      <Features />
      <section 
        id="about" 
        style={{
          padding: '5rem 0',
          background: 'var(--bg-primary)',
          position: 'relative'
        }}
      >
        <div className="features-container">
          <div className="features-header">
            <span className="features-badge">
              À Propos
            </span>

            <h2 className="features-title">
              Notre Mission
            </h2>

            <p className="features-description">
              Smart Glove est né de la volonté de rendre la technologie 
              de reconnaissance de gestes accessible à tous. Notre équipe 
              de chercheurs et développeurs passionnés travaille sans 
              relâche pour créer des solutions innovantes basées sur 
              l'intelligence artificielle.
            </p>

            <p className="features-description" style={{ marginTop: 'var(--spacing-lg)' }}>
           Grâce à notre système de Machine Learning, nous avons développé 
           un prototype capable de reconnaître trois gestes distincts avec une bonne précision, 
           démontrant la faisabilité de la reconnaissance 
           gestuelle pour des applications en accessibilité, 
           interaction homme-machine et robotique.
            </p>
          </div>
          <div className="features-grid" style={{ marginTop: 'var(--spacing-3xl)' }}>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #6FF0E2 0%, #00D4AA 100%)' }}>
                <GraduationCap size={32} />
              </div>
              <h3 className="feature-title">
                Machine Learning
              </h3>
              <p className="feature-description">
                Algorithme de Random Forest pour une reconnaissance précise et rapide des gestes à partir des données capteurs du Smart Glove.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #6FF0E2 0%, #00D4AA 100%)' }}>
                <Settings size={32} />
              </div>
              <h3 className="feature-title">
                Flask + React
              </h3>
              <p className="feature-description">
                Architecture moderne combinant puissance backend et interface réactive
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #6FF0E2 0%, #00D4AA 100%)' }}>
                <Zap size={32} />
              </div>
              <h3 className="feature-title">
                Open Source
              </h3>
              <p className="feature-description">
                Communauté active contribuant à l'amélioration continue du projet
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;