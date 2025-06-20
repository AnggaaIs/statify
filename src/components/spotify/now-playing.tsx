"use client";

import { useSpotify } from "@/lib/hooks/spotify";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLinkIcon,
  MusicIcon,
  VolumeXIcon,
  Volume2Icon,
  MicIcon,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export function NowPlaying() {
  const { nowPlaying, loading, error } = useSpotify();
  const [progress, setProgress] = useState(0);
  const [hasInitialData, setHasInitialData] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (nowPlaying && !hasInitialData) {
      setHasInitialData(true);
    }
  }, [nowPlaying, hasInitialData]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!nowPlaying?.is_playing || !nowPlaying?.item) {
      return;
    }

    setProgress(nowPlaying.progress_ms || 0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1000;
        const maxProgress = nowPlaying.item!.duration_ms;

        if (newProgress >= maxProgress) {
          return maxProgress;
        }

        return newProgress;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nowPlaying?.is_playing, nowPlaying?.item, nowPlaying?.progress_ms]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = nowPlaying?.item
    ? (progress / nowPlaying.item.duration_ms) * 100
    : 0;

  if (loading && !hasInitialData) {
    return (
      <Card className="w-full backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-destructive/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <MusicIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Failed to load
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nowPlaying?.is_playing || !nowPlaying?.item) {
    return (
      <Card className="w-full backdrop-blur-sm border-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <VolumeXIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              No music playing right now
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { item } = nowPlaying;

  return (
    <Card className="w-full bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant="secondary"
            className="bg-green-500/10 text-green-600 border-green-500/20"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
            <Volume2Icon className="h-3 w-3 mr-1" />
            Now Playing
          </Badge>

          <div className="flex items-center gap-2">
            {nowPlaying.device && (
              <Badge variant="outline" className="text-xs">
                {nowPlaying.device.name}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative flex-shrink-0">
            <Image
              src={item.album.images[0]?.url || "/placeholder-album.png"}
              alt={item.album.name}
              width={80}
              height={80}
              className="rounded-lg shadow-lg"
              priority
            />
            <div className="absolute inset-0 bg-black/10 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground truncate mb-1">
              {item.name}
            </h3>
            <p className="text-muted-foreground truncate mb-1">
              {item.artists.map((artist) => artist.name).join(", ")}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {item.album.name}
            </p>

            {item.explicit && (
              <Badge variant="secondary" className="text-xs mt-2">
                Explicit
              </Badge>
            )}
          </div>

          <div className="flex-shrink-0 flex gap-2">
            <a
              href={item.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors bg-green-500/10 hover:bg-green-500/20 px-3 py-2 rounded-lg"
            >
              <span className="text-sm font-medium hidden sm:inline">Open</span>
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mt-6 space-y-3">
          <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-1000 ease-linear shadow-sm"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="font-mono">{formatTime(progress)}</span>
            <span className="font-mono">{formatTime(item.duration_ms)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
