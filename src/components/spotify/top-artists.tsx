"use client";

import { useTopArtists } from "@/lib/hooks/spotify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLinkIcon,
  UsersIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TopArtistsProps {
  timeRange?: "short_term" | "medium_term" | "long_term";
}

export function TopArtists({ timeRange = "medium_term" }: TopArtistsProps) {
  const { topArtists, loading, error } = useTopArtists(timeRange);
  const [displayCount, setDisplayCount] = useState(5);

  const loadMore = () => {
    if (displayCount >= topArtists.length) {
      setDisplayCount(5);
    } else {
      setDisplayCount(Math.min(displayCount + 5, topArtists.length));
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
            <UsersIcon className="h-5 w-5 text-orange-600" />
            Your Top Artists
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
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

  if (error || !topArtists || topArtists.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-orange-600" />
            Your Top Artists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No top artists found</p>
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
            <UsersIcon className="h-5 w-5 text-orange-600" />
            Your Top Artists
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-orange-500/10 text-orange-600 border-orange-500/20"
          >
            {getTimeRangeLabel(timeRange)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {topArtists.slice(0, displayCount).map((artist, index) => (
          <div
            key={artist.id}
            className={`
              flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group
              ${
                index < 3
                  ? "bg-gradient-to-r from-orange-500/5 to-transparent border border-orange-500/10"
                  : ""
              }
            `}
          >
            {/* Rank */}
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

            {/* Artist Image */}
            <div className="relative flex-shrink-0">
              <Image
                src={artist.images[0]?.url || "/placeholder-artist.png"}
                alt={artist.name}
                width={56}
                height={56}
                className="rounded-full shadow-sm"
              />
              {index < 3 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">★</span>
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate text-sm">
                {artist.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {artist.genres.slice(0, 2).join(", ") || "No genres listed"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <UsersIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {artist.followers.total.toLocaleString()} followers
                  </span>
                </div>
              </div>
            </div>

            {/* Popularity & Link */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      artist.popularity >= 80
                        ? "bg-orange-500"
                        : artist.popularity >= 60
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {artist.popularity}%
                  </span>
                </div>
              </div>
              <a
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}

        {/* Load More Button */}
        {topArtists.length > 5 && (
          <div className="pt-4 border-t border-border">
            <Button
              onClick={loadMore}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {displayCount >= topArtists.length ? (
                <>
                  <ChevronUpIcon className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4 mr-2" />
                  Load More ({Math.min(
                    5,
                    topArtists.length - displayCount
                  )}{" "}
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
