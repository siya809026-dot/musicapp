import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Song } from '../data/songs';
import { MoodConfig } from '../data/moods';

interface AppState {
  currentMood: string | null;
  moodConfig: MoodConfig | null;
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: Song[];
  queue: Song[];
  volume: number;
  progress: number;
  listeningHistory: { mood: string; timestamp: number }[];
}

interface AppContextType extends AppState {
  setMood: (mood: string, config: MoodConfig) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (vol: number) => void;
  setProgress: (prog: number) => void;
  addToFavorites: (song: Song) => void;
  removeFromFavorites: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  addToQueue: (song: Song) => void;
  clearMood: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const savedFavorites = localStorage.getItem('moodsphere_favorites');
    const savedHistory = localStorage.getItem('moodsphere_history');
    return {
      currentMood: null,
      moodConfig: null,
      currentSong: null,
      isPlaying: false,
      favorites: savedFavorites ? JSON.parse(savedFavorites) : [],
      queue: [],
      volume: 75,
      progress: 0,
      listeningHistory: savedHistory ? JSON.parse(savedHistory) : [],
    };
  });

  useEffect(() => {
    localStorage.setItem('moodsphere_favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    localStorage.setItem('moodsphere_history', JSON.stringify(state.listeningHistory));
  }, [state.listeningHistory]);

  // Simulate progress
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state.isPlaying && state.currentSong) {
      interval = setInterval(() => {
        setState(prev => {
          const newProgress = prev.progress + 1;
          if (newProgress >= (prev.currentSong?.duration || 0)) {
            return { ...prev, progress: 0, isPlaying: false };
          }
          return { ...prev, progress: newProgress };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isPlaying, state.currentSong]);

  const setMood = useCallback((mood: string, config: MoodConfig) => {
    setState(prev => ({
      ...prev,
      currentMood: mood,
      moodConfig: config,
      listeningHistory: [...prev.listeningHistory, { mood, timestamp: Date.now() }],
    }));
  }, []);

  const playSong = useCallback((song: Song) => {
    setState(prev => ({
      ...prev,
      currentSong: song,
      isPlaying: true,
      progress: 0,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const nextSong = useCallback(() => {
    setState(prev => {
      if (!prev.currentSong || prev.queue.length === 0) return prev;
      const currentIndex = prev.queue.findIndex(s => s.id === prev.currentSong?.id);
      const nextIndex = (currentIndex + 1) % prev.queue.length;
      return { ...prev, currentSong: prev.queue[nextIndex], progress: 0, isPlaying: true };
    });
  }, []);

  const prevSong = useCallback(() => {
    setState(prev => {
      if (!prev.currentSong || prev.queue.length === 0) return prev;
      const currentIndex = prev.queue.findIndex(s => s.id === prev.currentSong?.id);
      const prevIndex = currentIndex <= 0 ? prev.queue.length - 1 : currentIndex - 1;
      return { ...prev, currentSong: prev.queue[prevIndex], progress: 0, isPlaying: true };
    });
  }, []);

  const setVolume = useCallback((vol: number) => {
    setState(prev => ({ ...prev, volume: vol }));
  }, []);

  const setProgress = useCallback((prog: number) => {
    setState(prev => ({ ...prev, progress: prog }));
  }, []);

  const addToFavorites = useCallback((song: Song) => {
    setState(prev => ({
      ...prev,
      favorites: [...prev.favorites, song],
    }));
  }, []);

  const removeFromFavorites = useCallback((songId: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.filter(s => s.id !== songId),
    }));
  }, []);

  const isFavorite = useCallback((songId: string) => {
    return state.favorites.some(s => s.id === songId);
  }, [state.favorites]);

  const addToQueue = useCallback((song: Song) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue.filter(s => s.id !== song.id), song],
    }));
  }, []);

  const clearMood = useCallback(() => {
    setState(prev => ({ ...prev, currentMood: null, moodConfig: null }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setMood,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        setVolume,
        setProgress,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addToQueue,
        clearMood,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
