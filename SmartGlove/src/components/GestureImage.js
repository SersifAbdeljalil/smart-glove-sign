/* ============================================
   FICHIER: src/components/GestureImage.js
   Composant d'affichage des images de gestes - React Native
   ============================================ */

import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getGestureInfo, getGestureImage, getGestureEmoji } from '../utils/gestureMapping';

const GestureImage = ({ 
  gestureLabel, 
  size = 'medium', 
  showLabel = true,
  showEmoji = false,
  style
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Récupérer les informations du geste
  const gestureInfo = getGestureInfo(gestureLabel);
  const imageSource = getGestureImage(gestureLabel);
  const emoji = getGestureEmoji(gestureLabel);

  // Tailles prédéfinies
  const sizes = {
    small: {
      size: 80,
      fontSize: 14,
      emojiSize: 32,
      labelFontSize: 12,
    },
    medium: {
      size: 150,
      fontSize: 16,
      emojiSize: 48,
      labelFontSize: 14,
    },
    large: {
      size: 250,
      fontSize: 20,
      emojiSize: 80,
      labelFontSize: 18,
    },
    xlarge: {
      size: 350,
      fontSize: 24,
      emojiSize: 112,
      labelFontSize: 22,
    },
  };

  const currentSize = sizes[size] || sizes.medium;

  // Gestion de l'erreur de chargement
  const handleImageError = () => {
    setImageError(true);
  };

  // Gestion du chargement réussi
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Conteneur de l'image */}
      <View 
        style={[
          styles.imageContainer,
          { 
            width: currentSize.size, 
            height: currentSize.size,
            backgroundColor: gestureInfo?.color || '#6FF0E2',
          }
        ]}
      >
        {/* Loader pendant le chargement */}
        {!imageLoaded && !imageError && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#0070F3" />
          </View>
        )}

        {/* Image du geste */}
        {!imageError && imageSource ? (
          <Image
            source={imageSource}
            style={[
              styles.image,
              { 
                width: currentSize.size, 
                height: currentSize.size,
                opacity: imageLoaded ? 1 : 0,
              }
            ]}
            onError={handleImageError}
            onLoad={handleImageLoad}
            resizeMode="cover"
          />
        ) : (
          // Fallback si l'image ne charge pas
          <Text style={[styles.fallbackEmoji, { fontSize: currentSize.emojiSize }]}>
            {emoji}
          </Text>
        )}
      </View>

      {/* Label du geste */}
      {showLabel && gestureInfo && (
        <View style={[
          styles.labelContainer,
          { backgroundColor: gestureInfo.color || '#0070F3' }
        ]}>
          {showEmoji && (
            <Text style={styles.labelEmoji}>{emoji}</Text>
          )}
          <Text style={[styles.labelText, { fontSize: currentSize.labelFontSize }]}>
            {gestureInfo.displayName}
          </Text>
        </View>
      )}

      {/* Description (optionnelle) */}
      {gestureInfo?.description && showLabel && (
        <Text style={[
          styles.description,
          { maxWidth: currentSize.size }
        ]}>
          {gestureInfo.description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  image: {
    position: 'absolute',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  fallbackEmoji: {
    opacity: 0.5,
  },
  labelContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelEmoji: {
    marginRight: 8,
    fontSize: 16,
  },
  labelText: {
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default GestureImage;