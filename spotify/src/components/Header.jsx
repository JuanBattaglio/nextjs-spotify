'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';    
import Link from 'next/link';
import { logout, getAccessToken } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
    } else if (response.status === 401) {
      handleLogout();
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-[#181818] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                {/* LOGO */}

                <Link href="/dashboard" className="text-white text-xl font-bold">
                    Spotify Taste Mixer
                </Link>
                {/* Menú */}

                <nav className="hidden md:flex space-x-4">
                    <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        FAVORITO
                    </Link>
                </nav>
                {/* Usuario */}

                <div className="flex items-center space-x-4">
                    {loading ? (
                        <div className="text-gray-300">Cargando...</div>
                    ) : user ? (
                        <>
                            <div className='hidden sm:flex items-center space-x-3'>
                                {user.images && user.images.length > 0 && (
                                    <img
                                        src={user.images[0].url}
                                        alt={user.display_name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                                <span className="text-gray-300">{user.display_name}</span>
                            </div>
                            <div>
                                <button
                                    onClick={handleLogout} 
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                    Cerrar sesión
                                </button>                                        
                            </div>
                        </>
                    ) : null}

                    {/* Menú móvil */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            {/* Menú móvil desplegable */}
            {mobileMenuOpen && (
                <nav className="md:hidden mt-2 space-y-1">
                    <Link href="/dashboard" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                        Dashboard
                    </Link>
                </nav>
            )}
            <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                        FAVORITO
                    </Link>
                    {user && (
                        <div className='flex sm:hidden items-center space-x-3 mt-2'>
                            {user.images && user.images.length > 0 && (
                                <img
                                    src={user.images[0].url}
                                    alt={user.display_name}
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            <span className="text-gray-300">{user.display_name}</span>
                        </div>
                    )}
                    <span className="text-white text-sm font-medium">
                        {user?.display_name || 'Usuario'}
                    </span>
        </div>
    </header>
  );
}