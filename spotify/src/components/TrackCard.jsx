'use client';

export default function TrackCard({ track, isFavorite, onToggleFavorite, onRemove }) {

    const formatoDuracion = (ms) => {
        const minutos = Math.floor(ms / 60000);
        const segundos = Math.floor((ms % 60000) / 1000);
        return `${minutos + ":" + (segundos < 10 ? '0' : '') + segundos}`;
    };

    const nombresArtistas = track.artists.map(artista => artista.name).join(', ');

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-700 transition duration-200 group">
            <div className="flex items-center gap-4 w-full">

                {/* cubierta */}
                <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="w-16 h-16 rounded-md object-cover"
                />

                {/* informacion de la pista */}
                <div className="flex-grow min-w-0">
                    <h3 className="text-white font-medium truncate">
                        {track.name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                        {nombresArtistas}
                    </p>
                </div>

                {/* duracion de la pista */}
                <div className="hidden sm:block text-gray-400 text-sm">
                    {formatoDuracion(track.duration_ms)}
                </div>

                {/* botones */}
                <div className="flex space-x-2">
                    {/* Favorite Button */}
                    <button
                        onClick={() => onToggleFavorite(track)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                            isFavorite 
                                ? 'text-yellow-400 hover:text-yellow-500' 
                                : 'text-gray-400 hover:text-yellow-400'
                        }`}
                        title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                        <svg 
                            className="w-5 h-5" 
                            fill={isFavorite ? 'currentColor' : 'none'}
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                            />
                        </svg>
                    </button>

                    {/* Remove Button */}
                    <button
                        onClick={() => onRemove(track.id)}
                        className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        title="Eliminar de la playlist"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}