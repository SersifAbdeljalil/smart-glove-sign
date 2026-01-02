/* ============================================
   FICHIER: src/components/Features.js
   Composant section Fonctionnalités
   ============================================ */

import React from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  RefreshCw, 
  BarChart3, 
  Globe, 
  ArrowRight 
} from 'lucide-react';

const Features = () => {
  // Liste des fonctionnalités
  const features = [
    {
      id: 1,
      Icon: Brain,
      title: 'Intelligence Artificielle',
      description: 'Utilisation de réseaux de neurones profonds pour une reconnaissance précise et rapide des gestes en temps réel.'
    },
    {
      id: 2,
      Icon: Zap,
      title: 'Temps Réel',
      description: 'Traitement instantané des données avec une latence inférieure à 50ms pour une expérience fluide et réactive.'
    },
    {
      id: 3,
      Icon: Target,
      title: 'Haute Précision',
      description: 'Taux de reconnaissance supérieur à 95% grâce à notre modèle entraîné sur des milliers de gestes.'
    },
    {
      id: 4,
      Icon: RefreshCw,
      title: 'Apprentissage Continu',
      description: 'Le système s\'améliore constamment en apprenant de nouvelles variations de gestes au fil du temps.'
    },
    {
      id: 5,
      Icon: BarChart3,
      title: 'Analyse Détaillée',
      description: 'Visualisation complète des prédictions avec scores de confiance et historique des détections.'
    },
    {
      id: 6,
      Icon: Globe,
      title: 'Interface Intuitive',
      description: 'Dashboard moderne et facile à utiliser pour tester et visualiser les résultats instantanément.'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        {/* En-tête de la section */}
        <div className="features-header">
          <span className="features-badge">
            Nos Fonctionnalités
          </span>

          <h2 className="features-title">
            Pourquoi Choisir Smart Glove ?
          </h2>

          <p className="features-description">
            Découvrez les technologies avancées qui font de Smart Glove 
            la solution la plus performante pour la reconnaissance de gestes.
          </p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = feature.Icon;
            return (
              <div key={feature.id} className="feature-card">
                {/* Icône */}
                <div className="feature-icon">
                  <IconComponent size={32} />
                </div>

                {/* Titre */}
                <h3 className="feature-title">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div style={{
          marginTop: 'var(--spacing-3xl)',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          padding: 'var(--spacing-3xl)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Effet lumineux d'arrière-plan */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(111, 240, 226, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          <h3 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-md)',
            position: 'relative',
            zIndex: 1
          }}>
            Prêt à Tester ?
          </h3>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-2xl)',
            maxWidth: '600px',
            margin: '0 auto var(--spacing-2xl)',
            lineHeight: '1.7',
            position: 'relative',
            zIndex: 1
          }}>
            Essayez notre système dès maintenant et découvrez la puissance 
            de la reconnaissance de gestes par intelligence artificielle.
          </p>

          <a
            href="#dashboard"
            className="hero-button hero-button-primary"
            style={{
              display: 'inline-flex',
              position: 'relative',
              zIndex: 1
            }}
          >
            Accéder au Dashboard
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;