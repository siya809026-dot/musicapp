import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, Trash2 } from 'lucide-react';
import { MoodScene } from '../components/three/MoodScene';
import { SongCard } from '../components/ui/SongCard';
import { useApp } from '../context/AppContext';

export const FavoritesPage: React.FC = () => {
  const { favorites, moodConfig, removeFromFavorites } = useApp();

  return (
    <div className="relative min-h-screen">
      <MoodScene moodConfig={moodConfig} className="absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 pointer-events-none" />

      <div className="relative z-10 pt-20 pb-32 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Your Favorites</h1>
          </div>
          <p className="text-gray-400 mb-8">
            {favorites.length} {favorites.length === 1 ? 'song' : 'songs'} saved
          </p>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favorites.map((song, i) => (
                <SongCard key={song.id} song={song} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Music size={32} className="text-gray-500" />
              </div>
              <h3 className="text-xl text-white mb-2">No favorites yet</h3>
              <p className="text-gray-400">
                Start exploring and save songs you love!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
