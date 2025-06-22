"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
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

        {/* Time Range Selector - Responsive */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              value: "short_term",
              label: "4W",
              fullLabel: "4 Weeks",
              icon: Clock,
            },
            {
              value: "medium_term",
              label: "6M",
              fullLabel: "6 Months",
              icon: Calendar,
            },
            {
              value: "long_term",
              label: "All",
              fullLabel: "All Time",
              icon: TrendingUp,
            },
          ].map(({ value, label, fullLabel, icon: Icon }) => (
            <Button
              key={value}
              variant={timeRange === value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(value as typeof timeRange)}
              className="flex items-center gap-1 flex-shrink-0"
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{fullLabel}</span>
              <span className="sm:hidden">{label}</span>
            </Button>
          ))}
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
                <div className="flex flex-col items-end gap-1 text-xs sm:text-sm text-muted-foreground">
                  <span>{formatDuration(track.duration_ms)}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full" />
                    <span className="text-xs">{track.popularity}%</span>
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
