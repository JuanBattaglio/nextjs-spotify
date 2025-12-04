'use client';

import { useState, useMemo } from 'react';

// Lista completa de géneros disponibles en Spotify
const AVAILABLE_GENRES = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
  'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova',
  'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house',
  'children', 'chill', 'classical', 'club', 'comedy',
  'country', 'dance', 'dancehall', 'death-metal', 'deep-house',
  'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
  'dubstep', 'edm', 'electro', 'electronic', 'emo',
  'folk', 'forro', 'french', 'funk', 'garage',
  'german', 'gospel', 'goth', 'grindcore', 'groove',
  'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
  'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm',
  'indian', 'indie', 'indie-pop', 'industrial', 'iranian',
  'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz',
  'k-pop', 'kids', 'latin', 'latino', 'malay',
  'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno',
  'movies', 'mpb', 'new-age', 'new-release', 'opera',
  'pagode', 'party', 'philippines-opm', 'piano', 'pop',
  'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock',
  'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae',
  'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly',
  'romance', 'sad', 'salsa', 'samba', 'sertanejo',
  'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter',
  'soul', 'soundtracks', 'spanish', 'study', 'summer',
  'swedish', 'synth-pop', 'tango', 'techno', 'trance',
  'trip-hop', 'turkish', 'work-out', 'world-music'
];

export default function GenreWidget({ onSelect, selectedItems = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const MAX_SELECTIONS = 5;

  // Filtrar géneros según búsqueda
  const filteredGenres = useMemo(() => {
    if (!searchTerm) return AVAILABLE_GENRES;
    
    return AVAILABLE_GENRES.filter(genre => 
      genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Manejar selección/deselección
  const handleToggleGenre = (genre) => {
    let newSelection;
    
    if (selectedItems.includes(genre)) {
      // Deseleccionar
      newSelection = selectedItems.filter(g => g !== genre);
    } else {
      // Seleccionar (si no se alcanzó el máximo)
      if (selectedItems.length >= MAX_SELECTIONS) {
        alert(`Máximo ${MAX_SELECTIONS} géneros permitidos`);
        return;
      }
      newSelection = [...selectedItems, genre];
    }
    
    onSelect(newSelection);
  };

  // Limpiar selección
  const handleClear = () => {
    onSelect([]);
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
          🎸 Géneros Musicales
        </h3>
        {selectedItems.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Selection Counter */}
      <p className="text-gray-400 text-sm mb-4">
        {selectedItems.length} / {MAX_SELECTIONS} géneros seleccionados
      </p>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar géneros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#282828] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
        />
      </div>

      {/* Selected Genres (if any) */}
      {selectedItems.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Seleccionados:</p>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map(genre => (
              <button
                key={genre}
                onClick={() => handleToggleGenre(genre)}
                className="bg-[#1DB954] text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-[#1ed760] transition-colors flex items-center gap-1"
              >
                {genre}
                <span className="text-xs">✕</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Genres Grid */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredGenres.map(genre => {
            const isSelected = selectedItems.includes(genre);
            
            return (
              <button
                key={genre}
                onClick={() => handleToggleGenre(genre)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#1DB954] text-white'
                    : 'bg-[#282828] text-gray-300 hover:bg-[#3E3E3E] hover:text-white'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* No results */}
        {filteredGenres.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            No se encontraron géneros con "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
}