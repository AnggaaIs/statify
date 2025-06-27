"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useApiError } from "@/hooks/use-api-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  ExternalLink,
  RefreshCw,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Users,
  Music,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { Artist, TopArtistsData } from "@/types";

export function TopArtistsCard() {
  const { get_top_artists, loading } = useSpotify();
  const { handleApiError } = useApiError();
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [displayedArtists, setDisplayedArtists] = useState<Artist[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalArtists, setTotalArtists] = useState(0);
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const ARTISTS_PER_PAGE = 5;

  const fetchTopArtists = async (selectedTimeRange: typeof timeRange) => {
    try {
      const data = (await get_top_artists(
        selectedTimeRange,
        50
      )) as TopArtistsData;

      if (data?.items) {
        setAllArtists(data.items);
        setDisplayedArtists(data.items.slice(0, ARTISTS_PER_PAGE));
        setCurrentPage(0);
        setTotalArtists(data.items.length);
      }
    } catch (error) {
      console.error("Error fetching top artists:", error);
      handleApiError(error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTopArtists(timeRange);
  }, [timeRange]);

  const loadMoreArtists = () => {
    setIsLoadingMore(true);

    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = (nextPage + 1) * ARTISTS_PER_PAGE;

      setDisplayedArtists(allArtists.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
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

  const getArtistImage = (artist: Artist) => {
    return artist.images?.[0]?.url || null;
  };

  const hasMoreArtists = displayedArtists.length < allArtists.length;

  if (isInitialLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-green-50/20 via-background to-green-50/10 dark:from-green-950/20 dark:via-background dark:to-green-900/10 border-green-200/30 dark:border-green-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
            Top Artists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted rounded-full animate-pulse flex-shrink-0" />
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

  if (!allArtists.length) {
    return (
      <Card className="w-full flex flex-col bg-gradient-to-br from-green-50/20 via-background to-green-50/10 dark:from-green-950/20 dark:via-background dark:to-green-900/10 border-green-200/30 dark:border-green-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Top Artists
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No top artists found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Listen to more music on Spotify to see your top artists
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full flex flex-col bg-gradient-to-br from-green-50/20 via-background to-green-50/10 dark:from-green-950/20 dark:via-background dark:to-green-900/10 border-green-200/30 dark:border-green-800/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Top Artists
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTopArtists(timeRange)}
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
            Top artists from {getTimeRangeLabel(timeRange).toLowerCase()}
          </span>
          <span className="text-xs sm:text-sm flex-shrink-0">
            {displayedArtists.length} of {totalArtists}
          </span>
        </div>

        {/* Artists List */}
        <div className="space-y-3">
          {displayedArtists.map((artist, index) => (
            <div
              key={artist.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group min-w-0"
            >
              {/* Rank */}
              <div className="w-6 text-center flex-shrink-0">
                <span className="text-base sm:text-lg font-bold text-muted-foreground">
                  {index + 1}
                </span>
              </div>

              {/* Artist Image */}
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0">
                <AvatarImage
                  src={getArtistImage(artist) || ""}
                  alt={artist.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-full">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                </AvatarFallback>
              </Avatar>

              {/* Artist Info - Takes remaining space */}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="font-medium truncate text-sm sm:text-base">
                  {artist.name}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {artist.genres.slice(0, 3).join(", ")}
                  {artist.genres.length > 3 &&
                    ` +${artist.genres.length - 3} more`}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {formatFollowers(artist.followers!.total)} followers
                  </span>
                  <span>•</span>
                  <span>{artist.popularity}% popularity</span>
                </div>
              </div>

              {/* Artist Stats - Right side */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* External Link */}
                <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={artist.external_urls.spotify}
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
        {hasMoreArtists && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={loadMoreArtists}
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
                      allArtists.length - displayedArtists.length
                    } remaining)`}
              </span>
              <span className="sm:hidden">
                {isLoadingMore ? "Loading..." : "Load More"}
              </span>
            </Button>
          </div>
        )}

        {/* No More Artists Message */}
        {!hasMoreArtists && displayedArtists.length > ARTISTS_PER_PAGE && (
          <div className="text-center pt-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              All {totalArtists} artists shown
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TopArtistsDetails() {
  const { get_top_artists, loading } = useSpotify();
  const { handleApiError } = useApiError();
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [sortBy, setSortBy] = useState<"rank" | "popularity" | "followers">(
    "rank"
  );
  const [filterGenre, setFilterGenre] = useState<string>("all");

  const fetchTopArtists = async (selectedTimeRange: typeof timeRange) => {
    setIsLoading(true);
    try {
      const data = (await get_top_artists(
        selectedTimeRange,
        50
      )) as TopArtistsData;

      if (data?.items) {
        setAllArtists(data.items);
      }
    } catch (error) {
      console.error("Error fetching top artists:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopArtists(timeRange);
  }, [timeRange]);

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
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

  const getArtistImage = (artist: Artist) => {
    return artist.images?.[0]?.url || null;
  };

  const getAllGenres = () => {
    const genres = new Set<string>();
    allArtists.forEach((artist) => {
      artist.genres.forEach((genre) => genres.add(genre));
    });
    return Array.from(genres).sort();
  };

  const filteredAndSortedArtists = () => {
    let filtered = allArtists;

    // Filter by genre
    if (filterGenre !== "all") {
      filtered = filtered.filter((artist) =>
        artist.genres.includes(filterGenre)
      );
    }

    // Sort artists
    switch (sortBy) {
      case "popularity":
        return filtered.sort((a, b) => b.popularity - a.popularity);
      case "followers":
        return filtered.sort((a, b) => b.followers!.total - a.followers!.total);
      case "rank":
      default:
        return filtered; // Keep original order (rank)
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-br from-green-50/20 via-background to-green-50/10 dark:from-green-950/20 dark:via-background dark:to-green-900/10 p-6 rounded-lg border border-green-200/30 dark:border-green-800/30">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
            <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 bg-muted/20 rounded-lg animate-pulse">
                <div className="w-full aspect-square bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!allArtists.length) {
    return (
      <div className="w-full bg-gradient-to-br from-green-50/20 via-background to-green-50/10 dark:from-green-950/20 dark:via-background dark:to-green-900/10 p-8 rounded-lg border border-green-200/30 dark:border-green-800/30">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Top Artists Found</h3>
          <p className="text-muted-foreground">
            Listen to more music on Spotify to see your top artists
          </p>
        </div>
      </div>
    );
  }

  const processedArtists = filteredAndSortedArtists();
  const allGenres = getAllGenres();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-50/20 via-background to-green-50/10 dark:from-green-950/20 dark:via-background dark:to-green-900/10 p-6 rounded-lg border border-green-200/30 dark:border-green-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold">Artists Overview</h2>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchTopArtists(timeRange)}
            disabled={loading}
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Range Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Range</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "short_term", label: "4 Weeks" },
                { value: "medium_term", label: "6 Months" },
                { value: "long_term", label: "All Time" },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={timeRange === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(value as typeof timeRange)}
                  className="flex-1 sm:flex-none"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "rank", label: "Rank" },
                { value: "popularity", label: "Popularity" },
                { value: "followers", label: "Followers" },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={sortBy === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(value as typeof sortBy)}
                  className="flex-1 sm:flex-none"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Genre Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Genre</label>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="w-full p-2 text-sm border border-border rounded-md bg-background"
            >
              <option value="all">All Genres</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre} className="capitalize">
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-green-500">
              {processedArtists.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Artists</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-500">
              {allGenres.length}
            </div>
            <div className="text-xs text-muted-foreground">Unique Genres</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-500">
              {Math.round(
                processedArtists.reduce(
                  (sum, artist) => sum + artist.popularity,
                  0
                ) / processedArtists.length || 0
              )}
              %
            </div>
            <div className="text-xs text-muted-foreground">Avg Popularity</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-500">
              {formatFollowers(
                processedArtists.reduce(
                  (sum, artist) => sum + artist.followers!.total,
                  0
                )
              )}
            </div>
            <div className="text-xs text-muted-foreground">Total Followers</div>
          </div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {processedArtists.map((artist, index) => (
          <Card
            key={artist.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-50/10 to-transparent dark:from-green-900/10 border-green-200/20 dark:border-green-800/20"
            onClick={() => setSelectedArtist(artist)}
          >
            <div className="relative">
              {/* Artist Image */}
              <div className="aspect-square overflow-hidden">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={getArtistImage(artist) || ""}
                    alt={artist.name}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="rounded-none w-full h-full">
                    <User className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Rank Badge */}
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-bold">
                #{index + 1}
              </div>

              {/* Popularity Badge */}
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                {artist.popularity}%
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 truncate">
                {artist.name}
              </h3>

              {/* Genres */}
              <div className="flex flex-wrap gap-1 mb-3">
                {artist.genres.slice(0, 3).map((genre, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 capitalize"
                  >
                    {genre}
                  </Badge>
                ))}
                {artist.genres.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{artist.genres.length - 3}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Followers</span>
                  </div>
                  <span className="font-medium">
                    {formatFollowers(artist.followers!.total)}
                  </span>
                </div>
              </div>

              {/* External Link */}
              <div className="mt-4 flex justify-end">
                <Link
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Open in Spotify</span>
                    <span className="sm:hidden">Spotify</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Artist Detail Modal - You can implement this as a separate component */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Artist Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArtist(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={getArtistImage(selectedArtist) || ""}
                    alt={selectedArtist.name}
                  />
                  <AvatarFallback>
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selectedArtist.name}</h2>
                  <p className="text-muted-foreground">
                    {formatFollowers(selectedArtist.followers!.total)} followers
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArtist.genres.map((genre, i) => (
                    <Badge key={i} variant="secondary" className="capitalize">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Popularity</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedArtist.popularity}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {selectedArtist.popularity}%
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedArtist(null)}
                >
                  Close
                </Button>
                <Link
                  href={selectedArtist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open in Spotify
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
