// Web Audio API Synthesizer for Dalek Caan Chess
// Generates stylized digital and robotic sound effects dynamically with 0 asset overhead

let audioContextInstance: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContextInstance) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContextInstance = new AudioContextClass();
  }
  if (audioContextInstance.state === 'suspended') {
    void audioContextInstance.resume();
  }
  return audioContextInstance;
}

export function initAudioEngine(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    
    // Dummy synth to unlock iOS Web Audio
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.001);

    // Dummy speech utterance to unlock iOS Speech Synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(' ');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
  } catch (error) {
    console.warn('Audio engine initialization failed:', error);
  }
}

export type SynthSoundType = 'move' | 'capture' | 'check' | 'checkmate' | 'victory' | 'blip' | 'alarm';

export function playSynthSound(
  type: SynthSoundType,
  muted: boolean = false,
  volume: number = 0.5
): void {
  if (muted) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Main volume gain node
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.01);
    mainGain.connect(ctx.destination);

    switch (type) {
      case 'move': {
        // Quick glide synthesizer sound
        const oscillator = ctx.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(350, now);
        oscillator.frequency.exponentialRampToValueAtTime(700, now + 0.08);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        oscillator.connect(filter);
        filter.connect(mainGain);

        oscillator.start(now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        oscillator.stop(now + 0.13);
        break;
      }

      case 'capture': {
        // Dalek exterminator ray laser sound (Zap + white noise burst)
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(1200, now);
        oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.25);

        // Ring modulation effect to sound Dalek-like
        const modulator = ctx.createOscillator();
        modulator.type = 'sine';
        modulator.frequency.value = 45; // metallic buzz frequency
        const modGain = ctx.createGain();
        modGain.gain.value = 500;

        // Bandpass sweeps
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1500, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.22);

        modulator.connect(modGain);
        modGain.connect(oscillator.frequency);
        oscillator.connect(filter);
        filter.connect(mainGain);

        modulator.start(now);
        oscillator.start(now);

        mainGain.gain.setValueAtTime(volume * 0.4, now);
        mainGain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.05);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        modulator.stop(now + 0.3);
        oscillator.stop(now + 0.3);
        break;
      }

      case 'check': {
        // Warning dual-tone high-pitched metallic ring
        const oscPrimary = ctx.createOscillator();
        const oscSecondary = ctx.createOscillator();
        oscPrimary.type = 'sine';
        oscSecondary.type = 'sawtooth';

        oscPrimary.frequency.value = 660;
        oscSecondary.frequency.value = 440;

        const filter = ctx.createBiquadFilter();
        filter.type = 'peaking';
        filter.Q.value = 10;
        filter.frequency.value = 550;

        oscPrimary.connect(filter);
        oscSecondary.connect(filter);
        filter.connect(mainGain);

        oscPrimary.start(now);
        oscSecondary.start(now);

        // Rhythmic alarm pulses
        mainGain.gain.setValueAtTime(0, now);
        mainGain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.05);
        mainGain.gain.setValueAtTime(0.01, now + 0.15);
        mainGain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.2);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        oscPrimary.stop(now + 0.5);
        oscSecondary.stop(now + 0.5);
        break;
      }

      case 'checkmate': {
        // Sub-bass sweep and descending metallic dissonance
        const oscillator = ctx.createOscillator();
        const subOscillator = ctx.createOscillator();
        oscillator.type = 'sawtooth';
        subOscillator.type = 'sine';

        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.linearRampToValueAtTime(45, now + 0.8);
        subOscillator.frequency.setValueAtTime(90, now);
        subOscillator.frequency.linearRampToValueAtTime(30, now + 0.9);

        // High frequency static
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 250;

        oscillator.connect(filter);
        subOscillator.connect(filter);
        filter.connect(mainGain);

        oscillator.start(now);
        subOscillator.start(now);

        mainGain.gain.setValueAtTime(volume * 0.6, now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        oscillator.stop(now + 1.3);
        subOscillator.stop(now + 1.3);
        break;
      }

      case 'victory': {
        // Triumphant dynamic robotic arpeggio
        const tempo = 0.08;
        const arpeggioNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
        arpeggioNotes.forEach((freq, idx) => {
          const oscillator = ctx.createOscillator();
          oscillator.type = 'square';
          oscillator.frequency.value = freq;

          const bitGain = ctx.createGain();
          bitGain.gain.setValueAtTime(0, now + idx * tempo);
          bitGain.gain.linearRampToValueAtTime(volume * 0.3, now + idx * tempo + 0.01);
          bitGain.gain.exponentialRampToValueAtTime(0.001, now + idx * tempo + 0.15);

          oscillator.connect(bitGain);
          bitGain.connect(ctx.destination);

          oscillator.start(now + idx * tempo);
          oscillator.stop(now + idx * tempo + 0.16);
        });
        break;
      }

      case 'blip': {
        // Simple robotic UI blip
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.linearRampToValueAtTime(600, now + 0.05);

        oscillator.connect(mainGain);
        oscillator.start(now);
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        oscillator.stop(now + 0.07);
        break;
      }

      case 'alarm': {
        // Pulsing radar-like alarm
        for (let i = 0; i < 3; i++) {
          const pulseStartTime = now + i * 0.12;
          const oscillator = ctx.createOscillator();
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(800 - i * 100, pulseStartTime);
          oscillator.frequency.linearRampToValueAtTime(100, pulseStartTime + 0.1);

          const pulseGain = ctx.createGain();
          pulseGain.gain.setValueAtTime(0, pulseStartTime);
          pulseGain.gain.linearRampToValueAtTime(volume * 0.3, pulseStartTime + 0.01);
          pulseGain.gain.exponentialRampToValueAtTime(0.001, pulseStartTime + 0.11);

          oscillator.connect(pulseGain);
          pulseGain.connect(ctx.destination);

          oscillator.start(pulseStartTime);
          oscillator.stop(pulseStartTime + 0.12);
        }
        break;
      }
    }
  } catch (error) {
    console.warn('Audio context synthesis failed:', error);
  }
}

