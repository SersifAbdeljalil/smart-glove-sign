"""
SMART GLOVE - Interface Web de Prédiction Temps Réel
Fichier: glove_predictor.py
"""

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import joblib
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ========== CHARGEMENT DU MODÈLE ==========
print("\n🤖 Chargement du modèle...")

try:
    model = joblib.load('glove_model.pkl')
    scaler = joblib.load('scaler.pkl')
    label_encoder = joblib.load('label_encoder.pkl')
    print("✅ Modèle chargé avec succès!")
    print(f"✅ Labels disponibles: {label_encoder.classes_.tolist()}")
except Exception as e:
    print(f"❌ ERREUR: Impossible de charger le modèle: {e}")
    print("💡 Lance d'abord: python train_model.py")
    exit(1)

# ========== STATISTIQUES + DERNIÈRE PRÉDICTION ==========
stats = {
    "total_predictions": 0,
    "predictions_by_label": {},
    "last_prediction": None,
    "confidence": 0,
    "history": []
}

# Variable globale pour stocker la dernière prédiction complète
latest_prediction_data = None

# ========== ROUTE: Page d'accueil ==========
@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

# ========== ROUTE: Prédiction ==========
@app.route('/predict', methods=['POST'])
def predict():
    global stats, latest_prediction_data
    
    try:
        # Récupérer les données JSON
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
        
        # Préparer les données (reshape + normalisation)
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
        
        # Historique (garder les 50 dernières)
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
        
        # 🔥 STOCKER LA DERNIÈRE PRÉDICTION
        latest_prediction_data = result
        
        print(f"✅ Prédiction: {predicted_label} ({confidence:.2f}%)")
        
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ========== ROUTE: Dernière prédiction (NOUVEAU) ==========
@app.route('/latest-prediction', methods=['GET'])
def get_latest_prediction():
    """Retourner la dernière prédiction disponible pour le Dashboard React"""
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

