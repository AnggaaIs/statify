"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useApiError } from "@/hooks/use-api-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  ExternalLink,
  RefreshCw,
  PlayCircle,
  User,
  Heart,
  Lock,
  Globe,
  Clock,
  ListMusic,
} from "lucide-react";
import Link from "next/link";

interface Playlist {
  id: string;
  name: string;
  description: string;
  public: boolean;
  collaborative: boolean;
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
  followers?: {
    total: number;
  };
}

interface PlaylistsData {
  items: Playlist[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export function MyPlaylistsCard() {
  const { get_user_playlists, loading } = useSpotify();
  const { handleApiError } = useApiError();
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [displayedPlaylists, setDisplayedPlaylists] = useState<Playlist[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPlaylists, setTotalPlaylists] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PLAYLISTS_PER_PAGE = 6;

  const fetchPlaylists = async () => {
    try {
      const data = (await get_user_playlists(50, 0)) as PlaylistsData;

      if (data?.items) {
        setAllPlaylists(data.items);
        setDisplayedPlaylists(data.items.slice(0, PLAYLISTS_PER_PAGE));
        setCurrentPage(0);
        setTotalPlaylists(data.items.length);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      handleApiError(error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const loadMorePlaylists = () => {
    setIsLoadingMore(true);

    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = (nextPage + 1) * PLAYLISTS_PER_PAGE;

      setDisplayedPlaylists(allPlaylists.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  const formatTrackCount = (count: number) => {
    if (count === 0) return "Empty";
    if (count === 1) return "1 track";
    return `${count} tracks`;
  };

  const getPlaylistImage = (playlist: Playlist) => {
    return playlist.images?.[0]?.url || null;
  };

  const hasMorePlaylists = displayedPlaylists.length < allPlaylists.length;

  if (isInitialLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-blue-50/20 via-background to-blue-50/10 dark:from-blue-950/20 dark:via-background dark:to-blue-900/10 border-blue-200/30 dark:border-blue-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted animate-pulse" />
            My Playlists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
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

  if (!allPlaylists.length) {
    return (
      <Card className="w-full flex flex-col bg-gradient-to-br from-blue-50/20 via-background to-blue-50/10 dark:from-blue-950/20 dark:via-background dark:to-blue-900/10 border-blue-200/30 dark:border-blue-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListMusic className="w-4 h-4" />
            My Playlists
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <ListMusic className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No playlists found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create playlists on Spotify to see them here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full flex flex-col bg-gradient-to-br from-blue-50/20 via-background to-blue-50/10 dark:from-blue-950/20 dark:via-background dark:to-blue-900/10 border-blue-200/30 dark:border-blue-800/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2">
            <ListMusic className="w-4 h-4 text-blue-500" />
            My Playlists
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPlaylists}
            disabled={loading}
            className="flex-shrink-0"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
          <span className="truncate">Your music collections</span>
          <span className="text-xs sm:text-sm flex-shrink-0">
            {displayedPlaylists.length} of {totalPlaylists}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Playlists List */}
        <div className="space-y-3">
          {displayedPlaylists.map((playlist, index) => (
            <div
              key={playlist.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group min-w-0"
            >
              {/* Number */}
              <div className="w-6 text-center flex-shrink-0">
                <span className="text-base sm:text-lg font-bold text-muted-foreground">
                  {index + 1}
                </span>
              </div>

              {/* Playlist Cover */}
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0">
                <AvatarImage
                  src={getPlaylistImage(playlist) || ""}
                  alt={playlist.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">
                  <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                </AvatarFallback>
              </Avatar>

              {/* Playlist Info - Takes remaining space */}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="font-medium truncate text-sm sm:text-base">
                  {playlist.name}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  by {playlist.owner.display_name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTrackCount(playlist.tracks.total)}</span>
                  {playlist.collaborative && (
                    <>
                      <span>•</span>
                      <span>Collaborative</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{playlist.public ? "Public" : "Private"}</span>
                </div>
              </div>

              {/* Playlist Stats - Right side */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* External Link */}
                <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={playlist.external_urls.spotify}
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
        {hasMorePlaylists && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={loadMorePlaylists}
              disabled={isLoadingMore}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoadingMore ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ListMusic className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isLoadingMore
                  ? "Loading..."
                  : `Load More (${
                      allPlaylists.length - displayedPlaylists.length
                    } remaining)`}
              </span>
              <span className="sm:hidden">
                {isLoadingMore ? "Loading..." : "Load More"}
              </span>
            </Button>
          </div>
        )}

        {/* No More Playlists Message */}
        {!hasMorePlaylists &&
          displayedPlaylists.length > PLAYLISTS_PER_PAGE && (
            <div className="text-center pt-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                All {totalPlaylists} playlists shown
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}

export function MyPlaylistsDetails() {
  const { get_user_playlists, loading } = useSpotify();
  const { handleApiError } = useApiError();
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [sortBy, setSortBy] = useState<"name" | "tracks" | "created">("name");
  const [filterType, setFilterType] = useState<
    "all" | "public" | "private" | "collaborative"
  >("all");

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const data = (await get_user_playlists(50, 0)) as PlaylistsData;

      if (data?.items) {
        setAllPlaylists(data.items);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const formatTrackCount = (count: number) => {
    if (count === 0) return "Empty";
    if (count === 1) return "1 track";
    return `${count} tracks`;
  };

  const getPlaylistImage = (playlist: Playlist) => {
    return playlist.images?.[0]?.url || null;
  };

  const filteredAndSortedPlaylists = () => {
    let filtered = allPlaylists;

    // Filter by type
    switch (filterType) {
      case "public":
        filtered = filtered.filter((p) => p.public);
        break;
      case "private":
        filtered = filtered.filter((p) => !p.public);
        break;
      case "collaborative":
        filtered = filtered.filter((p) => p.collaborative);
        break;
      case "all":
      default:
        break;
    }

    // Sort playlists
    switch (sortBy) {
      case "tracks":
        return filtered.sort((a, b) => b.tracks.total - a.tracks.total);
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "created":
        // Reverse order to show newest first (assuming API returns newest first)
        return filtered.slice().reverse();
      default:
        return filtered; // Keep original order
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-50/20 via-background to-blue-50/10 dark:from-blue-950/20 dark:via-background dark:to-blue-900/10 p-6 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-muted rounded animate-pulse" />
            <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
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

  if (!allPlaylists.length) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-50/20 via-background to-blue-50/10 dark:from-blue-950/20 dark:via-background dark:to-blue-900/10 p-8 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-lg flex items-center justify-center">
            <ListMusic className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Playlists Found</h3>
          <p className="text-muted-foreground">
            Create playlists on Spotify to see them here
          </p>
        </div>
      </div>
    );
  }

  const processedPlaylists = filteredAndSortedPlaylists();
  const totalTracks = allPlaylists.reduce(
    (sum, playlist) => sum + playlist.tracks.total,
    0
  );
  const publicPlaylists = allPlaylists.filter((p) => p.public).length;
  const privatePlaylists = allPlaylists.filter((p) => !p.public).length;
  const collaborativePlaylists = allPlaylists.filter(
    (p) => p.collaborative
  ).length;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50/20 via-background to-blue-50/10 dark:from-blue-950/20 dark:via-background dark:to-blue-900/10 p-6 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <ListMusic className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Playlists Overview</h2>
          </div>
          <Button
            variant="outline"
            onClick={fetchPlaylists}
            disabled={loading}
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Controls - Improved responsive design */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Sort By */}
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Sort By
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  value: "name",
                  label: "Name",
                  icon: Music,
                  description: "A-Z",
                },
                {
                  value: "tracks",
                  label: "Tracks",
                  icon: ListMusic,
                  description: "Count",
                },
                {
                  value: "created",
                  label: "Created",
                  icon: Clock,
                  description: "Newest",
                },
              ].map(({ value, label, icon: Icon, description }) => (
                <Button
                  key={value}
                  variant={sortBy === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(value as typeof sortBy)}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Filter by Type */}
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Filter by Type
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  value: "all",
                  label: "All",
                  icon: ListMusic,
                  count: allPlaylists.length,
                },
                {
                  value: "public",
                  label: "Public",
                  icon: Globe,
                  count: publicPlaylists,
                },
                {
                  value: "private",
                  label: "Private",
                  icon: Lock,
                  count: privatePlaylists,
                },
                {
                  value: "collaborative",
                  label: "Collaborative",
                  icon: User,
                  count: collaborativePlaylists,
                },
              ].map(({ value, label, icon: Icon, count }) => (
                <Button
                  key={value}
                  variant={filterType === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(value as typeof filterType)}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden text-xs">
                    {value === "all"
                      ? "All"
                      : value === "public"
                      ? "Pub"
                      : value === "private"
                      ? "Pri"
                      : "Col"}
                  </span>
                  {count > 0 && (
                    <span className="text-xs opacity-60">({count})</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-500">
              {processedPlaylists.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Playlists</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-green-500">
              {publicPlaylists}
            </div>
            <div className="text-xs text-muted-foreground">Public</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-500">
              {privatePlaylists}
            </div>
            <div className="text-xs text-muted-foreground">Private</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-500">
              {collaborativePlaylists}
            </div>
            <div className="text-xs text-muted-foreground">Collaborative</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-red-500">{totalTracks}</div>
            <div className="text-xs text-muted-foreground">Total Tracks</div>
          </div>
        </div>
      </div>

      {/* Current Filter/Sort Display - Responsive */}
      <div className="bg-gradient-to-br from-blue-50/20 via-background to-blue-50/10 dark:from-blue-950/20 dark:via-background dark:to-blue-900/10 p-4 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
          <span className="truncate">
            {filterType === "all"
              ? "All playlists"
              : filterType === "public"
              ? "Public playlists"
              : filterType === "private"
              ? "Private playlists"
              : "Collaborative playlists"}{" "}
            sorted by{" "}
            {sortBy === "name"
              ? "name (A-Z)"
              : sortBy === "tracks"
              ? "track count (most tracks first)"
              : "creation date (newest first)"}
          </span>
          <span className="text-xs sm:text-sm flex-shrink-0">
            {processedPlaylists.length} playlists
          </span>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {processedPlaylists.map((playlist) => (
          <Card
            key={playlist.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50/10 to-transparent dark:from-blue-900/10 border-blue-200/20 dark:border-blue-800/20"
            onClick={() => setSelectedPlaylist(playlist)}
          >
            <div className="relative">
              {/* Playlist Cover */}
              <div className="aspect-square overflow-hidden">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={getPlaylistImage(playlist) || ""}
                    alt={playlist.name}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="rounded-none w-full h-full">
                    <Music className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Privacy Badge */}
              <div className="absolute top-2 left-2">
                {playlist.public ? (
                  <Badge className="bg-green-500 text-white text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Private
                  </Badge>
                )}
              </div>

              {/* Track Count Badge */}
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                {playlist.tracks.total} tracks
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                <Link
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="icon"
                    className="rounded-full bg-green-500 hover:bg-green-600 text-white w-12 h-12"
                  >
                    <PlayCircle className="w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                {playlist.name}
              </h3>

              {playlist.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3 min-h-[4rem]">
                  {playlist.description}
                </p>
              )}

              {/* Owner */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <User className="w-4 h-4" />
                <span className="truncate">
                  by {playlist.owner.display_name}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {playlist.collaborative && (
                  <Badge variant="outline" className="text-xs">
                    Collaborative
                  </Badge>
                )}
                {playlist.tracks.total === 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Empty
                  </Badge>
                )}
              </div>

              {/* External Link */}
              <div className="flex justify-end">
                <Link
                  href={playlist.external_urls.spotify}
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

      {/* Playlist Detail Modal */}
      {selectedPlaylist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ListMusic className="w-5 h-5" />
                  Playlist Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlaylist(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24 rounded-lg">
                  <AvatarImage
                    src={getPlaylistImage(selectedPlaylist) || ""}
                    alt={selectedPlaylist.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    <Music className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedPlaylist.name}
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    by {selectedPlaylist.owner.display_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTrackCount(selectedPlaylist.tracks.total)}
                  </p>
                </div>
              </div>

              {selectedPlaylist.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPlaylist.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Properties</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedPlaylist.public ? "default" : "secondary"}
                  >
                    {selectedPlaylist.public ? (
                      <>
                        <Globe className="w-3 h-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                  {selectedPlaylist.collaborative && (
                    <Badge variant="outline">
                      <User className="w-3 h-3 mr-1" />
                      Collaborative
                    </Badge>
                  )}
                  {selectedPlaylist.tracks.total === 0 && (
                    <Badge variant="secondary">Empty Playlist</Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPlaylist(null)}
                >
                  Close
                </Button>
                <Link
                  href={selectedPlaylist.external_urls.spotify}
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
