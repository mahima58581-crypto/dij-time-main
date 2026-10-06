// High-Fidelity Web Audio API Sound Synthesizer & Voice Announcements
// Zero external dependencies, 100% reliable offline, crystal clear audio

export interface SoundSettings {
  isMuted: boolean;
  volume: number; // 0 to 1
  voiceEnabled: boolean;
  alert10MinEnabled: boolean;
  alert5MinEnabled: boolean;
  alertTimeUpEnabled: boolean;
  checkoutSoundEnabled: boolean;
  reservationSoundEnabled: boolean;
  sessionStartSoundEnabled: boolean;
  snackSoundEnabled: boolean;
}

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  isMuted: false,
  volume: 0.8,
  voiceEnabled: true,
  alert10MinEnabled: true,
  alert5MinEnabled: true,
  alertTimeUpEnabled: true,
  checkoutSoundEnabled: true,
  reservationSoundEnabled: true,
  sessionStartSoundEnabled: true,
  snackSoundEnabled: true,
};

// Singleton AudioContext
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Load saved sound settings
export function loadSoundSettings(): SoundSettings {
  try {
    const saved = localStorage.getItem('dij_tiem_sound_settings_v1');
    if (saved) {
      return { ...DEFAULT_SOUND_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Error loading sound settings:', e);
  }
  return DEFAULT_SOUND_SETTINGS;
}

export function saveSoundSettings(settings: SoundSettings): void {
  try {
    localStorage.setItem('dij_tiem_sound_settings_v1', JSON.stringify(settings));
  } catch (e) {
    console.warn('Error saving sound settings:', e);
  }
}

// Current memory settings
let currentSettings: SoundSettings = loadSoundSettings();

export function updateGlobalSoundSettings(newSettings: Partial<SoundSettings>): SoundSettings {
  currentSettings = { ...currentSettings, ...newSettings };
  saveSoundSettings(currentSettings);
  return currentSettings;
}

export function getGlobalSoundSettings(): SoundSettings {
  return currentSettings;
}

// Helper to play synthesized tone bursts
function playToneBurst(
  frequencies: number[],
  durations: number[],
  type: OscillatorType = 'sine',
  gainPeak = 0.25
) {
  if (currentSettings.isMuted || currentSettings.volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    let startTime = ctx.currentTime;

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      const duration = durations[index] || 0.12;
      const effectiveGain = gainPeak * currentSettings.volume;

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(effectiveGain, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);

      startTime += duration * 0.85; // Slight smooth overlap
    });
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * 1. 10 Minutes Warning Sound
 * Gentle high-low double chime indicating 10 mins remaining
 */
export function play10MinWarningSound() {
  if (!currentSettings.alert10MinEnabled) return;
  // Notes: G5 (784Hz) -> E5 (659Hz)
  playToneBurst([784, 659], [0.18, 0.28], 'triangle', 0.28);
}

/**
 * 2. 5 Minutes Warning Sound
 * Distinct triple urgent chime (A5 -> D6 -> A5)
 */
export function play5MinWarningSound() {
  if (!currentSettings.alert5MinEnabled) return;
  // Notes: A5 (880Hz) -> D6 (1174Hz) -> A5 (880Hz)
  playToneBurst([880, 1174, 880], [0.15, 0.18, 0.3], 'sine', 0.32);
}

/**
 * 3. Time Over Alarm Sound
 * High-tech alarm pulse (3 rapid clear beeps)
 */
export function playTimeOverAlarmSound() {
  if (!currentSettings.alertTimeUpEnabled) return;
  if (currentSettings.isMuted || currentSettings.volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const beepTimes = [0, 0.22, 0.44];
    beepTimes.forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(987.77, now + delay); // B5

      const effGain = 0.22 * currentSettings.volume;
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(effGain, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.16);

      // Lowpass filter for smooth, professional arcade sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now + delay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.16);
    });
  } catch (e) {
    console.warn(e);
  }
}

/**
 * 4. Checkout and Invoice Paid Chime
 * Cash register triumphant ascending chord (C5 -> E5 -> G5 -> C6)
 */
export function playCheckoutSound() {
  if (!currentSettings.checkoutSoundEnabled) return;
  // Notes: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
  playToneBurst([523.25, 659.25, 784.0, 1046.5], [0.12, 0.12, 0.14, 0.4], 'triangle', 0.3);
}

/**
 * 5. Reservation / Next In Queue Call Chime
 * Soft airport/bell chime (F5 -> A5 -> C6)
 */
export function playReservationAlertSound() {
  if (!currentSettings.reservationSoundEnabled) return;
  // Notes: F5 (698Hz) -> A5 (880Hz) -> C6 (1046Hz)
  playToneBurst([698.46, 880.0, 1046.5], [0.18, 0.18, 0.35], 'sine', 0.3);
}

/**
 * 6. Session Started Power-up Sound
 * Energetic ascending retro chime
 */
export function playSessionStartSound() {
  if (!currentSettings.sessionStartSoundEnabled) return;
  playToneBurst([440, 554.37, 659.25, 880], [0.08, 0.08, 0.1, 0.25], 'sine', 0.25);
}

/**
 * 7. Snack & Buffet Added Chime
 * Crisp double click ding
 */
export function playSnackSound() {
  if (!currentSettings.snackSoundEnabled) return;
  playToneBurst([880, 1318.51], [0.09, 0.18], 'sine', 0.22);
}

/**
 * 8. Wallet Recharged Coin Chime
 * Mario-style dual coin ring (B5 -> E6)
 */
export function playCoinSound() {
  playToneBurst([987.77, 1318.51], [0.1, 0.25], 'sine', 0.28);
}

/**
 * 9. Speech Synthesis Voice Announcement
 * Speaks Arabic or Persian announcements if browser supports it
 */
export function speakVoiceAlert(text: string) {
  if (currentSettings.isMuted || !currentSettings.voiceEnabled) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Cancel any lingering utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = Math.min(1, currentSettings.volume * 1.2);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.lang = 'ar'; // اعلان‌های صوتی به زبان عربی

    // Prefer an Arabic voice, then Persian, else default
    const voices = window.speechSynthesis.getVoices();
    const targetVoice =
      voices.find((v) => v.lang.startsWith('ar')) ||
      voices.find((v) => v.lang.startsWith('fa')) ||
      voices[0];

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

// User-interaction unlocker
export function unlockAudioContext() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}
