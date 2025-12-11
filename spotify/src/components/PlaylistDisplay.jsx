'use client';

import { useState, useEffect } from 'react';
import { getAccessToken } from '@/lib/auth';
import TrackCard from './TrackCard';

export default function PlaylistDisplay({ preferences }) {
  const [playlist, setPlaylist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar favoritos de localStorage al montar
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    setFavorites(savedFavorites);
  }, []);

  // Generar playlist basada en preferencias
  const generatePlaylist = async () => {

    console.log('🎵 INICIO - Generando playlist...');
    console.log('Preferences recibidas:', preferences);
    console.log('Token disponible:', getAccessToken());
    setLoading(true);
    setError(null);
    
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      let allTracks = [];

      // 1. Buscar por artistas seleccionados
      if (preferences.artists && preferences.artists.length > 0) {
        for (const artist of preferences.artists) {
          const tracks = await fetchArtistTopTracks(artist.id, token);
          allTracks.push(...tracks);
        }
      }

      // 2. Buscar por géneros seleccionados
      if (preferences.genres && preferences.genres.length > 0) {
        for (const genre of preferences.genres.slice(0, 3)) { // Máximo 3 géneros
          const tracks = await searchByGenre(genre, token);
          allTracks.push(...tracks);
        }
      }

      // 3. Si no hay artistas ni géneros, usar top tracks del usuario
      if (allTracks.length === 0) {
        allTracks = await fetchUserTopTracks(token);
      }

      // 4. Filtrar y procesar tracks
      let filteredTracks = filterTracksByPreferences(allTracks, preferences);
      
      // 5. Remover duplicados
      filteredTracks = removeDuplicates(filteredTracks);

      // 6. Mezclar y limitar a 30 canciones
      filteredTracks = shuffleArray(filteredTracks).slice(0, 30);

      setPlaylist(filteredTracks);
    } catch (err) {
      console.error('Error generating playlist:', err);
      setError('Error al generar playlist. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch top tracks de un artista
  const fetchArtistTopTracks = async (artistId, token) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      return data.tracks || [];
    } catch (err) {
      console.error('Error fetching artist tracks:', err);
      return [];
    }
  };

  // Buscar tracks por género
  const searchByGenre = async (genre, token) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=genre:${encodeURIComponent(genre)}&limit=20`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      return data.tracks?.items || [];
    } catch (err) {
      console.error('Error searching by genre:', err);
      return [];
    }
  };

  // Fetch top tracks del usuario
  const fetchUserTopTracks = async (token) => {
    try {
      const response = await fetch(
        'https://api.spotify.com/v1/me/top/tracks?limit=50',
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      return data.items || [];
    } catch (err) {
      console.error('Error fetching user top tracks:', err);
      return [];
    }
  };

  // Filtrar tracks según preferencias
  const filterTracksByPreferences = (tracks, prefs) => {
    return tracks.filter(track => {
      // Filtrar por década
      if (prefs.decades && prefs.decades.length > 0) {
        const year = new Date(track.album.release_date).getFullYear();
        const matchesDecade = prefs.decades.some(decade => {
          const decadeStart = parseInt(decade.substring(0, 4));
          return year >= decadeStart && year < decadeStart + 10;
        });
        if (!matchesDecade) return false;
      }

      // Filtrar por popularidad
      if (prefs.popularity) {
        const { min, max } = prefs.popularity;
        if (track.popularity < min || track.popularity > max) {
          return false;
        }
      }

      return true;
    });
  };

  // Remover duplicados
  const removeDuplicates = (tracks) => {
    const seen = new Set();
    return tracks.filter(track => {
      if (seen.has(track.id)) {
        return false;
      }
      seen.add(track.id);
      return true;
    });
  };

  // Mezclar array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Eliminar track de la playlist
  const removeTrack = (trackId) => {
    setPlaylist(playlist.filter(track => track.id !== trackId));
  };

  // Toggle favorito
  const toggleFavorite = (track) => {
    const isFavorite = favorites.some(f => f.id === track.id);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter(f => f.id !== track.id);
    } else {
      newFavorites = [...favorites, track];
    }

    setFavorites(newFavorites);
    localStorage.setItem('favorite_tracks', JSON.stringify(newFavorites));
  };

  // Verificar si es favorito
  const isFavorite = (trackId) => {
    return favorites.some(f => f.id === trackId);
  };

  // Refrescar playlist (regenerar con mismas preferencias)
  const refreshPlaylist = () => {
    generatePlaylist();
  };

  // Añadir más canciones
  const addMoreTracks = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token');

      let moreTracks = [];

      // Buscar más tracks de géneros
      if (preferences.genres && preferences.genres.length > 0) {
        const randomGenre = preferences.genres[Math.floor(Math.random() * preferences.genres.length)];
        moreTracks = await searchByGenre(randomGenre, token);
      } else {
        moreTracks = await fetchUserTopTracks(token);
      }

      // Filtrar y procesar
      let filtered = filterTracksByPreferences(moreTracks, preferences);
      filtered = filtered.filter(track => !playlist.some(p => p.id === track.id));
      filtered = shuffleArray(filtered).slice(0, 10);

      setPlaylist([...playlist, ...filtered]);
    } catch (err) {
      console.error('Error adding more tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-2xl">
          Tu Playlist Personalizada
        </h3>
        {playlist.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={refreshPlaylist}
              disabled={loading}
              className="bg-[#282828] hover:bg-[#3E3E3E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            >
              Refrescar
            </button>
            <button
              onClick={addMoreTracks}
              disabled={loading}
              className="bg-[#282828] hover:bg-[#3E3E3E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            >
              Añadir Más
            </button>
          </div>
        )}
      </div>

      {/* boton generador*/}
      {playlist.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-6">
            Selecciona tus preferencias en los widgets y genera tu playlist personalizada
          </p>
          <button
            onClick={generatePlaylist}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
          >
            Generar Playlist
          </button>
        </div>
      )}

      {/* carga */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Generando tu playlist...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Playlist */}
      {playlist.length > 0 && !loading && (
        <div>
          <p className="text-gray-400 text-sm mb-4">
            {playlist.length} canciones
          </p>
          <div className="space-y-3">
            {playlist.map(track => (
              <TrackCard
                key={track.id}
                track={track}
                onRemove={removeTrack}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(track.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}