"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useApiError } from "@/hooks/use-api-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Music,
  Clock,
  Calendar,
  TrendingUp,
  User,
  Headphones,
  BarChart3,
  Activity,
  Target,
  Zap,
  Star,
  Volume2,
  RefreshCw,
  PlayCircle,
  Heart,
  Mic,
  Radio,
  Timer,
  Users,
  PieChart,
  LineChart,
  Globe,
} from "lucide-react";
import {
  SpotifyTrack,
  SpotifyArtist,
  SpotifyUserProfile,
  TopTracksData,
  TopArtistsData,
  RecentlyPlayedData,
  RecentlyPlayedTrack,
  TimeRange,
  StatisticsOverview as StatisticsOverviewType,
} from "@/types/spotify";

export function StatisticsOverview() {
  const {
    get_top_tracks,
    get_top_artists,
    get_recently_played,
    get_user_profile,
  } = useSpotify();
  const { handleApiError } = useApiError();

  // Data states
  const [allTracks, setAllTracks] = useState<{
    [key in TimeRange]: SpotifyTrack[];
  }>({
    short_term: [],
    medium_term: [],
    long_term: [],
  });
  const [allArtists, setAllArtists] = useState<{
    [key in TimeRange]: SpotifyArtist[];
  }>({
    short_term: [],
    medium_term: [],
    long_term: [],
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedTrack[]>(
    []
  );
  const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(
    null
  );

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  // Active time range for display
  const [activeTimeRange, setActiveTimeRange] =
    useState<TimeRange>("medium_term");

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch data for all time ranges
      const timeRanges: TimeRange[] = [
        "short_term",
        "medium_term",
        "long_term",
      ];

      const tracksPromises = timeRanges.map(async (range) => {
        const data = (await get_top_tracks(range, 50)) as TopTracksData;
        return { range, data: data?.items || [] };
      });

      const artistsPromises = timeRanges.map(async (range) => {
        const data = (await get_top_artists(range, 50)) as TopArtistsData;
        return { range, data: data?.items || [] };
      });

      const [tracksResults, artistsResults, recentData, profileData] =
        await Promise.all([
          Promise.all(tracksPromises),
          Promise.all(artistsPromises),
          get_recently_played(50) as Promise<RecentlyPlayedData>,
          get_user_profile() as Promise<SpotifyUserProfile>,
        ]);

      // Update tracks state
      const newTracks = { ...allTracks };
      tracksResults.forEach(
        ({ range, data }: { range: TimeRange; data: SpotifyTrack[] }) => {
          newTracks[range] = data;
        }
      );
      setAllTracks(newTracks);

      // Update artists state
      const newArtists = { ...allArtists };
      artistsResults.forEach(
        ({ range, data }: { range: TimeRange; data: SpotifyArtist[] }) => {
          newArtists[range] = data;
        }
      );
      setAllArtists(newArtists);

      setRecentlyPlayed(recentData?.items || []);
      console.log("User profile data:", profileData);
      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching statistics data:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSpecificData = async (type: string) => {
    setRefreshing(type);
    try {
      if (type === "tracks") {
        const timeRanges: TimeRange[] = [
          "short_term",
          "medium_term",
          "long_term",
        ];
        const tracksPromises = timeRanges.map(async (range) => {
          const data = (await get_top_tracks(range, 50)) as TopTracksData;
          return { range, data: data?.items || [] };
        });
        const results = await Promise.all(tracksPromises);
        const newTracks = { ...allTracks };
        results.forEach(({ range, data }) => {
          newTracks[range] = data;
        });
        setAllTracks(newTracks);
      } else if (type === "artists") {
        const timeRanges: TimeRange[] = [
          "short_term",
          "medium_term",
          "long_term",
        ];
        const artistsPromises = timeRanges.map(async (range) => {
          const data = (await get_top_artists(range, 50)) as TopArtistsData;
          return { range, data: data?.items || [] };
        });
        const results = await Promise.all(artistsPromises);
        const newArtists = { ...allArtists };
        results.forEach(({ range, data }) => {
          newArtists[range] = data;
        });
        setAllArtists(newArtists);
      } else if (type === "recent") {
        const data = (await get_recently_played(50)) as RecentlyPlayedData;
        setRecentlyPlayed(data?.items || []);
      }
    } catch (error) {
      console.error(`Error refreshing ${type}:`, error);
      handleApiError(error);
    } finally {
      setRefreshing(null);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Utility functions
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatFollowers = (count: number | undefined | null) => {
    if (!count || typeof count !== "number") {
      return "0";
    }
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case "short_term":
        return "Last 4 Weeks";
      case "medium_term":
        return "Last 6 Months";
      case "long_term":
        return "All Time";
    }
  };

  const getImageUrl = (images: Array<{ url: string }> | undefined) => {
    return images?.[0]?.url || null;
  };

  // Calculate comprehensive statistics
  const calculateStatistics = () => {
    const currentTracks = allTracks[activeTimeRange];
    const currentArtists = allArtists[activeTimeRange];

    // Basic stats
    const totalTracks = currentTracks.length;
    const totalArtists = currentArtists.length;
    const uniqueAlbums = new Set(currentTracks.map((track) => track.album.name))
      .size;
    const uniqueGenres = new Set(
      currentArtists.flatMap((artist) => artist.genres)
    ).size;

    // Duration stats
    const totalDurationMs = currentTracks.reduce(
      (sum, track) => sum + track.duration_ms,
      0
    );
    const avgDurationMs = totalTracks > 0 ? totalDurationMs / totalTracks : 0;
    const totalHours = Math.floor(totalDurationMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (totalDurationMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Popularity stats
    const avgPopularity =
      totalTracks > 0
        ? Math.round(
            currentTracks.reduce((sum, track) => sum + track.popularity, 0) /
              totalTracks
          )
        : 0;

    const avgArtistPopularity =
      totalArtists > 0
        ? Math.round(
            currentArtists.reduce((sum, artist) => sum + artist.popularity, 0) /
              totalArtists
          )
        : 0;

    // Most common genres (top 5)
    const genreCount = currentArtists.reduce((acc, artist) => {
      artist.genres.forEach((genre: string) => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    // Artist diversity (followers range)
    const followerCounts = currentArtists
      .map((artist) => artist.followers?.total)
      .filter((count): count is number => typeof count === "number");
    const minFollowers =
      followerCounts.length > 0 ? Math.min(...followerCounts) : 0;
    const maxFollowers =
      followerCounts.length > 0 ? Math.max(...followerCounts) : 0;
    const avgFollowers =
      followerCounts.length > 0
        ? Math.round(
            followerCounts.reduce((sum, count) => sum + count, 0) /
              followerCounts.length
          )
        : 0;

    // Recent listening patterns
    const recentArtists = new Set(
      recentlyPlayed.map((item) => item.track.artists[0]?.name)
    ).size;
    const recentTracks = recentlyPlayed.length;

    // Calculate listening time distribution (by hour if recent data available)
    const listeningHours = recentlyPlayed.reduce((acc, item) => {
      const hour = new Date(item.played_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakListeningHour = Object.entries(listeningHours).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    return {
      basic: {
        totalTracks,
        totalArtists,
        uniqueAlbums,
        uniqueGenres,
      },
      duration: {
        totalHours,
        totalMinutes,
        avgDurationMs,
        totalDurationMs,
      },
      popularity: {
        avgPopularity,
        avgArtistPopularity,
      },
      genres: topGenres,
      diversity: {
        minFollowers,
        maxFollowers,
        avgFollowers,
      },
      recent: {
        recentArtists,
        recentTracks,
        peakListeningHour: peakListeningHour
          ? parseInt(peakListeningHour)
          : null,
      },
      listeningHours,
    };
  };

  const stats = calculateStatistics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 bg-muted rounded w-48 animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded w-96 animate-pulse" />
              </div>
              <div className="h-10 bg-muted rounded w-24 animate-pulse" />
            </div>
          </CardHeader>
        </Card>

        {/* Loading cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-24 animate-pulse mb-4" />
                <div className="h-8 bg-muted rounded w-16 animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded w-20 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-gradient-to-br from-violet-50/20 via-background to-violet-50/10 dark:from-violet-950/20 dark:via-background dark:to-violet-900/10 border-violet-200/30 dark:border-violet-800/30">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-500" />
                Music Statistics Overview
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive analysis of your listening habits for{" "}
                {getTimeRangeLabel(activeTimeRange).toLowerCase()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["short_term", "medium_term", "long_term"] as TimeRange[]).map(
                (range) => (
                  <Button
                    key={range}
                    variant={activeTimeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTimeRange(range)}
                    className="flex items-center gap-2"
                  >
                    {range === "short_term" && <Clock className="w-4 h-4" />}
                    {range === "medium_term" && (
                      <Calendar className="w-4 h-4" />
                    )}
                    {range === "long_term" && (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    {getTimeRangeLabel(range)}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAllData()}
                disabled={!!refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh All
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Basic Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200/30 dark:border-blue-800/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Total Tracks
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-1">
              {stats.basic.totalTracks}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              From {stats.basic.uniqueAlbums} albums
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200/30 dark:border-green-800/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Mic className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Total Artists
              </span>
            </div>
            <p className="text-3xl font-bold text-green-800 dark:text-green-300 mb-1">
              {stats.basic.totalArtists}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {stats.basic.uniqueGenres} unique genres
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200/30 dark:border-orange-800/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                Listening Time
              </span>
            </div>
            <p className="text-3xl font-bold text-orange-800 dark:text-orange-300 mb-1">
              {stats.duration.totalHours}h {stats.duration.totalMinutes}m
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Avg: {formatDuration(stats.duration.avgDurationMs)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200/30 dark:border-purple-800/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                Avg Popularity
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-1">
              {stats.popularity.avgPopularity}%
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Artists: {stats.popularity.avgArtistPopularity}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Genres */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-500" />
                Top Genres
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshSpecificData("artists")}
                disabled={refreshing === "artists"}
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    refreshing === "artists" ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.genres.map(({ genre, count }, index) => {
                const percentage =
                  stats.basic.totalArtists > 0
                    ? Math.round(
                        ((count as number) / stats.basic.totalArtists) * 100
                      )
                    : 0;
                return (
                  <div key={genre} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium capitalize">{genre}</span>
                        <span className="text-sm text-muted-foreground">
                          {count as number} artists
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="secondary">{percentage}%</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Artist Diversity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-500" />
              Artist Popularity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {formatFollowers(stats.diversity.avgFollowers)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Followers
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {formatFollowers(stats.diversity.maxFollowers)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Most Popular
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Underground</span>
                  <span>Mainstream</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full"
                    style={{
                      width: `${Math.min(
                        (stats.diversity.avgFollowers /
                          stats.diversity.maxFollowers) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Your taste leans{" "}
                  {stats.popularity.avgArtistPopularity > 70
                    ? "mainstream"
                    : stats.popularity.avgArtistPopularity > 40
                    ? "balanced"
                    : "underground"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Listening Habits */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Recent Listening Habits
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshSpecificData("recent")}
              disabled={refreshing === "recent"}
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing === "recent" ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
              <Radio className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {stats.recent.recentTracks}
              </div>
              <div className="text-sm text-emerald-600 dark:text-emerald-500">
                Recent Tracks
              </div>
            </div>

            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
              <Headphones className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {stats.recent.recentArtists}
              </div>
              <div className="text-sm text-emerald-600 dark:text-emerald-500">
                Unique Artists
              </div>
            </div>

            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
              <Timer className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {stats.recent.peakListeningHour
                  ? `${stats.recent.peakListeningHour}:00`
                  : "N/A"}
              </div>
              <div className="text-sm text-emerald-600 dark:text-emerald-500">
                Peak Hour
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Time Period Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-cyan-500" />
            Time Period Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["short_term", "medium_term", "long_term"] as TimeRange[]).map(
              (range) => {
                const tracks = allTracks[range];
                const artists = allArtists[range];
                const avgPop =
                  tracks.length > 0
                    ? Math.round(
                        tracks.reduce(
                          (sum, track) => sum + track.popularity,
                          0
                        ) / tracks.length
                      )
                    : 0;

                return (
                  <div
                    key={range}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      activeTimeRange === range
                        ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20"
                        : "border-muted hover:border-cyan-300"
                    }`}
                    onClick={() => setActiveTimeRange(range)}
                  >
                    <div className="text-center">
                      <h3 className="font-semibold mb-3">
                        {getTimeRangeLabel(range)}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Tracks:</span>
                          <span className="font-medium">{tracks.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Artists:</span>
                          <span className="font-medium">{artists.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Pop:</span>
                          <span className="font-medium">{avgPop}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      {userProfile && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/20 dark:to-slate-900/20 border-slate-200/30 dark:border-slate-800/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-600" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={getImageUrl(userProfile.images) || ""}
                  alt={userProfile.display_name}
                />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold">
                  {userProfile.display_name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {formatFollowers(userProfile?.followers)} followers
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {userProfile.country}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {userProfile.product}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
