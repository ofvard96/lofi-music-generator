import * as Tone from 'tone';
import { randomFloat, randomInt } from '../utils/musicTheory';

export class DrumGenerator {
  constructor() {
    this.kick = null;
    this.snare = null;
    this.hihat = null;
    this.openhat = null;
    this.kickPattern = null;
    this.snarePattern = null;
    this.hihatPattern = null;
    this.volume = new Tone.Volume(-6).toDestination();
  }

  async init() {
    // Muted, warm kick
    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 0.4,
        attackCurve: 'exponential'
      }
    }).connect(this.volume);

    // Vinyl-crackle style snare (noise burst)
    this.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: {
        attack: 0.001,
        decay: 0.15,
        sustain: 0
      }
    }).connect(this.volume);

    const snareFilter = new Tone.Filter(3000, 'highpass').connect(this.snare);
    this.snare.connect(snareFilter);

    // Soft hi-hats
    this.hihat = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.05,
        release: 0.01
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).connect(this.volume);

    // Open hi-hat
    this.openhat = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.3,
        release: 0.3
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).connect(this.volume);

    // Apply filters for warmth
    const kickFilter = new Tone.Filter(120, 'lowpass').connect(this.volume);
    this.kick.connect(kickFilter);

    const hihatFilter = new Tone.Filter(8000, 'highpass').connect(this.volume);
    this.hihat.connect(hihatFilter);
    this.openhat.connect(hihatFilter);
  }

  generatePattern(bpm = 80, mood = 0.5) {
    this.stop();

    // Kick pattern (boom-bap style)
    const kickSequence = this.createKickPattern(mood);
    this.kickPattern = new Tone.Sequence(
      (time, note) => {
        if (note) {
          // Humanize velocity
          const velocity = randomFloat(0.5, 0.7);
          this.kick.triggerAttackRelease('C1', '8n', time, velocity);
        }
      },
      kickSequence,
      '8n'
    );

    // Snare pattern (on 2 and 4 typically)
    const snareSequence = this.createSnarePattern(mood);
    this.snarePattern = new Tone.Sequence(
      (time, note) => {
        if (note) {
          const velocity = randomFloat(0.3, 0.5);
          this.snare.triggerAttackRelease('8n', time, velocity);
        }
      },
      snareSequence,
      '8n'
    );

    // Hi-hat pattern (continuous but humanized)
    const hihatSequence = this.createHihatPattern(mood);
    this.hihatPattern = new Tone.Sequence(
      (time, note) => {
        if (note === 1) {
          // Closed hi-hat
          const velocity = randomFloat(0.1, 0.3);
          this.hihat.triggerAttackRelease('16n', time, velocity);
        } else if (note === 2) {
          // Open hi-hat
          const velocity = randomFloat(0.15, 0.25);
          this.openhat.triggerAttackRelease('8n', time, velocity);
        }
      },
      hihatSequence,
      '16n'
    );
  }

  createKickPattern(mood) {
    // Base pattern: kick on 1 and 3.5
    const patterns = [
      [1, 0, 0, 0, 0, 0, 1, 0], // Classic boom-bap
      [1, 0, 0, 0, 1, 0, 1, 0], // Syncopated
      [1, 0, 0, 1, 0, 0, 1, 0], // Variation
    ];

    let pattern = patterns[randomInt(0, patterns.length - 1)];

    // Add ghost notes based on mood (more melancholic = fewer hits)
    if (mood < 0.3) {
      pattern = pattern.map(hit => hit && Math.random() > 0.2 ? hit : 0);
    }

    return pattern;
  }

  createSnarePattern(mood) {
    // Snare on beats 2 and 4
    const patterns = [
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0], // With fill
    ];

    let pattern = patterns[Math.random() > 0.7 ? 1 : 0];

    // Occasional ghost notes
    pattern = pattern.map(hit => {
      if (!hit && Math.random() < 0.05) return 0.3; // Ghost note
      return hit;
    });

    return pattern;
  }

  createHihatPattern(mood) {
    // More active for chill mood, sparser for melancholic
    const density = mood > 0.5 ? 0.8 : 0.5;

    const pattern = [];
    for (let i = 0; i < 16; i++) {
      if (Math.random() < density) {
        // Closed hi-hat
        pattern.push(1);
      } else if (Math.random() < 0.1) {
        // Occasional open hi-hat
        pattern.push(2);
      } else {
        pattern.push(0);
      }
    }

    return pattern;
  }

  start() {
    if (this.kickPattern) this.kickPattern.start(0);
    if (this.snarePattern) this.snarePattern.start(0);
    if (this.hihatPattern) this.hihatPattern.start(0);
  }

  stop() {
    if (this.kickPattern) {
      this.kickPattern.stop();
      this.kickPattern.dispose();
    }
    if (this.snarePattern) {
      this.snarePattern.stop();
      this.snarePattern.dispose();
    }
    if (this.hihatPattern) {
      this.hihatPattern.stop();
      this.hihatPattern.dispose();
    }
  }

  setVolume(db) {
    this.volume.volume.value = db;
  }

  dispose() {
    this.stop();
    this.kick?.dispose();
    this.snare?.dispose();
    this.hihat?.dispose();
    this.openhat?.dispose();
    this.volume?.dispose();
  }
}
