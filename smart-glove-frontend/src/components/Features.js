/* ============================================
   FICHIER: src/components/Features.js
   Composant section Fonctionnalités
   ============================================ */

import React from 'react';

const Features = () => {
  // Liste des fonctionnalités
  const features = [
    {
      id: 1,
      icon: '🤖',
      title: 'Intelligence Artificielle',
      description: 'Utilisation de réseaux de neurones profonds pour une reconnaissance précise et rapide des gestes en temps réel.'
    },
    {
      id: 2,
      icon: '⚡',
      title: 'Temps Réel',
      description: 'Traitement instantané des données avec une latence inférieure à 50ms pour une expérience fluide et réactive.'
    },
    {
      id: 3,
      icon: '🎯',
      title: 'Haute Précision',
      description: 'Taux de reconnaissance supérieur à 95% grâce à notre modèle entraîné sur des milliers de gestes.'
    },
    {
      id: 4,
      icon: '🔄',
      title: 'Apprentissage Continu',
      description: 'Le système s\'améliore constamment en apprenant de nouvelles variations de gestes au fil du temps.'
    },
    {
      id: 5,
      icon: '📊',
      title: 'Analyse Détaillée',
      description: 'Visualisation complète des prédictions avec scores de confiance et historique des détections.'
    },
    {
      id: 6,
      icon: '🌐',
      title: 'Interface Intuitive',
      description: 'Dashboard moderne et facile à utiliser pour tester et visualiser les résultats instantanément.'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        {/* En-tête de la section */}
        <div className="features-header">
          <span className="features-badge">Nos Fonctionnalités</span>
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
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              {/* Icône */}
              <div className="feature-icon">
                <span>{feature.icon}</span>
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
          ))}
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--spacing-2xl)',
          paddingTop: 'var(--spacing-2xl)'
        }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Prêt à Tester ?
          </h3>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-xl)',
            maxWidth: '600px',
            margin: '0 auto var(--spacing-xl)'
          }}>
            Essayez notre système dès maintenant et découvrez la puissance 
            de la reconnaissance de gestes par intelligence artificielle.
          </p>
          <a 
            href="/dashboard" 
            className="btn btn-primary btn-large"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            <span>🚀</span>
            <span>Accéder au Dashboard</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;