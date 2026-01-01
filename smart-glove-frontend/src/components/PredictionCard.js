/* ============================================
   FICHIER: src/components/PredictionCard.js
   Composant carte de prédiction avec probabilités
   ============================================ */

import React from 'react';
import GestureImage from './GestureImage';
import { 
  getGestureInfo, 
  getConfidenceColor, 
  getConfidenceStatus,
  formatProbabilities,
  getTopPredictions 
} from '../utils/gestureMapping';

const PredictionCard = ({ 
  prediction,
  showProbabilities = true,
  showTopN = 5,
  showImage = true,
  className = ''
}) => {
  
  // Si pas de prédiction, afficher un état vide
  if (!prediction) {
    return (
      <div className={`prediction-card prediction-card-empty ${className}`}>
        <div className="prediction-empty-state">
          <div className="prediction-empty-icon">🤚</div>
          <h3 className="prediction-empty-title">En attente de prédiction</h3>
          <p className="prediction-empty-text">
            Entrez les valeurs des capteurs et cliquez sur "Prédire"
          </p>
        </div>
      </div>
    );
  }

  const { label, confidence, probabilities, timestamp } = prediction;
  const gestureInfo = getGestureInfo(label);
  const confidenceColor = getConfidenceColor(confidence);
  const confidenceStatus = getConfidenceStatus(confidence);
  const topPredictions = getTopPredictions(probabilities, showTopN);

  return (
    <div className={`prediction-card ${className}`}>
      {/* En-tête de la carte */}
      <div className="prediction-card-header">
        <h3 className="prediction-card-title">
          🎯 Résultat de la Prédiction
        </h3>
        {timestamp && (
          <span className="prediction-timestamp">
            🕐 {timestamp}
          </span>
        )}
      </div>

      {/* Corps de la carte */}
      <div className="prediction-card-body">
        
        {/* Image du geste */}
        {showImage && (
          <div className="prediction-image-section">
            <GestureImage 
              gestureLabel={label}
              size="large"
              showLabel={true}
              showEmoji={true}
            />
          </div>
        )}

        {/* Confiance */}
        <div className="prediction-confidence-section">
          <div className="prediction-confidence-label">
            Niveau de Confiance
          </div>
          <div 
            className="prediction-confidence-value"
            style={{ color: confidenceColor }}
          >
            {confidence.toFixed(2)}%
          </div>
          <div className="prediction-confidence-bar">
            <div 
              className="prediction-confidence-fill"
              style={{ 
                width: `${confidence}%`,
                backgroundColor: confidenceColor 
              }}
            />
          </div>
          <div 
            className="prediction-confidence-status"
            style={{ color: confidenceColor }}
          >
            {confidenceStatus}
          </div>
        </div>

        {/* Informations du geste */}
        {gestureInfo && (
          <div className="prediction-info-section">
            <div className="prediction-info-item">
              <span className="prediction-info-label">Catégorie:</span>
              <span className="prediction-info-value">
                {gestureInfo.category}
              </span>
            </div>
            <div className="prediction-info-item">
              <span className="prediction-info-label">Description:</span>
              <span className="prediction-info-value">
                {gestureInfo.description}
              </span>
            </div>
          </div>
        )}

        {/* Barres de probabilités */}
        {showProbabilities && probabilities && (
          <div className="prediction-probabilities-section">
            <h4 className="prediction-probabilities-title">
              📊 Probabilités Détaillées
            </h4>
            <div className="prediction-probabilities-list">
              {topPredictions.map((item, index) => (
                <div 
                  key={item.label} 
                  className="prediction-probability-item"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="prediction-probability-header">
                    <span className="prediction-probability-label">
                      {item.info?.emoji || '❓'} {item.label}
                    </span>
                    <span 
                      className="prediction-probability-value"
                      style={{ 
                        color: item.value >= 50 ? confidenceColor : 'var(--text-secondary)' 
                      }}
                    >
                      {item.value.toFixed(2)}%
                    </span>
                  </div>
                  <div className="prediction-probability-bar">
                    <div 
                      className="prediction-probability-fill"
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: item.value >= 50 
                          ? confidenceColor 
                          : 'var(--text-light)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;