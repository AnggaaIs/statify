"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useApiError } from "@/hooks/use-api-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Calendar,
  TrendingUp,
  Music,
  Headphones,
  Volume2,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Timer,
  RefreshCw,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Target,
  Repeat,
  Shuffle,
  PlayCircle,
  Heart,
} from "lucide-react";
import {
  SpotifyTrack,
  RecentlyPlayedTrack,
  RecentlyPlayedData,
  ListeningHabitsAnalysis as ListeningHabitsType,
} from "@/types/spotify";

export function ListeningHabitsAnalysis() {
  const { get_recently_played } = useSpotify();
  const { handleApiError } = useApiError();

  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedTrack[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentlyPlayed = async () => {
    setIsLoading(true);
    try {
      const data = (await get_recently_played(50)) as RecentlyPlayedData;
      console.log("Recently played data:", data);
      setRecentlyPlayed(data?.items || []);
    } catch (error) {
      console.error("Error fetching recently played:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentlyPlayed();
  }, []);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const analyzeListeningHabits = () => {
    if (recentlyPlayed.length === 0) {
      return {
        hourlyDistribution: [],
        dayOfWeekDistribution: [],
        averageSessionLength: 0,
        mostActiveHour: null,
        mostActiveDay: null,
        listeningPatterns: [],
        topRecentArtists: [],
        avgSongLength: 0,
        totalListeningTime: 0,
        uniqueTracksCount: 0,
        repeatRate: 0,
      };
    }

    // Hourly distribution
    const hourlyStats: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourlyStats[i] = 0;
    }

    // Day of week distribution (0 = Sunday)
    const dayStats: Record<number, number> = {};
    for (let i = 0; i < 7; i++) {
      dayStats[i] = 0;
    }

    // Track frequency for repeat analysis
    const trackFrequency: Record<string, number> = {};
    const artistFrequency: Record<string, { count: number; artist: string }> =
      {};

    let totalDuration = 0;
    const uniqueTracks = new Set<string>();

    recentlyPlayed.forEach(({ track, played_at }) => {
      const date = new Date(played_at);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();

      hourlyStats[hour]++;
      dayStats[dayOfWeek]++;

      // Track analysis
      trackFrequency[track.id] = (trackFrequency[track.id] || 0) + 1;
      uniqueTracks.add(track.id);
      totalDuration += track.duration_ms;

      // Artist analysis
      const mainArtist = track.artists[0]?.name;
      if (mainArtist) {
        if (!artistFrequency[mainArtist]) {
          artistFrequency[mainArtist] = { count: 0, artist: mainArtist };
        }
        artistFrequency[mainArtist].count++;
      }
    });

    // Find most active hour and day
    const mostActiveHour = Object.entries(hourlyStats).reduce((a, b) =>
      hourlyStats[parseInt(a[0])] > hourlyStats[parseInt(b[0])] ? a : b
    )[0];

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const mostActiveDay = Object.entries(dayStats).reduce((a, b) =>
      dayStats[parseInt(a[0])] > dayStats[parseInt(b[0])] ? a : b
    )[0];

    // Calculate repeat rate
    const totalPlays = recentlyPlayed.length;
    const uniqueTracksCount = uniqueTracks.size;
    const repeatRate =
      totalPlays > 0
        ? ((totalPlays - uniqueTracksCount) / totalPlays) * 100
        : 0;

    // Top recent artists
    const topRecentArtists = Object.values(artistFrequency)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Convert to arrays for display
    const hourlyDistribution = Object.entries(hourlyStats).map(
      ([hour, count]) => ({
        hour: parseInt(hour),
        count,
        percentage: totalPlays > 0 ? (count / totalPlays) * 100 : 0,
      })
    );

    const dayOfWeekDistribution = Object.entries(dayStats).map(
      ([day, count]) => ({
        day: parseInt(day),
        dayName: dayNames[parseInt(day)],
        count,
        percentage: totalPlays > 0 ? (count / totalPlays) * 100 : 0,
      })
    );

    // Calculate listening patterns
    const morningListening =
      hourlyStats[6] +
      hourlyStats[7] +
      hourlyStats[8] +
      hourlyStats[9] +
      hourlyStats[10] +
      hourlyStats[11];
    const afternoonListening =
      hourlyStats[12] +
      hourlyStats[13] +
      hourlyStats[14] +
      hourlyStats[15] +
      hourlyStats[16] +
      hourlyStats[17];
    const eveningListening =
      hourlyStats[18] +
      hourlyStats[19] +
      hourlyStats[20] +
      hourlyStats[21] +
      hourlyStats[22] +
      hourlyStats[23];
    const nightListening =
      hourlyStats[0] +
      hourlyStats[1] +
      hourlyStats[2] +
      hourlyStats[3] +
      hourlyStats[4] +
      hourlyStats[5];

    const listeningPatterns = [
      {
        period: "Morning",
        count: morningListening,
        percentage: totalPlays > 0 ? (morningListening / totalPlays) * 100 : 0,
        icon: Sunrise,
      },
      {
        period: "Afternoon",
        count: afternoonListening,
        percentage:
          totalPlays > 0 ? (afternoonListening / totalPlays) * 100 : 0,
        icon: Sun,
      },
      {
        period: "Evening",
        count: eveningListening,
        percentage: totalPlays > 0 ? (eveningListening / totalPlays) * 100 : 0,
        icon: Sunset,
      },
      {
        period: "Night",
        count: nightListening,
        percentage: totalPlays > 0 ? (nightListening / totalPlays) * 100 : 0,
        icon: Moon,
      },
    ].sort((a, b) => b.count - a.count);

    return {
      hourlyDistribution,
      dayOfWeekDistribution,
      mostActiveHour: parseInt(mostActiveHour),
      mostActiveDay: {
        number: parseInt(mostActiveDay),
        name: dayNames[parseInt(mostActiveDay)],
      },
      listeningPatterns,
      topRecentArtists,
      avgSongLength: totalPlays > 0 ? totalDuration / totalPlays : 0,
      totalListeningTime: totalDuration,
      uniqueTracksCount,
      repeatRate,
    };
  };

  const getHourLabel = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getPeriodOfDay = (hour: number) => {
    if (hour >= 6 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 18) return "Afternoon";
    if (hour >= 18 && hour < 24) return "Evening";
    return "Night";
  };

  const analysis = analyzeListeningHabits();

  if (isLoading) {
    return (
      <div className="space-y-6">
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (recentlyPlayed.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-emerald-50/20 via-background to-emerald-50/10 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10 border-emerald-200/30 dark:border-emerald-800/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Listening Habits Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Detailed analysis of your recent listening patterns and
                  preferences
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRecentlyPlayed}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Recent Listening Data
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              We couldn't find any recent listening history. Make sure you've
              been listening to music on Spotify recently, then try refreshing.
            </p>
            <Button onClick={fetchRecentlyPlayed} disabled={isLoading}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-emerald-50/20 via-background to-emerald-50/10 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10 border-emerald-200/30 dark:border-emerald-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                Listening Habits Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Detailed analysis of your recent listening patterns and
                preferences
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecentlyPlayed}
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Total Listening
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-1">
              {Math.floor(analysis.totalListeningTime / (1000 * 60 * 60))}h{" "}
              {Math.floor(
                (analysis.totalListeningTime % (1000 * 60 * 60)) / (1000 * 60)
              )}
              m
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {recentlyPlayed.length} tracks played
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shuffle className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                Music Variety
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-1">
              {analysis.uniqueTracksCount}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Unique tracks ({Math.round(100 - analysis.repeatRate)}% variety)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Avg Song Length
              </span>
            </div>
            <p className="text-3xl font-bold text-green-800 dark:text-green-300 mb-1">
              {formatDuration(analysis.avgSongLength)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              Average duration
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                Peak Activity
              </span>
            </div>
            <p className="text-3xl font-bold text-orange-800 dark:text-orange-300 mb-1">
              {analysis.mostActiveHour !== null
                ? getHourLabel(analysis.mostActiveHour)
                : "N/A"}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Most active hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Listening Patterns by Time of Day */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            Listening Patterns by Time of Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {analysis.listeningPatterns.map(
              ({ period, count, percentage, icon: Icon }) => (
                <div
                  key={period}
                  className="text-center p-4 bg-muted/20 rounded-lg"
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-semibold mb-1">{period}</h3>
                  <div className="text-2xl font-bold mb-1">{count}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hourly Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            24-Hour Activity Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {analysis.hourlyDistribution.map(({ hour, count, percentage }) => {
              const intensity = Math.max(0.1, percentage / 100);
              const isActive = count > 0;

              return (
                <div
                  key={hour}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? "border-indigo-300 dark:border-indigo-700"
                      : "border-muted"
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? `rgba(99, 102, 241, ${intensity})`
                      : undefined,
                  }}
                  title={`${getHourLabel(
                    hour
                  )}: ${count} tracks (${percentage.toFixed(1)}%)`}
                >
                  <div className="font-medium">
                    {hour.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-200 rounded" />
              <span>Low Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded" />
              <span>High Activity</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pink-500" />
            Weekly Listening Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.dayOfWeekDistribution.map(
              ({ day, dayName, count, percentage }) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">{dayName}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        {count} tracks
                      </span>
                      <span className="text-sm font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Recent Artists */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-cyan-500" />
            Most Played Artists Recently
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.topRecentArtists.map(({ artist, count }, index) => {
              const percentage =
                recentlyPlayed.length > 0
                  ? (count / recentlyPlayed.length) * 100
                  : 0;

              return (
                <div key={artist} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{artist}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} plays
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
