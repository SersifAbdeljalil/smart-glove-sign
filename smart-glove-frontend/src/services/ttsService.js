// src/services/ttsService.js

class TTSService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.selectedVoice = null;
    this.isEnabled = true;
    this.lastSpokenLabel = null;
    this.lastSpokenTime = 0;
    this.minTimeBetweenSpeech = 2000; // 2 secondes minimum entre chaque annonce
    
    // Options de configuration
    this.messageMode = 'short'; // 'short' ou 'detailed'
    this.voiceGender = 'all'; // 'male', 'female', ou 'all'
    this.availableVoices = { male: [], female: [] };
    
    // Initialiser les voix
    this.initVoices();
  }

  /**
   * Initialiser et catégoriser les voix disponibles
   */
  initVoices() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      
      // Réinitialiser les listes
      this.availableVoices.male = [];
      this.availableVoices.female = [];
      
      // Catégoriser les voix par genre
      voices.forEach(voice => {
        // Voix françaises en priorité, puis anglaises
        if (voice.lang.startsWith('fr-') || voice.lang.startsWith('en-')) {
          // Détection basique du genre par le nom de la voix
          const nameLower = voice.name.toLowerCase();
          
          // Mots-clés pour voix féminines
          const femaleKeywords = ['female', 'woman', 'femme', 'aria', 'jenny', 'sara', 
                                   'sarah', 'amelie', 'celine', 'julie', 'marie', 
                                   'alice', 'emma', 'lea', 'manon', 'sophie'];
          
          // Mots-clés pour voix masculines
          const maleKeywords = ['male', 'man', 'homme', 'guy', 'eric', 'thomas',
                                'nicolas', 'pierre', 'paul', 'jean', 'marc',
                                'antoine', 'laurent', 'david', 'alex'];
          
          const isFemale = femaleKeywords.some(kw => nameLower.includes(kw));
          const isMale = maleKeywords.some(kw => nameLower.includes(kw));
          
          if (isFemale) {
            this.availableVoices.female.push(voice);
          } else if (isMale) {
            this.availableVoices.male.push(voice);
          } else {
            // Si incertain, ajouter aux deux catégories
            this.availableVoices.female.push(voice);
            this.availableVoices.male.push(voice);
          }
        }
      });
      
      // Sélectionner une voix par défaut
      this.updateVoiceSelection();
      
      console.log('🔊 Voix disponibles:');
      console.log('   Féminines:', this.availableVoices.female.length);
      console.log('   Masculines:', this.availableVoices.male.length);
      console.log('   Voix sélectionnée:', this.selectedVoice?.name || 'Défaut');
    };

    // Les voix peuvent être chargées de manière asynchrone
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
      // 'all' - mélanger les deux
      voicePool = [...this.availableVoices.female, ...this.availableVoices.male];
    }
    
    // Sélectionner une voix française en priorité
    this.selectedVoice = voicePool.find(v => v.lang.startsWith('fr-')) ||
                         voicePool.find(v => v.lang.startsWith('en-')) ||
                         voicePool[0] ||
                         this.synth.getVoices()[0];
    
    console.log('🔊 Voix mise à jour:', this.selectedVoice?.name, '(' + this.voiceGender + ')');
  }

  /**
   * Obtenir le message selon le mode (court ou détaillé)
   */
  getGestureMessage(label) {
    if (this.messageMode === 'short') {
      // Mode court : juste le label
      const shortMessages = {
        'A': 'A',
        'B': 'B',
        'C': 'C',
        'D': 'D',
        'E': 'E',
        'L': 'L',
        'merci': 'Merci',
        'ok': 'OK',
        'stop': 'Stop',
      };
      return shortMessages[label] || label;
    } else {
      // Mode détaillé : phrase complète
      const detailedMessages = {
        'A': 'Lettre A détectée',
        'B': 'Lettre B détectée',
        'C': 'Lettre C détectée',
        'D': 'Lettre D détectée',
        'E': 'Lettre E détectée',
        'L': 'Lettre L détectée',
        'merci': 'Geste merci détecté',
        'ok': 'Geste OK détecté',
        'stop': 'Geste stop détecté',
      };
      return detailedMessages[label] || `${label}`;
    }
  }

  /**
   * Vérifier si on peut parler (éviter les répétitions trop rapides)
   */
  canSpeak(label) {
    const now = Date.now();
    const timeSinceLastSpeech = now - this.lastSpokenTime;
    
    // Si c'est le même geste et qu'il s'est passé moins de X secondes, ne pas répéter
    if (label === this.lastSpokenLabel && timeSinceLastSpeech < this.minTimeBetweenSpeech) {
      return false;
    }
    
    return true;
  }

  /**
   * Annoncer un geste détecté
   */
  speakGesture(label, confidence = 0) {
    // Vérifier si TTS est activé
    if (!this.isEnabled) {
      return;
    }

    // Vérifier si on peut parler (éviter spam)
    if (!this.canSpeak(label)) {
      return;
    }

    // Annuler toute parole en cours
    this.synth.cancel();

    // Créer l'énoncé
    const message = this.getGestureMessage(label);
    const utterance = new SpeechSynthesisUtterance(message);

    // Configurer la voix
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Paramètres de la voix
    utterance.rate = 1.0;    // Vitesse normale
    utterance.pitch = 1.0;   // Hauteur normale
    utterance.volume = 1.0;  // Volume maximum

    // Callbacks
    utterance.onstart = () => {
      console.log(`🔊 Annonce: "${message}" (${this.selectedVoice?.name})`);
    };

    utterance.onerror = (event) => {
      console.error('❌ Erreur TTS:', event.error);
    };

    // Parler
    this.synth.speak(utterance);

    // Mettre à jour le tracking
    this.lastSpokenLabel = label;
    this.lastSpokenTime = Date.now();
  }

  /**
   * Changer le mode de message (court/détaillé)
   */
  setMessageMode(mode) {
    if (mode === 'short' || mode === 'detailed') {
      this.messageMode = mode;
      console.log(`📝 Mode message: ${mode === 'short' ? 'Court' : 'Détaillé'}`);
    }
  }

  /**
   * Changer le genre de voix
   */
  setVoiceGender(gender) {
    if (gender === 'male' || gender === 'female' || gender === 'all') {
      this.voiceGender = gender;
      this.updateVoiceSelection();
      console.log(`👤 Genre de voix: ${gender}`);
    }
  }

  /**
   * Activer/Désactiver le TTS
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    
    if (!enabled) {
      this.synth.cancel(); // Arrêter toute parole en cours
    }
    
    console.log(`🔊 TTS ${enabled ? 'activé' : 'désactivé'}`);
  }

  /**
   * Arrêter toute parole en cours
   */
  stop() {
    this.synth.cancel();
  }

  /**
   * Tester le TTS
   */
  test() {
    const testMessage = this.messageMode === 'short' ? 'A' : 'Test de synthèse vocale';
    const utterance = new SpeechSynthesisUtterance(testMessage);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    this.synth.speak(utterance);
    console.log('🔊 Test TTS:', testMessage);
  }

  /**
   * Obtenir les informations de configuration actuelle
   */
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
}

// Exporter une instance unique (singleton)
const ttsService = new TTSService();
export default ttsService;