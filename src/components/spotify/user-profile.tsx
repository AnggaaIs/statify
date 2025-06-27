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
  Mail,
  MapPin,
  Users,
  Crown,
  Calendar,
  Music,
  Headphones,
  Globe,
  Star,
  Shield,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { ListeningStats } from "@/types";

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  country: string;
  followers: number;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  product: string;
  external_urls: {
    spotify: string;
  };
}

export function UserProfileCard() {
  const { get_user_profile, get_top_tracks, get_top_artists, loading } =
    useSpotify();
  const { handleApiError } = useApiError();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listeningStats, setListeningStats] = useState<ListeningStats | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const data = await get_user_profile();
      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      handleApiError(error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchListeningStats = async () => {
    try {
      setIsLoadingStats(true);

      // Fetch data from multiple time ranges to calculate stats
      const [
        shortTermTracks,
        mediumTermTracks,
        longTermTracks,
        shortTermArtists,
        mediumTermArtists,
        longTermArtists,
      ] = await Promise.all([
        get_top_tracks("short_term", 50),
        get_top_tracks("medium_term", 50),
        get_top_tracks("long_term", 50),
        get_top_artists("short_term", 50),
        get_top_artists("medium_term", 50),
        get_top_artists("long_term", 50),
      ]);

      // Calculate listening statistics
      const allTracks = new Set();
      const allArtists = new Set();
      const allGenres = new Set<string>();
      let totalDuration = 0;

      // Process tracks from all time ranges
      [shortTermTracks, mediumTermTracks, longTermTracks].forEach(
        (trackData: any) => {
          if (trackData?.items) {
            trackData.items.forEach((track: any) => {
              allTracks.add(track.id);
              totalDuration += track.duration_ms;
              track.artists.forEach((artist: any) =>
                allArtists.add(artist.name)
              );
            });
          }
        }
      );

      // Process artists from all time ranges for genres
      [shortTermArtists, mediumTermArtists, longTermArtists].forEach(
        (artistData: any) => {
          if (artistData?.items) {
            artistData.items.forEach((artist: any) => {
              if (artist.genres) {
                artist.genres.forEach((genre: string) => allGenres.add(genre));
              }
            });
          }
        }
      );

      // Calculate stats
      const hours = Math.floor(totalDuration / (1000 * 60 * 60));
      const minutes = Math.floor(
        (totalDuration % (1000 * 60 * 60)) / (1000 * 60)
      );

      const topGenresArray = Array.from(allGenres).slice(0, 5);
      const averageTrackLength =
        allTracks.size > 0 ? totalDuration / allTracks.size : 0;
      const avgMinutes = Math.floor(averageTrackLength / (1000 * 60));
      const avgSeconds = Math.floor((averageTrackLength % (1000 * 60)) / 1000);

      setListeningStats({
        totalPlaytime: `${hours}h ${minutes}m`,
        topGenres: topGenresArray,
        averageListeningTime: `${avgMinutes}:${avgSeconds
          .toString()
          .padStart(2, "0")}`,
        totalTracks: allTracks.size,
        totalArtists: allArtists.size,
        mostActiveTime: "Afternoon", // This would need actual listening history data
      });
    } catch (error) {
      console.error("Error fetching listening stats:", error);
      // Don't show error for stats as it's secondary data
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchListeningStats();
  }, []);

  const refreshData = () => {
    fetchProfile();
    fetchListeningStats();
  };

  const getCountryFlag = (countryCode: string) => {
    if (!countryCode) return "🌍";

    const flags: { [key: string]: string } = {
      US: "🇺🇸",
      GB: "🇬🇧",
      CA: "🇨🇦",
      AU: "🇦🇺",
      DE: "🇩🇪",
      FR: "🇫🇷",
      ES: "🇪🇸",
      IT: "🇮🇹",
      NL: "🇳🇱",
      SE: "🇸🇪",
      NO: "🇳🇴",
      DK: "🇩🇰",
      FI: "🇫🇮",
      BR: "🇧🇷",
      JP: "🇯🇵",
      KR: "🇰🇷",
      IN: "🇮🇳",
      SG: "🇸🇬",
      MY: "🇲🇾",
      TH: "🇹🇭",
      ID: "🇮🇩",
      PH: "🇵🇭",
      VN: "🇻🇳",
      TW: "🇹🇼",
      HK: "🇭🇰",
      MX: "🇲🇽",
      AR: "🇦🇷",
      CL: "🇨🇱",
      CO: "🇨🇴",
      PE: "🇵🇪",
      PL: "🇵🇱",
      CZ: "🇨🇿",
      HU: "🇭🇺",
      RO: "🇷🇴",
      GR: "🇬🇷",
      TR: "🇹🇷",
      RU: "🇷🇺",
      UA: "🇺🇦",
      ZA: "🇿🇦",
      EG: "🇪🇬",
      IL: "🇮🇱",
      AE: "🇦🇪",
      SA: "🇸🇦",
      QA: "🇶🇦",
      KW: "🇰🇼",
    };

    return flags[countryCode] || "🌍";
  };

  const getProductBadge = (product: string) => {
    switch (product) {
      case "premium":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        );
      case "free":
        return (
          <Badge variant="outline">
            <Music className="w-3 h-3 mr-1" />
            Free
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Shield className="w-3 h-3 mr-1" />
            {product}
          </Badge>
        );
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (isLoadingProfile) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50/20 via-background to-indigo-50/10 dark:from-indigo-950/20 dark:via-background dark:to-indigo-900/10 border-indigo-200/30 dark:border-indigo-800/30">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </div>
            <Button size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="w-32 h-32 bg-muted rounded-full animate-pulse" />
                <div className="text-center md:text-left space-y-2">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50/20 via-background to-indigo-50/10 dark:from-indigo-950/20 dark:via-background dark:to-indigo-900/10 border-indigo-200/30 dark:border-indigo-800/30">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Unable to load profile information.
            </p>
            <Button onClick={refreshData} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="bg-gradient-to-br from-indigo-50/20 via-background to-indigo-50/10 dark:from-indigo-950/20 dark:via-background dark:to-indigo-900/10 border-indigo-200/30 dark:border-indigo-800/30">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={profile.images?.[0]?.url}
                  alt={profile.display_name || "User"}
                />
                <AvatarFallback>
                  {profile.display_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </div>
            <Button onClick={refreshData} size="sm" disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={profile.images?.[0]?.url}
                    alt={profile.display_name || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl">
                    {profile.display_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-2xl font-bold">
                    {profile.display_name || "Spotify User"}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>@{profile.id}</span>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-sm text-muted-foreground break-all">
                      {profile.email || "Not available"}
                    </p>
                  </div>

                  {/* Country */}
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Country</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getCountryFlag(profile.country)}{" "}
                      {profile.country || "Not specified"}
                    </p>
                  </div>

                  {/* Followers */}
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Followers</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatFollowers(profile.followers || 0)} followers
                    </p>
                  </div>

                  {/* Subscription */}
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Subscription</span>
                    </div>
                    <div>{getProductBadge(profile.product)}</div>
                  </div>
                </div>

                {/* External Links */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={profile.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Spotify
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listening Statistics Card */}
      <Card className="bg-gradient-to-br from-indigo-50/20 via-background to-indigo-50/10 dark:from-indigo-950/20 dark:via-background dark:to-indigo-900/10 border-indigo-200/30 dark:border-indigo-800/30">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Listening Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : listeningStats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Playtime */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Headphones className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Total Playtime</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {listeningStats.totalPlaytime}
                  </p>
                </div>

                {/* Total Tracks */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Unique Tracks</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {listeningStats.totalTracks}
                  </p>
                </div>

                {/* Total Artists */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Unique Artists</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {listeningStats.totalArtists}
                  </p>
                </div>

                {/* Average Track Length */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Avg Track Length
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {listeningStats.averageListeningTime}
                  </p>
                </div>

                {/* Most Active Time */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Most Active</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {listeningStats.mostActiveTime}
                  </p>
                </div>

                {/* Top Genres Count */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Genres Explored</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {listeningStats.topGenres.length}
                  </p>
                </div>
              </div>

              {/* Top Genres */}
              {listeningStats.topGenres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Top Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {listeningStats.topGenres.map((genre, index) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="capitalize"
                      >
                        #{index + 1} {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Unable to calculate listening statistics.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This may be due to limited listening history or privacy
                settings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
