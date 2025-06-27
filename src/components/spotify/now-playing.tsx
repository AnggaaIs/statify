"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useApiError } from "@/hooks/use-api-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  ExternalLink,
  RefreshCw,
  Monitor,
  Smartphone,
  Speaker,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { SpotifyDevice, SpotifyDevicesResponse } from "@/types/spotify";

interface NowPlayingData {
  is_playing: boolean;
  current_track: {
    name: string;
    artist: string;
    album: string;
    duration_ms: number;
    progress_ms: number;
    external_urls?: {
      spotify: string;
    };
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    preview_url: string | null;
    track_id: string;
    uri: string;
  } | null;
  device: {
    name: string;
    type: string;
    volume_percent: number;
  } | null;
  context: any;
}

export function NowPlayingCard() {
  const { get_now_playing, get_available_devices } = useSpotify();
  const { handleApiError } = useApiError();
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [progress, setProgress] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [lastActiveDeviceId, setLastActiveDeviceId] = useState<string | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [lastToastTime, setLastToastTime] = useState(0);

  const fetchNowPlaying = async (isBackground = false) => {
    try {
      const data = (await get_now_playing()) as NowPlayingData;

      // Only update if we have valid data and track info
      if (
        data &&
        data.current_track &&
        data.current_track.name &&
        data.current_track.artist
      ) {
        setNowPlaying(data);

        // Only update progress if it's not a background update or if it's significantly different
        if (data.current_track.progress_ms !== undefined) {
          if (
            !isBackground ||
            Math.abs((data.current_track.progress_ms || 0) - progress) > 5000
          ) {
            setProgress(data.current_track.progress_ms);
          }
        }
      } else if (data && !data.current_track) {
        // Handle case where no track is playing
        setNowPlaying(data);
      }
      // Skip update if data is incomplete (avoid "Unknown track" flash)
    } catch (error) {
      console.error("Error fetching now playing:", error);
      handleApiError(error);
    } finally {
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    }
  };

  const fetchDevices = async () => {
    try {
      setIsRefreshing(true);
      const data = (await get_available_devices()) as SpotifyDevicesResponse;
      console.log("Available devices:", data);

      let newDevices: SpotifyDevice[] = [];

      // Ensure we have the devices array, even if empty
      if (data && Array.isArray(data.devices)) {
        newDevices = data.devices;
      } else if (data && Array.isArray(data)) {
        // Handle case where API might return devices array directly
        newDevices = data as SpotifyDevice[];
      } else {
        console.warn("Unexpected devices response format:", data);
        newDevices = [];
      }

      // Check if active device changed
      const currentActiveDevice = newDevices.find((device) => device.is_active);
      const currentActiveDeviceId = currentActiveDevice?.id || null;

      if (
        lastActiveDeviceId !== null &&
        lastActiveDeviceId !== currentActiveDeviceId
      ) {
        console.log(
          "Device changed from",
          lastActiveDeviceId,
          "to",
          currentActiveDeviceId
        );

        // Show toast notification about device change (only once with debouncing)
        const now = Date.now();
        if (currentActiveDeviceId && now - lastToastTime > 3000) {
          const newDevice = newDevices.find(
            (d) => d.id === currentActiveDeviceId
          );
          if (newDevice) {
            toast.success(`Switched to ${newDevice.name}`, {
              description: `Now playing on ${newDevice.type}`,
              duration: 2000,
            });
            setLastToastTime(now);
          }
        }
      }

      // Update last active device ID after checking for changes
      setLastActiveDeviceId(currentActiveDeviceId);

      setDevices(newDevices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      // Don't call handleApiError for devices as it's not critical
      // Just log and continue
    } finally {
      setIsRefreshing(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    const type = deviceType.toLowerCase();
    switch (type) {
      case "computer":
        return Monitor;
      case "smartphone":
        return Smartphone;
      case "speaker":
        return Speaker;
      case "tv":
        return Monitor;
      case "tablet":
        return Smartphone; // Using smartphone icon for tablet
      case "game_console":
        return Monitor;
      case "cast_video":
        return Monitor;
      case "cast_audio":
        return Speaker;
      default:
        return Radio;
    }
  };

  const getActiveDevice = () => {
    return devices.find((device) => device.is_active);
  };

  const refreshData = () => {
    fetchNowPlaying(false);
    fetchDevices();
  };

  useEffect(() => {
    fetchNowPlaying(false);
    fetchDevices();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
      if (!document.hidden) {
        // Immediately refresh when page becomes visible
        fetchNowPlaying(false);
        fetchDevices();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Dynamic polling based on page visibility
    const nowPlayingInterval = setInterval(
      () => {
        if (isPageVisible) {
          fetchNowPlaying(true);
        }
      },
      isPageVisible ? 3000 : 15000
    ); // 3s when visible, 15s when hidden

    const devicesInterval = setInterval(
      () => {
        if (isPageVisible) {
          fetchDevices();
        }
      },
      isPageVisible ? 5000 : 20000
    ); // 5s when visible, 20s when hidden

    return () => {
      clearInterval(nowPlayingInterval);
      clearInterval(devicesInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPageVisible]);

  useEffect(() => {
    if (nowPlaying?.is_playing && nowPlaying?.current_track?.progress_ms) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1000;
          return Math.min(
            newProgress,
            nowPlaying.current_track?.duration_ms || 0
          );
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nowPlaying?.is_playing, nowPlaying?.current_track?.duration_ms]);

  useEffect(() => {
    if (nowPlaying?.current_track?.progress_ms !== undefined) {
      setProgress(nowPlaying.current_track.progress_ms);
    }
  }, [nowPlaying?.current_track?.track_id]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getAlbumArt = () => {
    if (!nowPlaying?.current_track?.images?.length) return null;
    const imageUrl = nowPlaying.current_track.images[0]?.url;
    // Return null if url is empty string or undefined/null
    return imageUrl && imageUrl.trim() !== "" ? imageUrl : null;
  };

  if (isInitialLoading) {
    return (
      <Card className="w-full max-w-none mx-0 bg-gradient-to-br from-green-50/20 via-background to-green-50/10 dark:from-green-950/20 dark:via-background dark:to-green-900/10 border-green-200/30 dark:border-green-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
            Now Playing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-2 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nowPlaying?.current_track) {
    return (
      <Card className="w-full max-w-none mx-0 flex flex-col bg-gradient-to-br from-green-50/20 via-background to-green-50/10 dark:from-green-950/20 dark:via-background dark:to-green-900/10 border-green-200/30 dark:border-green-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-muted" />
            Now Playing
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No music playing</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start playing music on Spotify to see it here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = nowPlaying.current_track?.duration_ms
    ? (progress / nowPlaying.current_track.duration_ms) * 100
    : 0;

  return (
    <Card className="w-full max-w-none mx-0 flex flex-col bg-gradient-to-br from-green-50/20 via-background to-green-50/10 dark:from-green-950/20 dark:via-background dark:to-green-900/10 border-green-200/30 dark:border-green-800/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full ${
              nowPlaying.is_playing ? "bg-green-500 animate-pulse" : "bg-muted"
            }`}
          />
          {nowPlaying.is_playing ? "Now Playing" : "Paused"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        {/* Track Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20 rounded-lg">
            {getAlbumArt() && (
              <AvatarImage
                src={getAlbumArt()!}
                alt={nowPlaying.current_track?.album || "Album cover"}
                className="object-cover"
              />
            )}
            <AvatarFallback className="rounded-lg">
              <Play className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xl truncate">
              {nowPlaying.current_track?.name || "Unknown Track"}
            </h3>
            <p className="text-muted-foreground text-lg truncate">
              {nowPlaying.current_track?.artist || "Unknown Artist"}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {nowPlaying.current_track?.album || "Unknown Album"}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {nowPlaying.current_track.external_urls?.spotify && (
              <Link
                href={nowPlaying.current_track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon" title="Open in Spotify">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span>
              {formatTime(nowPlaying.current_track?.duration_ms || 0)}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Device Info */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Available Devices</h4>
              {isRefreshing && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              className="h-6 w-6 p-0"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          {devices.length > 0 ? (
            <div className="space-y-2">
              {devices.map((device, index) => {
                const DeviceIcon = getDeviceIcon(device.type);
                // Use device.id or fallback to index if id is null
                const deviceKey = device.id || `device-${index}`;
                return (
                  <div
                    key={deviceKey}
                    className={`flex items-center justify-between p-2 rounded-lg border text-sm transition-all duration-300 ${
                      device.is_active
                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 shadow-sm"
                        : "bg-muted/30 border-muted hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <DeviceIcon className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-medium">{device.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {device.type}
                        </span>
                      </div>
                      {device.is_active && (
                        <Badge variant="secondary" className="text-xs h-5">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {device.volume_percent !== null &&
                        device.supports_volume && (
                          <div className="flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            <span>{device.volume_percent}%</span>
                          </div>
                        )}
                      {device.is_private_session && (
                        <span className="text-orange-500">Private</span>
                      )}
                      {device.is_restricted && (
                        <span className="text-red-500">Restricted</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No devices found</p>
              <p className="text-xs">Make sure Spotify is open on a device</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
