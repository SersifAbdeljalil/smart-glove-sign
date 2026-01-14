/* ============================================
   FICHIER: src/pages/Dashboard.js
   Page Dashboard - React Native
   ============================================ */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import apiService from '../services/api';
import { getGestureImage, getGestureInfo } from '../utils/gestureMapping';

const Dashboard = () => {
  // ========== ÉTATS ==========
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [refreshing, setRefreshing] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const lastPredictionRef = useRef(null);
  const pollingInterval = useRef(null);

  // ========== EFFETS ==========
  useEffect(() => {
    checkApiConnection();
    loadStatsFromApi();
    
    // Polling pour les prédictions
    if (apiStatus === 'connected') {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [apiStatus]);

  // ========== FONCTIONS ==========
  const startPolling = () => {
    stopPolling();
    pollingInterval.current = setInterval(() => {
      fetchLatestPrediction();
    }, 1000); // Poll chaque seconde
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const checkApiConnection = async () => {
    const result = await apiService.testConnection();
    if (result.success) {
      setApiStatus('connected');
      console.log('✅ API connectée');
    } else {
      setApiStatus('disconnected');
      setError('API déconnectée. Vérifiez la connexion.');
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
          console.log('🆕 Nouvelle prédiction:', newPrediction.predicted_label);
          
          const gestureInfo = getGestureInfo(newPrediction.predicted_label);
          const predictionData = {
            label: newPrediction.predicted_label,
            confidence: newPrediction.confidence,
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            image: gestureInfo?.image || getGestureImage(newPrediction.predicted_label),
            emoji: gestureInfo?.emoji || '🤚',
          };

          setPrediction(predictionData);
          lastPredictionRef.current = predictionSignature;
          setHistory(prev => [predictionData, ...prev].slice(0, 10));
          loadStatsFromApi();
          setError(null);
        }
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('❌ Erreur:', err);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkApiConnection();
    await loadStatsFromApi();
    await fetchLatestPrediction();
    setRefreshing(false);
  };

  const toggleTTS = () => {
    const newState = !isTTSEnabled;
    setIsTTSEnabled(newState);
    Alert.alert(
      'Audio',
      newState ? 'Audio activé' : 'Audio désactivé'
    );
  };

  // ========== RENDER ==========
  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>🎯</Text>
          <View style={styles.headerText}>
            <Text style={styles.title}>Reconnaissance de Gestes</Text>
            <Text style={styles.subtitle}>Affichage en temps réel</Text>
          </View>
        </View>

        {/* API Status */}
        <View style={[
          styles.apiStatus,
          apiStatus === 'connected' ? styles.apiStatusConnected : styles.apiStatusDisconnected
        ]}>
          <View style={styles.apiStatusIndicator} />
          <Text style={styles.apiStatusText}>
            {apiStatus === 'checking' && 'Vérification...'}
            {apiStatus === 'connected' && 'Connecté'}
            {apiStatus === 'disconnected' && 'Déconnecté'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlBtn, isTTSEnabled ? styles.controlBtnEnabled : styles.controlBtnDisabled]}
          onPress={toggleTTS}
        >
          <Text style={styles.controlBtnIcon}>{isTTSEnabled ? '🔊' : '🔇'}</Text>
          <Text style={styles.controlBtnText}>
            {isTTSEnabled ? 'Audio ON' : 'Audio OFF'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlBtn}
          onPress={() => setShowSettings(!showSettings)}
        >
          <Text style={styles.controlBtnIcon}>⚙️</Text>
          <Text style={styles.controlBtnText}>Paramètres</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlBtn}
          onPress={onRefresh}
        >
          <Text style={styles.controlBtnIcon}>🔄</Text>
          <Text style={styles.controlBtnText}>Actualiser</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {stats && (
        <View style={styles.statsCard}>
          <Text style={styles.statsIcon}>🎯</Text>
          <View style={styles.statsContent}>
            <Text style={styles.statsValue}>{stats.last_prediction || '---'}</Text>
            <Text style={styles.statsLabel}>Dernier Geste</Text>
          </View>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Current Prediction */}
      <View style={styles.predictionSection}>
        {prediction ? (
          <View style={styles.currentPrediction}>
            <Text style={styles.predictionTitle}>Geste Détecté</Text>
            
            <View style={styles.predictionImageContainer}>
              {prediction.image ? (
                <Image 
                  source={prediction.image}
                  style={styles.predictionImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.predictionImageFallback}>
                  <Text style={styles.predictionEmoji}>{prediction.emoji}</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.predictionLabel}>{prediction.label}</Text>
            
            <View style={styles.predictionTime}>
              <Text style={styles.predictionTimeIcon}>🕐</Text>
              <Text style={styles.predictionTimeText}>{prediction.timestamp}</Text>
            </View>

            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Confiance</Text>
              <Text style={styles.confidenceValue}>
                {prediction.confidence?.toFixed(2) || '---'}%
              </Text>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceBarFill,
                    { width: `${prediction.confidence || 0}%` }
                  ]}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyPrediction}>
            <Text style={styles.emptyPredictionIcon}>🤚</Text>
            <Text style={styles.emptyPredictionText}>
              En attente de détection...
            </Text>
            {apiStatus === 'checking' && (
              <ActivityIndicator size="large" color="#0070F3" style={{ marginTop: 20 }} />
            )}
          </View>
        )}
      </View>

      {/* History */}
      {history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Historique</Text>
          {history.slice(0, 5).map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyEmoji}>{item.emoji}</Text>
              <View style={styles.historyContent}>
                <Text style={styles.historyLabel}>{item.label}</Text>
                <Text style={styles.historyTime}>{item.timestamp}</Text>
              </View>
              <Text style={styles.historyConfidence}>
                {item.confidence?.toFixed(0)}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06141B',
  },
  
  // Header
  header: {
    padding: 24,
    backgroundColor: '#0F172A',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  
  // API Status
  apiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  apiStatusConnected: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  apiStatusDisconnected: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  apiStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  apiStatusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Controls
  controls: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  controlBtnEnabled: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  controlBtnDisabled: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },
  controlBtnIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  controlBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statsIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6FF0E2',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  
  // Error
  errorCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  errorText: {
    flex: 1,
    color: '#EF4444',
    fontSize: 14,
  },
  
  // Prediction
  predictionSection: {
    padding: 16,
  },
  currentPrediction: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6FF0E2',
  },
  predictionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  predictionImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(111, 240, 226, 0.1)',
  },
  predictionImage: {
    width: '100%',
    height: '100%',
  },
  predictionImageFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionEmoji: {
    fontSize: 80,
  },
  predictionLabel: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6FF0E2',
    marginBottom: 12,
  },
  predictionTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  predictionTimeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  predictionTimeText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  
  // Confidence
  confidenceContainer: {
    width: '100%',
    marginTop: 16,
  },
  confidenceLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  confidenceValue: {
    color: '#6FF0E2',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: '#6FF0E2',
  },
  
  // Empty
  emptyPrediction: {
    backgroundColor: '#1F2937',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyPredictionIcon: {
    fontSize: 96,
    marginBottom: 16,
  },
  emptyPredictionText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
  },
  
  // History
  historySection: {
    padding: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  historyEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  historyContent: {
    flex: 1,
  },
  historyLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyTime: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  historyConfidence: {
    color: '#6FF0E2',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Dashboard;