/* ============================================
   FICHIER: src/pages/Home.js
   Page d'accueil principale - React Native
   ============================================ */

import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Linking,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Scroll vers le haut au chargement de la page
    // En React Native, pas besoin car chaque screen commence en haut
  }, []);

  const openLinkedIn = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const navigateToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <Hero onDashboardPress={navigateToDashboard} />

      {/* Team Section */}
      <View style={styles.teamSection} id="team">
        <View style={styles.teamContainer}>
          {/* Header */}
          <View style={styles.teamHeader}>
            <View style={styles.teamBadge}>
              <Text style={styles.teamBadgeText}>👥 Notre Équipe</Text>
            </View>
            <Text style={styles.teamTitle}>Les Créateurs du Projet</Text>
            <Text style={styles.teamDescription}>
              Une équipe polyvalente de développeurs Full Stack spécialisés en IA et IoT
            </Text>
          </View>

          {/* Team Grid */}
          <View style={styles.teamGrid}>
            {/* Membre 1 - Abdeljalil */}
            <View style={styles.teamCard}>
              <View style={styles.teamImageWrapper}>
                <Image 
                  source={require('../../assets/gestures/SERSIF Abdeljalil.jpg')} 
                  style={styles.teamImage}
                />
                <TouchableOpacity 
                  style={styles.teamOverlay}
                  onPress={() => openLinkedIn('https://www.linkedin.com/in/abdeljalil-sersif')}
                >
                  <View style={styles.linkedinBtn}>
                    <Text style={styles.linkedinBtnText}>🔗 Voir le profil</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>SERSIF Abdeljalil</Text>
                <Text style={styles.teamRole}>Full Stack Developer</Text>
                <View style={styles.teamSkills}>
                  <View style={styles.teamSkill}>
                    <Text style={styles.teamSkillText}>IA</Text>
                  </View>
                  <View style={styles.teamSkill}>
                    <Text style={styles.teamSkillText}>IoT</Text>
                  </View>
                  <View style={styles.teamSkill}>
                    <Text style={styles.teamSkillText}>Web</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Membre 2 - Nouhaila */}
            <View style={styles.teamCard}>
              <View style={styles.teamImageWrapper}>
                <Image 
                  source={require('../../assets/gestures/nouha.png')} 
                  style={styles.teamImage}
                />
                <TouchableOpacity 
                  style={styles.teamOverlay}
                  onPress={() => openLinkedIn('https://www.linkedin.com/in/nouhaila-chahmi-485542351')}
                >
                  <View style={styles.linkedinBtn}>
                    <Text style={styles.linkedinBtnText}>🔗 Voir le profil</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>CHAHMI Nouhaila</Text>
                <Text style={styles.teamRole}>Full Stack Developer</Text>
                <View style={styles.teamSkills}>
                  <View style={styles.teamSkill}>
                    <Text style={styles.teamSkillText}>IA</Text>
                  </View>
                  <View style={styles.teamSkill}>
                    <Text style={styles.teamSkillText}>IoT</Text>
                  </View>
                  <View style={styles.teamSkill}>
                    <Text style={styles.teamSkillText}>Web</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Membre 3 - Kawtar */}
            <View style={styles.teamCard}>
              <View style={styles.teamImageWrapper}>
                <View style={[styles.teamImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>KG</Text>
                </View>
                <TouchableOpacity 
                  style={styles.teamOverlay}
                  onPress={() => openLinkedIn('https://www.linkedin.com/in/kawtar-gantouh-67a002352')}
                >
                  <View style={styles.linkedinBtn}>
                    <Text style={styles.linkedinBtnText}>🔗 Voir le profil</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>GANTOUH Kawtar</Text>
                <Text style={styles.teamRole}>Full Stack Developer</Text>
                <View style={styles.teamSkills}>
                  <View style={styles.teamSkill}>
                    <Text style={styles.teamSkillText}>IA</Text>
                  </View>
                  <View style={styles.teamSkill}>
                    <Text style={styles.teamSkillText}>IoT</Text>
                  </View>
                  <View style={styles.teamSkill}>
                    <Text style={styles.teamSkillText}>Web</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <Features />

      {/* About Section */}
      <View style={styles.aboutSection}>
        <View style={styles.aboutContainer}>
          <View style={styles.aboutHeader}>
            <View style={styles.aboutBadge}>
              <Text style={styles.aboutBadgeText}>À Propos</Text>
            </View>
            <Text style={styles.aboutTitle}>Notre Mission</Text>
            <Text style={styles.aboutDescription}>
              Smart Glove est né de la volonté de rendre la technologie 
              de reconnaissance de gestes accessible à tous. Notre équipe 
              de chercheurs et développeurs passionnés travaille sans 
              relâche pour créer des solutions innovantes basées sur 
              l'intelligence artificielle.
            </Text>
            <Text style={[styles.aboutDescription, { marginTop: 16 }]}>
              Grâce à notre système de Machine Learning, nous avons développé 
              un prototype capable de reconnaître trois gestes distincts avec une bonne précision, 
              démontrant la faisabilité de la reconnaissance 
              gestuelle pour des applications en accessibilité, 
              interaction homme-machine et robotique.
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>🎓</Text>
              </View>
              <Text style={styles.statTitle}>Machine Learning</Text>
              <Text style={styles.statDescription}>
                Algorithme de Random Forest pour une reconnaissance précise et rapide des gestes.
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>⚙️</Text>
              </View>
              <Text style={styles.statTitle}>Flask + React</Text>
              <Text style={styles.statDescription}>
                Architecture moderne combinant puissance backend et interface réactive
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>⚡</Text>
              </View>
              <Text style={styles.statTitle}>Open Source</Text>
              <Text style={styles.statDescription}>
                Communauté active contribuant à l'amélioration continue du projet
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Team Section
  teamSection: {
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  teamContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
  },
  teamHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  teamBadge: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  teamBadgeText: {
    color: '#0070F3',
    fontWeight: '600',
    fontSize: 14,
  },
  teamTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  teamDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Team Grid
  teamGrid: {
    gap: 24,
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  teamImageWrapper: {
    position: 'relative',
    height: 300,
  },
  teamImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#9B7EBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  teamOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    alignItems: 'center',
  },
  linkedinBtn: {
    backgroundColor: '#0070F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  linkedinBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  teamInfo: {
    padding: 20,
  },
  teamName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  teamSkills: {
    flexDirection: 'row',
    gap: 8,
  },
  teamSkill: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  teamSkillText: {
    color: '#0070F3',
    fontSize: 12,
    fontWeight: '600',
  },

  // About Section
  aboutSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  aboutContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  aboutBadge: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  aboutBadgeText: {
    color: '#0070F3',
    fontWeight: '600',
    fontSize: 14,
  },
  aboutTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  aboutDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },

  // Stats Grid
  statsGrid: {
    gap: 24,
  },
  statCard: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6FF0E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconText: {
    fontSize: 32,
  },
  statTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  statDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Home;