'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAccessToken } from '@/lib/auth';

export default function ArtistWidget({ onSelect, selectedItems = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const MAX_SELECTIONS = 5;

  // Debounced search function
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchArtists(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Buscar artistas en Spotify API
  const searchArtists = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al buscar artistas');
      }

      const data = await response.json();
      setSearchResults(data.artists?.items || []);
    } catch (err) {
      console.error('Error searching artists:', err);
      setError('Error al buscar artistas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección/deselección
  const handleToggleArtist = (artist) => {
    const isSelected = selectedItems.some(a => a.id === artist.id);
    let newSelection;

    if (isSelected) {
      // Deseleccionar
      newSelection = selectedItems.filter(a => a.id !== artist.id);
    } else {
      // Seleccionar (si no se alcanzó el máximo)
      if (selectedItems.length >= MAX_SELECTIONS) {
        alert(`Máximo ${MAX_SELECTIONS} artistas permitidos`);
        return;
      }
      newSelection = [...selectedItems, { id: artist.id, name: artist.name, images: artist.images }];
    }

    onSelect(newSelection);
  };

  // Limpiar selección
  const handleClear = () => {
    onSelect([]);
  };

  // Verificar si un artista está seleccionado
  const isArtistSelected = (artistId) => {
    return selectedItems.some(a => a.id === artistId);
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-xl">
          Artistas Favoritos
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
        {selectedItems.length} / {MAX_SELECTIONS} artistas seleccionados
      </p>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar artistas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#282828] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
        />
      </div>

      {/* Selected Artists */}
      {selectedItems.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Seleccionados:</p>
          <div className="space-y-2">
            {selectedItems.map(artist => (
              <div
                key={artist.id}
                className="flex items-center gap-3 bg-[#1DB954] rounded-lg p-2"
              >
                {artist.images && artist.images.length > 0 ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <span className="flex-1 text-white font-medium text-sm">{artist.name}</span>
                <button
                  onClick={() => handleToggleArtist(artist)}
                  className="text-white hover:text-gray-200 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm text-center py-4">
            {error}
          </div>
        )}

        {!loading && !error && searchResults.length === 0 && searchTerm && (
          <p className="text-gray-400 text-center py-8">
            No se encontraron artistas
          </p>
        )}

        {!loading && !error && searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map(artist => {
              const isSelected = isArtistSelected(artist.id);

              return (
                <button
                  key={artist.id}
                  onClick={() => handleToggleArtist(artist)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#1DB954] text-white'
                      : 'bg-[#282828] text-gray-300 hover:bg-[#3E3E3E]'
                  }`}
                >
                  {/* Artist Image */}
                  {artist.images && artist.images.length > 0 ? (
                    <img
                      src={artist.images[2]?.url || artist.images[0]?.url}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {/* Artist Info */}
                  <div className="flex-1 text-left">
                    <p className="font-medium">{artist.name}</p>
                    {artist.followers && (
                      <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {artist.followers.total.toLocaleString()} seguidores
                      </p>
                    )}
                  </div>

                  {/* Checkmark */}
                  {isSelected && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {!loading && !error && !searchTerm && (
          <p className="text-gray-400 text-center py-8">
            Escribe para buscar artistas
          </p>
        )}
      </div>
    </div>
  );
}