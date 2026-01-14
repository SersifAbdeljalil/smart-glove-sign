/* ============================================
   FICHIER: src/components/Features.js
   Composant section Fonctionnalités - React Native
   ============================================ */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: '🧠',
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
    <View style={styles.featuresSection}>
      <View style={styles.featuresContainer}>
        {/* En-tête de la section */}
        <View style={styles.featuresHeader}>
          <View style={styles.featuresBadge}>
            <Text style={styles.featuresBadgeText}>Nos Fonctionnalités</Text>
          </View>

          <Text style={styles.featuresTitle}>
            Pourquoi Choisir Smart Glove ?
          </Text>

          <Text style={styles.featuresDescription}>
            Découvrez les technologies avancées qui font de Smart Glove 
            la solution la plus performante pour la reconnaissance de gestes.
          </Text>
        </View>

        {/* Grille des fonctionnalités */}
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              {/* Icône */}
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>{feature.icon}</Text>
              </View>

              {/* Titre */}
              <Text style={styles.featureTitle}>{feature.title}</Text>

              {/* Description */}
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaContainer}>
          <View style={styles.ctaGlow} />
          
          <Text style={styles.ctaTitle}>Prêt à Tester ?</Text>

          <Text style={styles.ctaDescription}>
            Essayez notre système dès maintenant et découvrez la puissance 
            de la reconnaissance de gestes par intelligence artificielle.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featuresSection: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
  },
  featuresContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Header
  featuresHeader: {
    alignItems: 'center',
    marginBottom: 48,
  },
  featuresBadge: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  featuresBadgeText: {
    color: '#0070F3',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600,
  },
  
  // Grid
  featuresGrid: {
    gap: 24,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconText: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  // CTA
  ctaContainer: {
    marginTop: 48,
    backgroundColor: '#F3F4F6',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(111, 240, 226, 0.1)',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    zIndex: 1,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 500,
    zIndex: 1,
  },
});

export default Features;