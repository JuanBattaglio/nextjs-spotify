'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Header from '@/components/Header';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';
import ArtistWidget from '@/components/widgets/ArtistWidget';

export default function Dashboard() {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [moodValues, setMoodValues] = useState({});
  const [popularityValues, setPopularityValues] = useState({});
  const [selectedArtists, setSelectedArtists] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <main className="min-h-screen bg-[#121212] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Genera tu Playlist
          </h2>
          <Header />
          {/* Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <GenreWidget 
              onSelect={setSelectedGenres}
              selectedItems={selectedGenres}
            />
            
            <DecadeWidget 
              onSelect={setSelectedDecades}
              selectedItems={selectedDecades}
            />

            <MoodWidget 
              onSelect={setMoodValues}
              selectedItems={moodValues}
            />

            <PopularityWidget 
              onSelect={setPopularityValues}
              selectedItems={popularityValues}
            />

            <ArtistWidget 
              onSelect={setSelectedArtists}
              selectedItems={selectedArtists}
            />
          </div>
        </div>
      </main>
    </>
  );
}