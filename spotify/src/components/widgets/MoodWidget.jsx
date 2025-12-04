'use client';

import { useState, useEffect } from 'react';

// Presets de mood predefinidos
const MOOD_PRESETS = {
  happy: {
    name: 'Happy',
    values: { energy: 70, valence: 80, danceability: 70, acousticness: 30 }
  },
  sad: {
    name: 'Sad',
    values: { energy: 30, valence: 20, danceability: 30, acousticness: 60 }
  },
  energetic: {
    name: 'Energetic',
    values: { energy: 90, valence: 70, danceability: 85, acousticness: 10 }
  },
  calm: {
    name: 'Calm',
    values: { energy: 20, valence: 50, danceability: 20, acousticness: 70 }
  },
  party: {
    name: 'Party',
    values: { energy: 85, valence: 90, danceability: 95, acousticness: 5 }
  },
  chill: {
    name: 'Chill',
    values: { energy: 25, valence: 60, danceability: 40, acousticness: 50 }
  }
};

// Parámetros de audio con descripciones
const AUDIO_FEATURES = [
  {
    key: 'energy',
    label: 'Energy',
    description: 'Intensidad y actividad',
    color: 'from-red-500 to-orange-500'
  },
  {
    key: 'valence',
    label: 'Valence',
    description: 'Positividad musical',
    color: 'from-yellow-500 to-green-500'
  },
  {
    key: 'danceability',
    label: 'Danceability',
    description: 'Qué tan bailable',
    color: 'from-purple-500 to-pink-500'
  },
  {
    key: 'acousticness',
    label: 'Acousticness',
    description: 'Nivel acústico',
    color: 'from-blue-500 to-cyan-500'
  }
];

export default function MoodWidget({ onSelect, selectedItems = {} }) {
  // Inicializar con valores por defecto o los recibidos
  const [values, setValues] = useState({
    energy: selectedItems.energy ?? 50,
    valence: selectedItems.valence ?? 50,
    danceability: selectedItems.danceability ?? 50,
    acousticness: selectedItems.acousticness ?? 50
  });

  // Emitir cambios al padre
  useEffect(() => {
    onSelect(values);
  }, [values, onSelect]);

  // Manejar cambio de slider
  const handleSliderChange = (key, value) => {
    setValues(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));
  };

  // Aplicar preset
  const applyPreset = (presetKey) => {
    const preset = MOOD_PRESETS[presetKey];
    setValues(preset.values);
  };

  // Reset a valores por defecto
  const handleReset = () => {
    setValues({
      energy: 50,
      valence: 50,
      danceability: 50,
      acousticness: 50
    });
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-xl">
          Mood & Características
        </h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Ajusta las características de audio de tu playlist
      </p>

      {/* Mood Presets */}
      <div className="mb-6">
        <p className="text-white text-sm font-medium mb-3">Presets rápidos:</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Object.entries(MOOD_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="bg-[#282828] hover:bg-[#3E3E3E] text-white p-3 rounded-lg transition-all duration-300 hover:scale-105"
              title={preset.name}
            >
              <span className="text-sm font-medium">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audio Feature Sliders */}
      <div className="space-y-6">
        {AUDIO_FEATURES.map(feature => (
          <div key={feature.key}>
            {/* Label & Value */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-medium text-sm">{feature.label}</p>
                <p className="text-gray-500 text-xs">{feature.description}</p>
              </div>
              <span className="text-white font-bold text-lg bg-[#282828] px-3 py-1 rounded-full min-w-[60px] text-center">
                {values[feature.key]}
              </span>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={values[feature.key]}
                onChange={(e) => handleSliderChange(feature.key, e.target.value)}
                className="w-full h-2 bg-[#282828] rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, 
                    #1DB954 0%, 
                    #1DB954 ${values[feature.key]}%, 
                    #282828 ${values[feature.key]}%, 
                    #282828 100%)`
                }}
              />
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        ))}
      </div>

      {/* Current Values Summary */}
      <div className="mt-6 p-4 bg-[#282828] rounded-lg">
        <p className="text-gray-400 text-sm mb-2">Configuración actual:</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {AUDIO_FEATURES.map(feature => (
            <div key={feature.key} className="flex items-center gap-2">
              <span className="text-gray-300">{feature.label}:</span>
              <span className="text-white font-medium">{values[feature.key]}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1DB954;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1DB954;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .slider:hover::-webkit-slider-thumb {
          transform: scale(1.2);
        }

        .slider:hover::-moz-range-thumb {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}