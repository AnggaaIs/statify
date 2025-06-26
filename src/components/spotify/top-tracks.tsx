"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useApiError } from "@/hooks/use-api-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Music,
  ExternalLink,
  RefreshCw,
  Clock,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";

interface Track {
  id: string;
  name: string;
  artists: Array<{
    name: string;
    external_urls: {
      spotify: string;
    };
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  popularity: number;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

interface TopTracksData {
  items: Track[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export function TopTracksCard() {
  const { get_top_tracks, loading } = useSpotify();
  const { handleApiError } = useApiError();
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [displayedTracks, setDisplayedTracks] = useState<Track[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalTracks, setTotalTracks] = useState(0);
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const TRACKS_PER_PAGE = 5;

  const fetchTopTracks = async (selectedTimeRange: typeof timeRange) => {
    try {
      const data = (await get_top_tracks(
        selectedTimeRange,
        50
      )) as TopTracksData;

      if (data?.items) {
        setAllTracks(data.items);
        setDisplayedTracks(data.items.slice(0, TRACKS_PER_PAGE));
        setCurrentPage(0);
        setTotalTracks(data.items.length);
      }
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      handleApiError(error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTopTracks(timeRange);
  }, [timeRange]);

  const loadMoreTracks = () => {
    setIsLoadingMore(true);

    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = (nextPage + 1) * TRACKS_PER_PAGE;

      setDisplayedTracks(allTracks.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimeRangeLabel = (range: typeof timeRange) => {
    switch (range) {
      case "short_term":
        return "Last 4 Weeks";
      case "medium_term":
        return "Last 6 Months";
      case "long_term":
        return "All Time";
      default:
        return "Last 6 Months";
    }
  };

  const getTrackImage = (track: Track) => {
    return track.album.images?.[0]?.url || null;
  };

  const hasMoreTracks = displayedTracks.length < allTracks.length;

  if (isInitialLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-purple-50/20 via-background to-purple-50/10 dark:from-purple-950/20 dark:via-background dark:to-purple-900/10 border-purple-200/30 dark:border-purple-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
            Top Tracks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted rounded-lg animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!allTracks.length) {
    return (
      <Card className="w-full flex flex-col bg-gradient-to-br from-purple-50/20 via-background to-purple-50/10 dark:from-purple-950/20 dark:via-background dark:to-purple-900/10 border-purple-200/30 dark:border-purple-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Top Tracks
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No top tracks found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Listen to more music on Spotify to see your top tracks
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full flex flex-col bg-gradient-to-br from-purple-50/20 via-background to-purple-50/10 dark:from-purple-950/20 dark:via-background dark:to-purple-900/10 border-purple-200/30 dark:border-purple-800/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            Top Tracks
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTopTracks(timeRange)}
            disabled={loading}
            className="flex-shrink-0"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Time Range Selector - Improved responsive design */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Time Range
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  value: "short_term",
                  label: "4 Weeks",
                  shortLabel: "4W",
                  icon: Clock,
                },
                {
                  value: "medium_term",
                  label: "6 Months",
                  shortLabel: "6M",
                  icon: Calendar,
                },
                {
                  value: "long_term",
                  label: "All Time",
                  shortLabel: "All",
                  icon: TrendingUp,
                },
              ].map(({ value, label, shortLabel, icon: Icon }) => (
                <Button
                  key={value}
                  variant={timeRange === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(value as typeof timeRange)}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{shortLabel}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Current Time Range Display - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
          <span className="truncate">
            Top tracks from {getTimeRangeLabel(timeRange).toLowerCase()}
          </span>
          <span className="text-xs sm:text-sm flex-shrink-0">
            {displayedTracks.length} of {totalTracks}
          </span>
        </div>

        {/* Tracks List */}
        <div className="space-y-3">
          {displayedTracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group min-w-0"
            >
              {/* Rank */}
              <div className="w-6 text-center flex-shrink-0">
                <span className="text-base sm:text-lg font-bold text-muted-foreground">
                  {index + 1}
                </span>
              </div>

              {/* Album Art */}
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0">
                <AvatarImage
                  src={getTrackImage(track) || ""}
                  alt={track.album.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">
                  <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                </AvatarFallback>
              </Avatar>

              {/* Track Info - Takes remaining space */}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="font-medium truncate text-sm sm:text-base">
                  {track.name}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                  {track.album.name}
                </p>
              </div>

              {/* Track Stats - Right side */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Duration & Popularity - Stack on mobile */}
                <div className="hidden sm:flex flex-col items-end gap-1 text-xs sm:text-sm text-muted-foreground">
                  <span>{formatDuration(track.duration_ms)}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full" />
                    <span className="text-xs">{track.popularity}%</span>
                  </div>
                </div>

                {/* Mobile stats - Show as single line */}
                <div className="sm:hidden flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDuration(track.duration_ms)}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span>{track.popularity}%</span>
                  </div>
                </div>

                {/* External Link */}
                <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-8 sm:w-8"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreTracks && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={loadMoreTracks}
              disabled={isLoadingMore}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoadingMore ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isLoadingMore
                  ? "Loading..."
                  : `Load More (${
                      allTracks.length - displayedTracks.length
                    } remaining)`}
              </span>
              <span className="sm:hidden">
                {isLoadingMore ? "Loading..." : "Load More"}
              </span>
            </Button>
          </div>
        )}

        {/* No More Tracks Message */}
        {!hasMoreTracks && displayedTracks.length > TRACKS_PER_PAGE && (
          <div className="text-center pt-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              All {totalTracks} tracks shown
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TopTracksDetails() {
  const { get_top_tracks, loading } = useSpotify();
  const { handleApiError } = useApiError();
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [sortBy, setSortBy] = useState<"rank" | "popularity" | "duration">(
    "rank"
  );
  const [filterGenre, setFilterGenre] = useState<string>("all");

  const fetchTopTracks = async (selectedTimeRange: typeof timeRange) => {
    setIsLoading(true);
    try {
      const data = (await get_top_tracks(
        selectedTimeRange,
        50
      )) as TopTracksData;

      if (data?.items) {
        setAllTracks(data.items);
      }
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopTracks(timeRange);
  }, [timeRange]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimeRangeLabel = (range: typeof timeRange) => {
    switch (range) {
      case "short_term":
        return "Last 4 Weeks";
      case "medium_term":
        return "Last 6 Months";
      case "long_term":
        return "All Time";
      default:
        return "Last 6 Months";
    }
  };

  const getTrackImage = (track: Track) => {
    return track.album.images?.[0]?.url || null;
  };

  const getAllArtists = () => {
    const artists = new Set<string>();
    allTracks.forEach((track) => {
      track.artists.forEach((artist) => artists.add(artist.name));
    });
    return Array.from(artists).sort();
  };

  const getAllAlbums = () => {
    const albums = new Set<string>();
    allTracks.forEach((track) => {
      albums.add(track.album.name);
    });
    return Array.from(albums).sort();
  };

  const sortedTracks = [...allTracks].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularity - a.popularity;
      case "duration":
        return b.duration_ms - a.duration_ms;
      case "rank":
      default:
        return 0; // Keep original order (rank)
    }
  });

  const getAverageStats = () => {
    if (!allTracks.length)
      return { avgPopularity: 0, avgDuration: 0, totalDuration: 0 };

    const avgPopularity = Math.round(
      allTracks.reduce((sum, track) => sum + track.popularity, 0) /
        allTracks.length
    );
    const totalDuration = allTracks.reduce(
      (sum, track) => sum + track.duration_ms,
      0
    );
    const avgDuration = totalDuration / allTracks.length;

    return { avgPopularity, avgDuration, totalDuration };
  };

  const stats = getAverageStats();
  const totalHours = Math.floor(stats.totalDuration / (1000 * 60 * 60));
  const totalMinutes = Math.floor(
    (stats.totalDuration % (1000 * 60 * 60)) / (1000 * 60)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-8 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!allTracks.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Top Tracks Found</h3>
            <p className="text-muted-foreground">
              Listen to more music on Spotify to see your detailed top tracks
              statistics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-gradient-to-br from-purple-50/20 via-background to-purple-50/10 dark:from-purple-950/20 dark:via-background dark:to-purple-900/10 border-purple-200/30 dark:border-purple-800/30">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Tracks Overview
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Your {getTimeRangeLabel(timeRange).toLowerCase()} listening
                statistics
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchTopTracks(timeRange)}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { value: "short_term", label: "4 Weeks", icon: Clock },
              { value: "medium_term", label: "6 Months", icon: Calendar },
              { value: "long_term", label: "All Time", icon: TrendingUp },
            ].map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={timeRange === value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(value as typeof timeRange)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </CardHeader>

        {/* Statistics Overview */}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Total Tracks</span>
              </div>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {allTracks.length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Avg Popularity</span>
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {stats.avgPopularity}%
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Avg Duration</span>
              </div>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {formatDuration(stats.avgDuration)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">Total Time</span>
              </div>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                {totalHours}h {totalMinutes}m
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium">Unique Artists</span>
              </div>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                {getAllArtists().length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Unique Albums</span>
              </div>
              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                {getAllAlbums().length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <Card className="bg-gradient-to-br from-purple-50/20 via-background to-purple-50/10 dark:from-purple-950/20 dark:via-background dark:to-purple-900/10 border-purple-200/30 dark:border-purple-800/30">
        <CardContent className="pt-6 ">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 ">
              <span className="text-sm font-medium">Sort by:</span>
              <div className="flex gap-1">
                {[
                  { value: "rank", label: "Rank" },
                  { value: "popularity", label: "Popularity" },
                  { value: "duration", label: "Duration" },
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={sortBy === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy(value as typeof sortBy)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {sortedTracks.length} tracks
            </div>
          </div>

          {/* Tracks Grid */}
          <div className="grid grid-cols-1 gap-4">
            {sortedTracks.map((track, index) => {
              const originalIndex = allTracks.findIndex(
                (t) => t.id === track.id
              );
              return (
                <div
                  key={track.id}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() =>
                    setSelectedTrack(
                      selectedTrack?.id === track.id ? null : track
                    )
                  }
                >
                  {/* Rank */}
                  <div className="flex flex-col items-center min-w-[2rem] sm:min-w-[2.5rem]">
                    <span className="text-base sm:text-lg font-bold text-muted-foreground">
                      #{originalIndex + 1}
                    </span>
                    {sortBy === "popularity" && (
                      <div className="w-1 h-6 sm:h-8 bg-gradient-to-t from-purple-200 to-purple-500 rounded-full mt-1">
                        <div
                          className="w-1 bg-purple-500 rounded-full transition-all"
                          style={{
                            height: `${(track.popularity / 100) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Album Art */}
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex-shrink-0">
                    <AvatarImage
                      src={getTrackImage(track) || ""}
                      alt={track.album.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-lg">
                      <Music className="w-4 h-4 sm:w-6 sm:h-6" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-semibold truncate text-sm sm:text-base">
                      {track.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground truncate hidden sm:block">
                      {track.album.name}
                    </p>

                    {/* Stats - Mobile */}
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground sm:hidden">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(track.duration_ms)}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {track.popularity}%
                      </span>
                    </div>
                  </div>

                  {/* Stats - Desktop */}
                  <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-muted-foreground min-w-[4rem]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(track.duration_ms)}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {track.popularity}%
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-8 sm:w-8"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Track Detail Modal/Card */}
      {selectedTrack && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-500" />
                Track Details
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTrack(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Album Art */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 rounded-xl">
                  <AvatarImage
                    src={getTrackImage(selectedTrack) || ""}
                    alt={selectedTrack.album.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-xl">
                    <Music className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Track Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{selectedTrack.name}</h3>
                <p className="text-lg text-muted-foreground mb-1">
                  {selectedTrack.artists
                    .map((artist) => artist.name)
                    .join(", ")}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Album: {selectedTrack.album.name}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Duration
                    </span>
                    <p className="text-lg font-semibold">
                      {formatDuration(selectedTrack.duration_ms)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Popularity
                    </span>
                    <p className="text-lg font-semibold">
                      {selectedTrack.popularity}%
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Rank
                    </span>
                    <p className="text-lg font-semibold">
                      #
                      {allTracks.findIndex((t) => t.id === selectedTrack.id) +
                        1}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Link
                    href={selectedTrack.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Open in Spotify
                    </Button>
                  </Link>
                  {selectedTrack.preview_url && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Music className="w-4 h-4" />
                      Preview
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
