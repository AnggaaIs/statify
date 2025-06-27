/**
 * Centralized Spotify-related types and interfaces
 * Used across all components for consistency
 */

export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  popularity: number;
  followers?: { total: number };
  genres: string[];
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  release_date?: string;
  album_type?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  external_urls: SpotifyExternalUrls;
  preview_url?: string;
  explicit?: boolean;
  disc_number?: number;
  track_number?: number;
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email?: string;
  followers: number; // Already flattened from API response
  images: SpotifyImage[];
  country: string;
  product: string;
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  public: boolean;
  collaborative: boolean;
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
    items?: SpotifyPlaylistTrack[];
  };
}

export interface RecentlyPlayedTrack {
  track: SpotifyTrack;
  played_at: string;
  context?: {
    type: string;
    href: string;
    external_urls: SpotifyExternalUrls;
  };
}

export interface CurrentlyPlayingTrack {
  is_playing: boolean;
  current_track: {
    name: string;
    artist: string;
    duration_ms: number;
    progress_ms: number;
    album?: {
      name: string;
      images: SpotifyImage[];
    };
    external_urls?: SpotifyExternalUrls;
  } | null;
}

export interface SpotifyDevice {
  id: string | null;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string; // "computer", "smartphone", "speaker", etc.
  volume_percent: number | null;
  supports_volume: boolean;
}

export interface SpotifyDevicesResponse {
  devices: SpotifyDevice[];
}

// API Response Types
export interface SpotifyApiResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export type TopTracksData = SpotifyApiResponse<SpotifyTrack>;
export type TopArtistsData = SpotifyApiResponse<SpotifyArtist>;
export type RecentlyPlayedData = SpotifyApiResponse<RecentlyPlayedTrack>;
export type PlaylistsData = SpotifyApiResponse<SpotifyPlaylist>;

// Time Range Types
export type TimeRange = "short_term" | "medium_term" | "long_term";

// Statistics Types
export interface ListeningHabitsAnalysis {
  hourlyDistribution: Array<{ hour: number; count: number }>;
  dayOfWeekDistribution: Array<{ day: string; count: number }>;
  averageSessionLength: number;
  mostActiveHour: number | null;
  mostActiveDay: string | null;
  listeningPatterns: string[];
  topRecentArtists: Array<{ name: string; count: number }>;
  avgSongLength: number;
  totalListeningTime: number;
  uniqueTracksCount: number;
  repeatRate: number;
}

export interface ListeningStats {
  totalPlaytime: string;
  topGenres: string[];
  averageListeningTime: string;
  totalTracks: number;
  totalArtists: number;
  mostActiveTime: string;
}

export interface MusicDiscoveryInsights {
  adventurousnessScore: number;
  undergroundRatio: number;
  consistentFavorites: Array<{
    artist: SpotifyArtist;
    count: number;
    timeRanges: TimeRange[];
  }>;
  hiddenGems: SpotifyTrack[];
  risingStars: SpotifyArtist[];
  genreEvolution: {
    emerging: string[];
    declining: string[];
    stable: string[];
  };
  seasonalPreferences: Record<string, any>;
}

export interface StatisticsOverview {
  tracks: {
    total: number;
    avgPopularity: number;
    avgDuration: number;
    avgEnergy: number;
    popularityDistribution: Record<string, number>;
  };
  artists: {
    total: number;
    avgPopularity: number;
    topGenres: Array<{ genre: string; count: number }>;
  };
  diversity: {
    genreCount: number;
    avgFollowers: number;
    maxFollowers: number;
    minFollowers: number;
  };
  listeningTime: {
    total: number;
    average: number;
    recentTracks: number;
    recentArtists: number;
  };
  timeRanges: Record<
    TimeRange,
    {
      tracks: number;
      artists: number;
      topGenre: string;
    }
  >;
}

// Audio Features (for future use)
export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

// Error Types
export interface SpotifyApiError {
  error: {
    status: number;
    message: string;
  };
}

// Utility Types
export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface TimeRangeOptions {
  time_range?: TimeRange;
  limit?: number;
  offset?: number;
}
