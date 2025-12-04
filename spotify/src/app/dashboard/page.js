'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Header from '@/components/Header';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Si NO está autenticado, redirigir al login
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-[#121212] pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Mi Dashboard
          </h2>
          
          {/* Aquí irán los widgets después */}
          <div className="text-white">
            <p>Dashboard funcionando! 🎉</p>
            <p className="text-gray-400 mt-2">
              Próximamente: widgets y generador de playlists
            </p>
          </div>
        </div>
      </main>
    </>
  );
}