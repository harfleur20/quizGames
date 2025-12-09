// audio-manager.js - Gestionnaire audio simplifié
class AudioManager {
    constructor() {
        this.enabled = localStorage.getItem('quizAudioEnabled') !== 'false';
        this.sounds = {};
    }
    
    init() {
        // Créer les 5 éléments audio
        this.sounds = {
            'gameStart': this.createAudio('audio/the-news-intro-logo-154238.mp3'),
            'correct': this.createAudio('audio/correct.mp3'),
            'wrong': this.createAudio('audio/wrong.mp3'),
            'milestone': this.createAudio('audio/victory.mp3'),
            'gameOver': this.createAudio('audio/game-over.mp3')
        };
        
        console.log('🎵 Audio Manager initialisé - Son:', this.enabled ? 'ACTIF' : 'INACTIF');
    }
    
    createAudio(src) {
        const audio = new Audio(src);
        audio.volume = 0.7; // Volume à 70%
        audio.preload = 'auto';
        return audio;
    }
    
    playSound(name) {
        if (!this.enabled || !this.sounds[name]) return false;
        
        try {
            const sound = this.sounds[name];
            sound.currentTime = 0; // Rejouer depuis le début
            sound.play().catch(e => {
                // Silencieux si le navigateur bloque
                if (!e.message.includes('user gesture')) {
                    console.warn(`⚠️ Audio ${name}:`, e.message);
                }
            });
            return true;
        } catch (error) {
            console.warn(`⚠️ Erreur lecture ${name}:`, error);
            return false;
        }
    }
    
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('quizAudioEnabled', this.enabled);
        console.log('🎵 Audio:', this.enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ');
        return this.enabled;
    }
    
    isEnabled() {
        return this.enabled;
    }
}

// Créer une instance globale
window.audioManager = new AudioManager();