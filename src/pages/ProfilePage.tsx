import React from 'react';
import { motion } from 'framer-motion';
import { User, Music, Clock, Heart, TrendingUp } from 'lucide-react';
import { MoodScene } from '../components/three/MoodScene';
import { useApp } from '../context/AppContext';
import { moods } from '../data/moods';

export const ProfilePage: React.FC = () => {
  const { favorites, listeningHistory, currentMood, moodConfig } = useApp();

  const moodStats = listeningHistory.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMoods = Object.entries(moodStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const totalListeningTime = favorites.reduce((acc, song) => acc + song.duration, 0);
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="relative min-h-screen">
      <MoodScene moodConfig={moodConfig} className="absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 pointer-events-none" />

      <div className="relative z-10 pt-20 pb-32 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Music Lover</h1>
              <p className="text-gray-400 text-sm">Exploring moods through music</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Heart, label: 'Favorites', value: favorites.length, color: 'from-pink-500 to-rose-500' },
              { icon: Clock, label: 'Listen Time', value: formatDuration(totalListeningTime), color: 'from-blue-500 to-cyan-500' },
              { icon: TrendingUp, label: 'Mood Checks', value: listeningHistory.length, color: 'from-green-500 to-emerald-500' },
              { icon: Music, label: 'Current Mood', value: currentMood || 'None', color: 'from-purple-500 to-violet-500' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                  <stat.icon size={16} className="text-white" />
                </div>
                <p className="text-white font-semibold text-lg">{stat.value}</p>
                <p className="text-gray-400 text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Mood History */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Mood History</h2>
            {topMoods.length > 0 ? (
              <div className="space-y-3">
                {topMoods.map(([mood, count], i) => {
                  const moodConfig = moods[mood];
                  const maxCount = topMoods[0][1];
                  const percentage = (count / maxCount) * 100;
                  return (
                    <motion.div
                      key={mood}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xl w-8">{moodConfig?.emoji || '😐'}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white capitalize">{mood}</span>
                          <span className="text-xs text-gray-400">{count} times</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: moodConfig?.colors.primary || '#9B59B6' }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No mood history yet. Start exploring!</p>
            )}
          </div>

          {/* Recent Favorites */}
          {favorites.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Favorites</h2>
              <div className="space-y-2">
                {favorites.slice(-5).reverse().map((song, i) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${song.coverGradient} flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm truncate">{song.title}</p>
                      <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                    </div>
                    <span className="text-xs text-gray-500">{song.genre}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
