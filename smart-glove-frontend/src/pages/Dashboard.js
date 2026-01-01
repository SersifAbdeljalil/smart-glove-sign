import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiService from '../services/api';
import ttsService from '../services/ttsService';
import '../styles/dashboard.css';

const Dashboard = () => {
  // ========== ÉTATS ==========
  
  // Prédiction actuelle
  const [prediction, setPrediction] = useState(null);
  
  // Historique des prédictions
  const [history, setHistory] = useState([]);
  
  // Statistiques globales
  const [stats, setStats] = useState(null);
  
  // États de chargement et erreurs
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  
  // États TTS
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [messageMode, setMessageMode] = useState('short'); // 'short' ou 'detailed'
  const [voiceGender, setVoiceGender] = useState('all'); // 'male', 'female', 'all'
  const [showSettings, setShowSettings] = useState(false); // Afficher/masquer les paramètres
  
  // Référence pour stocker la dernière prédiction reçue
  const lastPredictionRef = useRef(null);

  // ========== MAPPING DES LABELS VERS LES IMAGES ==========
  const getGestureImage = (label) => {
    const gestureMap = {
      'A': 'A.png',
      'B': 'B.png',
      'C': 'C.png',
      'D': 'D.png',
      'E': 'E.png',
      'L': 'L.png',
      'merci': 'merci.png',
      'ok': 'ok.png',
      'stop': 'stop.png',
    };
    
    const fileName = gestureMap[label] || 'ok.png';
    return `/gestures/${fileName}`;
  };

  // ========== EFFETS ==========
  
  useEffect(() => {
    checkApiConnection();
    loadStatsFromApi();
    
    // Synchroniser les paramètres TTS
    ttsService.setEnabled(isTTSEnabled);
    ttsService.setMessageMode(messageMode);
    ttsService.setVoiceGender(voiceGender);
    
    // Polling toutes les 500ms
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

  /**
   * Vérifier la connexion à l'API
   */
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

  /**
   * Charger les statistiques depuis l'API
   */
  const loadStatsFromApi = async () => {
    const result = await apiService.getStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  /**
   * Récupérer la dernière prédiction depuis l'API
   */
  const fetchLatestPrediction = async () => {
    try {
      const result = await apiService.getLatestPrediction();
      
      if (result.success && result.data) {
        const newPrediction = result.data;
        const predictionSignature = newPrediction.timestamp || Date.now();
        
        if (lastPredictionRef.current !== predictionSignature) {
          console.log('🆕 Nouvelle prédiction:', newPrediction.predicted_label, newPrediction.confidence.toFixed(2) + '%');
          
          const predictionData = {
            label: newPrediction.predicted_label,
            confidence: newPrediction.confidence,
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            image: getGestureImage(newPrediction.predicted_label),
          };

          setPrediction(predictionData);
          
          // ANNONCER LE GESTE AVEC TTS
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

  /**
   * Toggle TTS ON/OFF
   */
  const toggleTTS = () => {
    const newState = !isTTSEnabled;
    setIsTTSEnabled(newState);
    ttsService.setEnabled(newState);
  };

  /**
   * Changer le mode de message (court/détaillé)
   */
  const handleMessageModeChange = (mode) => {
    setMessageMode(mode);
    ttsService.setMessageMode(mode);
  };

  /**
   * Changer le genre de voix
   */
  const handleVoiceGenderChange = (gender) => {
    setVoiceGender(gender);
    ttsService.setVoiceGender(gender);
  };

  /**
   * Tester le TTS
   */
  const testTTS = () => {
    ttsService.test();
  };

  // ========== RENDER ==========

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        
        {/* En-tête du Dashboard */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            🎯 Reconnaissance de Gestes
          </h1>
          <p className="dashboard-subtitle">
            Affichage en temps réel des gestes détectés
          </p>

          {/* Contrôles principaux */}
          <div className="controls-wrapper">
            {/* Statut API et contrôles TTS */}
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
                {isTTSEnabled ? '🔊 Audio ON' : '🔇 Audio OFF'}
              </button>

              {/* Bouton Paramètres */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="tts-settings-btn"
                title="Paramètres audio"
              >
                ⚙️ Paramètres
              </button>

              {/* Bouton Test */}
              <button 
                onClick={testTTS}
                className="tts-test-btn"
                title="Tester la synthèse vocale"
              >
                🎤 Test
              </button>
            </div>

            {/* Panneau de paramètres */}
            {showSettings && (
              <div className="tts-settings-panel">
                <h3 className="settings-title">⚙️ Paramètres Audio</h3>
                
                {/* Mode de message */}
                <div className="setting-group">
                  <label className="setting-label">📝 Type d'annonce :</label>
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
                  <label className="setting-label">👤 Genre de voix :</label>
                  <div className="setting-options">
                    <button
                      className={`setting-btn ${voiceGender === 'female' ? 'active' : ''}`}
                      onClick={() => handleVoiceGenderChange('female')}
                    >
                      👩 Féminine
                    </button>
                    <button
                      className={`setting-btn ${voiceGender === 'male' ? 'active' : ''}`}
                      onClick={() => handleVoiceGenderChange('male')}
                    >
                      👨 Masculine
                    </button>
                    <button
                      className={`setting-btn ${voiceGender === 'all' ? 'active' : ''}`}
                      onClick={() => handleVoiceGenderChange('all')}
                    >
                      👥 Les deux
                    </button>
                  </div>
                </div>

                {/* Aperçu de la configuration */}
                <div className="settings-preview">
                  <p>
                    <strong>Configuration actuelle :</strong><br/>
                    Mode : <span className="preview-value">{messageMode === 'short' ? 'Court' : 'Détaillé'}</span><br/>
                    Voix : <span className="preview-value">
                      {voiceGender === 'male' ? 'Masculine' : voiceGender === 'female' ? 'Féminine' : 'Toutes'}
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
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{stats.total_predictions || 0}</div>
                <div className="stat-label">Prédictions Totales</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">{stats.last_prediction || '---'}</div>
                <div className="stat-label">Dernier Geste</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✨</div>
              <div className="stat-content">
                <div className="stat-value">
                  {stats.confidence ? `${stats.confidence.toFixed(2)}%` : '---'}
                </div>
                <div className="stat-label">Confiance Moyenne</div>
              </div>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="dashboard-error">
            <span className="dashboard-error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Contenu Principal - Prédiction Actuelle */}
        <div className="dashboard-content">
          {prediction ? (
            <div className="current-prediction" key={prediction.timestamp}>
              <h2 className="current-prediction-title">Geste Détecté</h2>
              
              {/* IMAGE RÉELLE DU GESTE */}
              <div className="current-prediction-image">
                <img 
                  src={prediction.image} 
                  alt={prediction.label}
                  onError={(e) => {
                    console.error('Image non trouvée:', prediction.image);
                    e.target.src = '/gestures/ok.png';
                  }}
                />
              </div>
              
              {/* NOM DU GESTE */}
              <div className="current-prediction-label">
                {prediction.label}
              </div>
              
              {/* BARRE DE CONFIANCE */}
              <div className="current-prediction-confidence">
                <div className="confidence-bar-wrapper">
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ 
                        width: `${prediction.confidence}%`,
                        background: prediction.confidence >= 90 
                          ? 'linear-gradient(90deg, #10B981, #34D399)' 
                          : prediction.confidence >= 70 
                          ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' 
                          : 'linear-gradient(90deg, #EF4444, #F87171)'
                      }}
                    />
                  </div>
                </div>
                <div className="confidence-value">
                  {prediction.confidence.toFixed(1)}%
                </div>
              </div>
              
              {/* HEURE */}
              <div className="current-prediction-time">
                📅 {prediction.timestamp}
              </div>
            </div>
          ) : (
            <div className="empty-prediction">
              <div className="empty-prediction-icon">🤚</div>
              <div className="empty-prediction-text">
                En attente de détection...
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;