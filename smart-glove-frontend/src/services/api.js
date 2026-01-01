/* ============================================
   FICHIER: src/services/api.js
   Service API pour communiquer avec Flask
   ============================================ */

import axios from 'axios';

// URL de base de l'API depuis .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Instance Axios configurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== SERVICE API ==========

const apiService = {
  
  /**
   * Prédire un geste à partir des features
   * @param {Object} features - Les 9 features des capteurs
   * @returns {Promise} - Réponse de l'API avec la prédiction
   */
  predict: async (features) => {
    try {
      const response = await apiClient.post('/predict', features);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ Erreur lors de la prédiction:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur de connexion au serveur',
      };
    }
  },

  /**
   * Récupérer la dernière prédiction en temps réel
   * @returns {Promise} - Dernière prédiction disponible
   */
  getLatestPrediction: async () => {
    try {
      const response = await apiClient.get('/latest-prediction');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la dernière prédiction:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur de connexion au serveur',
      };
    }
  },

  /**
   * Récupérer les statistiques globales
   * @returns {Promise} - Statistiques du serveur
   */
  getStats: async () => {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des stats:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur de connexion au serveur',
      };
    }
  },

  /**
   * Tester la connexion à l'API
   * @returns {Promise} - État de la connexion
   */
  testConnection: async () => {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        message: 'Connexion API réussie',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Impossible de se connecter à l\'API Flask',
        error: error.message,
      };
    }
  },

};

// ========== FONCTIONS UTILITAIRES ==========

/**
 * Valider les features avant envoi
 * @param {Object} features - Les features à valider
 * @returns {Object} - Résultat de la validation
 */
export const validateFeatures = (features) => {
  const requiredFields = [
    'flex_thumb',
    'flex_index',
    'flex_middle',
    'gyro_x',
    'gyro_y',
    'gyro_z',
    'accel_x',
    'accel_y',
    'accel_z',
  ];

  // Vérifier que tous les champs sont présents
  const missingFields = requiredFields.filter(field => !(field in features));
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Champs manquants: ${missingFields.join(', ')}`,
    };
  }

  // Vérifier que toutes les valeurs sont des nombres
  for (const field of requiredFields) {
    if (typeof features[field] !== 'number' || isNaN(features[field])) {
      return {
        valid: false,
        error: `Le champ "${field}" doit être un nombre valide`,
      };
    }
  }

  return {
    valid: true,
  };
};

/**
 * Créer un objet features avec valeurs par défaut
 * @returns {Object} - Features initialisées à 0
 */
export const createEmptyFeatures = () => {
  return {
    flex_thumb: 0,
    flex_index: 0,
    flex_middle: 0,
    gyro_x: 0,
    gyro_y: 0,
    gyro_z: 0,
    accel_x: 0,
    accel_y: 0,
    accel_z: 0,
  };
};

/**
 * Formater les données de prédiction pour l'affichage
 * @param {Object} predictionData - Données brutes de l'API
 * @returns {Object} - Données formatées
 */
export const formatPredictionData = (predictionData) => {
  if (!predictionData) return null;

  return {
    label: predictionData.predicted_label,
    confidence: predictionData.confidence,
    probabilities: predictionData.probabilities,
    features: predictionData.features,
    timestamp: new Date().toLocaleTimeString('fr-FR'),
  };
};

// Export par défaut
export default apiService;