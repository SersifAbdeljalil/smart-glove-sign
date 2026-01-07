"""
SMART GLOVE - Serveur Flask pour Collecte Dataset (CORRIGÉ v2)
Fichier: glove_server.py

Installation des dépendances:
pip install flask flask-cors pandas numpy

Utilisation:
python glove_server.py
"""

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Permet les requêtes depuis ESP32

# ========== CONFIGURATION ==========
DATASET_FOLDER = "datasets"
CURRENT_LABEL = "AUCUN"  # Label en cours d'enregistrement
IS_RECORDING = False
CURRENT_SESSION_FILE = None

# Créer le dossier datasets s'il n'existe pas
os.makedirs(DATASET_FOLDER, exist_ok=True)

# Statistiques
stats = {
    "total_samples": 0,
    "session_samples": 0,
    "gestures": {},
    "last_data": None
}

# ========== ROUTE: Page d'accueil (Interface Web) ==========
@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

# ========== ROUTE: Recevoir données de l'ESP32 ==========
@app.route('/record', methods=['POST'])
def record_data():
    global stats, CURRENT_SESSION_FILE, IS_RECORDING
    
    try:
        # Récupérer les données JSON
        data = request.get_json()
        
        if not data:
            return jsonify({"status": "error", "message": "Pas de données"}), 400
        
        # Ajouter timestamp et label
        data['label'] = CURRENT_LABEL
        data['datetime'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Mettre à jour stats
        stats['last_data'] = data
        
        # Si en mode enregistrement, sauvegarder dans CSV
        if IS_RECORDING and CURRENT_LABEL != "AUCUN":
            # Créer le fichier s'il n'existe pas
            if CURRENT_SESSION_FILE is None:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                CURRENT_SESSION_FILE = os.path.join(
                    DATASET_FOLDER, 
                    f"dataset_{CURRENT_LABEL}_{timestamp}.csv"
                )
            
            # Sauvegarder dans CSV
            df = pd.DataFrame([data])
            
            # Ajouter au fichier existant ou créer nouveau
            if os.path.exists(CURRENT_SESSION_FILE):
                df.to_csv(CURRENT_SESSION_FILE, mode='a', header=False, index=False)
            else:
                df.to_csv(CURRENT_SESSION_FILE, mode='w', header=True, index=False)
            
            # Mettre à jour stats
            stats['total_samples'] += 1
            stats['session_samples'] += 1
            
            if CURRENT_LABEL not in stats['gestures']:
                stats['gestures'][CURRENT_LABEL] = 0
            stats['gestures'][CURRENT_LABEL] += 1
            
            print(f"✅ Enregistré: {CURRENT_LABEL} | Total: {stats['session_samples']}")
        
        return jsonify({
            "status": "success",
            "recording": IS_RECORDING,
            "label": CURRENT_LABEL,
            "samples": stats['session_samples']
        })
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

# ========== ROUTE: Démarrer enregistrement ==========
@app.route('/start/<label>', methods=['POST'])
def start_recording(label):
    global IS_RECORDING, CURRENT_LABEL, stats, CURRENT_SESSION_FILE
    
    CURRENT_LABEL = label.upper()
    IS_RECORDING = True
    stats['session_samples'] = 0
    CURRENT_SESSION_FILE = None
    
    print(f"\n🎬 DÉMARRAGE ENREGISTREMENT: {CURRENT_LABEL}")
    
    return jsonify({
        "status": "started",
        "label": CURRENT_LABEL
    })

# ========== ROUTE: Arrêter enregistrement ==========
@app.route('/stop', methods=['POST'])
def stop_recording():
    global IS_RECORDING, CURRENT_LABEL, stats, CURRENT_SESSION_FILE
    
    samples = stats['session_samples']
    label = CURRENT_LABEL
    
    IS_RECORDING = False
    CURRENT_LABEL = "AUCUN"
    
    print(f"⏹️ ARRÊT ENREGISTREMENT: {label} | Échantillons: {samples}")
    
    result = {
        "status": "stopped",
        "label": label,
        "samples": samples,
        "file": CURRENT_SESSION_FILE
    }
    
    CURRENT_SESSION_FILE = None
    
    return jsonify(result)

# ========== ROUTE: Obtenir statistiques ==========
@app.route('/stats', methods=['GET'])
def get_stats():
    return jsonify({
        "recording": IS_RECORDING,
        "current_label": CURRENT_LABEL,
        "total_samples": stats['total_samples'],
        "session_samples": stats['session_samples'],
        "gestures": stats['gestures'],
        "last_data": stats['last_data']
    })

# ========== ROUTE: Lister tous les fichiers dataset ==========
@app.route('/datasets', methods=['GET'])
def list_datasets():
    files = []
    for filename in os.listdir(DATASET_FOLDER):
        if filename.endswith('.csv'):
            filepath = os.path.join(DATASET_FOLDER, filename)
            df = pd.read_csv(filepath)
            files.append({
                "filename": filename,
                "samples": len(df),
                "size_kb": round(os.path.getsize(filepath) / 1024, 2)
            })
    
    return jsonify({"datasets": files})

# ========== ROUTE: Fusionner tous les datasets ==========
@app.route('/merge', methods=['POST'])
def merge_datasets():
    try:
        all_files = [f for f in os.listdir(DATASET_FOLDER) if f.endswith('.csv')]
        
        if not all_files:
            return jsonify({"status": "error", "message": "Aucun dataset trouvé"}), 404
        
        # Lire et fusionner tous les CSV
        dfs = []
        for filename in all_files:
            filepath = os.path.join(DATASET_FOLDER, filename)
            df = pd.read_csv(filepath)
            dfs.append(df)
        
        merged_df = pd.concat(dfs, ignore_index=True)
        
        # Sauvegarder le dataset fusionné
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        merged_file = os.path.join(DATASET_FOLDER, f"dataset_MERGED_{timestamp}.csv")
        merged_df.to_csv(merged_file, index=False)
        
        # Statistiques
        label_counts = merged_df['label'].value_counts().to_dict()
        
        return jsonify({
            "status": "success",
            "file": merged_file,
            "total_samples": len(merged_df),
            "labels": label_counts
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ========== HTML TEMPLATE (Interface Web - CORRIGÉ v2) ==========
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Glove - Dataset Collector</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
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
        .content { padding: 30px; }
        .section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
        }
        .section h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        .status-card {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat {
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
        .recording-indicator {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #dc3545;
            margin-right: 10px;
            animation: pulse 1s infinite;
        }
        .recording-indicator.active { background: #28a745; }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        .gesture-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin: 15px 0;
        }
        .gesture-btn {
            padding: 20px;
            background: white;
            border: 2px solid #667eea;
            color: #667eea;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 1.1em;
        }
        .gesture-btn:hover {
            background: #667eea;
            color: white;
            transform: scale(1.05);
        }
        input[type="text"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            margin: 10px 0;
        }
        .btn {
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            margin: 5px;
        }
        .btn-start { background: #28a745; color: white; }
        .btn-stop { background: #dc3545; color: white; }
        .btn-merge { background: #ffc107; color: #333; }
        .btn:hover { transform: translateY(-2px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .data-display {
            background: #1e1e1e;
            color: #00ff00;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            max-height: 300px;
            overflow-y: auto;
        }
        .dataset-list {
            background: white;
            border-radius: 8px;
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
        }
        .dataset-item {
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧤 Smart Glove Dataset Collector</h1>
            <p>Serveur Flask - Collecte en Temps Réel</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>📊 Statistiques en Temps Réel</h2>
                <div class="status-card">
                    <div class="stat">
                        <div class="stat-value" id="totalSamples">0</div>
                        <div class="stat-label">Total Échantillons</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" id="sessionSamples">0</div>
                        <div class="stat-label">Session Actuelle</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" id="gestureCount">0</div>
                        <div class="stat-label">Gestes Différents</div>
                    </div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
                    <span class="recording-indicator" id="recordingDot"></span>
                    <strong id="statusText">En attente...</strong>
                    <br><span id="currentLabel" style="color: #667eea; font-size: 1.2em;">AUCUN</span>
                </div>
            </div>
            
            <div class="section">
                <h2>🎮 Contrôles d'Enregistrement</h2>
                <div class="gesture-grid">
                    <button class="gesture-btn" onclick="selectGesture('POING')">👊 Poing</button>
                    <button class="gesture-btn" onclick="selectGesture('OUVERT')">🖐️ Ouvert</button>
                    <button class="gesture-btn" onclick="selectGesture('OK')">👌 OK</button>
                    <button class="gesture-btn" onclick="selectGesture('POUCE')">👍 Pouce</button>
                    <button class="gesture-btn" onclick="selectGesture('VICTOIRE')">✌️ Victoire</button>
                    <button class="gesture-btn" onclick="selectGesture('POINTEUR')">☝️ Pointeur</button>
                </div>
                <input type="text" id="customLabel" placeholder="Ou entre un label personnalisé...">
                <div style="text-align: center; margin-top: 15px;">
                    <button class="btn btn-start" onclick="startRecording()">▶️ Démarrer</button>
                    <button class="btn btn-stop" onclick="stopRecording()">⏹️ Arrêter</button>
                    <button class="btn btn-merge" onclick="mergeDatasets()">📦 Fusionner Tout</button>
                </div>
            </div>
            
            <div class="section">
                <h2>📈 Données en Temps Réel</h2>
                <div class="data-display" id="dataDisplay">En attente de données de l'ESP32...</div>
            </div>
            
            <div class="section">
                <h2>📁 Datasets Sauvegardés</h2>
                <div class="dataset-list" id="datasetList">Chargement...</div>
            </div>
        </div>
    </div>

    <script>
        var updateInterval;
        
        function selectGesture(name) {
            document.getElementById('customLabel').value = name;
        }
        
        function startRecording() {
            var label = document.getElementById('customLabel').value.trim();
            if (!label) {
                alert('⚠️ Entre un label!');
                return;
            }
            
            fetch('/start/' + encodeURIComponent(label), { method: 'POST' })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (data.status === 'started') {
                        alert('✅ Enregistrement démarré pour: ' + label);
                    }
                })
                .catch(function(error) {
                    console.error('Erreur:', error);
                    alert('❌ Erreur de connexion au serveur');
                });
        }
        
        function stopRecording() {
            fetch('/stop', { method: 'POST' })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    alert('⏹️ Enregistrement arrêté!\\n' + data.samples + ' échantillons sauvegardés pour ' + data.label);
                })
                .catch(function(error) {
                    console.error('Erreur:', error);
                    alert('❌ Erreur de connexion au serveur');
                });
        }
        
        function mergeDatasets() {
            if (!confirm('Fusionner tous les datasets en un seul fichier?')) return;
            
            fetch('/merge', { method: 'POST' })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (data.status === 'success') {
                        alert('✅ Fusion réussie!\\n' + data.total_samples + ' échantillons\\nFichier: ' + data.file);
                        loadDatasets();
                    } else {
                        alert('❌ ' + data.message);
                    }
                })
                .catch(function(error) {
                    console.error('Erreur:', error);
                    alert('❌ Erreur de connexion au serveur');
                });
        }
        
        function updateStats() {
            fetch('/stats')
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    document.getElementById('totalSamples').textContent = data.total_samples;
                    document.getElementById('sessionSamples').textContent = data.session_samples;
                    document.getElementById('gestureCount').textContent = Object.keys(data.gestures).length;
                    document.getElementById('currentLabel').textContent = data.current_label;
                    
                    var recordingDot = document.getElementById('recordingDot');
                    var statusText = document.getElementById('statusText');
                    
                    if (data.recording) {
                        recordingDot.classList.add('active');
                        statusText.textContent = '🔴 ENREGISTREMENT EN COURS';
                    } else {
                        recordingDot.classList.remove('active');
                        statusText.textContent = '⚪ En attente';
                    }
                    
                    if (data.last_data) {
                        var display = document.getElementById('dataDisplay');
                        var line = 'Flex: ' + data.last_data.flex_thumb + '% | ' + data.last_data.flex_index + '% | ' + data.last_data.flex_middle + '%\\n' +
                                   'Gyro: ' + data.last_data.gyro_x + '° | ' + data.last_data.gyro_y + '° | ' + data.last_data.gyro_z + '°\\n' +
                                   'Accel: ' + data.last_data.accel_x + 'g | ' + data.last_data.accel_y + 'g | ' + data.last_data.accel_z + 'g\\n' +
                                   'Label: ' + data.last_data.label + ' | Time: ' + data.last_data.datetime + '\\n' +
                                   '────────────────────────────────────────';
                        display.textContent = line + '\\n' + display.textContent;
                        var lines = display.textContent.split('\\n');
                        display.textContent = lines.slice(0, 50).join('\\n');
                    }
                })
                .catch(function(error) {
                    console.error('Erreur updateStats:', error);
                });
        }
        
        function loadDatasets() {
            fetch('/datasets')
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    var list = document.getElementById('datasetList');
                    list.innerHTML = '';
                    
                    if (data.datasets.length === 0) {
                        list.innerHTML = '<p style="text-align:center;color:#888;">Aucun dataset trouvé</p>';
                        return;
                    }
                    
                    data.datasets.forEach(function(ds) {
                        var item = document.createElement('div');
                        item.className = 'dataset-item';
                        item.innerHTML = '<span>' + ds.filename + '</span>' +
                                         '<span>' + ds.samples + ' échantillons | ' + ds.size_kb + ' KB</span>';
                        list.appendChild(item);
                    });
                })
                .catch(function(error) {
                    console.error('Erreur loadDatasets:', error);
                });
        }
        
        console.log('🚀 Interface Smart Glove chargée');
        updateInterval = setInterval(updateStats, 1000);
        setInterval(loadDatasets, 5000);
        updateStats();
        loadDatasets();
    </script>
</body>
</html>
"""

# ========== DÉMARRAGE DU SERVEUR ==========
if __name__ == '__main__':
    print("\n" + "="*50)
    print("  SMART GLOVE - SERVEUR FLASK")
    print("="*50)
    print("\n📁 Dossier datasets:", os.path.abspath(DATASET_FOLDER))
    print("\n🌐 Interface web: http://localhost:5000")
    print("🌐 Adresse réseau: http://192.168.1.154:5000")
    print("\n⚠️ IMPORTANT: Modifie l'IP dans le code ESP32!")
    print("   Ton adresse IP actuelle: 192.168.1.154")
    print("   Utilise cette adresse dans ton code ESP32\n")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)