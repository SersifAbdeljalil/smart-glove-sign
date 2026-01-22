
import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ||'http://192.168.71.109:5000' ;


console.log('API URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, 
});

apiClient.interceptors.request.use(
  (config) => {
    const url = `${config.baseURL}${config.url}`;
    console.log(`Requête: ${config.method.toUpperCase()} ${url}`);
    return config;
  },
  (error) => {
    console.error('Erreur avant envoi:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(' Réponse reçue:', response.status, response.data);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ ERREUR RÉSEAU (ERR_NETWORK)');
      console.error('URL tentée:', error.config?.baseURL + error.config?.url);
      console.error('');
      console.error(' Vérifiez:');
      console.error('   1. Flask est démarré ? → python app.py');
      console.error('   2. URL correcte ? → ' + API_BASE_URL);
      console.error('   3. flask-cors installé ? → pip install flask-cors');
      console.error('   4. CORS(app) ajouté dans Flask ?');
      console.error('   5. .env correct et React redémarré ?');
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏱ TIMEOUT - Le serveur ne répond pas');
    } else if (error.response) {
      console.error(' Erreur HTTP:', error.response.status, error.response.data);
    } else {
      console.error(' Erreur inconnue:', error.message);
    }
    
    return Promise.reject(error);
  }
);

const createErrorResponse = (error, context) => {
  const response = {
    success: false,
    context,
    error: 'Erreur inconnue',
    details: {},
  };

  if (error.code === 'ERR_NETWORK') {
    response.error = 'Impossible de contacter le serveur Flask';
    response.details = {
      code: error.code,
      url: API_BASE_URL,
      solutions: [
        'Vérifiez que Flask est démarré (python app.py)',
        'Vérifiez l\'URL dans .env: ' + API_BASE_URL,
        'Installez flask-cors: pip install flask-cors',
        'Ajoutez CORS(app) dans votre app.py Flask',
        'Redémarrez React après modification du .env',
      ],
    };
  } else if (error.code === 'ECONNABORTED') {
    response.error = 'Timeout - Le serveur met trop de temps à répondre';
  } else if (error.response) {
    response.error = error.response.data?.error || `Erreur HTTP ${error.response.status}`;
    response.details = {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    };
  } else {
    response.error = error.message;
  }

  return response;
};


const apiService = {
  
  testConnection: async () => {
    try {
      console.log('🔍 Test de connexion vers:', API_BASE_URL);
      const response = await apiClient.get('/');
      
      return {
        success: true,
        message: 'Connexion réussie ✅',
        data: response.data,
        url: API_BASE_URL,
      };
    } catch (error) {
      return createErrorResponse(error, 'Test de connexion');
    }
  },
  getStats: async () => {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return createErrorResponse(error, 'Récupération des statistiques');
    }
  },

  predict: async (features) => {
    try {
      const validation = validateFeatures(features);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      const response = await apiClient.post('/predict', features);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return createErrorResponse(error, 'Prédiction');
    }
  },

  getLatestPrediction: async () => {
    try {
      const response = await apiClient.get('/latest-prediction');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: true,
          data: null,
          message: 'Aucune prédiction disponible',
        };
      }
      return createErrorResponse(error, 'Dernière prédiction');
    }
  },

};
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
  const missingFields = requiredFields.filter(field => !(field in features));
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Champs manquants: ${missingFields.join(', ')}`,
    };
  }
  for (const field of requiredFields) {
    if (typeof features[field] !== 'number' || isNaN(features[field])) {
      return {
        valid: false,
        error: `Le champ "${field}" doit être un nombre valide`,
      };
    }
  }

  return { valid: true };
};

export const createEmptyFeatures = () => ({
  flex_thumb: 0,
  flex_index: 0,
  flex_middle: 0,
  gyro_x: 0,
  gyro_y: 0,
  gyro_z: 0,
  accel_x: 0,
  accel_y: 0,
  accel_z: 0,
});

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

export default apiService;