#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>


const char* ssid = "Tp-link";
const char* password = "ABDOHZ@2018";


const char* serverUrl = "http://192.168.1.100:5000/record";

#define FLEX_THUMB 33
#define FLEX_INDEX 32
#define FLEX_MIDDLE 35

#define I2C_SDA 21
#define I2C_SCL 22


#define NUM_SAMPLES 5
#define CALIBRATION_TIME 3000
#define ADC_RESOLUTION 12
#define SEND_INTERVAL 500
#define MIN_VALID_VALUE 500
#define DISCONNECTED_THRESHOLD 4000

struct FlexSensor {
  int pin;
  String name;
  int rawValue;
  int minValue = 4095;
  int maxValue = 0;
  float percentage;
  int samples[NUM_SAMPLES] = {0};
  int sampleIndex = 0;
  bool connected = false;
  bool inverted = false;
};

FlexSensor thumb = {FLEX_THUMB, "Pouce"};
FlexSensor indexFinger = {FLEX_INDEX, "Index"};
FlexSensor middle = {FLEX_MIDDLE, "Majeur"};

Adafruit_MPU6050 mpu;
struct MPUData {
  float gyro_x = 0;
  float gyro_y = 0;
  float gyro_z = 0;
  float accel_x = 0;
  float accel_y = 0;
  float accel_z = 0;
  bool connected = false;
} mpuData;

HTTPClient http;
bool isCalibrated = false;
unsigned long lastSendTime = 0;
unsigned long lastUpdateTime = 0;
int successCount = 0;
int errorCount = 0;


bool initMPU() {
  Wire.begin(I2C_SDA, I2C_SCL);
  
  Serial.println("\n🔍 Initialisation MPU6050...");
  
  if (!mpu.begin()) {
    Serial.println("❌ MPU6050 non détecté!");
    return false;
  }
  
  Serial.println("✅ MPU6050 détecté!");
  
  
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  
  Serial.println("✅ MPU6050 configuré:");
  Serial.println("   - Accéléromètre: ±8g");
  Serial.println("   - Gyroscope: ±500°/s");
  Serial.println("   - Filtre: 21Hz");
  
  return true;
}

void readMPU() {
  if (!mpuData.connected) return;
  
  sensors_event_t accel, gyro, temp;
  mpu.getEvent(&accel, &gyro, &temp);
  
  
  mpuData.gyro_x = gyro.gyro.x * 57.2958; // rad/s -> deg/s
  mpuData.gyro_y = gyro.gyro.y * 57.2958;
  mpuData.gyro_z = gyro.gyro.z * 57.2958;
  
  // Accéléromètre (g)
  mpuData.accel_x = accel.acceleration.x / 9.81;
  mpuData.accel_y = accel.acceleration.y / 9.81;
  mpuData.accel_z = accel.acceleration.z / 9.81;
}

// ========== FONCTIONS FLEX SENSORS ==========

bool isFlexConnected(int pin) {
  long sum = 0;
  int valid = 0;
  
  for (int i = 0; i < 5; i++) {
    int value = analogRead(pin);
    Serial.printf("Test pin %d: valeur %d\n", pin, value);
    
    if (value > MIN_VALID_VALUE && value < DISCONNECTED_THRESHOLD) {
      sum += value;
      valid++;
    }
    delay(10);
  }
  
  bool result = (valid >= 3);
  Serial.printf("Pin %d connecté: %s (%d lectures valides)\n", pin, result ? "OUI" : "NON", valid);
  return result;
}

int readFilteredValue(FlexSensor &sensor) {
  int newValue = analogRead(sensor.pin);
  sensor.samples[sensor.sampleIndex] = newValue;
  sensor.sampleIndex = (sensor.sampleIndex + 1) % NUM_SAMPLES;
  
  int sorted[NUM_SAMPLES];
  memcpy(sorted, sensor.samples, sizeof(sorted));
  
  for (int i = 0; i < NUM_SAMPLES - 1; i++) {
    for (int j = i + 1; j < NUM_SAMPLES; j++) {
      if (sorted[i] > sorted[j]) {
        int temp = sorted[i];
        sorted[i] = sorted[j];
        sorted[j] = temp;
      }
    }
  }
  return sorted[NUM_SAMPLES / 2];
}

