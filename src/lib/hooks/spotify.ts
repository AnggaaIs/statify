"use client";

import { useAuth } from "@/lib/auth/context";
import { useState, useEffect, useCallback } from "react";
import { useApiErrorHandler } from "./useApiErrorHandler";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  popularity: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
}

interface NowPlayingData {
  is_playing: boolean;
  item: SpotifyTrack | null;
  progress_ms: number;
  device: {
    name: string;
    type: string;
  } | null;
}

interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
  } | null;
}

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  country: string;
  product: string;
  followers: {
    total: number;
  };
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: {
    spotify: string;
  };
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
}

interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: {
    spotify: string;
  };
}

export function useSpotify() {
  const { user } = useAuth();
  const { handleApiError } = useApiErrorHandler();
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    // Early return if no user
    if (!user) {
      setNowPlaying(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/spotify/now-playing");

      if (!response.ok) {
        await handleApiError(null, response);
        throw new Error("Failed to fetch now playing");
      }

      const data = await response.json();
      setNowPlaying(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setNowPlaying(null);
    } finally {
      setLoading(false);
    }
  }, [user, handleApiError]);

  useEffect(() => {
    if (!user) {
      setNowPlaying(null);
      setError(null);
      setLoading(false);
      return;
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 3000);
    return () => clearInterval(interval);
  }, [user, fetchNowPlaying]);

  return {
    nowPlaying,
    loading,
    error,
    refetch: fetchNowPlaying,
  };
}

export function useTopTracks(
  timeRange: "short_term" | "medium_term" | "long_term" = "medium_term"
) {
  const { user } = useAuth();
  const { handleApiError } = useApiErrorHandler();
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopTracks = useCallback(async () => {
    if (!user) {
      setTopTracks([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/spotify/top-tracks?time_range=${timeRange}&limit=50`
      );

      if (!response.ok) {
        await handleApiError(null, response);
        throw new Error("Failed to fetch top tracks");
      }

      const data = await response.json();
      setTopTracks(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setTopTracks([]);
    } finally {
      setLoading(false);
    }
  }, [user, timeRange, handleApiError]);

  useEffect(() => {
    if (!user) {
      setTopTracks([]);
      setError(null);
      setLoading(false);
      return;
    }

    fetchTopTracks();
  }, [user, fetchTopTracks]);

  return {
    topTracks,
    loading,
    error,
    refetch: fetchTopTracks,
  };
}

export function useTopArtists(
  timeRange: "short_term" | "medium_term" | "long_term" = "medium_term"
) {
  const { user } = useAuth();
  const { handleApiError } = useApiErrorHandler();
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopArtists = useCallback(async () => {
    if (!user) {
      setTopArtists([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/spotify/top-artists?time_range=${timeRange}&limit=50`
      );

      if (!response.ok) {
        await handleApiError(null, response);
        throw new Error("Failed to fetch top artists");
      }

      const data = await response.json();
      setTopArtists(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setTopArtists([]);
    } finally {
      setLoading(false);
    }
  }, [user, timeRange, handleApiError]);

  useEffect(() => {
    if (!user) {
      setTopArtists([]);
      setError(null);
      setLoading(false);
      return;
    }

    fetchTopArtists();
  }, [user, fetchTopArtists]);

  return {
    topArtists,
    loading,
    error,
    refetch: fetchTopArtists,
  };
}

export function useRecentlyPlayed() {
  const { user } = useAuth();
  const { handleApiError } = useApiErrorHandler();
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentlyPlayed = useCallback(async () => {
    if (!user) {
      setRecentlyPlayed([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/spotify/recently-played");

      if (!response.ok) {
        await handleApiError(null, response);
        throw new Error("Failed to fetch recently played");
      }

      const data = await response.json();
      setRecentlyPlayed(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setRecentlyPlayed([]);
    } finally {
      setLoading(false);
    }
  }, [user, handleApiError]);

  useEffect(() => {
    if (!user) {
      setRecentlyPlayed([]);
      setError(null);
      setLoading(false);
      return;
    }

    fetchRecentlyPlayed();
    const interval = setInterval(fetchRecentlyPlayed, 30000);
    return () => clearInterval(interval);
  }, [user, fetchRecentlyPlayed]);

  return {
    recentlyPlayed,
    loading,
    error,
    refetch: fetchRecentlyPlayed,
  };
}

export function useUserProfile() {
  const { user } = useAuth();
  const { handleApiError } = useApiErrorHandler();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/spotify/profile");

      if (!response.ok) {
        await handleApiError(null, response);
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user, handleApiError]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setError(null);
      setLoading(false);
      return;
    }

    fetchUserProfile();
  }, [user, fetchUserProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchUserProfile,
  };
}

export type {
  SpotifyTrack,
  NowPlayingData,
  RecentlyPlayedItem,
  UserProfile,
  SpotifyArtist,
};
