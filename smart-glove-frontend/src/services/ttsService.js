// src/services/ttsService.js

class TTSService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.selectedVoice = null;
    this.isEnabled = true;
    this.lastSpokenLabel = null;
    this.lastSpokenTime = 0;
    this.minTimeBetweenSpeech = 2000;
    
    this.messageMode = 'short';
    this.voiceGender = 'all';
    this.availableVoices = { male: [], female: [] };
    
    this.initVoices();
  }

  /**
   * Mapping manuel des voix connues par genre
   */
  getVoiceGenderMap() {
    return {
      // Voix françaises
      'Thomas': 'male',
      'Nicolas': 'male',
      'Daniel': 'male',
      'Amélie': 'female',
      'Virginie': 'female',
      'Audrey': 'female',
      
      // Voix Google (Chrome/Android)
      'Google français': 'female',
      'Google Français': 'female',
      'Google US English Male': 'male',
      'Google US English Female': 'female',
      'Google UK English Male': 'male',
      'Google UK English Female': 'female',
      
      // Voix Microsoft (Edge/Windows)
      'Microsoft David': 'male',
      'Microsoft Mark': 'male',
      'Microsoft Zira': 'female',
      'Microsoft Julie': 'female',
      'Microsoft Paul': 'male',
      'Microsoft Hortense': 'female',
      'Microsoft Claude': 'male',
      'Microsoft Eloise': 'female',
      
      // Voix Apple (Safari/macOS/iOS)
      'Thomas': 'male',
      'Nicolas': 'male',
      'Daniel': 'male',
      'Audrey': 'female',
      'Amélie': 'female',
      'Virginie': 'female',
      'Karen': 'female',
      'Samantha': 'female',
      'Alex': 'male',
      'Fred': 'male',
      
      // Voix supplémentaires communes
      'Yannick': 'male',
      'Alain': 'male',
      'Bruno': 'male',
      'Céline': 'female',
      'Marie': 'female',
      'Chantal': 'female'
    };
  }

  /**
   * Déterminer le genre d'une voix
   */
  detectVoiceGender(voice) {
    const voiceMap = this.getVoiceGenderMap();
    
    // 1. Chercher une correspondance exacte dans le mapping
    for (const [name, gender] of Object.entries(voiceMap)) {
      if (voice.name.includes(name)) {
        return gender;
      }
    }
    
    // 2. Chercher par mots-clés dans le nom
    const nameLower = voice.name.toLowerCase();
    
    const maleIndicators = [
      'male', 'man', 'homme', 'boy', 'guy',
      'masculin', 'masculino', 'maschile',
      'thomas', 'nicolas', 'daniel', 'eric', 'paul',
      'david', 'mark', 'alex', 'fred', 'bruno'
    ];
    
    const femaleIndicators = [
      'female', 'woman', 'femme', 'girl', 'lady',
      'féminin', 'feminino', 'femminile',
      'amelie', 'amélie', 'celine', 'céline', 'marie',
      'julie', 'audrey', 'virginie', 'zira', 'karen',
      'samantha', 'sara', 'sarah', 'alice', 'emma'
    ];
    
    // Vérifier les indicateurs masculins
    for (const indicator of maleIndicators) {
      if (nameLower.includes(indicator)) {
        return 'male';
      }
    }
    
    // Vérifier les indicateurs féminins
    for (const indicator of femaleIndicators) {
      if (nameLower.includes(indicator)) {
        return 'female';
      }
    }
    
    // 3. Si aucune correspondance, utiliser des heuristiques
    // Les voix se terminant par 'a' sont souvent féminines
    if (voice.name.endsWith('a')) {
      return 'female';
    }
    
    // Par défaut, considérer comme neutre/féminin
    return 'female';
  }

  /**
   * Initialiser et catégoriser les voix disponibles
   */
  initVoices() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      
      this.availableVoices.male = [];
      this.availableVoices.female = [];
      
      voices.forEach(voice => {
        // Filtrer les voix françaises et anglaises
        if (voice.lang.startsWith('fr-') || voice.lang.startsWith('en-')) {
          const gender = this.detectVoiceGender(voice);
          
          if (gender === 'male') {
            this.availableVoices.male.push(voice);
          } else {
            this.availableVoices.female.push(voice);
          }
        }
      });
      
      this.updateVoiceSelection();
      
      console.log('🔊 Voix disponibles:');
      console.log('   Féminines:', this.availableVoices.female.map(v => v.name));
      console.log('   Masculines:', this.availableVoices.male.map(v => v.name));
      console.log('   Voix sélectionnée:', this.selectedVoice?.name || 'Défaut');
    };

    if (this.synth.getVoices().length > 0) {
      loadVoices();
    }
    
    this.synth.onvoiceschanged = loadVoices;
  }

  /**
   * Mettre à jour la sélection de voix selon le genre choisi
   */
  updateVoiceSelection() {
    let voicePool = [];
    
    if (this.voiceGender === 'female') {
      voicePool = this.availableVoices.female;
    } else if (this.voiceGender === 'male') {
      voicePool = this.availableVoices.male;
    } else {
      voicePool = [...this.availableVoices.female, ...this.availableVoices.male];
    }
    
    // Priorité aux voix françaises
    this.selectedVoice = voicePool.find(v => v.lang.startsWith('fr-')) ||
                         voicePool.find(v => v.lang.startsWith('en-')) ||
                         voicePool[0] ||
                         this.synth.getVoices()[0];
    
    console.log('🔊 Voix sélectionnée:', this.selectedVoice?.name, '(' + this.voiceGender + ')');
  }

  /**
   * Obtenir le message selon le mode
   */
  getGestureMessage(label) {
    if (this.messageMode === 'short') {
      const shortMessages = {
        'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'L': 'L',
        'merci': 'Merci', 'ok': 'OK', 'stop': 'Stop',
      };
      return shortMessages[label] || label;
    } else {
      const detailedMessages = {
        'A': 'Lettre A détectée', 'B': 'Lettre B détectée', 'C': 'Lettre C détectée',
        'D': 'Lettre D détectée', 'E': 'Lettre E détectée', 'L': 'Lettre L détectée',
        'merci': 'Geste merci détecté', 'ok': 'Geste OK détecté', 'stop': 'Geste stop détecté',
      };
      return detailedMessages[label] || `${label}`;
    }
  }

  canSpeak(label) {
    const now = Date.now();
    const timeSinceLastSpeech = now - this.lastSpokenTime;
    
    if (label === this.lastSpokenLabel && timeSinceLastSpeech < this.minTimeBetweenSpeech) {
      return false;
    }
    
    return true;
  }

  speakGesture(label, confidence = 0) {
    if (!this.isEnabled || !this.canSpeak(label)) {
      return;
    }

    this.synth.cancel();

    const message = this.getGestureMessage(label);
    const utterance = new SpeechSynthesisUtterance(message);

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      console.log(`🔊 Annonce: "${message}" (${this.selectedVoice?.name})`);
    };

    utterance.onerror = (event) => {
      console.error('❌ Erreur TTS:', event.error);
    };

    this.synth.speak(utterance);

    this.lastSpokenLabel = label;
    this.lastSpokenTime = Date.now();
  }

  setMessageMode(mode) {
    if (mode === 'short' || mode === 'detailed') {
      this.messageMode = mode;
      console.log(`📝 Mode message: ${mode === 'short' ? 'Court' : 'Détaillé'}`);
    }
  }

  setVoiceGender(gender) {
    if (gender === 'male' || gender === 'female' || gender === 'all') {
      this.voiceGender = gender;
      this.updateVoiceSelection();
      console.log(`👤 Genre de voix: ${gender}`);
    }
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.synth.cancel();
    }
    console.log(`🔊 TTS ${enabled ? 'activé' : 'désactivé'}`);
  }

  stop() {
    this.synth.cancel();
  }

  test() {
    const testMessage = this.messageMode === 'short' ? 'A' : 'Test de synthèse vocale';
    const utterance = new SpeechSynthesisUtterance(testMessage);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    this.synth.speak(utterance);
    console.log('🔊 Test TTS:', testMessage, '- Voix:', this.selectedVoice?.name);
  }

  getConfig() {
    return {
      enabled: this.isEnabled,
      messageMode: this.messageMode,
      voiceGender: this.voiceGender,
      selectedVoice: this.selectedVoice?.name || 'Défaut',
      availableVoices: {
        male: this.availableVoices.male.length,
        female: this.availableVoices.female.length
      }
    };
  }

  /**
   * Obtenir la liste des voix disponibles avec leurs genres détectés
   */
  listVoices() {
    const voices = this.synth.getVoices();
    return voices
      .filter(v => v.lang.startsWith('fr-') || v.lang.startsWith('en-'))
      .map(v => ({
        name: v.name,
        lang: v.lang,
        gender: this.detectVoiceGender(v)
      }));
  }
}

const ttsService = new TTSService();
export default ttsService;