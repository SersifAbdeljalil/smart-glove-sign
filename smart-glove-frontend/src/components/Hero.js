/* ============================================
   FICHIER: src/components/Hero.js
   Composant section Hero (En-tête principal)
   Version adaptée aux styles existants
   ============================================ */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Target, Wifi, Cpu } from 'lucide-react';

const Hero = () => {
  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Contenu Texte */}
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
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
                <span>Essayer Maintenant</span>
              </button>
            </Link>
            
            <a href="#features">
              <button className="hero-button hero-button-secondary">
                <span>En Savoir Plus</span>
              </button>
            </a>
          </div>
        </div>

        {/* Partie Visuelle */}
        <div className="hero-visual">
          <div className="hero-image-container">
            {/* CONTENEUR AVEC BORDURE GRADIENT ANIMÉE */}
            <div 
              className="hero-image-wrapper"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              {/* Gradient Border Glow Effect */}
              <div className="hero-image-glow"></div>
              
              {/* IMAGE RÉELLE */}
              <div className="hero-real-image">
                <img 
                  src="/gestures/image.png"
                  alt="Smart Glove - Système de reconnaissance de gestes"
                  className="hero-main-image"
                  style={{
                    transform: isImageHovered ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                
                {/* Overlay avec gradient - visible au hover */}
                <div 
                  className="hero-image-overlay"
                  style={{
                    opacity: isImageHovered ? 1 : 0,
                    transition: 'opacity 0.5s ease'
                  }}
                >
                  <div className="hero-image-info">
                    <h3 className="hero-image-title">
                      Smart Glove v1.0
                    </h3>
                    <p className="hero-image-subtitle">
                      Capteurs flex + ESP32 + Module ML
                    </p>
                  </div>
                </div>

                {/* Glow Effect on Hover */}
                <div 
                  className="hero-image-hover-glow"
                  style={{
                    opacity: isImageHovered ? 1 : 0,
                    transition: 'opacity 0.5s ease'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Cartes Flottantes avec icônes Lucide - Position 1 (Haut Droite) */}
          <div className="hero-floating-card hero-card-top-right">
            <div className="hero-card-icon-wrapper">
              <div className="hero-card-icon-bg hero-icon-cyan">
                <Zap size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="hero-card-text">
              <div className="hero-card-title-text">Détection Instantanée</div>
              <div className="hero-card-subtitle-text">&lt; 50ms latence</div>
            </div>
          </div>

          {/* Carte Position 2 (Haut Gauche) */}
          <div className="hero-floating-card hero-card-top-left">
            <div className="hero-card-icon-wrapper">
              <div className="hero-card-icon-bg hero-icon-purple">
                <Target size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="hero-card-text">
              <div className="hero-card-title-text">Haute Précision</div>
              <div className="hero-card-subtitle-text">95%+ accuracy</div>
            </div>
          </div>

          {/* Carte Position 3 (Bas Droite) */}
          <div className="hero-floating-card hero-card-bottom-right">
            <div className="hero-card-icon-wrapper">
              <div className="hero-card-icon-bg hero-icon-blue">
                <Wifi size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="hero-card-text">
              <div className="hero-card-title-text">WiFi Connected</div>
              <div className="hero-card-subtitle-text">Real-time data</div>
            </div>
          </div>

          {/* Carte Position 4 (Bas Gauche) */}
          <div className="hero-floating-card hero-card-bottom-left">
            <div className="hero-card-icon-wrapper">
              <div className="hero-card-icon-bg hero-icon-pink">
                <Cpu size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="hero-card-text">
              <div className="hero-card-title-text">ESP32 Powered</div>
              <div className="hero-card-subtitle-text">Dual-core MCU</div>
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
            gap: 'var(--spacing-sm)',
            transition: 'all 0.3s ease'
          }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
            Découvrir
          </span>
          <span style={{ fontSize: '1.5rem' }}>↓</span>
        </a>
      </div>

      {/* Styles Inline Supplémentaires */}
      <style>{`
        /* ===== WRAPPER IMAGE AVEC BORDURE GRADIENT ===== */
        .hero-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-2xl);
        }

        /* Gradient Border Glow - Animation Pulse */
        .hero-image-glow {
          position: absolute;
          inset: -3px;
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--secondary),
            var(--primary)
          );
          background-size: 200% 200%;
          border-radius: var(--radius-2xl);
          opacity: 0.7;
          filter: blur(10px);
          animation: gradient-rotate 3s linear infinite, pulse-glow 2s ease-in-out infinite;
          z-index: 0;
        }

        .hero-image-wrapper:hover .hero-image-glow {
          opacity: 1;
          filter: blur(15px);
          animation: gradient-rotate 2s linear infinite, pulse-glow 1.5s ease-in-out infinite;
        }

        @keyframes gradient-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.01);
          }
        }

        /* ===== CONTAINER IMAGE RÉELLE ===== */
        .hero-real-image {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: var(--radius-2xl);
          background: rgba(6, 20, 27, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-light);
          z-index: 1;
        }

        .hero-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ===== OVERLAY AVEC INFO PROJECT ===== */
        .hero-image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--spacing-xl);
          background: linear-gradient(
            to top,
            rgba(6, 20, 27, 0.95) 0%,
            rgba(6, 20, 27, 0.7) 50%,
            transparent 100%
          );
          border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
          z-index: 2;
          pointer-events: none;
        }

        .hero-image-info {
          transform: translateY(10px);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-image-wrapper:hover .hero-image-info {
          transform: translateY(0);
        }

        .hero-image-title {
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--spacing-xs);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        .hero-image-subtitle {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
        }

        /* ===== GLOW EFFECT ON HOVER ===== */
        .hero-image-hover-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(111, 240, 226, 0.12) 0%,
            rgba(76, 201, 240, 0.12) 50%,
            rgba(111, 240, 226, 0.12) 100%
          );
          border-radius: var(--radius-2xl);
          z-index: 1;
          pointer-events: none;
        }

        /* ===== CARTES FLOTTANTES RÉORGANISÉES ===== */
        .hero-floating-card {
          position: absolute;
          background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
          padding: var(--spacing-lg);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-xl);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          min-width: 200px;
        }

        .hero-floating-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: var(--shadow-xl), var(--glow-primary);
        }

        /* Positions Spécifiques */
        .hero-card-top-right {
          top: 8%;
          right: -8%;
          animation: float 4s ease-in-out infinite;
          border-color: rgba(111, 240, 226, 0.3);
        }

        .hero-card-top-left {
          top: 30%;
          left: -8%;
          animation: float 4s ease-in-out infinite;
          animation-delay: 1s;
          border-color: rgba(168, 85, 247, 0.3);
        }

        .hero-card-bottom-right {
          bottom: 30%;
          right: -8%;
          animation: float 4s ease-in-out infinite;
          animation-delay: 2s;
          border-color: rgba(59, 130, 246, 0.3);
        }

        .hero-card-bottom-left {
          bottom: 8%;
          left: -8%;
          animation: float 4s ease-in-out infinite;
          animation-delay: 3s;
          border-color: rgba(236, 72, 153, 0.3);
        }

        /* Icônes des Cartes */
        .hero-card-icon-wrapper {
          flex-shrink: 0;
        }

        .hero-card-icon-bg {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .hero-floating-card:hover .hero-card-icon-bg {
          transform: rotate(5deg) scale(1.1);
        }

        .hero-icon-cyan {
          background: rgba(111, 240, 226, 0.15);
          color: var(--primary);
          box-shadow: 0 0 20px rgba(111, 240, 226, 0.3);
        }

        .hero-icon-purple {
          background: rgba(168, 85, 247, 0.15);
          color: #a855f7;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
        }

        .hero-icon-blue {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .hero-icon-pink {
          background: rgba(236, 72, 153, 0.15);
          color: #ec4899;
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
        }

        .hero-card-text {
          flex: 1;
        }

        .hero-card-title-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }

        .hero-card-subtitle-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .hero-floating-card {
            min-width: 180px;
            padding: var(--spacing-md);
          }

          .hero-card-icon-bg {
            width: 48px;
            height: 48px;
          }

          .hero-card-top-right,
          .hero-card-bottom-right {
            right: -5%;
          }

          .hero-card-top-left,
          .hero-card-bottom-left {
            left: -5%;
          }
        }

        @media (max-width: 768px) {
          .hero-floating-card {
            display: none;
          }

          .hero-image-glow {
            inset: -2px;
          }

          .hero-image-wrapper {
            margin: 0 auto;
            max-width: 500px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;