"use client";

import { useTopTracks } from "@/lib/hooks/spotify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLinkIcon,
  MusicIcon,
  TrendingUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TopTracksProps {
  timeRange?: "short_term" | "medium_term" | "long_term";
}

export function TopTracks({ timeRange = "medium_term" }: TopTracksProps) {
  const { topTracks, loading, error } = useTopTracks(timeRange);
  const [displayCount, setDisplayCount] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadMore = () => {
    if (displayCount >= topTracks.length) {
      setDisplayCount(5);
      setIsExpanded(false);
    } else {
      const newCount = Math.min(displayCount + 5, topTracks.length);
      setDisplayCount(newCount);
      setIsExpanded(newCount >= topTracks.length);
    }
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "short_term":
        return "Last 4 weeks";
      case "medium_term":
        return "Last 6 months";
      case "long_term":
        return "All time";
      default:
        return "Last 6 months";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-green-600" />
            Your Top Tracks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-6" />
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
              Failed to load top tracks
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topTracks || topTracks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-green-600" />
            Your Top Tracks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MusicIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No top tracks found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Listen to more music to see your top tracks
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-green-600" />
            Your Top Tracks
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-green-500/10 text-green-600 border-green-500/20"
          >
            {getTimeRangeLabel(timeRange)}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {displayCount} of {topTracks.length} tracks
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live data
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {topTracks.slice(0, displayCount).map((track, index) => (
          <div
            key={track.id}
            className={`
              flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group
              ${
                index < 3
                  ? "bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10"
                  : ""
              }
            `}
          >
            {/* Enhanced Rank */}
            <div className="flex-shrink-0 w-8 text-center">
              <span
                className={`
                text-sm font-mono font-bold
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
            </div>

            {/* Album Art with Rank Badge */}
            <div className="relative flex-shrink-0">
              <Image
                src={track.album.images[0]?.url || "/placeholder-album.png"}
                alt={track.album.name}
                width={48}
                height={48}
                className="rounded-md shadow-sm"
              />
              <div className="absolute inset-0 bg-black/10 rounded-md" />
              {index < 3 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">★</span>
                </div>
              )}
            </div>

            {/* Enhanced Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate text-sm flex items-center gap-2">
                {track.name}
                {track.explicit && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    E
                  </Badge>
                )}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {track.album.name} • {Math.floor(track.duration_ms / 60000)}:
                {((track.duration_ms % 60000) / 1000)
                  .toFixed(0)
                  .padStart(2, "0")}
              </p>
            </div>

            {/* Enhanced Popularity & Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      track.popularity >= 80
                        ? "bg-green-500"
                        : track.popularity >= 60
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {track.popularity}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">popularity</div>
              </div>
              <a
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}

        {/* Load More Button */}
        {topTracks.length > 5 && (
          <div className="pt-4 border-t border-border">
            <Button
              onClick={loadMore}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {displayCount >= topTracks.length ? (
                <>
                  <ChevronUpIcon className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4 mr-2" />
                  Load More ({Math.min(5, topTracks.length - displayCount)}{" "}
                  more)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
