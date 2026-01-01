/* ============================================
   FICHIER: src/components/Hero.js
   Composant section Hero (En-tête principal)
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Contenu Texte */}
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span>✨</span>
            <span>Technologie de pointe</span>
          </div>

          {/* Titre Principal */}
          <h1 className="hero-title">
            Reconnaissance de{' '}
            <span className="hero-title-highlight">Gestes</span>{' '}
            en Temps Réel
          </h1>

          {/* Description */}
          <p className="hero-description">
            Découvrez notre système intelligent de reconnaissance de gestes 
            utilisant l'apprentissage profond. Transformez vos mouvements en 
            commandes avec une précision exceptionnelle.
          </p>

          {/* Boutons d'Action */}
          <div className="hero-buttons">
            <Link to="/dashboard">
              <button className="hero-button hero-button-primary">
                <span>🚀</span>
                <span>Essayer Maintenant</span>
              </button>
            </Link>
            
            <a href="#features">
              <button className="hero-button hero-button-secondary">
                <span>📖</span>
                <span>En Savoir Plus</span>
              </button>
            </a>
          </div>

          {/* Statistiques */}
          <div className="hero-stats" style={{
            display: 'flex',
            gap: 'var(--spacing-xl)',
            marginTop: 'var(--spacing-2xl)',
            flexWrap: 'wrap'
          }}>
            <div className="hero-stat-item">
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                10+
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-light)'
              }}>
                Gestes Reconnus
              </div>
            </div>

            <div className="hero-stat-item">
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                95%+
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-light)'
              }}>
                Précision
              </div>
            </div>

            <div className="hero-stat-item">
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-light)'
              }}>
                Temps de Réponse
              </div>
            </div>
          </div>
        </div>

        {/* Partie Visuelle */}
        <div className="hero-visual">
          <div className="hero-image-container">
            {/* Placeholder pour image/animation */}
            <div className="hero-image-placeholder">
              🧤
            </div>
          </div>

          {/* Cartes Flottantes */}
          <div className="hero-floating-card hero-floating-card-1" style={{
            width: '150px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: 'var(--spacing-sm)'
            }}>
              ✋
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              Détection Instantanée
            </div>
          </div>

          <div className="hero-floating-card hero-floating-card-2" style={{
            width: '150px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: 'var(--spacing-sm)'
            }}>
              🎯
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              Haute Précision
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de Scroll */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--spacing-2xl)',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        animation: 'bounce 2s infinite'
      }}>
        <a 
          href="#features" 
          style={{
            color: 'var(--primary)',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
            Découvrir
          </span>
          <span style={{ fontSize: '1.5rem' }}>↓</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;