// Keep track of active audio carrier nodes so they clean up nicely on interrupt
let speechOscillator: OscillatorNode | null = null;
let speechModulator: OscillatorNode | null = null;
let speechModGain: GainNode | null = null;
let speechGainNode: GainNode | null = null;
let celestialOscPrimary: OscillatorNode | null = null;
let celestialOscSecondary: OscillatorNode | null = null;
let celestialGainNode: GainNode | null = null;

export function cleanupSpeechAudio(): void {
  try {
    if (speechOscillator) {
      speechOscillator.stop();
      speechOscillator.disconnect();
      speechOscillator = null;
    }
    if (speechModulator) {
      speechModulator.stop();
      speechModulator.disconnect();
      speechModulator = null;
    }
    if (speechModGain) {
      speechModGain.disconnect();
      speechModGain = null;
    }
    if (speechGainNode) {
      speechGainNode.disconnect();
      speechGainNode = null;
    }
    if (celestialOscPrimary) {
      celestialOscPrimary.stop();
      celestialOscPrimary.disconnect();
      celestialOscPrimary = null;
    }
    if (celestialOscSecondary) {
      celestialOscSecondary.stop();
      celestialOscSecondary.disconnect();
      celestialOscSecondary = null;
    }
    if (celestialGainNode) {
      celestialGainNode.disconnect();
      celestialGainNode = null;
    }
  } catch {
    // Already disconnected or inactive
  }
}

let globalChronosLoadValue = 0;
export function setChronosLoadValue(val: number): void {
  globalChronosLoadValue = val;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  cleanupSpeechAudio();
}

/**
 * Custom Speech Synthesis narrator for Dalek Caan
 * Combines built-in browser Text-To-Speech with a synchronized Web Audio API
 * 30Hz Ring Modulation drone representing Dalek vocal box mechanics.
 */
