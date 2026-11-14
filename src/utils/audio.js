/**
 * Ambient Wedding & Celebration Audio Synthesizer via Web Audio API.
 * Plays a soothing, romantic harp/piano arpeggio loop without relying on
 * external CDN/MP3 files that can 404 or fail CORS.
 * Also supports custom audio files when provided.
 */

class RomanticAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.timer = null;
    this.audioElement = null;
    this.step = 0;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a gentle bell/harp note
  playNote(frequency, startTime, duration = 2.2, gainValue = 0.08) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Soft triangle + sine wave for acoustic harp/celeste timbre
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, startTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2, startTime); // Gentle upper octave harmonic

      // Envelope: Soft attack, exponential decay
      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(gainValue, startTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(gainValue * 0.4, startTime + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

      osc.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(startTime);
      osc2.start(startTime);
      osc.stop(startTime + duration);
      osc2.stop(startTime + duration);
    } catch {
      // Audio node scheduling guard
    }
  }

  startMelody(onStateChange) {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
    }
    this.step = 0;
    if (onStateChange) onStateChange(true);

    // Romantic wedding arpeggio chords (Db major / F minor / Gb major / Ab major progression)
    const chords = [
      [277.18, 349.23, 415.30, 554.37], // Db Major (warm & romantic)
      [349.23, 415.30, 523.25, 698.46], // F Minor (emotional)
      [369.99, 466.16, 554.37, 739.99], // Gb Major (tender)
      [415.30, 523.25, 622.25, 830.61]  // Ab Major (resolving)
    ];

    const playLoop = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chordIndex = Math.floor(this.step / 4) % chords.length;
      const noteIndex = this.step % 4;
      const chord = chords[chordIndex];
      const freq = chord[noteIndex];

      this.playNote(freq, now, 2.5, 0.07);

      // Add a soft bass tone on the first beat of each chord
      if (noteIndex === 0) {
        this.playNote(chord[0] / 2, now, 3.5, 0.05);
      }

      this.step++;
      this.timer = setTimeout(playLoop, 650);
    };

    playLoop();
  }

  stop(onStateChange) {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {}
    }
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {}
    }
    if (onStateChange) onStateChange(false);
  }

  toggle(customAudioUrl, onStateChange) {
    if (this.isPlaying) {
      this.stop(onStateChange);
      return false;
    }

    if (customAudioUrl) {
      try {
        if (!this.audioElement) {
          this.audioElement = new Audio(customAudioUrl);
          this.audioElement.loop = true;
          this.audioElement.onerror = () => {
            this.startMelody(onStateChange);
          };
        }
        this.audioElement.play().then(() => {
          this.isPlaying = true;
          if (onStateChange) onStateChange(true);
        }).catch(() => {
          this.startMelody(onStateChange);
        });
        return true;
      } catch {
        this.startMelody(onStateChange);
        return true;
      }
    } else {
      this.startMelody(onStateChange);
      return true;
    }
  }
}

export const globalAudio = new RomanticAudioSynthesizer();
