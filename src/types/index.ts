/**
 * Re-export centralized types for easier migration
 * This helps existing components transition to centralized types
 */

export type {
  SpotifyTrack as Track,
  SpotifyArtist as Artist,
  SpotifyUserProfile as UserProfile,
  SpotifyPlaylist as Playlist,
  SpotifyAlbum as Album,
  SpotifyImage as Image,
  TopTracksData,
  TopArtistsData,
  RecentlyPlayedData,
  RecentlyPlayedTrack,
  CurrentlyPlayingTrack,
  PlaylistsData,
  TimeRange,
  ListeningHabitsAnalysis,
  MusicDiscoveryInsights,
  StatisticsOverview,
  SpotifyApiResponse,
  PaginationOptions,
  TimeRangeOptions,
  ListeningStats,
} from "./spotify";

// Legacy aliases for backward compatibility
export type {
  SpotifyTrack,
  SpotifyArtist,
  SpotifyUserProfile,
} from "./spotify";