void calibrate() {
  Serial.println("\n🔧 CALIBRATION EN COURS... Bouge tes doigts lentement (3s)");
  
  unsigned long start = millis();
  
  while (millis() - start < CALIBRATION_TIME) {
    if (thumb.connected) {
      int val = analogRead(FLEX_THUMB);
      thumb.minValue = min(thumb.minValue, val);
      thumb.maxValue = max(thumb.maxValue, val);
    }
    
    if (indexFinger.connected) {
      int val = analogRead(FLEX_INDEX);
      indexFinger.minValue = min(indexFinger.minValue, val);
      indexFinger.maxValue = max(indexFinger.maxValue, val);
    }
    
    if (middle.connected) {
      int val = analogRead(FLEX_MIDDLE);
      middle.minValue = min(middle.minValue, val);
      middle.maxValue = max(middle.maxValue, val);
    }
    
    delay(10);
  }
  
  // Détecte inversion
  if (thumb.connected && thumb.minValue > thumb.maxValue) {
    int temp = thumb.minValue;
    thumb.minValue = thumb.maxValue;
    thumb.maxValue = temp;
    thumb.inverted = true;
  }
  
  if (indexFinger.connected && indexFinger.minValue > indexFinger.maxValue) {
    int temp = indexFinger.minValue;
    indexFinger.minValue = indexFinger.maxValue;
    indexFinger.maxValue = temp;
    indexFinger.inverted = true;
  }
  
  if (middle.connected && middle.minValue > middle.maxValue) {
    int temp = middle.minValue;
    middle.minValue = middle.maxValue;
    middle.maxValue = temp;
    middle.inverted = true;
  }
  
  printCalibrationValues();
  isCalibrated = true;
}

void printCalibrationValues() {
  Serial.println("\n✅ Calibration terminée:");
  Serial.printf("Pouce (GPIO%d): Min %d | Max %d %s\n", 
    FLEX_THUMB, thumb.minValue, thumb.maxValue, 
    thumb.inverted ? "(Inversé)" : "");
  Serial.printf("Index (GPIO%d): Min %d | Max %d %s\n", 
    FLEX_INDEX, indexFinger.minValue, indexFinger.maxValue, 
    indexFinger.inverted ? "(Inversé)" : "");
  Serial.printf("Majeur (GPIO%d): Min %d | Max %d %s\n", 
    FLEX_MIDDLE, middle.minValue, middle.maxValue, 
    middle.inverted ? "(Inversé)" : "");
}

float calculatePercentage(FlexSensor &sensor) {
  if (!sensor.connected) return 0;
  
  int range = sensor.maxValue - sensor.minValue;
  if (range == 0) return 0;
  
  int adjusted = sensor.rawValue - sensor.minValue;
  float percent = (adjusted * 100.0) / range;
  
  return constrain(percent, 0, 100);
}

void printBar(String label, float percent, int raw, bool connected) {
  int bar = (int)(percent / 2);
  Serial.print(label + " [");
  
  if (!connected) {
    Serial.print("❌ DÉCONNECTÉ");
  } else {
    for (int i = 0; i < 50; i++) {
      Serial.print(i < bar ? "█" : "░");
    }
  }
  
  Serial.printf("] %3d%% (RAW: %4d)\n", (int)percent, raw);
}

