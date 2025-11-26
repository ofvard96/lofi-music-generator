import * as Tone from 'tone';
import { getBassNote, randomFloat } from '../utils/musicTheory';

export class BassGenerator {
  constructor() {
    this.synth = null;
    this.filter = null;
    this.pattern = null;
    this.currentProgression = [];
    this.volume = new Tone.Volume(-12).toDestination();
  }

  async init() {
    // Warm, rounded sub-bass
    this.synth = new Tone.MonoSynth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.4,
        release: 0.8
      },
      filterEnvelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.5,
        release: 1,
        baseFrequency: 200,
        octaves: 2
      }
    });

    // Low-pass filter for warmth
    this.filter = new Tone.Filter({
      frequency: 400,
      type: 'lowpass',
      rolloff: -24
    }).connect(this.volume);

    this.synth.connect(this.filter);
  }

  generatePattern(progression, key = 'Am', mood = 0.5) {
    this.stop();
    this.currentProgression = progression;

    // Create bass pattern from chord progression
    const bassNotes = [];

    progression.forEach((degree, i) => {
      const bassNote = getBassNote(degree, key, 2);

      // Root on downbeat
      bassNotes.push({ time: `${i * 4}:0:0`, note: bassNote, duration: '2n' });

      // Occasional walking bass or slide
      if (Math.random() < 0.3) {
        const walkNote = getBassNote(degree, key, 2);
        bassNotes.push({
          time: `${i * 4}:2:2`,
          note: walkNote,
          duration: '8n',
          slide: Math.random() < 0.5
        });
      }

      // Less active for melancholic mood
      if (mood > 0.4 && Math.random() < 0.4) {
        bassNotes.push({
          time: `${i * 4}:1:0`,
          note: bassNote,
          duration: '4n'
        });
      }
    });

    this.pattern = new Tone.Part((time, note) => {
      const velocity = randomFloat(0.6, 0.8);

      if (note.slide) {
        // Slide effect
        this.synth.triggerAttackRelease(note.note, note.duration, time, velocity);
        this.synth.frequency.linearRampTo(
          Tone.Frequency(note.note).transpose(2),
          0.1,
          time
        );
      } else {
        this.synth.triggerAttackRelease(note.note, note.duration, time, velocity);
      }
    }, bassNotes);

    this.pattern.loop = true;
    this.pattern.loopEnd = `${progression.length * 4}m`;
  }

  start() {
    if (this.pattern) {
      this.pattern.start(0);
    }
  }

  stop() {
    if (this.pattern) {
      this.pattern.stop();
      this.pattern.dispose();
    }
  }

  setVolume(db) {
    this.volume.volume.value = db;
  }

  dispose() {
    this.stop();
    this.synth?.dispose();
    this.filter?.dispose();
    this.volume?.dispose();
  }
}
