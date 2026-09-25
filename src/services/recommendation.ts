import { Song, songs, getSongsByMood } from '../data/songs';
import { getMoodById } from '../data/moods';

interface RecommendationResult {
  songs: Song[];
  recommendationType: string;
  confidence: number;
  reason: string;
}

interface RecommendationInput {
  mood: string;
  confidence?: number;
  favoriteGenres?: string[];
  listeningHistory?: string[];
}

// Strategy Pattern for recommendation algorithms
interface RecommendationStrategy {
  recommend(input: RecommendationInput): Song[];
  getType(): string;
  getReason(): string;
}

class MoodBasedStrategy implements RecommendationStrategy {
  private reason = '';
  
  recommend(input: RecommendationInput): Song[] {
    const moodSongs = getSongsByMood(input.mood);
    this.reason = `Songs matched to your ${input.mood} mood`;
    
    return moodSongs.sort((a, b) => {
      const aMatch = a.mood.filter(m => m === input.mood).length;
      const bMatch = b.mood.filter(m => m === input.mood).length;
      return bMatch - aMatch;
    });
  }
  
  getType(): string {
    return 'mood_based';
  }
  
  getReason(): string {
    return this.reason;
  }
}

class EnergyMatchingStrategy implements RecommendationStrategy {
  private reason = '';
  
  recommend(input: RecommendationInput): Song[] {
    const moodConfig = getMoodById(input.mood);
    if (!moodConfig) return [];
    
    const targetEnergy = moodConfig.animationIntensity;
    const moodSongs = getSongsByMood(input.mood);
    
    this.reason = `Songs with energy levels matching your ${input.mood} mood`;
    
    return moodSongs.sort((a, b) => {
      const aDiff = Math.abs(a.energy - targetEnergy);
      const bDiff = Math.abs(b.energy - targetEnergy);
      return aDiff - bDiff;
    });
  }
  
  getType(): string {
    return 'energy_matching';
  }
  
  getReason(): string {
    return this.reason;
  }
}

class GenrePreferenceStrategy implements RecommendationStrategy {
  private reason = '';
  
  recommend(input: RecommendationInput): Song[] {
    const moodSongs = getSongsByMood(input.mood);
    const favorites = input.favoriteGenres || [];
    
    this.reason = `Songs in your preferred genres that match your mood`;
    
    if (favorites.length === 0) return moodSongs;
    
    return moodSongs.sort((a, b) => {
      const aInFav = favorites.includes(a.genre) ? 1 : 0;
      const bInFav = favorites.includes(b.genre) ? 1 : 0;
      return bInFav - aInFav;
    });
  }
  
  getType(): string {
    return 'genre_preference';
  }
  
  getReason(): string {
    return this.reason;
  }
}

// Factory Pattern for creating strategies
class RecommendationFactory {
  static createStrategy(type: string): RecommendationStrategy {
    switch (type) {
      case 'mood_based':
        return new MoodBasedStrategy();
      case 'energy_matching':
        return new EnergyMatchingStrategy();
      case 'genre_preference':
        return new GenrePreferenceStrategy();
      default:
        return new MoodBasedStrategy();
    }
  }
  
  static getAllStrategies(): RecommendationStrategy[] {
    return [
      new MoodBasedStrategy(),
      new EnergyMatchingStrategy(),
      new GenrePreferenceStrategy(),
    ];
  }
}

// Main recommendation service
export class RecommendationService {
  static getRecommendations(input: RecommendationInput): RecommendationResult {
    const confidence = input.confidence || 0.8;
    
    // Select strategy based on available data
    let strategy: RecommendationStrategy;
    
    if (input.favoriteGenres && input.favoriteGenres.length > 0 && confidence > 0.7) {
      strategy = RecommendationFactory.createStrategy('genre_preference');
    } else if (confidence > 0.6) {
      strategy = RecommendationFactory.createStrategy('energy_matching');
    } else {
      strategy = RecommendationFactory.createStrategy('mood_based');
    }
    
    const recommendedSongs = strategy.recommend(input);
    
    return {
      songs: recommendedSongs,
      recommendationType: strategy.getType(),
      confidence,
      reason: strategy.getReason(),
    };
  }
  
  static getTopRecommendations(input: RecommendationInput, limit = 8): RecommendationResult {
    const result = this.getRecommendations(input);
    return {
      ...result,
      songs: result.songs.slice(0, limit),
    };
  }
  
  static getAllSongs(): Song[] {
    return songs;
  }
}
