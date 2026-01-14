/* ============================================
   FICHIER: src/utils/gestureMapping.js
   Mapping des gestes avec images et métadonnées
   Version React Native
   ============================================ */

// ========== MAPPING DES GESTES ==========

export const gestureMapping = {
  'A': {
    label: 'A',
    displayName: 'Lettre A',
    image: require('../../assets/gestures/A.png'),
    emoji: '🅰️',
    description: 'Poing fermé avec pouce sur le côté',
    category: 'Lettre',
    color: '#6FF0E2', // Mint
  },
  'B': {
    label: 'B',
    displayName: 'Lettre B',
    image: require('../../assets/gestures/B.png'),
    emoji: '🅱️',
    description: 'Main ouverte, doigts joints et tendus',
    category: 'Lettre',
    color: '#6FF0E2',
  },
  'D': {
    label: 'D',
    displayName: 'Lettre D',
    image: require('../../assets/gestures/D.png'),
    emoji: '🇩',
    description: 'Index pointé vers le haut',
    category: 'Lettre',
    color: '#6FF0E2',
  },
  'F': {
    label: 'F',
    displayName: 'Lettre F',
    image: require('../../assets/gestures/F.png'),
    emoji: '🇫',
    description: 'Geste pour la lettre F',
    category: 'Lettre',
    color: '#6FF0E2',
  },
  'OK': {
    label: 'OK',
    displayName: 'OK',
    image: require('../../assets/gestures/ok.png'),
    emoji: '👌',
    description: 'Pouce et index formant un cercle',
    category: 'Expression',
    color: '#10B981', // Success
  },
  'K': {
    label: 'K',
    displayName: 'Lettre K',
    image: require('../../assets/gestures/ok.png'), // Utilise la même image que OK
    emoji: '🇰',
    description: 'Geste pour la lettre K',
    category: 'Lettre',
    color: '#6FF0E2',
  },
  'STOP': {
    label: 'STOP',
    displayName: 'Stop',
    image: require('../../assets/gestures/stop.png'),
    emoji: '✋',
    description: 'Main ouverte, paume vers l\'avant',
    category: 'Expression',
    color: '#EF4444', // Error
  },
};

// ========== FONCTIONS UTILITAIRES ==========

/**
 * Obtenir les informations d'un geste
 * @param {string} gestureLabel - Label du geste (ex: 'A', 'MERCI')
 * @returns {Object|null} - Informations du geste ou null
 */
export const getGestureInfo = (gestureLabel) => {
  if (!gestureLabel) return null;
  
  const upperLabel = gestureLabel.toString().toUpperCase();
  return gestureMapping[upperLabel] || null;
};

/**
 * Obtenir l'image d'un geste (source pour React Native Image)
 * @param {string} gestureLabel - Label du geste
 * @returns {number|null} - Source de l'image (require) ou null
 */
export const getGestureImage = (gestureLabel) => {
  const info = getGestureInfo(gestureLabel);
  return info ? info.image : null;
};

/**
 * Obtenir l'emoji d'un geste
 * @param {string} gestureLabel - Label du geste
 * @returns {string} - Emoji correspondant
 */
export const getGestureEmoji = (gestureLabel) => {
  const info = getGestureInfo(gestureLabel);
  return info ? info.emoji : '❓';
};

/**
 * Obtenir la couleur d'un geste
 * @param {string} gestureLabel - Label du geste
 * @returns {string} - Code couleur HEX
 */
export const getGestureColor = (gestureLabel) => {
  const info = getGestureInfo(gestureLabel);
  return info ? info.color : '#6FF0E2';
};

/**
 * Obtenir tous les labels de gestes disponibles
 * @returns {Array} - Liste des labels
 */
export const getAllGestureLabels = () => {
  return Object.keys(gestureMapping);
};

/**
 * Obtenir les gestes par catégorie
 * @param {string} category - Catégorie ('Lettre' ou 'Expression')
 * @returns {Array} - Liste des gestes de cette catégorie
 */
export const getGesturesByCategory = (category) => {
  return Object.values(gestureMapping).filter(
    gesture => gesture.category === category
  );
};

/**
 * Vérifier si un geste existe
 * @param {string} gestureLabel - Label du geste
 * @returns {boolean} - true si le geste existe
 */
export const isValidGesture = (gestureLabel) => {
  if (!gestureLabel) return false;
  const upperLabel = gestureLabel.toString().toUpperCase();
  return upperLabel in gestureMapping;
};

/**
 * Obtenir la couleur selon le niveau de confiance
 * @param {number} confidence - Pourcentage de confiance (0-100)
 * @returns {string} - Code couleur HEX
 */
export const getConfidenceColor = (confidence) => {
  if (confidence >= 90) {
    return '#10B981'; // Success (vert)
  } else if (confidence >= 70) {
    return '#F59E0B'; // Warning (orange)
  } else if (confidence >= 50) {
    return '#3B82F6'; // Info (bleu)
  } else {
    return '#EF4444'; // Error (rouge)
  }
};

/**
 * Obtenir le texte de statut selon la confiance
 * @param {number} confidence - Pourcentage de confiance
 * @returns {string} - Texte du statut
 */
export const getConfidenceStatus = (confidence) => {
  if (confidence >= 90) {
    return 'Excellent';
  } else if (confidence >= 70) {
    return 'Bon';
  } else if (confidence >= 50) {
    return 'Moyen';
  } else {
    return 'Faible';
  }
};

/**
 * Formater les probabilités pour affichage
 * @param {Object} probabilities - Objet des probabilités
 * @returns {Array} - Tableau trié des probabilités
 */
export const formatProbabilities = (probabilities) => {
  if (!probabilities) return [];

  return Object.entries(probabilities)
    .map(([label, value]) => ({
      label,
      value: parseFloat(value),
      info: getGestureInfo(label),
    }))
    .sort((a, b) => b.value - a.value); // Trier par ordre décroissant
};

/**
 * Obtenir le top N des prédictions
 * @param {Object} probabilities - Objet des probabilités
 * @param {number} n - Nombre de résultats (défaut: 3)
 * @returns {Array} - Top N prédictions
 */
export const getTopPredictions = (probabilities, n = 3) => {
  const formatted = formatProbabilities(probabilities);
  return formatted.slice(0, n);
};

// ========== DONNÉES STATIQUES ==========

/**
 * Liste des catégories disponibles
 */
export const categories = ['Lettre', 'Expression'];

/**
 * Statistiques des gestes
 */
export const gestureStats = {
  total: Object.keys(gestureMapping).length,
  byCategory: {
    'Lettre': getGesturesByCategory('Lettre').length,
    'Expression': getGesturesByCategory('Expression').length,
  },
};

/**
 * Configuration des couleurs sémantiques
 */
export const confidenceThresholds = {
  excellent: 90,
  good: 70,
  medium: 50,
  low: 0,
};

// Export par défaut
export default gestureMapping;