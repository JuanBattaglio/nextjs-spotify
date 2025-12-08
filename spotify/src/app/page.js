'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

const handleLogin = () => {
  // Debug temporal
  console.log('CLIENT_ID:', process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID);
  console.log('REDIRECT_URI:', process.env.NEXT_PUBLIC_REDIRECT_URI);
  
  const url = getSpotifyAuthUrl();
  console.log('URL generada:', url);
  
  window.location.href = url;
};

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#191414] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎵 Spotify Taste Mixer
          </h1>

          <button
            onClick={handleLogin}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#1DB954]/50"
          >
            Conectar con Spotify
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Necesitas una cuenta de Spotify (gratuita o premium)
          </p>
        </div>
      </div>
    </>
  );
}


