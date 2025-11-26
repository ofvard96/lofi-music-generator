# Lofi Music Generator

A browser-based lofi hip-hop beat generator that creates endless, procedurally generated music. Built with React and Tone.js.

## Features

### 🎵 Procedural Audio Generation
- **Layered Architecture**: Drums, bass, chords, melody, and ambient textures
- **Dynamic Composition**: Generates jazzy chord progressions (ii-V-I, I-vi-IV-V variants)
- **Humanized Performance**: Randomized ghost notes, timing variations, and velocity changes
- **BPM Range**: 70-90 with swing/groove quantization

### 🎨 Sound Design
- **Drums**: Muted kick, vinyl-crackle snare, soft hi-hats with humanized timing
- **Bass**: Warm, rounded sub-bass with occasional slides
- **Chords**: Jazzy 7th/9th chords (Rhodes/EP style), low-pass filtered
- **Melody**: Sparse pentatonic phrases with slight detuning
- **Ambient**: Vinyl crackle and rain sounds (toggleable)

### 🎛️ Controls
- Play/Pause and Regenerate buttons
- Mood slider (melancholic ↔ chill)
- Master volume control
- Individual layer toggles (drums, bass, chords, melody)
- Ambient controls (vinyl crackle intensity, rain toggle)

### ✨ UI/UX
- Dark, warm color palette (deep purples, soft oranges, muted browns)
- Animated canvas visualization
- Smooth transitions and fade animations
- Responsive design

## Tech Stack

- **React 18** - UI framework
- **Tone.js 15** - Web Audio synthesis and sequencing
- **Vite** - Build tool and dev server

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:3000`

### Build

```bash
npm run build
```

## How It Works

### Audio Engine
The app uses a layered architecture where each musical element is generated independently:

1. **Chord Progressions**: Selected from lofi-appropriate progressions in minor keys
2. **Bass Patterns**: Generated from chord roots with occasional walking bass lines
3. **Drum Patterns**: Boom-bap style with randomized ghost notes and variations
4. **Melodies**: Sparse pentatonic phrases derived from chord tones
5. **Ambient Layer**: Continuous vinyl crackle and optional rain sounds

### Procedural Generation
- Patterns loop seamlessly with subtle variations
- Mood slider affects:
  - Chord progression style (melancholic vs. jazzy)
  - Rhythm density
  - Note spacing and activity
- Each regeneration creates a unique composition

## Vibes

*"2am studying alone • rainy window • late night drive"*

Everything is intentionally slightly imperfect, warm, and human.
