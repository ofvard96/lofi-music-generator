import * as Tone from 'tone';

export class AmbientGenerator {
  constructor() {
    this.vinylNoise = null;
    this.rainNoise = null;
    this.vinylVolume = new Tone.Volume(-24).toDestination();
    this.rainVolume = new Tone.Volume(-18).toDestination();
    this.vinylEnabled = true;
    this.rainEnabled = false;
  }

  async init() {
    // Vinyl crackle - pink noise with filtering
    this.vinylNoise = new Tone.Noise('pink');

    const vinylFilter = new Tone.Filter({
      frequency: 3000,
      type: 'lowpass',
      rolloff: -24
    }).connect(this.vinylVolume);

    // AutoFilter for subtle movement
    const vinylAutoFilter = new Tone.AutoFilter({
      frequency: 0.3,
      depth: 0.3
    }).connect(vinylFilter).start();

    this.vinylNoise.connect(vinylAutoFilter);

    // Rain sound - brown noise with filtering
    this.rainNoise = new Tone.Noise('brown');

    const rainFilter = new Tone.Filter({
      frequency: 1500,
      type: 'lowpass',
      rolloff: -12
    }).connect(this.rainVolume);

    // Auto panner for spatial rain effect
    const rainPanner = new Tone.AutoPanner({
      frequency: 0.1,
      depth: 0.5
    }).connect(rainFilter).start();

    // Reverb for space
    const rainReverb = new Tone.Reverb({
      decay: 3,
      wet: 0.4
    }).connect(rainPanner);

    this.rainNoise.connect(rainReverb);

    await rainReverb.generate();
  }

  start() {
    if (this.vinylEnabled && this.vinylNoise) {
      this.vinylNoise.start();
    }

    if (this.rainEnabled && this.rainNoise) {
      this.rainNoise.start();
    }
  }

  stop() {
    if (this.vinylNoise) {
      this.vinylNoise.stop();
    }

    if (this.rainNoise) {
      this.rainNoise.stop();
    }
  }

  toggleVinyl(enabled) {
    this.vinylEnabled = enabled;

    if (enabled && this.vinylNoise && this.vinylNoise.state !== 'started') {
      this.vinylNoise.start();
    } else if (!enabled && this.vinylNoise) {
      this.vinylNoise.stop();
    }
  }

  toggleRain(enabled) {
    this.rainEnabled = enabled;

    if (enabled && this.rainNoise && this.rainNoise.state !== 'started') {
      this.rainNoise.start();
    } else if (!enabled && this.rainNoise) {
      this.rainNoise.stop();
    }
  }

  setVinylIntensity(value) {
    // value from 0 to 1
    const db = -30 + (value * 15); // -30db to -15db
    this.vinylVolume.volume.value = db;
  }

  setRainVolume(db) {
    this.rainVolume.volume.value = db;
  }

  dispose() {
    this.stop();
    this.vinylNoise?.dispose();
    this.rainNoise?.dispose();
    this.vinylVolume?.dispose();
    this.rainVolume?.dispose();
  }
}
