import * as Tone from 'tone';
import { DrumGenerator } from './drumGenerator';
import { BassGenerator } from './bassGenerator';
import { ChordGenerator } from './chordGenerator';
import { MelodyGenerator } from './melodyGenerator';
import { AmbientGenerator } from './ambientGenerator';
import { randomInt } from '../utils/musicTheory';

export class AudioEngine {
  constructor() {
    this.drums = new DrumGenerator();
    this.bass = new BassGenerator();
    this.chords = new ChordGenerator();
    this.melody = new MelodyGenerator();
    this.ambient = new AmbientGenerator();

    this.isPlaying = false;
    this.isInitialized = false;
    this.currentKey = 'Am';
    this.currentBPM = 80;
    this.currentMood = 0.5; // 0 = melancholic, 1 = chill

    // Layer toggles
    this.layersEnabled = {
      drums: true,
      bass: true,
      chords: true,
      melody: true
    };
  }

  async init() {
    if (this.isInitialized) return;

    await Promise.all([
      this.drums.init(),
      this.bass.init(),
      this.chords.init(),
      this.melody.init(),
      this.ambient.init()
    ]);

    this.isInitialized = true;
  }

  async generate(mood = 0.5) {
    if (!this.isInitialized) {
      await this.init();
    }

    // Stop current playback
    this.stop();

    this.currentMood = mood;

    // Set BPM with slight variation
    this.currentBPM = randomInt(72, 88);
    Tone.Transport.bpm.value = this.currentBPM;

    // Add swing for groove
    Tone.Transport.swing = 0.05;
    Tone.Transport.swingSubdivision = '8n';

    // Generate chord progression
    const progression = this.chords.generateProgression(mood);

    // Generate all layers based on progression
    this.drums.generatePattern(this.currentBPM, mood);
    this.bass.generatePattern(progression, this.currentKey, mood);
    this.chords.generatePattern(progression, this.currentKey, mood);
    this.melody.generatePattern(progression, this.currentKey, mood);

    console.log('Generated:', {
      bpm: this.currentBPM,
      key: this.currentKey,
      progression,
      mood: mood < 0.3 ? 'melancholic' : mood > 0.7 ? 'jazzy' : 'chill'
    });
  }

  async play() {
    if (!this.isInitialized) {
      await this.init();
    }

    if (!this.isPlaying) {
      await Tone.start();
      Tone.Transport.start();

      if (this.layersEnabled.drums) this.drums.start();
      if (this.layersEnabled.bass) this.bass.start();
      if (this.layersEnabled.chords) this.chords.start();
      if (this.layersEnabled.melody) this.melody.start();

      this.ambient.start();

      this.isPlaying = true;
    }
  }

  stop() {
    if (this.isPlaying) {
      Tone.Transport.stop();
      Tone.Transport.cancel();

      this.drums.stop();
      this.bass.stop();
      this.chords.stop();
      this.melody.stop();
      this.ambient.stop();

      this.isPlaying = false;
    }
  }

  toggleLayer(layer, enabled) {
    this.layersEnabled[layer] = enabled;

    if (this.isPlaying) {
      if (enabled) {
        switch (layer) {
          case 'drums':
            this.drums.start();
            break;
          case 'bass':
            this.bass.start();
            break;
          case 'chords':
            this.chords.start();
            break;
          case 'melody':
            this.melody.start();
            break;
        }
      } else {
        switch (layer) {
          case 'drums':
            this.drums.stop();
            break;
          case 'bass':
            this.bass.stop();
            break;
          case 'chords':
            this.chords.stop();
            break;
          case 'melody':
            this.melody.stop();
            break;
        }
      }
    }
  }

  setMasterVolume(db) {
    Tone.Destination.volume.value = db;
  }

  setLayerVolume(layer, db) {
    switch (layer) {
      case 'drums':
        this.drums.setVolume(db);
        break;
      case 'bass':
        this.bass.setVolume(db);
        break;
      case 'chords':
        this.chords.setVolume(db);
        break;
      case 'melody':
        this.melody.setVolume(db);
        break;
    }
  }

  toggleVinyl(enabled) {
    this.ambient.toggleVinyl(enabled);
  }

  toggleRain(enabled) {
    this.ambient.toggleRain(enabled);
  }

  setVinylIntensity(value) {
    this.ambient.setVinylIntensity(value);
  }

  dispose() {
    this.stop();
    this.drums.dispose();
    this.bass.dispose();
    this.chords.dispose();
    this.melody.dispose();
    this.ambient.dispose();
  }
}
