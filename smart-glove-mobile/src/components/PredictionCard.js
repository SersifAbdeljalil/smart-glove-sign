/* ============================================
   FICHIER: src/components/PredictionCard.js
   Composant carte de prédiction avec probabilités - React Native
   ============================================ */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import GestureImage from './GestureImage';
import { 
  getGestureInfo, 
  getConfidenceColor, 
  getConfidenceStatus,
  getTopPredictions 
} from '../utils/gestureMapping';

const PredictionCard = ({ 
  prediction,
  showProbabilities = true,
  showTopN = 5,
  showImage = true,
  style
}) => {
  
  // Si pas de prédiction, afficher un état vide
  if (!prediction) {
    return (
      <View style={[styles.card, styles.cardEmpty, style]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🤚</Text>
          <Text style={styles.emptyTitle}>En attente de prédiction</Text>
          <Text style={styles.emptyText}>
            Entrez les valeurs des capteurs et cliquez sur "Prédire"
          </Text>
        </View>
      </View>
    );
  }

  const { label, confidence, probabilities, timestamp } = prediction;
  const gestureInfo = getGestureInfo(label);
  const confidenceColor = getConfidenceColor(confidence);
  const confidenceStatus = getConfidenceStatus(confidence);
  const topPredictions = getTopPredictions(probabilities, showTopN);

  return (
    <ScrollView style={[styles.card, style]}>
      {/* En-tête de la carte */}
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Résultat de la Prédiction</Text>
        {timestamp && (
          <Text style={styles.timestamp}>🕐 {timestamp}</Text>
        )}
      </View>

      {/* Corps de la carte */}
      <View style={styles.body}>
        
        {/* Image du geste */}
        {showImage && (
          <View style={styles.imageSection}>
            <GestureImage 
              gestureLabel={label}
              size="large"
              showLabel={true}
              showEmoji={true}
            />
          </View>
        )}

        {/* Confiance */}
        <View style={styles.confidenceSection}>
          <Text style={styles.confidenceLabel}>Niveau de Confiance</Text>
          <Text style={[styles.confidenceValue, { color: confidenceColor }]}>
            {confidence.toFixed(2)}%
          </Text>
          
          {/* Barre de progression */}
          <View style={styles.confidenceBarContainer}>
            <View 
              style={[
                styles.confidenceBarFill,
                { 
                  width: `${confidence}%`,
                  backgroundColor: confidenceColor 
                }
              ]}
            />
          </View>
          
          <Text style={[styles.confidenceStatus, { color: confidenceColor }]}>
            {confidenceStatus}
          </Text>
        </View>

        {/* Informations du geste */}
        {gestureInfo && (
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Catégorie:</Text>
              <Text style={styles.infoValue}>{gestureInfo.category}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Description:</Text>
              <Text style={styles.infoValue}>{gestureInfo.description}</Text>
            </View>
          </View>
        )}

        {/* Barres de probabilités */}
        {showProbabilities && probabilities && (
          <View style={styles.probabilitiesSection}>
            <Text style={styles.probabilitiesTitle}>
              📊 Probabilités Détaillées
            </Text>
            <View style={styles.probabilitiesList}>
              {topPredictions.map((item, index) => (
                <View key={item.label} style={styles.probabilityItem}>
                  <View style={styles.probabilityHeader}>
                    <Text style={styles.probabilityLabel}>
                      {item.info?.emoji || '❓'} {item.label}
                    </Text>
                    <Text 
                      style={[
                        styles.probabilityValue,
                        { color: item.value >= 50 ? confidenceColor : '#6B7280' }
                      ]}
                    >
                      {item.value.toFixed(2)}%
                    </Text>
                  </View>
                  <View style={styles.probabilityBarContainer}>
                    <View 
                      style={[
                        styles.probabilityBarFill,
                        { 
                          width: `${item.value}%`,
                          backgroundColor: item.value >= 50 
                            ? confidenceColor 
                            : '#E5E7EB'
                        }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardEmpty: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Header
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  // Body
  body: {
    gap: 24,
  },
  
  // Image section
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  // Confidence section
  confidenceSection: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confidenceValue: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 16,
  },
  confidenceBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  confidenceStatus: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Info section
  infoSection: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 8,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  
  // Probabilities section
  probabilitiesSection: {
    marginTop: 20,
  },
  probabilitiesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  probabilitiesList: {
    gap: 12,
  },
  probabilityItem: {
    marginBottom: 12,
  },
  probabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  probabilityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  probabilityValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  probabilityBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  probabilityBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default PredictionCard;