# ========== HTML TEMPLATE (reste identique) ==========
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Glove - Prédiction Temps Réel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .content { padding: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
        }
        .section.full { grid-column: 1 / -1; }
        .section h2 { color: #667eea; margin-bottom: 15px; }
        .prediction-box {
            background: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .prediction-label {
            font-size: 4em;
            font-weight: bold;
            color: #667eea;
            margin: 20px 0;
            text-transform: uppercase;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .confidence {
            font-size: 1.5em;
            color: #28a745;
            font-weight: 600;
        }
        .proba-bars {
            margin-top: 20px;
        }
        .proba-item {
            margin: 10px 0;
            text-align: left;
        }
        .proba-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-weight: 600;
        }
        .proba-bar {
            height: 25px;
            background: #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
        }
        .proba-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            padding-left: 10px;
            color: white;
            font-weight: bold;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .stat-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label { color: #888; margin-top: 5px; }
        .history-list {
            max-height: 400px;
            overflow-y: auto;
            background: white;
            padding: 15px;
            border-radius: 8px;
        }
        .history-item {
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .history-label {
            font-weight: bold;
            color: #667eea;
            font-size: 1.1em;
        }
        .status-indicator {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #28a745;
            margin-right: 10px;
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 15px;
        }
        .feature-box {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .feature-label { color: #888; font-size: 0.9em; }
        .feature-value { font-size: 1.5em; font-weight: bold; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧤 Smart Glove - Prédiction IA</h1>
            <p>Reconnaissance de Gestes en Temps Réel</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>🎯 Prédiction en Temps Réel</h2>
                <div class="prediction-box">
                    <div style="font-size: 1.2em; color: #888;">
                        <span class="status-indicator"></span>En écoute...
                    </div>
                    <div class="prediction-label" id="predictionLabel">En attente</div>
                    <div class="confidence" id="confidence">---%</div>
                </div>
            </div>
            
            <div class="section">
                <h2>📊 Probabilités</h2>
                <div class="proba-bars" id="probaBars">
                    <p style="text-align: center; color: #888;">En attente de données...</p>
                </div>
            </div>
            
            <div class="section full">
                <h2>📈 Statistiques</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="totalPredictions">0</div>
                        <div class="stat-label">Total Prédictions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="lastLabel">---</div>
                        <div class="stat-label">Dernier Geste</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="avgConfidence">---%</div>
                        <div class="stat-label">Confiance</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>🕐 Historique</h2>
                <div class="history-list" id="historyList">
                    <p style="text-align: center; color: #888;">Aucune prédiction encore</p>
                </div>
            </div>
            
            <div class="section">
                <h2>📡 Capteurs Actuels</h2>
                <div class="features-grid" id="featuresGrid">
                    <div class="feature-box">
                        <div class="feature-label">Pouce</div>
                        <div class="feature-value" id="flex_thumb">--</div>
                    </div>
                    <div class="feature-box">
                        <div class="feature-label">Index</div>
                        <div class="feature-value" id="flex_index">--</div>
                    </div>
                    <div class="feature-box">
                        <div class="feature-label">Majeur</div>
                        <div class="feature-value" id="flex_middle">--</div>
                    </div>
                    <div class="feature-box">
                        <div class="feature-label">Gyro X</div>
                        <div class="feature-value" id="gyro_x">--</div>
                    </div>
                    <div class="feature-box">
                        <div class="feature-label">Gyro Y</div>
                        <div class="feature-value" id="gyro_y">--</div>
                    </div>
                    <div class="feature-box">
                        <div class="feature-label">Gyro Z</div>
                        <div class="feature-value" id="gyro_z">--</div>
                    </div>
                    <div class="feature-box">
                        <div class="feature-label">Accel X</div>
                        <div class="feature-value" id="accel_x">--</div>
                    </div>
                    <div class="feature-box">
                        <div class="feature-label">Accel Y</div>
                        <div class="feature-value" id="accel_y">--</div>
                    </div>
                    <div class="feature-box">
                        <div class="feature-label">Accel Z</div>
                        <div class="feature-value" id="accel_z">--</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        var updateInterval;
        
        function updateStats() {
            fetch('/stats')
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    document.getElementById('totalPredictions').textContent = data.total_predictions;
                    document.getElementById('lastLabel').textContent = data.last_prediction || '---';
                    document.getElementById('avgConfidence').textContent = 
                        data.confidence ? data.confidence.toFixed(2) + '%' : '---%';
                    
                    // Historique
                    if (data.history && data.history.length > 0) {
                        var historyHtml = '';
                        data.history.forEach(function(item) {
                            historyHtml += '<div class="history-item">' +
                                '<div>' +
                                '<span class="history-label">' + item.label + '</span>' +
                                '<span style="color: #888; margin-left: 10px;">' + item.timestamp + '</span>' +
                                '</div>' +
                                '<div style="color: #28a745; font-weight: bold;">' + item.confidence + '%</div>' +
                                '</div>';
                        });
                        document.getElementById('historyList').innerHTML = historyHtml;
                    }
                })
                .catch(function(error) {
                    console.error('Erreur:', error);
                });
        }
        
        // Mise à jour toutes les secondes
        updateInterval = setInterval(updateStats, 1000);
        updateStats();
        
        console.log('🚀 Interface de prédiction chargée');
        console.log('💡 Envoie des données depuis ton ESP32 vers /predict');
    </script>
</body>
</html>
"""

# ========== DÉMARRAGE DU SERVEUR ==========
if __name__ == '__main__':
    print("\n" + "="*50)
    print("  SMART GLOVE - INTERFACE DE PRÉDICTION")
    print("="*50)
    print("\n🌐 Interface web: http://localhost:5000")
    print("🌐 Dashboard React: http://localhost:3000")
    print("\n📡 Endpoints disponibles:")
    print("   POST /predict - Prédiction depuis ESP32")
    print("   GET /latest-prediction - Dernière prédiction (React)")
    print("   GET /stats - Statistiques")
    print("\n" + "="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)