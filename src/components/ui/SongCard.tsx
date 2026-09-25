import React from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Plus } from 'lucide-react';
import { Song } from '../../data/songs';
import { useApp } from '../../context/AppContext';

interface SongCardProps {
  song: Song;
  index?: number;
}

export const SongCard: React.FC<SongCardProps> = ({ song, index = 0 }) => {
  const { playSong, addToFavorites, removeFromFavorites, isFavorite, addToQueue } = useApp();
  const { currentSong, isPlaying } = useApp();
  const isActive = currentSong?.id === song.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
        isActive ? 'ring-1 ring-purple-500/50 bg-white/10' : ''
      }`}
      onClick={() => playSong(song)}
    >
      {/* Cover */}
      <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${song.coverGradient} mb-3 relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            {isActive && isPlaying ? (
              <div className="flex gap-0.5">
                <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-black rounded-full" />
                <motion.div animate={{ height: [16, 8, 16] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-black rounded-full" />
                <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-black rounded-full" />
              </div>
            ) : (
              <Play size={20} className="text-black ml-0.5" />
            )}
          </div>
        </div>
        {isActive && isPlaying && (
          <div className="absolute bottom-2 left-2 flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                className="w-1 bg-white rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="text-white text-sm font-medium truncate">{song.title}</h3>
      <p className="text-gray-400 text-xs truncate mt-0.5">{song.artist}</p>
      
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">{song.genre}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              isFavorite(song.id) ? removeFromFavorites(song.id) : addToFavorites(song);
            }}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <Heart size={14} className={isFavorite(song.id) ? 'text-pink-500 fill-pink-500' : 'text-gray-400'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToQueue(song);
            }}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <Plus size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
