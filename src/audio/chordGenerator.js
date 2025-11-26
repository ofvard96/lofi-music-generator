import * as Tone from 'tone';
import { getChordNotes, CHORD_PROGRESSIONS, randomChoice, randomFloat } from '../utils/musicTheory';

export class ChordGenerator {
  constructor() {
    this.synth = null;
    this.filter = null;
    this.pattern = null;
    this.currentProgression = [];
    this.volume = new Tone.Volume(-16).toDestination();
  }

  async init() {
    // Rhodes/EP style with warm, jazzy tone
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.3,
        decay: 0.5,
        sustain: 0.6,
        release: 2
      }
    });

    // Low-pass filter for lo-fi warmth
    this.filter = new Tone.Filter({
      frequency: 2000,
      type: 'lowpass',
      rolloff: -12
    }).connect(this.volume);

    // Bit crusher for lo-fi character
    const crusher = new Tone.BitCrusher(4).connect(this.filter);

    this.synth.connect(crusher);
  }

  generateProgression(mood = 0.5) {
    // Choose progression based on mood
    let progressionType;
    if (mood < 0.3) {
      progressionType = 'melancholic';
    } else if (mood > 0.7) {
      progressionType = 'jazzy';
    } else {
      progressionType = 'classic';
    }

    const progressions = CHORD_PROGRESSIONS[progressionType];
    this.currentProgression = randomChoice(progressions);

    return this.currentProgression;
  }

  generatePattern(progression, key = 'Am', mood = 0.5) {
    this.stop();

    const chordEvents = [];
    const barLength = 4; // 4 beats per chord

    progression.forEach((degree, i) => {
      const chordNotes = getChordNotes(degree, key, 3);

      // Main chord hit
      chordEvents.push({
        time: `${i * barLength}:0:0`,
        notes: chordNotes,
        duration: '2n'
      });

      // Add some rhythmic variations based on mood
      if (mood > 0.5) {
        // More active for chill mood
        if (Math.random() < 0.6) {
          chordEvents.push({
            time: `${i * barLength}:1:2`,
            notes: chordNotes.slice(0, 3), // Partial chord
            duration: '8n'
          });
        }

        if (Math.random() < 0.4) {
          chordEvents.push({
            time: `${i * barLength}:2:0`,
            notes: chordNotes,
            duration: '4n'
          });
        }
      } else {
        // Sparser for melancholic mood - sustain longer
        chordEvents[chordEvents.length - 1].duration = '1n';
      }
    });

    this.pattern = new Tone.Part((time, event) => {
      const velocity = randomFloat(0.4, 0.6);
      this.synth.triggerAttackRelease(event.notes, event.duration, time, velocity);
    }, chordEvents);

    this.pattern.loop = true;
    this.pattern.loopEnd = `${progression.length * barLength}m`;
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
