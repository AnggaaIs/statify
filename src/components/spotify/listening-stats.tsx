"use client";

import {
  useTopTracks,
  useTopArtists,
  useRecentlyPlayed,
} from "@/lib/hooks/spotify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3Icon,
  TrendingUpIcon,
  ClockIcon,
  MusicIcon,
  PieChartIcon,
  CalendarIcon,
  HeadphonesIcon,
} from "lucide-react";
import { useMemo } from "react";

export function ListeningStats() {
  const { topTracks, loading: tracksLoading } = useTopTracks("medium_term");
  const { topArtists, loading: artistsLoading } = useTopArtists("medium_term");
  const { recentlyPlayed, loading: recentLoading } = useRecentlyPlayed();

  const stats = useMemo(() => {
    if (!topTracks || !topArtists || !recentlyPlayed) {
      return {
        totalListeningTime: 0,
        uniqueArtists: 0,
        topGenres: [],
        averagePopularity: 0,
        explicitContent: 0,
        recentActivity: 0,
      };
    }

    // Calculate total listening time (estimate based on track durations)
    const totalListeningTime = topTracks.reduce(
      (acc, track) => acc + track.duration_ms,
      0
    );

    // Count unique artists
    const uniqueArtistsSet = new Set();
    topTracks.forEach((track) => {
      track.artists.forEach((artist) => uniqueArtistsSet.add(artist.name));
    });

    // Extract genres from top artists
    const genreCount: { [key: string]: number } = {};
    topArtists.forEach((artist) => {
      artist.genres.forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    // Calculate average popularity
    const averagePopularity =
      topTracks.length > 0
        ? Math.round(
            topTracks.reduce((acc, track) => acc + track.popularity, 0) /
              topTracks.length
          )
        : 0;

    // Count explicit content
    const explicitContent = topTracks.filter((track) => track.explicit).length;

    // Recent activity (last 24 hours)
    const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
    const recentActivity = recentlyPlayed.filter(
      (item) => new Date(item.played_at).getTime() > last24Hours
    ).length;

    return {
      totalListeningTime,
      uniqueArtists: uniqueArtistsSet.size,
      topGenres,
      averagePopularity,
      explicitContent,
      recentActivity,
    };
  }, [topTracks, topArtists, recentlyPlayed]);

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5 text-purple-600" />
              Listening Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5 text-purple-600" />
            Listening Analytics
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Insights from your top tracks and listening patterns
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">
                  TOTAL TIME
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatDuration(stats.totalListeningTime)}
              </p>
              <p className="text-xs text-muted-foreground">From top tracks</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MusicIcon className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  ARTISTS
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.uniqueArtists}
              </p>
              <p className="text-xs text-muted-foreground">Unique artists</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-600">
                  POPULARITY
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.averagePopularity}%
              </p>
              <p className="text-xs text-muted-foreground">Average score</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HeadphonesIcon className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-600">
                  RECENT
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.recentActivity}
              </p>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-600">
                  EXPLICIT
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.explicitContent}
              </p>
              <p className="text-xs text-muted-foreground">Explicit tracks</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-cyan-600" />
                <span className="text-xs font-medium text-cyan-600">
                  GENRES
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.topGenres.length}
              </p>
              <p className="text-xs text-muted-foreground">Top genres</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Genres */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-cyan-600" />
            Top Genres
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Most common genres from your top artists
          </p>
        </CardHeader>
        <CardContent>
          {stats.topGenres.length > 0 ? (
            <div className="space-y-3">
              {stats.topGenres.map((item, index) => {
                const percentage =
                  stats.topGenres.length > 0
                    ? Math.round((item.count / stats.topGenres[0].count) * 100)
                    : 0;

                return (
                  <div key={item.genre} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                          text-sm font-mono font-bold w-6 text-center
                          ${
                            index === 0
                              ? "text-yellow-600"
                              : index === 1
                              ? "text-gray-500"
                              : index === 2
                              ? "text-orange-600"
                              : "text-muted-foreground"
                          }
                        `}
                        >
                          #{index + 1}
                        </span>
                        <span className="font-medium text-foreground capitalize">
                          {item.genre}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.count} artists
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-orange-500"
                            : "bg-muted-foreground"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No genre data available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Listen to more music to see genre analytics
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Listening Patterns */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-blue-600" />
            Listening Patterns
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analysis of your music consumption habits
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Track Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Explicit Content
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {topTracks.length > 0
                        ? Math.round(
                            (stats.explicitContent / topTracks.length) * 100
                          )
                        : 0}
                      %
                    </span>
                    <div className="w-16 bg-muted rounded-full h-1">
                      <div
                        className="bg-red-500 h-1 rounded-full"
                        style={{
                          width: `${
                            topTracks.length > 0
                              ? (stats.explicitContent / topTracks.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Average Popularity
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {stats.averagePopularity}%
                    </span>
                    <div className="w-16 bg-muted rounded-full h-1">
                      <div
                        className="bg-green-500 h-1 rounded-full"
                        style={{ width: `${stats.averagePopularity}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Activity Summary</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Total Top Tracks
                  </span>
                  <Badge variant="secondary">{topTracks.length}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Total Top Artists
                  </span>
                  <Badge variant="secondary">{topArtists.length}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Recent Tracks
                  </span>
                  <Badge variant="secondary">{recentlyPlayed.length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
