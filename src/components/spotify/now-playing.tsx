"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface NowPlayingData {
  is_playing: boolean;
  current_track: {
    name: string;
    artist: string;
    album: string;
    duration_ms: number;
    progress_ms: number;
    external_urls: {
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
  };
  context: any;
}

export function NowPlayingCard() {
  const { get_now_playing } = useSpotify();
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [progress, setProgress] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchNowPlaying = async (isBackground = false) => {
    try {
      const data = (await get_now_playing()) as NowPlayingData;

      setNowPlaying(data);

      if (data?.current_track?.progress_ms) {
        setProgress(data.current_track.progress_ms);
      }
    } catch (error) {
      console.error("Error fetching now playing:", error);
    } finally {
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNowPlaying(false);

    const interval = setInterval(() => {
      fetchNowPlaying(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
    return nowPlaying.current_track.images[0]?.url;
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

  const progressPercentage = nowPlaying.current_track.duration_ms
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
            <AvatarImage
              src={getAlbumArt() || ""}
              alt={nowPlaying.current_track.album}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg">
              <Play className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xl truncate">
              {nowPlaying.current_track.name}
            </h3>
            <p className="text-muted-foreground text-lg truncate">
              {nowPlaying.current_track.artist}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {nowPlaying.current_track.album}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Link
              href={nowPlaying.current_track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(nowPlaying.current_track.duration_ms)}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Device Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span>
              {nowPlaying.device?.name
                ? `Playing on ${nowPlaying.device.name}`
                : "No active device"}
            </span>
            {nowPlaying.device?.volume_percent && (
              <span className="ml-2">
                • {nowPlaying.device.volume_percent}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
