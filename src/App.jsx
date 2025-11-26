import React, { useState, useEffect, useRef } from 'react';
import { AudioEngine } from './audio/audioEngine';
import { Controls } from './components/Controls';
import { LayerToggles } from './components/LayerToggles';
import { Visual } from './components/Visual';
import './App.css';

function App() {
  const audioEngineRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mood, setMood] = useState(0.5);
  const [masterVolume, setMasterVolume] = useState(-10);
  const [isGenerating, setIsGenerating] = useState(false);

  const [layers, setLayers] = useState({
    drums: true,
    bass: true,
    chords: true,
    melody: true
  });

  const [vinylEnabled, setVinylEnabled] = useState(true);
  const [rainEnabled, setRainEnabled] = useState(false);
  const [vinylIntensity, setVinylIntensity] = useState(0.5);

  // Initialize audio engine
  useEffect(() => {
    audioEngineRef.current = new AudioEngine();

    // Generate initial beat
    audioEngineRef.current.generate(mood);

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
    };
  }, []);

  const handlePlayPause = async () => {
    if (!audioEngineRef.current) return;

    if (isPlaying) {
      audioEngineRef.current.stop();
      setIsPlaying(false);
    } else {
      await audioEngineRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRegenerate = async () => {
    if (!audioEngineRef.current || isGenerating) return;

    setIsGenerating(true);
    const wasPlaying = isPlaying;

    if (wasPlaying) {
      audioEngineRef.current.stop();
    }

    await audioEngineRef.current.generate(mood);

    if (wasPlaying) {
      await audioEngineRef.current.play();
    }

    setIsGenerating(false);
  };

  const handleMoodChange = async (newMood) => {
    setMood(newMood);

    // Auto-regenerate on significant mood changes
    if (Math.abs(newMood - mood) > 0.3) {
      await handleRegenerate();
    }
  };

  const handleVolumeChange = (db) => {
    setMasterVolume(db);
    if (audioEngineRef.current) {
      audioEngineRef.current.setMasterVolume(db);
    }
  };

  const handleToggleLayer = (layer, enabled) => {
    setLayers(prev => ({ ...prev, [layer]: enabled }));

    if (audioEngineRef.current) {
      audioEngineRef.current.toggleLayer(layer, enabled);
    }
  };

  const handleToggleVinyl = (enabled) => {
    setVinylEnabled(enabled);

    if (audioEngineRef.current) {
      audioEngineRef.current.toggleVinyl(enabled);
    }
  };

  const handleToggleRain = (enabled) => {
    setRainEnabled(enabled);

    if (audioEngineRef.current) {
      audioEngineRef.current.toggleRain(enabled);
    }
  };

  const handleVinylIntensityChange = (value) => {
    setVinylIntensity(value);

    if (audioEngineRef.current) {
      audioEngineRef.current.setVinylIntensity(value);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <Visual isPlaying={isPlaying} mood={mood} />

        <div className="controls-layout">
          <Controls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onRegenerate={handleRegenerate}
            mood={mood}
            onMoodChange={handleMoodChange}
            masterVolume={masterVolume}
            onVolumeChange={handleVolumeChange}
          />

          <LayerToggles
            layers={layers}
            onToggleLayer={handleToggleLayer}
            vinylEnabled={vinylEnabled}
            rainEnabled={rainEnabled}
            onToggleVinyl={handleToggleVinyl}
            onToggleRain={handleToggleRain}
            vinylIntensity={vinylIntensity}
            onVinylIntensityChange={handleVinylIntensityChange}
          />
        </div>

        <footer className="footer">
          <p>2am studying • rainy window • late night drive</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