void sendDataToServer() {
  if (WiFi.status() != WL_CONNECTED) return;
  
  // ========== CRÉATION DU JSON AVEC MPU ==========
  StaticJsonDocument<512> doc;
  doc["timestamp"] = millis();
  
  // Flex sensors
  doc["flex_thumb"] = round(thumb.percentage);
  doc["flex_index"] = round(indexFinger.percentage);
  doc["flex_middle"] = round(middle.percentage);
  
  // MPU6050 - Gyroscope (arrondis à 2 décimales)
  doc["gyro_x"] = round(mpuData.gyro_x * 100) / 100.0;
  doc["gyro_y"] = round(mpuData.gyro_y * 100) / 100.0;
  doc["gyro_z"] = round(mpuData.gyro_z * 100) / 100.0;
  
  // MPU6050 - Accéléromètre (arrondis à 2 décimales)
  doc["accel_x"] = round(mpuData.accel_x * 100) / 100.0;
  doc["accel_y"] = round(mpuData.accel_y * 100) / 100.0;
  doc["accel_z"] = round(mpuData.accel_z * 100) / 100.0;
  
  String json;
  serializeJson(doc, json);
  
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  int code = http.POST(json);
  
  if (code == 200) {
    successCount++;
  } else {
    errorCount++;
    Serial.printf("❌ Erreur envoi: %d\n", code);
  }
  
  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n🚀 Démarrage ESP32 Smart Glove");
  
  // Configuration ADC
  analogReadResolution(ADC_RESOLUTION);
  analogSetAttenuation(ADC_11db);
  
  pinMode(FLEX_THUMB, INPUT);
  pinMode(FLEX_INDEX, INPUT);
  pinMode(FLEX_MIDDLE, INPUT);
  
  // Test capteurs flex
  Serial.println("\n🔍 Test capteurs flex...");
  thumb.connected = isFlexConnected(FLEX_THUMB);
  indexFinger.connected = isFlexConnected(FLEX_INDEX);
  middle.connected = isFlexConnected(FLEX_MIDDLE);
  
  Serial.printf("\n📊 Résumé Flex:\n");
  Serial.printf("- Pouce (GPIO33): %s\n", thumb.connected ? "✅ OK" : "❌ ABSENT");
  Serial.printf("- Index (GPIO32): %s\n", indexFinger.connected ? "✅ OK" : "❌ ABSENT");
  Serial.printf("- Majeur (GPIO35): %s\n", middle.connected ? "✅ OK" : "❌ ABSENT");
  
  // Initialisation MPU6050
  mpuData.connected = initMPU();
  
  // Connexion WiFi
  Serial.println("\n📡 Connexion WiFi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\n✅ WiFi connecté!");
  Serial.printf("IP: %s\n", WiFi.localIP().toString().c_str());
  
  // Calibration flex
  calibrate();
  
  Serial.println("\n✅ Système prêt!");
}

void loop() {
  unsigned long now = millis();
  
  // Lecture flex sensors
  if (thumb.connected) {
    thumb.rawValue = readFilteredValue(thumb);
    thumb.percentage = calculatePercentage(thumb);
  }
  
  if (indexFinger.connected) {
    indexFinger.rawValue = readFilteredValue(indexFinger);
    indexFinger.percentage = calculatePercentage(indexFinger);
  }
  
  if (middle.connected) {
    middle.rawValue = readFilteredValue(middle);
    middle.percentage = calculatePercentage(middle);
  }
  
  // Lecture MPU6050
  readMPU();
  
  // Affichage console
  if (now - lastUpdateTime >= 100) {
    lastUpdateTime = now;
    Serial.println("\033[2J\033[H"); // Clear screen
    
    Serial.println("========== SMART GLOVE ==========");
    printBar("Pouce ", thumb.percentage, thumb.rawValue, thumb.connected);
    printBar("Index ", indexFinger.percentage, indexFinger.rawValue, indexFinger.connected);
    printBar("Majeur", middle.percentage, middle.rawValue, middle.connected);
    
    if (mpuData.connected) {
      Serial.println("\n--- MPU6050 ---");
      Serial.printf("Gyro: X=%.2f° Y=%.2f° Z=%.2f°\n", 
        mpuData.gyro_x, mpuData.gyro_y, mpuData.gyro_z);
      Serial.printf("Accel: X=%.2fg Y=%.2fg Z=%.2fg\n", 
        mpuData.accel_x, mpuData.accel_y, mpuData.accel_z);
    } else {
      Serial.println("\n❌ MPU6050 déconnecté");
    }
    
    Serial.printf("\n📤 Envois: %d | ❌ Erreurs: %d\n", successCount, errorCount);
    Serial.println("=================================");
  }
  
  // Envoi au serveur
  if (now - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = now;
    sendDataToServer();
  }
  
  // Recalibration (touche 'r')
  if (Serial.available() && Serial.read() == 'r') {
    calibrate();
  }
}