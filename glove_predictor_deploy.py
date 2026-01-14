"""
SMART GLOVE - Interface Web de Prédiction Temps Réel
Fichier: glove_predictor.py (Vercel)
"""

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import joblib
import numpy as np
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ========== CHARGEMENT DU MODÈLE ==========
model = None
scaler = None
label_encoder = None

def load_models():
    global model, scaler, label_encoder
    
    try:
        # Chemins des modèles (à la racine du projet)
        model_path = os.path.join(os.path.dirname(__file__), 'glove_model.pkl')
        scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')
        encoder_path = os.path.join(os.path.dirname(__file__), 'label_encoder.pkl')
        
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        label_encoder = joblib.load(encoder_path)
        
        print("✅ Modèle chargé avec succès!")
        print(f"✅ Labels disponibles: {label_encoder.classes_.tolist()}")
    except Exception as e:
        print(f"❌ ERREUR: {e}")

# Charger les modèles au démarrage
load_models()

# ========== STATISTIQUES + DERNIÈRE PRÉDICTION ==========
stats = {
    "total_predictions": 0,
    "predictions_by_label": {},
    "last_prediction": None,
    "confidence": 0,
    "history": []
}

latest_prediction_data = None

# ========== ROUTE: Page d'accueil ==========
@app.route('/')
def index():
    return jsonify({
        "message": "Smart Glove API",
        "endpoints": {
            "POST /predict": "Faire une prédiction",
            "GET /latest-prediction": "Obtenir la dernière prédiction",
            "GET /stats": "Obtenir les statistiques"
        },
        "status": "online"
    })

# ========== ROUTE: Prédiction ==========
@app.route('/predict', methods=['POST'])
def predict():
    global stats, latest_prediction_data
    
    if model is None:
        return jsonify({"error": "Modèle non chargé"}), 500
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Pas de données"}), 400
        
        # Extraire les 9 features
        features = [
            data.get('flex_thumb', 0),
            data.get('flex_index', 0),
            data.get('flex_middle', 0),
            data.get('gyro_x', 0),
            data.get('gyro_y', 0),
            data.get('gyro_z', 0),
            data.get('accel_x', 0),
            data.get('accel_y', 0),
            data.get('accel_z', 0)
        ]
        
        # Préparer les données
        X = np.array(features).reshape(1, -1)
        X_scaled = scaler.transform(X)
        
        # Prédiction
        prediction = model.predict(X_scaled)[0]
        predicted_label = label_encoder.inverse_transform([prediction])[0]
        
        # Probabilités
        probabilities = model.predict_proba(X_scaled)[0]
        confidence = float(np.max(probabilities) * 100)
        
        # Créer le dictionnaire de probabilités
        proba_dict = {}
        for i, label in enumerate(label_encoder.classes_):
            proba_dict[label] = float(probabilities[i] * 100)
        
        # Mettre à jour les stats
        stats['total_predictions'] += 1
        stats['last_prediction'] = predicted_label
        stats['confidence'] = confidence
        
        if predicted_label not in stats['predictions_by_label']:
            stats['predictions_by_label'][predicted_label] = 0
        stats['predictions_by_label'][predicted_label] += 1
        
        # Historique
        history_entry = {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "label": predicted_label,
            "confidence": round(confidence, 2)
        }
        stats['history'].insert(0, history_entry)
        stats['history'] = stats['history'][:50]
        
        # Réponse complète
        result = {
            "predicted_label": predicted_label,
            "confidence": round(confidence, 2),
            "probabilities": {k: round(v, 2) for k, v in proba_dict.items()},
            "features": features,
            "timestamp": datetime.now().isoformat()
        }
        
        latest_prediction_data = result
        
        print(f"✅ Prédiction: {predicted_label} ({confidence:.2f}%)")
        
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ========== ROUTE: Dernière prédiction ==========
@app.route('/latest-prediction', methods=['GET'])
def get_latest_prediction():
    global latest_prediction_data
    
    if latest_prediction_data is None:
        return jsonify({
            "error": "Aucune prédiction disponible",
            "message": "En attente de données depuis le gant..."
        }), 404
    
    return jsonify(latest_prediction_data)

# ========== ROUTE: Statistiques ==========
@app.route('/stats', methods=['GET'])
def get_stats():
    return jsonify(stats)

# ========== ROUTE: Health Check ==========
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    })

# Pour Vercel (pas de app.run())
if __name__ != '__main__':
    load_models()