/* ============================================
   FICHIER: src/components/Footer.js
   Composant pied de page - React Native
   ============================================ */

import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Linking 
} from 'react-native';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const openURL = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.footer}>
      <View style={styles.footerContainer}>
        {/* Section Brand */}
        <View style={styles.footerBrand}>
          <Text style={styles.footerLogo}>✨ Smart Glove</Text>
          <Text style={styles.footerDescription}>
            Système intelligent de reconnaissance de gestes utilisant 
            l'apprentissage profond pour transformer vos mouvements 
            en commandes avec une précision exceptionnelle.
          </Text>
          
          {/* Tags */}
          <View style={styles.footerTags}>
            <View style={styles.tagPrimary}>
              <Text style={styles.tagPrimaryText}>IA</Text>
            </View>
            <View style={styles.tagSecondary}>
              <Text style={styles.tagSecondaryText}>Deep Learning</Text>
            </View>
            <View style={styles.tagOutline}>
              <Text style={styles.tagOutlineText}>Temps Réel</Text>
            </View>
          </View>
        </View>

        {/* Section Liens */}
        <View style={styles.footerSections}>
          {/* Liens Rapides */}
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Liens Rapides</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Accueil</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Fonctionnalités</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>À propos</Text>
            </TouchableOpacity>
          </View>

          {/* Ressources */}
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Ressources</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Documentation</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>API</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Tutoriels</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>FAQ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.footerContact}>
          <Text style={styles.footerSectionTitle}>Contact</Text>
          <TouchableOpacity onPress={() => openURL('mailto:contact@smartglove.com')}>
            <Text style={styles.footerLink}>contact@smartglove.com</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openURL('tel:+212600000000')}>
            <Text style={styles.footerLink}>+212 6 00 00 00 00</Text>
          </TouchableOpacity>
          <Text style={styles.footerLinkInactive}>Casablanca, Maroc</Text>
        </View>

        {/* Bottom */}
        <View style={styles.footerBottom}>
          <View style={styles.footerCopyright}>
            <Text style={styles.footerCopyrightText}>
              © {currentYear} Smart Glove. Tous droits réservés.
            </Text>
            <Text style={styles.footerCopyrightSubtext}>
              Fait avec passion par l'équipe Smart Glove
            </Text>
          </View>

          {/* Social Links */}
          <View style={styles.footerSocial}>
            <TouchableOpacity 
              style={styles.socialLink}
              onPress={() => openURL('https://github.com')}
            >
              <Text style={styles.socialLinkText}>GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#0F172A',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  footerContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Brand
  footerBrand: {
    marginBottom: 32,
  },
  footerLogo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  footerDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 16,
  },
  footerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPrimary: {
    backgroundColor: '#6FF0E2',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  tagPrimaryText: {
    color: '#06141B',
    fontSize: 12,
    fontWeight: '600',
  },
  tagSecondary: {
    backgroundColor: '#4CC9F0',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  tagSecondaryText: {
    color: '#06141B',
    fontSize: 12,
    fontWeight: '600',
  },
  tagOutline: {
    backgroundColor: 'transparent',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6FF0E2',
  },
  tagOutlineText: {
    color: '#6FF0E2',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Sections
  footerSections: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
  },
  footerSection: {
    flex: 1,
  },
  footerSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  footerLinkInactive: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  
  // Contact
  footerContact: {
    marginBottom: 32,
  },
  
  // Bottom
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerCopyright: {
    flex: 1,
  },
  footerCopyrightText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerCopyrightSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Social
  footerSocial: {
    flexDirection: 'row',
    gap: 16,
  },
  socialLink: {
    padding: 8,
  },
  socialLinkText: {
    color: '#6FF0E2',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Footer;