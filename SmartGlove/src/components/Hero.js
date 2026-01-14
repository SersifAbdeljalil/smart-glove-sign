/* ============================================
   FICHIER: src/components/Hero.js
   Composant section Hero - React Native
   ============================================ */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

const Hero = ({ onDashboardPress }) => {
  const [isImagePressed, setIsImagePressed] = useState(false);

  return (
    <View style={styles.heroSection}>
      <View style={styles.heroContainer}>
        {/* Contenu Texte */}
        <View style={styles.heroContent}>
          {/* Badge */}
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Technologie de pointe</Text>
          </View>

          {/* Titre Principal */}
          <Text style={styles.heroTitle}>
            Reconnaissance de{' '}
            <Text style={styles.heroTitleHighlight}>Gestes</Text>{' '}
            en Temps Réel
          </Text>

          {/* Description */}
          <Text style={styles.heroDescription}>
            Découvrez notre système intelligent de reconnaissance de gestes 
            utilisant l'apprentissage profond. Transformez vos mouvements en 
            commandes avec une précision exceptionnelle.
          </Text>

          {/* Boutons d'Action */}
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={styles.heroBtnPrimary}
              onPress={onDashboardPress}
              activeOpacity={0.8}
            >
              <Text style={styles.heroBtnPrimaryText}>Essayer Maintenant</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Partie Visuelle */}
        <View style={styles.heroVisual}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={() => setIsImagePressed(true)}
            onPressOut={() => setIsImagePressed(false)}
          >
            <View style={styles.heroImageContainer}>
              {/* Gradient Border Glow */}
              <View style={styles.heroImageGlow} />
              
              {/* Image */}
              <View style={styles.heroRealImage}>
                <Image 
                  source={require('../../assets/gestures/reel.png')}
                  style={[
                    styles.heroMainImage,
                    isImagePressed && styles.heroMainImagePressed
                  ]}
                  resizeMode="cover"
                />
                
                {/* Overlay avec info */}
                {isImagePressed && (
                  <View style={styles.heroImageOverlay}>
                    <View style={styles.heroImageInfo}>
                      <Text style={styles.heroImageTitle}>Smart Glove v1.0</Text>
                      <Text style={styles.heroImageSubtitle}>
                        Capteurs flex + ESP32 + Module ML
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Floating Card */}
            <View style={styles.heroFloatingCard}>
              <View style={styles.heroCardIcon}>
                <Text style={styles.heroCardIconText}>⚡</Text>
              </View>
              <View style={styles.heroCardText}>
                <Text style={styles.heroCardTitle}>ESP32 Powered</Text>
                <Text style={styles.heroCardSubtitle}>Dual-core MCU</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: '#06141B',
  },
  heroContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  heroContent: {
    marginBottom: 40,
  },
  heroBadge: {
    backgroundColor: 'rgba(111, 240, 226, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(111, 240, 226, 0.3)',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  heroBadgeText: {
    color: '#6FF0E2',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 44,
  },
  heroTitleHighlight: {
    color: '#6FF0E2',
  },
  heroDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 24,
    marginBottom: 32,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  heroBtnPrimary: {
    backgroundColor: '#0070F3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#0070F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  heroBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  heroVisual: {
    position: 'relative',
  },
  heroImageContainer: {
    width: '100%',
    height: 400,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImageGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    backgroundColor: '#6FF0E2',
    opacity: 0.3,
    borderRadius: 24,
  },
  heroRealImage: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(6, 20, 27, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(111, 240, 226, 0.2)',
  },
  heroMainImage: {
    width: '100%',
    height: '100%',
  },
  heroMainImagePressed: {
    transform: [{ scale: 1.05 }],
  },
  heroImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'rgba(6, 20, 27, 0.9)',
  },
  heroImageInfo: {
    gap: 4,
  },
  heroImageTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  heroImageSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  heroFloatingCard: {
    position: 'absolute',
    bottom: -20,
    left: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  heroCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCardIconText: {
    fontSize: 24,
  },
  heroCardText: {
    gap: 2,
  },
  heroCardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroCardSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Hero;