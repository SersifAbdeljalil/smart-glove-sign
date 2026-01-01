/* ============================================
   FICHIER: src/components/GestureImage.js
   Composant d'affichage des images de gestes
   ============================================ */

import React, { useState } from 'react';
import { getGestureInfo, getGestureImage, getGestureEmoji } from '../utils/gestureMapping';

const GestureImage = ({ 
  gestureLabel, 
  size = 'medium', 
  showLabel = true,
  showEmoji = false,
  className = '',
  style = {}
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Récupérer les informations du geste
  const gestureInfo = getGestureInfo(gestureLabel);
  const imagePath = getGestureImage(gestureLabel);
  const emoji = getGestureEmoji(gestureLabel);

  // Tailles prédéfinies
  const sizes = {
    small: {
      width: '80px',
      height: '80px',
      fontSize: '0.875rem',
      emojiSize: '2rem',
    },
    medium: {
      width: '150px',
      height: '150px',
      fontSize: '1rem',
      emojiSize: '3rem',
    },
    large: {
      width: '250px',
      height: '250px',
      fontSize: '1.25rem',
      emojiSize: '5rem',
    },
    xlarge: {
      width: '350px',
      height: '350px',
      fontSize: '1.5rem',
      emojiSize: '7rem',
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

  // Style du conteneur
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-md)',
    ...style,
  };

  // Style de l'image
  const imageContainerStyle = {
    width: currentSize.width,
    height: currentSize.height,
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background-gray)',
    position: 'relative',
    transition: 'all var(--transition-base)',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: imageLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  // Style du loader
  const loaderStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: currentSize.emojiSize,
    animation: 'pulse 2s ease-in-out infinite',
  };

  // Style du fallback emoji
  const fallbackStyle = {
    fontSize: currentSize.emojiSize,
    filter: 'grayscale(0.5)',
  };

  // Style du label
  const labelStyle = {
    fontSize: currentSize.fontSize,
    fontWeight: '700',
    color: 'var(--text-primary)',
    textAlign: 'center',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    backgroundColor: gestureInfo?.color || 'var(--primary)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    minWidth: '100px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <div className={`gesture-image-container ${className}`} style={containerStyle}>
      {/* Conteneur de l'image */}
      <div 
        className="gesture-image-wrapper" 
        style={imageContainerStyle}
        title={gestureInfo?.description || gestureLabel}
      >
        {/* Loader pendant le chargement */}
        {!imageLoaded && !imageError && (
          <div style={loaderStyle}>
            {emoji}
          </div>
        )}

        {/* Image du geste */}
        {!imageError ? (
          <img
            src={imagePath}
            alt={gestureInfo?.displayName || gestureLabel}
            style={imageStyle}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          // Fallback si l'image ne charge pas
          <div style={fallbackStyle}>
            {emoji}
          </div>
        )}
      </div>

      {/* Label du geste */}
      {showLabel && gestureInfo && (
        <div style={labelStyle}>
          {showEmoji && <span style={{ marginRight: '8px' }}>{emoji}</span>}
          {gestureInfo.displayName}
        </div>
      )}

      {/* Description (optionnelle) */}
      {gestureInfo?.description && showLabel && (
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          maxWidth: currentSize.width,
          margin: '0',
        }}>
          {gestureInfo.description}
        </p>
      )}
    </div>
  );
};

export default GestureImage;