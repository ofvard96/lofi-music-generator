import React from 'react';
import './LayerToggles.css';

export function LayerToggles({
  layers,
  onToggleLayer,
  vinylEnabled,
  rainEnabled,
  onToggleVinyl,
  onToggleRain,
  vinylIntensity,
  onVinylIntensityChange
}) {
  return (
    <div className="layer-toggles">
      <h3 className="toggles-title">Layers</h3>

      <div className="toggle-grid">
        <div className="toggle-item">
          <label>
            <input
              type="checkbox"
              checked={layers.drums}
              onChange={(e) => onToggleLayer('drums', e.target.checked)}
            />
            <span>Drums</span>
          </label>
        </div>

        <div className="toggle-item">
          <label>
            <input
              type="checkbox"
              checked={layers.bass}
              onChange={(e) => onToggleLayer('bass', e.target.checked)}
            />
            <span>Bass</span>
          </label>
        </div>

        <div className="toggle-item">
          <label>
            <input
              type="checkbox"
              checked={layers.chords}
              onChange={(e) => onToggleLayer('chords', e.target.checked)}
            />
            <span>Chords</span>
          </label>
        </div>

        <div className="toggle-item">
          <label>
            <input
              type="checkbox"
              checked={layers.melody}
              onChange={(e) => onToggleLayer('melody', e.target.checked)}
            />
            <span>Melody</span>
          </label>
        </div>
      </div>

      <div className="ambient-section">
        <h4 className="ambient-title">Ambient</h4>

        <div className="toggle-item">
          <label>
            <input
              type="checkbox"
              checked={vinylEnabled}
              onChange={(e) => onToggleVinyl(e.target.checked)}
            />
            <span>Vinyl Crackle</span>
          </label>

          {vinylEnabled && (
            <div className="intensity-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={vinylIntensity}
                onChange={(e) => onVinylIntensityChange(parseFloat(e.target.value))}
                className="intensity-slider"
              />
            </div>
          )}
        </div>

        <div className="toggle-item">
          <label>
            <input
              type="checkbox"
              checked={rainEnabled}
              onChange={(e) => onToggleRain(e.target.checked)}
            />
            <span>Rain</span>
          </label>
        </div>
      </div>
    </div>
  );
}
