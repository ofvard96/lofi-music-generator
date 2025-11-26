// Music theory utilities for lofi generation

export const KEYS = {
  'Am': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  'Dm': ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
  'Em': ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
  'Cm': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'Gm': ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F']
};

// Lofi-appropriate chord progressions (all in minor keys)
export const CHORD_PROGRESSIONS = {
  classic: [
    ['i', 'iv', 'v', 'i'],     // Am, Dm, Em, Am
    ['i', 'VI', 'III', 'VII'], // Am, F, C, G
    ['i', 'v', 'VI', 'iv'],    // Am, Em, F, Dm
    ['i', 'VII', 'VI', 'v']    // Am, G, F, Em
  ],
  jazzy: [
    ['ii', 'V', 'i', 'i'],     // Bm7b5, E7, Am7, Am7
    ['i', 'iv', 'VII', 'III'], // Am7, Dm7, G7, Cmaj7
    ['vi', 'ii', 'V', 'i'],    // Fmaj7, Bm7b5, E7, Am7
    ['i', 'VI', 'ii', 'V']     // Am7, Fmaj7, Bm7b5, E7
  ],
  melancholic: [
    ['i', 'VI', 'iv', 'V'],    // Am, F, Dm, E
    ['i', 'v', 'i', 'iv'],     // Am, Em, Am, Dm
    ['iv', 'i', 'VI', 'V']     // Dm, Am, F, E
  ]
};

// Convert chord symbols to actual notes with 7th/9th voicings
export function getChordNotes(degree, key, octave = 3) {
  const scales = {
    'Am': {
      'i': ['A', 'C', 'E', 'G'],      // Am7
      'ii': ['B', 'D', 'F', 'A'],     // Bm7b5
      'III': ['C', 'E', 'G', 'B'],    // Cmaj7
      'iv': ['D', 'F', 'A', 'C'],     // Dm7
      'v': ['E', 'G', 'B', 'D'],      // Em7
      'VI': ['F', 'A', 'C', 'E'],     // Fmaj7
      'VII': ['G', 'B', 'D', 'F'],    // G7
      'V': ['E', 'G#', 'B', 'D']      // E7
    }
  };

  const chordNotes = scales[key][degree];
  return chordNotes.map((note, i) => {
    const noteOctave = i === 0 ? octave : (i === 3 ? octave + 1 : octave);
    return `${note}${noteOctave}`;
  });
}

// Get pentatonic scale for melodies
export function getPentatonicScale(key, octave = 4) {
  const pentatonic = {
    'Am': ['A', 'C', 'D', 'E', 'G'],
    'Dm': ['D', 'F', 'G', 'A', 'C'],
    'Em': ['E', 'G', 'A', 'B', 'D']
  };

  const baseScale = pentatonic[key] || pentatonic['Am'];
  return [
    ...baseScale.map(note => `${note}${octave}`),
    ...baseScale.map(note => `${note}${octave + 1}`)
  ];
}

// Get bass note from chord
export function getBassNote(degree, key, octave = 2) {
  const roots = {
    'Am': {
      'i': 'A', 'ii': 'B', 'III': 'C', 'iv': 'D',
      'v': 'E', 'VI': 'F', 'VII': 'G', 'V': 'E'
    }
  };

  return `${roots[key][degree]}${octave}`;
}

// Random choice helper
export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Random float between min and max
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// Random int between min and max (inclusive)
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
