/* ============================================
   FICHIER: src/components/Button.js
   Composant bouton réutilisable
   ============================================ */

import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  icon,
  type = 'button',
  className = '',
  ...props 
}) => {
  
  // Définir les classes CSS selon le variant
  const getVariantClass = () => {
    switch(variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'accent':
        return 'btn-accent';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-primary';
    }
  };

  // Définir les classes CSS selon la taille
  const getSizeClass = () => {
    switch(size) {
      case 'small':
        return 'btn-small';
      case 'medium':
        return '';
      case 'large':
        return 'btn-large';
      default:
        return '';
    }
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;