export interface MoodConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  particleSpeed: number;
  particleCount: number;
  animationIntensity: number;
  genres: string[];
}

export const moods: Record<string, MoodConfig> = {
  happy: {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    description: 'Feeling joyful and upbeat',
    colors: {
      primary: '#FFD700',
      secondary: '#FF8C00',
      accent: '#FF6347',
      background: '#1a1a2e',
    },
    particleSpeed: 1.5,
    particleCount: 200,
    animationIntensity: 0.8,
    genres: ['pop', 'indie', 'dance', 'funk'],
  },
  sad: {
    id: 'sad',
    name: 'Sad',
    emoji: '😢',
    description: 'Feeling melancholic and reflective',
    colors: {
      primary: '#4A90D9',
      secondary: '#2C3E50',
      accent: '#8E44AD',
      background: '#0d1117',
    },
    particleSpeed: 0.3,
    particleCount: 100,
    animationIntensity: 0.3,
    genres: ['ballad', 'acoustic', 'indie', 'soul'],
  },
  angry: {
    id: 'angry',
    name: 'Angry',
    emoji: '😤',
    description: 'Feeling intense and powerful',
    colors: {
      primary: '#FF4444',
      secondary: '#8B0000',
      accent: '#FF6600',
      background: '#1a0000',
    },
    particleSpeed: 2.5,
    particleCount: 300,
    animationIntensity: 1.0,
    genres: ['rock', 'metal', 'hip-hop', 'punk'],
  },
  relaxed: {
    id: 'relaxed',
    name: 'Relaxed',
    emoji: '😌',
    description: 'Feeling calm and peaceful',
    colors: {
      primary: '#00CED1',
      secondary: '#20B2AA',
      accent: '#48D1CC',
      background: '#0a1628',
    },
    particleSpeed: 0.4,
    particleCount: 80,
    animationIntensity: 0.2,
    genres: ['ambient', 'lo-fi', 'jazz', 'classical'],
  },
  romantic: {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💕',
    description: 'Feeling loving and dreamy',
    colors: {
      primary: '#FF69B4',
      secondary: '#FF1493',
      accent: '#DB7093',
      background: '#1a0a1e',
    },
    particleSpeed: 0.6,
    particleCount: 120,
    animationIntensity: 0.5,
    genres: ['r&b', 'soul', 'pop', 'jazz'],
  },
  energetic: {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    description: 'Feeling pumped and ready to go',
    colors: {
      primary: '#00FF88',
      secondary: '#00CC66',
      accent: '#33FF99',
      background: '#0a1a0a',
    },
    particleSpeed: 2.0,
    particleCount: 250,
    animationIntensity: 0.9,
    genres: ['edm', 'hip-hop', 'rock', 'pop'],
  },
  focused: {
    id: 'focused',
    name: 'Focused',
    emoji: '🎯',
    description: 'Feeling concentrated and determined',
    colors: {
      primary: '#7B68EE',
      secondary: '#6A5ACD',
      accent: '#9370DB',
      background: '#0f0f1a',
    },
    particleSpeed: 0.5,
    particleCount: 60,
    animationIntensity: 0.3,
    genres: ['classical', 'ambient', 'lo-fi', 'electronic'],
  },
  neutral: {
    id: 'neutral',
    name: 'Neutral',
    emoji: '😐',
    description: 'Feeling balanced and steady',
    colors: {
      primary: '#9B59B6',
      secondary: '#8E44AD',
      accent: '#BB8FCE',
      background: '#121212',
    },
    particleSpeed: 0.8,
    particleCount: 100,
    animationIntensity: 0.5,
    genres: ['pop', 'indie', 'alternative', 'electronic'],
  },
};

export const getMoodById = (id: string): MoodConfig | undefined => moods[id];
