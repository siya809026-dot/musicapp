import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { MoodScene } from '../components/three/MoodScene';
import { SongCard } from '../components/ui/SongCard';
import { useApp } from '../context/AppContext';
import { moods, getMoodById } from '../data/moods';
import { RecommendationService } from '../services/recommendation';
import { searchSongs } from '../data/songs';

export const DiscoverPage: React.FC = () => {
  const { currentMood, moodConfig, setMood, queue, addToQueue } = useApp();
  const [selectedMood, setSelectedMood] = useState<string | null>(currentMood);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoodSelector, setShowMoodSelector] = useState(!currentMood);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);

  const recommendations = useMemo(() => {
    if (searchQuery) {
      return { songs: searchSongs(searchQuery), reason: `Search results for "${searchQuery}"`, recommendationType: 'search' };
    }
    if (!selectedMood) return null;
    return RecommendationService.getRecommendations({ mood: selectedMood });
  }, [selectedMood, searchQuery]);

  const filteredSongs = useMemo(() => {
    if (!recommendations) return [];
    if (genreFilter) {
      return recommendations.songs.filter(s => s.genre === genreFilter);
    }
    return recommendations.songs;
  }, [recommendations, genreFilter]);

  const genres = useMemo(() => {
    if (!recommendations) return [];
    const genreSet = new Set(recommendations.songs.map(s => s.genre));
    return Array.from(genreSet);
  }, [recommendations]);

  const handleMoodSelect = (moodId: string) => {
    const config = getMoodById(moodId);
    if (config) {
      setSelectedMood(moodId);
      setMood(moodId, config);
      setShowMoodSelector(false);
      setGenreFilter(null);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 3D Background */}
      <MoodScene moodConfig={moodConfig} className="absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 pt-20 pb-32 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {showMoodSelector ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
                How are you feeling?
              </h1>
              <p className="text-gray-400 text-center mb-8">
                Select your mood to get personalized recommendations
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {Object.values(moods).map((mood, i) => (
                  <motion.button
                    key={mood.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodSelect(mood.id)}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all text-center group"
                    style={{
                      borderColor: selectedMood === mood.id ? mood.colors.primary : undefined,
                    }}
                  >
                    <span className="text-3xl mb-2 block">{mood.emoji}</span>
                    <span className="text-white text-sm font-medium">{mood.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{moodConfig?.emoji}</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {moodConfig?.name} Vibes
                    </h1>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {recommendations?.reason || 'Discover songs for your mood'}
                  </p>
                </div>
                <button
                  onClick={() => setShowMoodSelector(true)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
                >
                  Change Mood
                </button>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search songs, artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setGenreFilter(null)}
                    className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      !genreFilter ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    All
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setGenreFilter(genre === genreFilter ? null : genre)}
                      className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors capitalize ${
                        genreFilter === genre ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Songs Grid */}
              {filteredSongs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredSongs.map((song, i) => (
                    <SongCard key={song.id} song={song} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400">No songs found. Try a different search or mood.</p>
                </div>
              )}

              {/* Add all to queue button */}
              {filteredSongs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={() => filteredSongs.forEach(s => addToQueue(s))}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                  >
                    Add All to Queue ({filteredSongs.length} songs)
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
