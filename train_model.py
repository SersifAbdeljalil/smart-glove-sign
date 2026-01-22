
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os
import glob
import matplotlib.pyplot as plt
import seaborn as sns

# ========== CONFIGURATION ==========
DATASET_FOLDER = "datasets"
MODEL_FILE = "glove_model.pkl"
SCALER_FILE = "scaler.pkl"
LABEL_ENCODER_FILE = "label_encoder.pkl"

# ========== ÉTAPE 1: Charger et fusionner tous les datasets ==========
print("Chargement des datasets...")

csv_files = glob.glob(os.path.join(DATASET_FOLDER, "*.csv"))

if not csv_files:
    print("ERREUR: Aucun fichier CSV trouvé dans", DATASET_FOLDER)
    exit(1)

print(f"{len(csv_files)} fichiers trouvés:")
for f in csv_files:
    print(f"   - {os.path.basename(f)}")

# Fusionner tous les CSV
dataframes = []
for file in csv_files:
    try:
        df = pd.read_csv(file)
        dataframes.append(df)
        print(f"{os.path.basename(file)}: {len(df)} échantillons")
    except Exception as e:
        print(f"Erreur lecture {file}: {e}")

if not dataframes:
    print("ERREUR: Impossible de charger les datasets")
    exit(1)

data = pd.concat(dataframes, ignore_index=True)
print(f"\nDataset fusionné: {len(data)} échantillons")

# ========== ÉTAPE 2: Explorer les données ==========
print("\n Aperçu des données:")
print(data.head())

print("\n Colonnes disponibles:")
print(data.columns.tolist())

print("\n Distribution des labels:")
print(data['label'].value_counts())

# Vérifier les valeurs manquantes
print("\n Valeurs manquantes:")
print(data.isnull().sum())

# Supprimer les lignes avec valeurs manquantes
data = data.dropna()
print(f"Après nettoyage: {len(data)} échantillons")

# ========== ÉTAPE 3: Préparer les données ==========
print("\n Préparation des données...")

# Colonnes de features (9 capteurs)
feature_columns = [
    'flex_thumb', 'flex_index', 'flex_middle',
    'gyro_x', 'gyro_y', 'gyro_z',
    'accel_x', 'accel_y', 'accel_z'
]

# Vérifier que toutes les colonnes existent
missing_cols = [col for col in feature_columns if col not in data.columns]
if missing_cols:
    print(f"ERREUR: Colonnes manquantes: {missing_cols}")
    exit(1)

# Séparer features (X) et labels (y)
X = data[feature_columns].values
y = data['label'].values

print(f"Features (X): {X.shape}")
print(f"Labels (y): {y.shape}")

# Encoder les labels (A, B, OK... → 0, 1, 2...)
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print(f"\n Labels encodés:")
for i, label in enumerate(label_encoder.classes_):
    print(f"   {label} → {i}")

# Split train/test (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"\n Train: {len(X_train)} échantillons")
print(f" Test: {len(X_test)} échantillons")

# Normalisation des données
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("Normalisation effectuée")

# ========== ÉTAPE 4: Entraîner le modèle ==========
print("\n Entraînement du modèle Random Forest...")

model = RandomForestClassifier(
    n_estimators=100,      # 100 arbres
    max_depth=10,          # Profondeur max
    random_state=42,
    n_jobs=-1              # Utilise tous les CPU
)

model.fit(X_train_scaled, y_train)
print(" Modèle entraîné!")

# ========== ÉTAPE 5: Évaluer le modèle ==========
print("\n Évaluation du modèle...")

y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n Précision globale: {accuracy * 100:.2f}%")

print("\n Rapport de classification:")
print(classification_report(
    y_test, y_pred, 
    target_names=label_encoder.classes_
))

# Matrice de confusion
print("\n Matrice de confusion:")
cm = confusion_matrix(y_test, y_pred)
print(cm)

# Visualiser la matrice de confusion
plt.figure(figsize=(10, 8))
sns.heatmap(
    cm, 
    annot=True, 
    fmt='d', 
    cmap='Blues',
    xticklabels=label_encoder.classes_,
    yticklabels=label_encoder.classes_
)
plt.title('Matrice de Confusion')
plt.ylabel('Vraie classe')
plt.xlabel('Classe prédite')
plt.tight_layout()
plt.savefig('confusion_matrix.png')
print(" Matrice sauvegardée: confusion_matrix.png")

# Importance des features
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n Importance des capteurs:")
print(feature_importance)

plt.figure(figsize=(10, 6))
plt.barh(feature_importance['feature'], feature_importance['importance'])
plt.xlabel('Importance')
plt.title('Importance des Capteurs')
plt.tight_layout()
plt.savefig('feature_importance.png')
print(" Graphique sauvegardé: feature_importance.png")

# ========== ÉTAPE 6: Sauvegarder le modèle ==========
print("\n Sauvegarde du modèle...")

joblib.dump(model, MODEL_FILE)
joblib.dump(scaler, SCALER_FILE)
joblib.dump(label_encoder, LABEL_ENCODER_FILE)

print(f" Modèle sauvegardé: {MODEL_FILE}")
print(f" Scaler sauvegardé: {SCALER_FILE}")
print(f" Label encoder sauvegardé: {LABEL_ENCODER_FILE}")

# ========== ÉTAPE 7: Test de prédiction ==========
print("\n Test de prédiction:")

# Prendre un échantillon aléatoire
sample_idx = np.random.randint(0, len(X_test))
sample = X_test_scaled[sample_idx].reshape(1, -1)
true_label = label_encoder.inverse_transform([y_test[sample_idx]])[0]
pred_label = label_encoder.inverse_transform(model.predict(sample))[0]

print(f"Échantillon test:")
print(f"   Vraie classe: {true_label}")
print(f"   Prédiction: {pred_label}")
print(f"   Correct: {'' if true_label == pred_label else ' (Incorrect)'}")

# Probabilités
proba = model.predict_proba(sample)[0]
print(f"\nProbabilités:")
for i, prob in enumerate(proba):
    print(f"   {label_encoder.classes_[i]}: {prob * 100:.2f}%")

print("\n" + "="*50)
print(" ENTRAÎNEMENT TERMINÉ!")
print("="*50)
print("\nFichiers créés:")
print(f"   • {MODEL_FILE}")
print(f"   • {SCALER_FILE}")
print(f"   • {LABEL_ENCODER_FILE}")
