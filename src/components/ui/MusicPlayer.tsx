import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    volume,
    setVolume,
    progress,
    setProgress,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useApp();

  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (progress / currentSong.duration) * 100;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10"
    >
      {/* Progress bar */}
      <div
        className="h-1 w-full bg-white/10 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          setProgress(percent * currentSong.duration);
        }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentSong.coverGradient} flex-shrink-0`} />
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{currentSong.title}</p>
            <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
          </div>
          <button
            onClick={() => isFavorite(currentSong.id) ? removeFromFavorites(currentSong.id) : addToFavorites(currentSong)}
            className="ml-2 flex-shrink-0"
          >
            <Heart
              size={18}
              className={isFavorite(currentSong.id) ? 'text-pink-500 fill-pink-500' : 'text-gray-400 hover:text-white'}
            />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={prevSong} className="text-gray-400 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={18} className="text-black" />
            ) : (
              <Play size={18} className="text-black ml-0.5" />
            )}
          </button>
          <button onClick={nextSong} className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Time & Volume */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-xs text-gray-400 hidden sm:block">
            {formatTime(progress)} / {formatTime(currentSong.duration)}
          </span>
          <div className="hidden md:flex items-center gap-2">
            <Volume2 size={16} className="text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-1 accent-purple-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
