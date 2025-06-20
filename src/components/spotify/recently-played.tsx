"use client";

import { useRecentlyPlayed } from "@/lib/hooks/spotify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLinkIcon, MusicIcon, ClockIcon } from "lucide-react";
import Image from "next/image";

export function RecentlyPlayed() {
  const { recentlyPlayed, loading, error } = useRecentlyPlayed();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-blue-600" />
            Recently Played
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <MusicIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Failed to load recently played
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recentlyPlayed || recentlyPlayed.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-blue-600" />
            Recently Played
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent tracks found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-blue-600" />
          Recently Played
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentlyPlayed.slice(0, 10).map((item, index) => (
          <div
            key={`${item.track.id}-${item.played_at}-${index}`}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            {/* Album Art */}
            <div className="relative flex-shrink-0">
              <Image
                src={
                  item.track.album.images[0]?.url || "/placeholder-album.png"
                }
                alt={item.track.album.name}
                width={48}
                height={48}
                className="rounded-md shadow-sm"
              />
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate text-sm">
                {item.track.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {item.track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>

            {/* Time & Link */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground min-w-fit">
                {formatTimeAgo(item.played_at)}
              </span>
              <a
                href={item.track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
