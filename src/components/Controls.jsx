import React from 'react';
import './Controls.css';

export function Controls({
  isPlaying,
  onPlayPause,
  onRegenerate,
  mood,
  onMoodChange,
  masterVolume,
  onVolumeChange
}) {
  return (
    <div className="controls">
      <div className="control-group main-controls">
        <button
          className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={onPlayPause}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button className="control-btn regenerate-btn" onClick={onRegenerate}>
          ↻
        </button>
      </div>

      <div className="control-group mood-control">
        <label>
          <span className="mood-label">melancholic</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={mood}
            onChange={(e) => onMoodChange(parseFloat(e.target.value))}
            className="mood-slider"
          />
          <span className="mood-label">chill</span>
        </label>
      </div>

      <div className="control-group volume-control">
        <label>
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="-30"
            max="0"
            step="1"
            value={masterVolume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </label>
      </div>
    </div>
  );
}
