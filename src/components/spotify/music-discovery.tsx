"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useApiError } from "@/hooks/use-api-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  Star,
  Zap,
  Target,
  Compass,
  Radio,
  Shuffle,
  ExternalLink,
  RefreshCw,
  Music,
  Mic,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Search,
  Lightbulb,
  Heart,
  Volume2,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import {
  SpotifyTrack,
  SpotifyArtist,
  TopTracksData,
  TopArtistsData,
  TimeRange,
  MusicDiscoveryInsights as MusicDiscoveryType,
} from "@/types/spotify";

export function MusicDiscoveryInsights() {
  const { get_top_tracks, get_top_artists } = useSpotify();
  const { handleApiError } = useApiError();

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
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
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

      const [tracksResults, artistsResults] = await Promise.all([
        Promise.all(tracksPromises),
        Promise.all(artistsPromises),
      ]);

      const newTracks = { ...allTracks };
      tracksResults.forEach(({ range, data }) => {
        newTracks[range] = data;
      });
      setAllTracks(newTracks);

      const newArtists = { ...allArtists };
      artistsResults.forEach(({ range, data }) => {
        newArtists[range] = data;
      });
      setAllArtists(newArtists);
    } catch (error) {
      console.error("Error fetching discovery data:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const getImageUrl = (images: Array<{ url: string }> | undefined) => {
    return images?.[0]?.url || undefined;
  };

  const generateInsights = () => {
    // Combine all tracks and artists from all time periods
    const allTracksFlat = Object.values(allTracks).flat();
    const allArtistsFlat = Object.values(allArtists).flat();

    // Discover musical evolution patterns
    const shortTermGenres = new Set(
      allArtists.short_term.flatMap((a) => a.genres)
    );
    const longTermGenres = new Set(
      allArtists.long_term.flatMap((a) => a.genres)
    );
    const newGenres = [...shortTermGenres].filter(
      (g) => !longTermGenres.has(g)
    );
    const lostGenres = [...longTermGenres].filter(
      (g) => !shortTermGenres.has(g)
    );

    // Popularity trends
    const shortTermAvgPop =
      allTracks.short_term.length > 0
        ? allTracks.short_term.reduce(
            (sum, track) => sum + track.popularity,
            0
          ) / allTracks.short_term.length
        : 0;
    const longTermAvgPop =
      allTracks.long_term.length > 0
        ? allTracks.long_term.reduce(
            (sum, track) => sum + track.popularity,
            0
          ) / allTracks.long_term.length
        : 0;
    const popularityTrend = shortTermAvgPop - longTermAvgPop;

    // Artist diversity analysis
    const uniqueArtists = new Set(allArtistsFlat.map((a) => a.id)).size;
    const totalArtistAppearances = allArtistsFlat.length;
    const diversityScore = uniqueArtists / totalArtistAppearances;

    // Discover underground vs mainstream preference
    const undergroundTracks = allTracksFlat.filter((t) => t.popularity < 50);
    const mainstreamTracks = allTracksFlat.filter((t) => t.popularity >= 70);
    const undergroundRatio =
      allTracksFlat.length > 0
        ? undergroundTracks.length / allTracksFlat.length
        : 0;

    // Find consistent favorites (appear in multiple time ranges)
    const artistFrequency: Record<
      string,
      { artist: SpotifyArtist; count: number; timeRanges: TimeRange[] }
    > = {};

    Object.entries(allArtists).forEach(([range, artists]) => {
      artists.forEach((artist) => {
        if (!artistFrequency[artist.id]) {
          artistFrequency[artist.id] = { artist, count: 0, timeRanges: [] };
        }
        artistFrequency[artist.id].count++;
        artistFrequency[artist.id].timeRanges.push(range as TimeRange);
      });
    });

    const consistentFavorites = Object.values(artistFrequency)
      .filter(({ count }) => count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Hidden gems (low popularity but in your top tracks) - remove duplicates first
    const uniqueTracksMap = new Map();
    allTracksFlat.forEach((track) => {
      if (!uniqueTracksMap.has(track.id)) {
        uniqueTracksMap.set(track.id, track);
      }
    });
    const uniqueTracks = Array.from(uniqueTracksMap.values());

    const hiddenGems = uniqueTracks
      .filter((track) => track.popularity < 40)
      .sort((a, b) => a.popularity - b.popularity)
      .slice(0, 5);

    // Rising stars (artists with low followers but high in your lists) - remove duplicates first
    const uniqueArtistsForRising = new Map();
    allArtistsFlat.forEach((artist) => {
      if (!uniqueArtistsForRising.has(artist.id)) {
        uniqueArtistsForRising.set(artist.id, artist);
      }
    });
    const deduplicatedArtists = Array.from(uniqueArtistsForRising.values());

    const risingStars = deduplicatedArtists
      .filter(
        (artist) => artist.followers?.total && artist.followers.total < 100000
      )
      .sort((a, b) => (a.followers?.total || 0) - (b.followers?.total || 0))
      .slice(0, 5);

    // Musical adventurousness score
    const totalGenres = new Set(allArtistsFlat.flatMap((a) => a.genres)).size;
    const adventurousnessScore = Math.min(100, (totalGenres / 20) * 100); // Max 20 genres = 100% adventurous

    // Seasonal listening patterns (if we have data across time ranges)
    const seasonalPreferences = {
      current: {
        period: "Recent (4 weeks)",
        genres: [...shortTermGenres].slice(0, 3),
      },
      medium: {
        period: "Medium term (6 months)",
        genres: [
          ...new Set(allArtists.medium_term.flatMap((a) => a.genres)),
        ].slice(0, 3),
      },
      longTerm: { period: "All time", genres: [...longTermGenres].slice(0, 3) },
    };

    return {
      evolution: {
        newGenres: [...newGenres].slice(0, 5),
        lostGenres: [...lostGenres].slice(0, 5),
      },
      popularityTrend,
      diversityScore,
      undergroundRatio,
      consistentFavorites,
      hiddenGems,
      risingStars,
      adventurousnessScore,
      seasonalPreferences,
      stats: {
        totalGenres,
        uniqueArtists,
        undergroundTracks: undergroundTracks.length,
        mainstreamTracks: mainstreamTracks.length,
      },
    };
  };

  const insights = generateInsights();

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-cyan-50/20 via-background to-cyan-50/10 dark:from-cyan-950/20 dark:via-background dark:to-cyan-900/10 border-cyan-200/30 dark:border-cyan-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-500" />
                Music Discovery & Insights
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Advanced analysis of your musical journey, taste evolution, and
                discovery patterns
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
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

      {/* Musical Profile Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                Adventurousness
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-1">
              {Math.round(insights.adventurousnessScore)}%
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {insights.stats.totalGenres} genres explored
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Artist Diversity
              </span>
            </div>
            <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              {Math.round(insights.diversityScore * 100)}%
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {insights.stats.uniqueArtists} unique artists
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Radio className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                Underground Taste
              </span>
            </div>
            <p className="text-3xl font-bold text-orange-800 dark:text-orange-300 mb-1">
              {Math.round(insights.undergroundRatio * 100)}%
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {insights.stats.undergroundTracks} underground tracks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/20 dark:to-rose-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-rose-600" />
              <span className="text-sm font-medium text-rose-700 dark:text-rose-400">
                Popularity Trend
              </span>
            </div>
            <p className="text-3xl font-bold text-rose-800 dark:text-rose-300 mb-1">
              {insights.popularityTrend > 0 ? "+" : ""}
              {Math.round(insights.popularityTrend)}
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              {insights.popularityTrend > 0
                ? "More mainstream"
                : insights.popularityTrend < 0
                ? "More underground"
                : "Stable taste"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Consistent Favorites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Your Consistent Favorites
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Artists who appear in multiple time periods, showing your enduring
            preferences
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.consistentFavorites.map(
              ({ artist, count, timeRanges }, index) => (
                <Card
                  key={`consistent-favorite-${index}-${artist.id}`}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={getImageUrl(artist.images) || ""}
                          alt={artist.name}
                        />
                        <AvatarFallback>
                          <Mic className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {artist.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatFollowers(artist.followers?.total)} followers
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Appears in:</span>
                        <Badge variant="secondary">{count}/3 periods</Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {timeRanges.map((range) => (
                          <Badge
                            key={range}
                            variant="outline"
                            className="text-xs"
                          >
                            {range === "short_term"
                              ? "4W"
                              : range === "medium_term"
                              ? "6M"
                              : "All"}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={artist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        variant="outline"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in Spotify
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden Gems & Rising Stars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hidden Gems */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Hidden Gems
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Low popularity tracks you love - your unique taste discoveries
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.hiddenGems.map((track, index) => (
                <div
                  key={`hidden-gem-${index}-${track.id}`}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <Avatar className="w-10 h-10 rounded-lg">
                    <AvatarImage
                      src={getImageUrl(track.album.images)}
                      alt={track.album.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      <Music className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{track.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artists
                        .map((artist: any) => artist.name)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{track.popularity}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rising Stars */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-500" />
              Rising Stars
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Artists with smaller followings who made it to your tops - early
              adopter vibes
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.risingStars.map((artist, index) => (
                <div
                  key={`rising-star-${index}-${artist.id}`}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={getImageUrl(artist.images)}
                      alt={artist.name}
                    />
                    <AvatarFallback>
                      <Mic className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{artist.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatFollowers(artist.followers?.total)} followers
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{artist.popularity}% pop</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Musical Evolution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Musical Evolution
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How your taste has evolved over time - new discoveries and changing
            preferences
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(insights.seasonalPreferences).map(
              ([key, { period, genres }]) => (
                <div
                  key={key}
                  className="text-center p-4 bg-muted/20 rounded-lg"
                >
                  <h3 className="font-semibold mb-3">{period}</h3>
                  <div className="space-y-2">
                    {genres.map((genre, index) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="mr-1 mb-1 capitalize"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                New Genre Discoveries
              </h4>
              <div className="space-y-2">
                {insights.evolution.newGenres.length > 0 ? (
                  insights.evolution.newGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="mr-2 mb-2 capitalize"
                    >
                      {genre}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No new genres detected
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 rotate-180" />
                Genres You've Moved Away From
              </h4>
              <div className="space-y-2">
                {insights.evolution.lostGenres.length > 0 ? (
                  insights.evolution.lostGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="mr-2 mb-2 capitalize opacity-60"
                    >
                      {genre}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    All genres still in rotation
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taste Profile Summary */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/20 dark:to-slate-900/20 border-slate-200/30 dark:border-slate-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            Your Musical DNA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(insights.adventurousnessScore)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Musical Explorer
              </div>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(insights.undergroundRatio * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Underground Enthusiast
              </div>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {Math.round(insights.diversityScore * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Artist Diversity
              </div>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {insights.consistentFavorites.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Consistent Favorites
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
