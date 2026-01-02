import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Sparkles, Rocket, BookOpen, Home as HomeIcon,
  Target, Volume2, VolumeX, Settings as SettingsIcon,
  Mic, Clock, AlertTriangle, Hand, Users 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import ttsService from '../services/ttsService';
import '../styles/dashboard.css';

// ============================================
// FONCTION AMÉLIORÉE POUR LES IMAGES
// ============================================
const getGestureImage = (label) => {
  if (!label) {
    console.warn('⚠️ Label vide, utilisation image par défaut');
    return '/gestures/ok.png';
  }
  
  // Normaliser le label (minuscules, sans espaces)
  const normalizedLabel = label.toString().toLowerCase().trim();
  
  console.log('🔍 Recherche image pour label:', label, '→ normalisé:', normalizedLabel);
  
  // Mapping exact des labels vers les fichiers
  const gestureMap = {
    'a': 'A.png',
    'b': 'B.png',
    'c': 'C.png',
    'd': 'D.png',
    'e': 'E.png',
    'l': 'L.png',
    'merci': 'merci.png',
    'ok': 'ok.png',
    'stop': 'stop.png',
  };
  
  // Chercher dans le mapping
  if (gestureMap[normalizedLabel]) {
    const imagePath = `/gestures/${gestureMap[normalizedLabel]}`;
    console.log('✅ Image trouvée dans mapping:', imagePath);
    return imagePath;
  }
  
  // Si pas trouvé, essayer directement avec le nom du label
  const directPath = `/gestures/${normalizedLabel}.png`;
  console.log('⚠️ Pas dans mapping, essai direct:', directPath);
  return directPath;
};

// ============================================
// NAVBAR
// ============================================
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
          <span className="navbar-logo-icon">
            <Sparkles size={28} />
          </span>
          <span>Smart Glove</span>
        </Link>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="navbar-link" onClick={handleLinkClick}>
              <HomeIcon size={18} />
              <span>Accueil</span>
            </Link>
          </li>
          <li>
            <a href="/#features" className="navbar-link" onClick={handleLinkClick}>
              <Sparkles size={18} />
              <span>Fonctionnalités</span>
            </a>
          </li>
          <li>
            <a href="/#about" className="navbar-link" onClick={handleLinkClick}>
              <BookOpen size={18} />
              <span>À propos</span>
            </a>
          </li>
          <li>
            <a href="/#team" className="navbar-link" onClick={handleLinkClick}>
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

        <button className="navbar-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

