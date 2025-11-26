import * as Tone from 'tone';
import { getPentatonicScale, randomChoice, randomFloat, randomInt } from '../utils/musicTheory';

export class MelodyGenerator {
  constructor() {
    this.synth = null;
    this.filter = null;
    this.pattern = null;
    this.volume = new Tone.Volume(-18).toDestination();
  }

  async init() {
    // Simple, contemplative lead sound with slight detuning
    this.synth = new Tone.Synth({
      oscillator: {
        type: 'sine',
        spread: 20 // Slight detuning for warmth
      },
      envelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.5,
        release: 1.5
      }
    });

    // Filter for warmth
    this.filter = new Tone.Filter({
      frequency: 3000,
      type: 'lowpass',
      rolloff: -12
    }).connect(this.volume);

    // Chorus for width
    const chorus = new Tone.Chorus(4, 2.5, 0.5).connect(this.filter);
    this.synth.connect(chorus);
  }

  generatePattern(progression, key = 'Am', mood = 0.5) {
    this.stop();

    const scale = getPentatonicScale(key, 4);
    const melodyNotes = [];

    // Generate sparse, contemplative melody
    const barLength = 4;
    const numBars = progression.length;

    for (let bar = 0; bar < numBars; bar++) {
      // Sparse phrases - not every bar has melody
      if (Math.random() < (mood > 0.5 ? 0.7 : 0.5)) {
        const phraseLengthBeats = randomInt(2, 4);

        for (let beat = 0; beat < phraseLengthBeats; beat++) {
          if (Math.random() < 0.6) { // Not every beat has a note
            const note = randomChoice(scale);
            const duration = randomChoice(['8n', '4n', '4n', '2n']); // Prefer longer notes
            const time = `${bar * barLength}:${beat}:0`;

            melodyNotes.push({
              time,
              note,
              duration
            });
          }
        }
      }
    }

    // Make melody more contemplative - add rests between phrases
    const spacedMelody = [];
    melodyNotes.forEach((noteEvent, i) => {
      spacedMelody.push(noteEvent);

      // Add rest between some phrases
      if (i > 0 && Math.random() < 0.3) {
        const restTime = Tone.Time(noteEvent.time).toBarsBeatsSixteenths();
        const [bars, beats] = restTime.split(':').map(Number);
        if (beats < 3) {
          // Skip next notes to create space
          i++;
        }
      }
    });

    this.pattern = new Tone.Part((time, note) => {
      const velocity = randomFloat(0.3, 0.5);
      this.synth.triggerAttackRelease(note.note, note.duration, time, velocity);
    }, spacedMelody);

    this.pattern.loop = true;
    this.pattern.loopEnd = `${numBars * barLength}m`;
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