export function speakDalekText(
  text: string, 
  muted: boolean = false, 
  volume: number = 0.5, 
  onEndCallback?: () => void, 
  chronosLoad: number = 0
): void {
  const activeChronos = chronosLoad || globalChronosLoadValue;
  if (muted || typeof window === 'undefined' || !window.speechSynthesis) {
    onEndCallback?.();
    return;
  }

  try {
    // Cancel any active speech to avoid queues stacking up
    window.speechSynthesis.cancel();
    cleanupSpeechAudio();

    // Sift out bracket descriptors (e.g. [TEMPORAL STATIC]) so they aren't read out loud
    const cleanedText = text
      .replace(/\[.*?\]/g, "")
      .replace(/["'"]/g, "")
      .trim();

    if (!cleanedText) {
      onEndCallback?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.volume = volume;
    
    // Dalek Caan is insane, so high pitch (1.3 to 1.45) with slightly elevated speed sounds incredibly loyal to his Doctor Who personality!
    // Dynamically scale parameters based on interactive Chronos Load!
    const chronosPercentage = activeChronos / 100;
    utterance.pitch = 1.35 + (chronosPercentage * 0.45); // ranges up to 1.80
    utterance.rate = 1.0 + (chronosPercentage * 0.5);    // ranges up to 1.50

    // Locate preferred British voice if available (English accents are ideal for Daleks)
    const availableVoices = window.speechSynthesis.getVoices();
    const ukVoice = availableVoices.find(v => v.lang.includes('GB') || v.lang.includes('en-GB') || v.name.toLowerCase().includes('google uk') || v.name.toLowerCase().includes('british'));
    const englishVoice = availableVoices.find(v => v.lang.startsWith('en'));
    
    if (ukVoice) {
      utterance.voice = ukVoice;
    } else if (englishVoice) {
      utterance.voice = englishVoice;
    }

    // Audio frequency coupling while speaking
    utterance.onstart = () => {
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        speechGainNode = ctx.createGain();
        speechGainNode.gain.setValueAtTime(0, now);
        // Subtle background hum to add industrial vibe during voice playback
        speechGainNode.connect(ctx.destination);

        // Core carrier oscillator producing metallic buzz
        speechOscillator = ctx.createOscillator();
        speechOscillator.type = 'sawtooth';
        const carrierFrequency = 120 + chronosPercentage * 150; // shift up to 270Hz
        speechOscillator.frequency.setValueAtTime(carrierFrequency, now); // standard robotic hum frequency

        // LFO acting as a ring modulator (classic Doctor Who Dalek voice effect was created using a 30Hz ring modulator)
        speechModulator = ctx.createOscillator();
        speechModulator.type = 'sine';
        const lfoFrequency = 30 + chronosPercentage * 70; // shift metallic ring rate up to 100Hz
        speechModulator.frequency.value = lfoFrequency;

        speechModGain = ctx.createGain();
        speechModGain.gain.value = 40; // vibration depth

        speechModulator.connect(speechModGain);
        speechModGain.connect(speechOscillator.frequency);
        speechOscillator.connect(speechGainNode);

        speechModulator.start(now);
        speechOscillator.start(now);

        // Smoothly fade in sound
        speechGainNode.gain.linearRampToValueAtTime(volume * 0.15, now + 0.05);
      } catch (err) {
        console.warn("Failed to activate synchronized Dalek modulation buzz", err);
      }
    };

    // When speaking completed, shut down drone completely
    utterance.onend = () => {
      // Gentle fade-out then stop
      if (speechGainNode) {
        try {
          const ctx = getAudioContext();
          const now = ctx.currentTime;
          speechGainNode.gain.setValueAtTime(speechGainNode.gain.value, now);
          speechGainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          setTimeout(() => {
            cleanupSpeechAudio();
            onEndCallback?.();
          }, 60);
        } catch {
          cleanupSpeechAudio();
          onEndCallback?.();
        }
      } else {
        cleanupSpeechAudio();
        onEndCallback?.();
      }
    };

    utterance.onerror = () => {
      cleanupSpeechAudio();
      onEndCallback?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Dalek talk synthesis failed:", err);
    onEndCallback?.();
  }
}

/**
 * Custom Speech Synthesis narrator for Jesus's (Good)
 * Combines built-in browser Text-To-Speech with a synchronized Web Audio API
 * Warm golden choir drone (220Hz Sine base + 330Hz fifth) to symbolize celestial brilliance.
 */
export function speakJesusText(
  text: string, 
  muted: boolean = false, 
  volume: number = 0.5, 
  onEndCallback?: () => void, 
  chronosLoad: number = 0
): void {
  const activeChronos = chronosLoad || globalChronosLoadValue;
  if (muted || typeof window === 'undefined' || !window.speechSynthesis) {
    onEndCallback?.();
    return;
  }

  try {
    // Cancel any active speech to avoid queues stacking up
    window.speechSynthesis.cancel();
    cleanupSpeechAudio();

    // Sift out bracket descriptors so they aren't read out loud
    const cleanedText = text
      .replace(/\[.*?\]/g, "")
      .replace(/["'"]/g, "")
      .trim();

    if (!cleanedText) {
      onEndCallback?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.volume = volume;
    
    // Jesus speaks with a deep, calm, serene cadence
    const chronosPercentage = activeChronos / 100;
    utterance.pitch = 0.85 + (chronosPercentage * 0.35); // shifts up to 1.20
    utterance.rate = 0.85 + (chronosPercentage * 0.40);  // shifts up to 1.25

    // Find deep masculine, serene, or US voices
    const availableVoices = window.speechSynthesis.getVoices();
    const usVoice = availableVoices.find(v => v.lang.includes('US') || v.lang.includes('en-US') || v.name.toLowerCase().includes('google us') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('male'));
    const englishVoice = availableVoices.find(v => v.lang.startsWith('en'));

    if (usVoice) {
      utterance.voice = usVoice;
    } else if (englishVoice) {
      utterance.voice = englishVoice;
    }

    // Audio frequency coupling while speaking
    utterance.onstart = () => {
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        celestialGainNode = ctx.createGain();
        celestialGainNode.gain.setValueAtTime(0, now);
        celestialGainNode.connect(ctx.destination);

        // Warm sine base at 220Hz (A3)
        celestialOscPrimary = ctx.createOscillator();
        celestialOscPrimary.type = 'sine';
        celestialOscPrimary.frequency.setValueAtTime(220 + chronosPercentage * 50, now);

        // Warm celestial fifth at 330Hz (E4)
        celestialOscSecondary = ctx.createOscillator();
        celestialOscSecondary.type = 'sine';
        celestialOscSecondary.frequency.setValueAtTime(330 + chronosPercentage * 75, now);

        celestialOscPrimary.connect(celestialGainNode);
        celestialOscSecondary.connect(celestialGainNode);

        celestialOscPrimary.start(now);
        celestialOscSecondary.start(now);

        // Smooth golden fade-in
        celestialGainNode.gain.linearRampToValueAtTime(volume * 0.2, now + 0.1);
      } catch (err) {
        console.warn("Failed to activate synchronized celestial drone", err);
      }
    };

    utterance.onend = () => {
      if (celestialGainNode) {
        try {
          const ctx = getAudioContext();
          const now = ctx.currentTime;
          celestialGainNode.gain.setValueAtTime(celestialGainNode.gain.value, now);
          celestialGainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          setTimeout(() => {
            cleanupSpeechAudio();
            onEndCallback?.();
          }, 110);
        } catch {
          cleanupSpeechAudio();
          onEndCallback?.();
        }
      } else {
        cleanupSpeechAudio();
        onEndCallback?.();
      }
    };

    utterance.onerror = () => {
      cleanupSpeechAudio();
      onEndCallback?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Jesus talk synthesis failed:", err);
    onEndCallback?.();
  }
}