// ============================================
// DASHBOARD
// ============================================
const Dashboard = () => {
  // ========== ÉTATS ==========
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  
  // États TTS
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [messageMode, setMessageMode] = useState('short');
  const [voiceGender, setVoiceGender] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  
  const lastPredictionRef = useRef(null);

  // ========== EFFETS ==========
  useEffect(() => {
    checkApiConnection();
    loadStatsFromApi();
    
    ttsService.setEnabled(isTTSEnabled);
    ttsService.setMessageMode(messageMode);
    ttsService.setVoiceGender(voiceGender);
    
    const interval = setInterval(() => {
      if (apiStatus === 'connected') {
        fetchLatestPrediction();
      }
    }, 500);

    return () => {
      clearInterval(interval);
      ttsService.stop();
    };
  }, [apiStatus, isTTSEnabled, messageMode, voiceGender]);

  // ========== FONCTIONS ==========
  const checkApiConnection = async () => {
    const result = await apiService.testConnection();
    if (result.success) {
      setApiStatus('connected');
      console.log('✅ API connectée');
    } else {
      setApiStatus('disconnected');
      console.error('❌ API déconnectée:', result.error);
    }
  };

  const loadStatsFromApi = async () => {
    const result = await apiService.getStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  const fetchLatestPrediction = async () => {
    try {
      const result = await apiService.getLatestPrediction();
      
      if (result.success && result.data) {
        const newPrediction = result.data;
        const predictionSignature = newPrediction.timestamp || Date.now();
        
        if (lastPredictionRef.current !== predictionSignature) {
          console.log('🆕 Nouvelle prédiction:', newPrediction.predicted_label, 
                      newPrediction.confidence.toFixed(2) + '%');
          
          const predictionData = {
            label: newPrediction.predicted_label,
            confidence: newPrediction.confidence,
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            image: getGestureImage(newPrediction.predicted_label),
          };

          setPrediction(predictionData);
          
          if (isTTSEnabled) {
            ttsService.speakGesture(
              newPrediction.predicted_label,
              newPrediction.confidence
            );
          }
          
          lastPredictionRef.current = predictionSignature;
          setHistory(prev => [predictionData, ...prev].slice(0, 10));
          loadStatsFromApi();
        }
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('❌ Erreur:', err);
      }
    }
  };

  // ========== CONTRÔLES TTS ==========
  const toggleTTS = () => {
    const newState = !isTTSEnabled;
    setIsTTSEnabled(newState);
    ttsService.setEnabled(newState);
  };

  const handleMessageModeChange = (mode) => {
    setMessageMode(mode);
    ttsService.setMessageMode(mode);
  };

  const handleVoiceGenderChange = (gender) => {
    setVoiceGender(gender);
    ttsService.setVoiceGender(gender);
  };

  const testTTS = () => {
    ttsService.test();
  };

  // Fonction de debug
  const debugImages = () => {
    console.log('📁 Images disponibles dans /public/gestures/:');
    const labels = ['A', 'B', 'C', 'D', 'E', 'L', 'merci', 'ok', 'stop'];
    labels.forEach(label => {
      const imagePath = getGestureImage(label);
      console.log(`  ${label} → ${imagePath}`);
    });
  };

  // ========== RENDER ==========
  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        
        {/* En-tête du Dashboard */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <Target size={40} style={{ 
              display: 'inline-block', 
              verticalAlign: 'middle', 
              marginRight: '0.5rem' 
            }} />
            Reconnaissance de Gestes
          </h1>
          <p className="dashboard-subtitle">
            Affichage en temps réel des gestes détectés
          </p>

          {/* Contrôles principaux */}
          <div className="controls-wrapper">
            <div className="main-controls">
              {/* Statut API */}
              <div className={`api-status api-status-${apiStatus}`}>
                <span className="api-status-indicator"></span>
                <span className="api-status-text">
                  {apiStatus === 'checking' && 'Vérification...'}
                  {apiStatus === 'connected' && 'Connecté'}
                  {apiStatus === 'disconnected' && 'Déconnecté'}
                </span>
              </div>

              {/* Bouton Toggle TTS */}
              <button 
                onClick={toggleTTS}
                className={`tts-toggle-btn ${isTTSEnabled ? 'tts-enabled' : 'tts-disabled'}`}
                title={isTTSEnabled ? 'Désactiver les annonces vocales' : 'Activer les annonces vocales'}
              >
                {isTTSEnabled ? (
                  <>
                    <Volume2 size={18} />
                    <span>Audio ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={18} />
                    <span>Audio OFF</span>
                  </>
                )}
              </button>

              {/* Bouton Paramètres */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="tts-settings-btn"
                title="Paramètres audio"
              >
                <SettingsIcon size={18} />
                <span>Paramètres</span>
              </button>

              {/* Bouton Test */}
              <button 
                onClick={testTTS}
                className="tts-test-btn"
                title="Tester la synthèse vocale"
              >
                <Mic size={18} />
                <span>Test</span>
              </button>
            </div>

            {/* Panneau de paramètres */}
            {showSettings && (
              <div className="tts-settings-panel">
                <h3 className="settings-title">
                  <SettingsIcon size={24} style={{ 
                    display: 'inline-block', 
                    verticalAlign: 'middle', 
                    marginRight: '0.5rem' 
                  }} />
                  Paramètres Audio
                </h3>
                
                {/* Mode de message */}
                <div className="setting-group">
                  <label className="setting-label">Type d'annonce :</label>
                  <div className="setting-options">
                    <button
                      className={`setting-btn ${messageMode === 'short' ? 'active' : ''}`}
                      onClick={() => handleMessageModeChange('short')}
                    >
                      Court (ex: "A")
                    </button>
                    <button
                      className={`setting-btn ${messageMode === 'detailed' ? 'active' : ''}`}
                      onClick={() => handleMessageModeChange('detailed')}
                    >
                      Détaillé (ex: "Lettre A détectée")
                    </button>
                  </div>
                </div>

                {/* Genre de voix */}
                <div className="setting-group">
                  <label className="setting-label">Genre de voix :</label>
                  <div className="setting-options">
                    <button
                      className={`setting-btn ${voiceGender === 'female' ? 'active' : ''}`}
                      onClick={() => handleVoiceGenderChange('female')}
                    >
                      Féminine
                    </button>
                    <button
                      className={`setting-btn ${voiceGender === 'male' ? 'active' : ''}`}
                      onClick={() => handleVoiceGenderChange('male')}
                    >
                      Masculine
                    </button>
                    <button
                      className={`setting-btn ${voiceGender === 'all' ? 'active' : ''}`}
                      onClick={() => handleVoiceGenderChange('all')}
                    >
                      Les deux
                    </button>
                  </div>
                </div>

                {/* Aperçu */}
                <div className="settings-preview">
                  <p>
                    <strong>Configuration actuelle :</strong><br/>
                    Mode : <span className="preview-value">
                      {messageMode === 'short' ? 'Court' : 'Détaillé'}
                    </span><br/>
                    Voix : <span className="preview-value">
                      {voiceGender === 'male' ? 'Masculine' : 
                       voiceGender === 'female' ? 'Féminine' : 'Toutes'}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques Globales */}
        {stats && (
          <div className="dashboard-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Target size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.last_prediction || '---'}</div>
                <div className="stat-label">Dernier Geste</div>
              </div>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="dashboard-error">
            <AlertTriangle size={24} className="dashboard-error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Prédiction Actuelle */}
        <div className="dashboard-content">
          {prediction ? (
            <div className="current-prediction" key={prediction.timestamp}>
              <h2 className="current-prediction-title">Geste Détecté</h2>
              
              <div className="current-prediction-image">
                <img 
                  src={prediction.image} 
                  alt={prediction.label}
                  onLoad={() => {
                    console.log('✅ Image chargée:', prediction.image);
                  }}
                  onError={(e) => {
                    console.error('❌ Erreur chargement:', prediction.image);
                    console.log('🔄 Fallback vers ok.png');
                    e.target.src = '/gestures/ok.png';
                  }}
                />
              </div>
              
              <div className="current-prediction-label">
                {prediction.label}
              </div>
              
              <div className="current-prediction-time">
                <Clock size={18} style={{ 
                  display: 'inline-block', 
                  verticalAlign: 'middle', 
                  marginRight: '0.5rem' 
                }} />
                {prediction.timestamp}
              </div>
            </div>
          ) : (
            <div className="empty-prediction">
              <div className="empty-prediction-icon">
                <Hand size={96} />
              </div>
              <div className="empty-prediction-text">
                En attente de détection...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;