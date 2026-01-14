/* ============================================
   FICHIER: src/components/Button.js
   Composant bouton réutilisable - React Native
   ============================================ */

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onPress, 
  disabled = false,
  icon,
  loading = false,
  style,
  textStyle,
  ...props 
}) => {
  
  // Obtenir les styles selon le variant
  const getVariantStyle = () => {
    switch(variant) {
      case 'primary':
        return styles.btnPrimary;
      case 'secondary':
        return styles.btnSecondary;
      case 'accent':
        return styles.btnAccent;
      case 'outline':
        return styles.btnOutline;
      default:
        return styles.btnPrimary;
    }
  };

  // Obtenir les styles de texte selon le variant
  const getTextVariantStyle = () => {
    switch(variant) {
      case 'outline':
        return styles.textOutline;
      default:
        return styles.textDefault;
    }
  };

  // Obtenir les styles selon la taille
  const getSizeStyle = () => {
    switch(size) {
      case 'small':
        return styles.btnSmall;
      case 'medium':
        return styles.btnMedium;
      case 'large':
        return styles.btnLarge;
      default:
        return styles.btnMedium;
    }
  };

  const getTextSizeStyle = () => {
    switch(size) {
      case 'small':
        return styles.textSmall;
      case 'medium':
        return styles.textMedium;
      case 'large':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        getVariantStyle(),
        getSizeStyle(),
        disabled && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#0070F3' : '#FFFFFF'} 
          size="small" 
        />
      ) : (
        <View style={styles.btnContent}>
          {icon && <View style={styles.btnIcon}>{icon}</View>}
          <Text style={[
            styles.btnText,
            getTextVariantStyle(),
            getTextSizeStyle(),
            disabled && styles.textDisabled,
            textStyle,
          ]}>
            {children}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variants
  btnPrimary: {
    backgroundColor: '#0070F3',
    shadowColor: '#0070F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnSecondary: {
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnAccent: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0070F3',
  },
  
  // Sizes
  btnSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  btnMedium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  btnLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  
  // Disabled
  btnDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
    borderColor: '#E5E7EB',
  },
  
  // Content
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: 8,
  },
  
  // Text
  btnText: {
    fontWeight: '600',
  },
  textDefault: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: '#0070F3',
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  
  // Text sizes
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
});

export default Button;